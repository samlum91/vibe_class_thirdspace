import type { VercelRequest, VercelResponse } from '@vercel/node';

export const CACHE_CONTROL_HEADER =
  'public, s-maxage=86400, stale-while-revalidate=604800';

const MIN_INTERVAL_MS = 1000;
let lastUpstreamRequestMs = 0;

export interface NominatimConfig {
  baseUrl: string;
  userAgent: string;
}

export function getNominatimConfig(): NominatimConfig | null {
  const rawBase = process.env.NOMINATIM_BASE_URL?.trim() ?? '';
  const rawAgent = process.env.NOMINATIM_USER_AGENT?.trim() ?? '';

  if (!rawBase || !rawAgent) {
    return null;
  }

  return {
    baseUrl: rawBase.replace(/\/+$/, ''),
    userAgent: rawAgent,
  };
}

export function enforceGetOnly(
  req: VercelRequest,
  res: VercelResponse
): boolean {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({
      error: 'Method not allowed. Only GET requests are accepted.',
    });
    return false;
  }
  return true;
}

export function tryAcquireThrottleSlot(res: VercelResponse): boolean {
  const now = Date.now();
  const elapsed = now - lastUpstreamRequestMs;
  if (elapsed < MIN_INTERVAL_MS) {
    res.setHeader('Retry-After', '1');
    res.status(429).json({
      error:
        'Geocoding rate limit reached (max 1 request per second). Please wait a moment and try again.',
    });
    return false;
  }
  lastUpstreamRequestMs = now;
  return true;
}

export function getQueryParamString(
  value: string | string[] | undefined
): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0];
  }
  return null;
}

export function parseValidatedCoordinates(
  rawLat: unknown,
  rawLon: unknown
): { lat: number; lon: number } | null {
  if (
    rawLat === undefined ||
    rawLat === null ||
    rawLon === undefined ||
    rawLon === null
  ) {
    return null;
  }

  const latStr = String(rawLat).trim();
  const lonStr = String(rawLon).trim();
  if (!latStr || !lonStr) {
    return null;
  }

  const lat = Number(latStr);
  const lon = Number(lonStr);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return null;
  }

  return { lat, lon };
}

export async function fetchNominatimJson<T>(
  url: string,
  userAgent: string,
  timeoutMs = 7000
): Promise<{ ok: true; status: number; data: T } | { ok: false; status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    const data = (await response.json()) as T;
    return { ok: true, status: response.status, data };
  } catch {
    return { ok: false, status: 502 };
  } finally {
    clearTimeout(timer);
  }
}
