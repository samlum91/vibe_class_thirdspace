/**
 * Keyless OpenStreetMap Nominatim lookup for district-level vicinity verification.
 * Privacy rule: Queries ONLY city district / neighbourhood names (never residential addresses)
 * and falls back gracefully to local district coordinates if offline or rate-limited.
 */

export interface DistrictGeoResult {
  displayName: string;
  lat: number;
  lon: number;
  boundingBox: [number, number, number, number]; // [south, north, west, east]
  source: 'nominatim-live' | 'local-verified-cache';
}

const FALLBACK_DISTRICT: DistrictGeoResult = {
  displayName: 'Kitsilano, Vancouver, British Columbia',
  lat: 49.2684,
  lon: -123.1683,
  boundingBox: [49.2572, 49.2788, -123.1856, -123.1452],
  source: 'local-verified-cache',
};

export async function lookupDistrictVicinity(
  districtQuery = 'Kitsilano, Vancouver'
): Promise<DistrictGeoResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 3500);

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      districtQuery
    )}&format=json&limit=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return FALLBACK_DISTRICT;
    }

    const results = (await response.json()) as Array<{
      display_name?: string;
      lat?: string;
      lon?: string;
      boundingbox?: [string, string, string, string];
    }>;

    if (!Array.isArray(results) || results.length === 0) {
      return FALLBACK_DISTRICT;
    }

    const first = results[0];
    const lat = Number(first.lat);
    const lon = Number(first.lon);
    const bbox = first.boundingbox?.map(Number) as
      | [number, number, number, number]
      | undefined;

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return FALLBACK_DISTRICT;
    }

    return {
      displayName: first.display_name || FALLBACK_DISTRICT.displayName,
      lat,
      lon,
      boundingBox:
        bbox && bbox.length === 4 && bbox.every(Number.isFinite)
          ? bbox
          : FALLBACK_DISTRICT.boundingBox,
      source: 'nominatim-live',
    };
  } catch {
    return FALLBACK_DISTRICT;
  } finally {
    window.clearTimeout(timer);
  }
}
