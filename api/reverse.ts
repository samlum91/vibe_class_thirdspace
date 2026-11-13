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

interface NominatimReverseResponse {
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: Record<string, string>;
  error?: string;
}

interface ReverseResultPayload {
  displayName: string;
  address: Record<string, string>;
}

const reverseMemoryCache = new Map<string, ReverseResultPayload>();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (!enforceGetOnly(req, res)) return;

  const config = getNominatimConfig();
  if (!config) {
    res.status(503).json({
      error: 'Geocoding service is currently unavailable.',
    });
    return;
  }

  const rawLat = getQueryParamString(req.query.lat);
  const rawLon = getQueryParamString(req.query.lon);
  const coords = parseValidatedCoordinates(rawLat, rawLon);

  if (!coords) {
    res.status(400).json({
      error:
        'Valid "lat" (-90 to 90) and "lon" (-180 to 180) query parameters are required.',
    });
    return;
  }

  const cacheKey = `${coords.lat.toFixed(5)},${coords.lon.toFixed(5)}`;
  const cached = reverseMemoryCache.get(cacheKey);
  if (cached) {
    res.setHeader('Cache-Control', CACHE_CONTROL_HEADER);
    res.status(200).json(cached);
    return;
  }

  if (!tryAcquireThrottleSlot(res)) return;

  const { baseUrl, userAgent } = config;
  const upstreamUrl = `${baseUrl}/reverse?lat=${encodeURIComponent(
    String(coords.lat)
  )}&lon=${encodeURIComponent(String(coords.lon))}&format=json`;

  const upstream = await fetchNominatimJson<NominatimReverseResponse>(
    upstreamUrl,
    userAgent
  );

  if (!upstream.ok) {
    res.status(502).json({
      error: 'Unable to reach the geocoding provider right now.',
    });
    return;
  }

  if (!upstream.data || upstream.data.error || !upstream.data.display_name) {
    res.status(404).json({ error: 'No match found' });
    return;
  }

  // Validate returned coordinates if provided by upstream
  if (upstream.data.lat !== undefined || upstream.data.lon !== undefined) {
    const returnedCoords = parseValidatedCoordinates(
      upstream.data.lat,
      upstream.data.lon
    );
    if (!returnedCoords) {
      res.status(502).json({
        error: 'Geocoding provider returned invalid coordinates.',
      });
      return;
    }
  }

  const payload: ReverseResultPayload = {
    displayName: upstream.data.display_name,
    address: upstream.data.address ?? {},
  };

  reverseMemoryCache.set(cacheKey, payload);
  res.setHeader('Cache-Control', CACHE_CONTROL_HEADER);
  res.status(200).json(payload);
}
