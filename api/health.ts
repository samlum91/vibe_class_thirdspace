import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  enforceGetOnly,
  fetchNominatimJson,
  getNominatimConfig,
  tryAcquireThrottleSlot,
} from './_shared.js';

interface NominatimStatusResponse {
  status?: number;
  message?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (!enforceGetOnly(req, res)) return;

  res.setHeader('Cache-Control', 'no-store');

  const appStatus = {
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  };

  const config = getNominatimConfig();
  if (!config) {
    res.status(503).json({
      ok: false,
      app: appStatus,
      nominatim: {
        ok: false,
        status: 'unavailable',
        message: 'Nominatim geocoding service is not active.',
      },
    });
    return;
  }

  if (!tryAcquireThrottleSlot(res)) return;

  const { baseUrl, userAgent } = config;
  const upstreamUrl = `${baseUrl}/status?format=json`;
  const upstream = await fetchNominatimJson<NominatimStatusResponse>(
    upstreamUrl,
    userAgent
  );

  if (
    !upstream.ok ||
    (typeof upstream.data?.status === 'number' && upstream.data.status !== 0)
  ) {
    res.status(502).json({
      ok: false,
      app: appStatus,
      nominatim: {
        ok: false,
        status: 'unreachable',
        message: 'Upstream Nominatim service is currently unreachable.',
      },
    });
    return;
  }

  res.status(200).json({
    ok: true,
    app: appStatus,
    nominatim: {
      ok: true,
      status: upstream.data.status ?? 0,
      message: upstream.data.message ?? 'OK',
      attribution: '© OpenStreetMap contributors, ODbL',
    },
  });
}
