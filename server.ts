import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Search Grounding endpoint for Real-Time Seismic News & IGEPN Geological Reports
  app.post('/api/seismic-intel', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          text: 'Para obtener información satelital en vivo con Google Search, configure su GEMINI_API_KEY en la consola de Secrets.',
          sources: [
            { uri: 'https://www.igepn.edu.ec', title: 'Instituto Geofísico de la EPN (Ecuador)' },
            { uri: 'https://earthquake.usgs.gov', title: 'USGS Earthquake Hazards Program' },
            { uri: 'https://www.emsc-csem.org', title: 'EMSC / European-Mediterranean Seismological Centre' }
          ]
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const userQuery = req.body?.query || 'Últimos sismos en Ecuador, informes recientes del Instituto Geofísico EPN, actividad volcánica y monitoreo sísmico.';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Eres el sistema de inteligencia geofísica de GeoMonitor Ecuador. Proporciona un resumen técnico y fidedigno con datos recientes sobre: ${userQuery}. Incluye datos de fuentes oficiales como IGEPN, USGS y SNGRE.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map(chunk => chunk.web)
        .filter((web): web is NonNullable<typeof web> => Boolean(web));

      return res.json({
        text: response.text,
        sources,
      });
    } catch (err: unknown) {
      console.error('Error in seismic intel:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Maps Grounding endpoint for Seismological Observatories & Stations in Ecuador
  app.post('/api/seismic-places', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          text: 'Principales instalaciones sismológicas: Instituto Geofísico EPN (Campus Ladrón de Guevara, Quito), Estación Sismológica Otavalo (OTAV), Estación Pedernales (PEDE), Observatorio Volcánico Cotopaxi.',
          groundingChunks: []
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const userQuery = req.body?.query || 'Centros de monitoreo sismológico, Instituto Geofísico EPN y observatorios geofísicos en Quito y Ecuador';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: userQuery,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: -0.2104,
                longitude: -78.4908,
              },
            },
          },
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      return res.json({
        text: response.text,
        groundingChunks,
      });
    } catch (err: unknown) {
      console.error('Error in seismic places:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Static files or Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`GeoMonitor Ecuador Server running on port ${port}`);
  });
}

startServer();
