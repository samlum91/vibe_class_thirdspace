/**
 * Client wrapper for our Vercel serverless geocoding endpoints (/api/geocode/*).
 * Policy compliance:
 * - NEVER calls Nominatim directly from the browser.
 * - Caches geocoded coordinates in localStorage so repeat lookups do not re-query.
 * - Geocode only on explicit form submission (no autocomplete / search-as-you-type).
 * - Converts and validates coordinates with Number() before storing or returning.
 */

export const OSM_ATTRIBUTION = '© OpenStreetMap contributors, ODbL';

const GEOCODE_CACHE_KEY = 'kitsilano_geocode_cache_v1';

export interface GeocodeSearchResult {
  lat: number;
  lon: number;
  displayName: string;
  cached: boolean;
}

export interface GeocodeReverseResult {
  displayName: string;
  address: Record<string, string>;
  cached: boolean;
}

export interface GeocodeHealthResult {
  ok: boolean;
  configured: boolean;
  message: string;
}

interface StoredGeocodeCache {
  search: Record<string, { lat: number; lon: number; displayName: string }>;
  reverse: Record<string, { displayName: string; address: Record<string, string> }>;
}

function readCache(): StoredGeocodeCache {
  try {
    const raw = window.localStorage.getItem(GEOCODE_CACHE_KEY);
    if (!raw) return { search: {}, reverse: {} };
    const parsed = JSON.parse(raw) as Partial<StoredGeocodeCache>;
    return {
      search: parsed.search && typeof parsed.search === 'object' ? parsed.search : {},
      reverse: parsed.reverse && typeof parsed.reverse === 'object' ? parsed.reverse : {},
    };
  } catch {
    return { search: {}, reverse: {} };
  }
}

function writeCache(cache: StoredGeocodeCache): void {
  try {
    window.localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
}

function validateCoords(rawLat: unknown, rawLon: unknown): { lat: number; lon: number } | null {
  const lat = Number(rawLat);
  const lon = Number(rawLon);
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

async function parseJsonSafely<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function geocodeSearch(
  rawQuery: string
): Promise<{ ok: true; data: GeocodeSearchResult } | { ok: false; error: string }> {
  const query = rawQuery.trim();
  if (!query) {
    return { ok: false, error: 'Please enter a neighbourhood or district name to look up.' };
  }
  if (query.length > 200) {
    return { ok: false, error: 'Search query must be 200 characters or fewer.' };
  }

  const cache = readCache();
  const cacheKey = query.toLowerCase();
  const cachedHit = cache.search[cacheKey];
  if (cachedHit) {
    const valid = validateCoords(cachedHit.lat, cachedHit.lon);
    if (valid) {
      return {
        ok: true,
        data: {
          lat: valid.lat,
          lon: valid.lon,
          displayName: cachedHit.displayName,
          cached: true,
        },
      };
    }
  }

  try {
    const response = await fetch(
      `/api/geocode/search?q=${encodeURIComponent(query)}`,
      { method: 'GET', headers: { Accept: 'application/json' } }
    );

    const json = await parseJsonSafely<{
      lat?: unknown;
      lon?: unknown;
      displayName?: string;
      error?: string;
    }>(response);

    if (!json) {
      return {
        ok: false,
        error:
          'Serverless geocoding endpoint (/api/geocode/search) is available once deployed on Vercel.',
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: json.error || `Geocoding lookup failed (HTTP ${response.status}).`,
      };
    }

    const valid = validateCoords(json.lat, json.lon);
    if (!valid || !json.displayName) {
      return { ok: false, error: 'Server returned invalid coordinate data.' };
    }

    cache.search[cacheKey] = {
      lat: valid.lat,
      lon: valid.lon,
      displayName: json.displayName,
    };
    writeCache(cache);

    return {
      ok: true,
      data: {
        lat: valid.lat,
        lon: valid.lon,
        displayName: json.displayName,
        cached: false,
      },
    };
  } catch {
    return {
      ok: false,
      error: 'Unable to reach /api/geocode/search right now.',
    };
  }
}

export async function geocodeReverse(
  rawLat: number,
  rawLon: number
): Promise<{ ok: true; data: GeocodeReverseResult } | { ok: false; error: string }> {
  const valid = validateCoords(rawLat, rawLon);
  if (!valid) {
    return {
      ok: false,
      error: 'Latitude must be between -90 and 90, and longitude between -180 and 180.',
    };
  }

  const cache = readCache();
  const cacheKey = `${valid.lat.toFixed(5)},${valid.lon.toFixed(5)}`;
  const cachedHit = cache.reverse[cacheKey];
  if (cachedHit) {
    return {
      ok: true,
      data: {
        displayName: cachedHit.displayName,
        address: cachedHit.address,
        cached: true,
      },
    };
  }

  try {
    const response = await fetch(
      `/api/geocode/reverse?lat=${encodeURIComponent(String(valid.lat))}&lon=${encodeURIComponent(
        String(valid.lon)
      )}`,
      { method: 'GET', headers: { Accept: 'application/json' } }
    );

    const json = await parseJsonSafely<{
      displayName?: string;
      address?: Record<string, string>;
      error?: string;
    }>(response);

    if (!json) {
      return {
        ok: false,
        error:
          'Serverless reverse-geocoding endpoint (/api/geocode/reverse) is available once deployed on Vercel.',
      };
    }

    if (!response.ok || !json.displayName) {
      return {
        ok: false,
        error: json.error || `Reverse geocoding failed (HTTP ${response.status}).`,
      };
    }

    cache.reverse[cacheKey] = {
      displayName: json.displayName,
      address: json.address ?? {},
    };
    writeCache(cache);

    return {
      ok: true,
      data: {
        displayName: json.displayName,
        address: json.address ?? {},
        cached: false,
      },
    };
  } catch {
    return {
      ok: false,
      error: 'Unable to reach /api/geocode/reverse right now.',
    };
  }
}

export async function checkGeocodeHealth(): Promise<GeocodeHealthResult> {
  try {
    const response = await fetch('/api/geocode/health', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const json = await parseJsonSafely<{
      ok?: boolean;
      error?: string;
    }>(response);

    if (!json) {
      return {
        ok: false,
        configured: false,
        message:
          'Preview mode: /api/geocode/health becomes active when deployed to Vercel.',
      };
    }

    if (!response.ok || !json.ok) {
      return {
        ok: false,
        configured: false,
        message: json.error || `Health check returned HTTP ${response.status}.`,
      };
    }

    return {
      ok: true,
      configured: true,
      message: 'Serverless Nominatim geocoder is reachable.',
    };
  } catch {
    return {
      ok: false,
      configured: false,
      message: 'Unable to reach /api/geocode/health.',
    };
  }
}
