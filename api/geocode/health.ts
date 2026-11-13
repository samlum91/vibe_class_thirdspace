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

  const envCheck = getNominatimConfig();
  if (!envCheck.ok) {
    res.status(503).json({
      ok: false,
      configured: false,
      missing: envCheck.missing,
      error: 'Geocoding environment variables are not configured.',
    });
    return;
  }

  if (!tryAcquireThrottleSlot(res)) return;

  const { baseUrl, userAgent } = envCheck.config;
  const upstreamUrl = `${baseUrl}/status?format=json`;
  const upstream = await fetchNominatimJson<NominatimStatusResponse>(
    upstreamUrl,
    userAgent
  );

  if (!upstream.ok) {
    res.status(502).json({
      ok: false,
      configured: true,
      error: 'Upstream geocoding service is currently unreachable.',
    });
    return;
  }

  res.status(200).json({
    ok: true,
    configured: true,
    upstreamStatus: upstream.data.status ?? 0,
    attribution: '© OpenStreetMap contributors, ODbL',
  });
}
