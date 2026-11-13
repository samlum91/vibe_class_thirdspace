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

  const config = getNominatimConfig();
  if (!config) {
    res.status(503).json({
      ok: false,
      error: 'Geocoding service is currently unavailable.',
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

  if (!upstream.ok) {
    res.status(502).json({
      ok: false,
      error: 'Upstream geocoding service is currently unreachable.',
    });
    return;
  }

  res.status(200).json({
    ok: true,
    status: upstream.data.status ?? 0,
    message: upstream.data.message ?? 'OK',
    attribution: '© OpenStreetMap contributors, ODbL',
  });
}
