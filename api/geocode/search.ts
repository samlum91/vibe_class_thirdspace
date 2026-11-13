import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  CACHE_CONTROL_HEADER,
  enforceGetOnly,
  fetchNominatimJson,
  getNominatimConfig,
  getQueryParamString,
  parseValidatedCoordinates,
  tryAcquireThrottleSlot,
} from './_shared.js';

interface NominatimSearchItem {
  lat?: string;
  lon?: string;
  display_name?: string;
}

interface SearchResultPayload {
  lat: number;
  lon: number;
  displayName: string;
}

const searchMemoryCache = new Map<string, SearchResultPayload>();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (!enforceGetOnly(req, res)) return;

  const envCheck = getNominatimConfig();
  if (!envCheck.ok) {
    res.status(503).json({
      error: 'Geocoding service is not configured on the server.',
    });
    return;
  }

  const rawQuery = getQueryParamString(req.query.q);
  const query = rawQuery ? rawQuery.trim() : '';

  if (!query || query.length > 200) {
    res.status(400).json({
      error: 'Query parameter "q" is required and must be between 1 and 200 characters.',
    });
    return;
  }

  const cacheKey = query.toLowerCase();
  const cached = searchMemoryCache.get(cacheKey);
  if (cached) {
    res.setHeader('Cache-Control', CACHE_CONTROL_HEADER);
    res.status(200).json(cached);
    return;
  }

  if (!tryAcquireThrottleSlot(res)) return;

  const { baseUrl, userAgent } = envCheck.config;
  const upstreamUrl = `${baseUrl}/search?q=${encodeURIComponent(
    query
  )}&format=json&limit=1`;

  const upstream = await fetchNominatimJson<NominatimSearchItem[]>(
    upstreamUrl,
    userAgent
  );

  if (!upstream.ok) {
    res.status(502).json({
      error: 'Unable to reach the geocoding provider right now.',
    });
    return;
  }

  if (!Array.isArray(upstream.data) || upstream.data.length === 0) {
    res.status(404).json({ error: 'No match found' });
    return;
  }

  const first = upstream.data[0];
  const coords = parseValidatedCoordinates(first?.lat, first?.lon);
  if (!coords) {
    res.status(502).json({
      error: 'Geocoding provider returned invalid coordinates.',
    });
    return;
  }

  const payload: SearchResultPayload = {
    lat: coords.lat,
    lon: coords.lon,
    displayName: first.display_name || query,
  };

  searchMemoryCache.set(cacheKey, payload);
  res.setHeader('Cache-Control', CACHE_CONTROL_HEADER);
  res.status(200).json(payload);
}
