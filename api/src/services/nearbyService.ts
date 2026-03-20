import { env } from "../utils/env.js";

type PlaceType = "gym" | "hospital" | "yoga" | "clinic";

type CachedEntry = {
  timestamp: number;
  data: any;
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CachedEntry>();

function cacheKey(lat: number, lng: number, type: PlaceType, radius: number, minRating: number) {
  // round coordinates to 3 decimals to improve cache hit rate (~100m precision)
  const rLat = lat.toFixed(3);
  const rLng = lng.toFixed(3);
  return `${rLat}:${rLng}:${type}:${radius}:${minRating}`;
}

function isFresh(entry: CachedEntry) {
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371e3; // meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const PLACE_CONFIG: Record<
  PlaceType,
  { type?: string; keyword?: string; fallbackType?: string | undefined }
> = {
  gym: { type: "gym" },
  hospital: { type: "hospital" },
  yoga: { type: "gym", keyword: "yoga" },
  clinic: { type: "doctor", keyword: "clinic" },
};

export async function findNearby(
  lat: number,
  lng: number,
  type: PlaceType,
  radiusKm: number,
  minRating: number
) {
  const radiusMeters = Math.min(Math.max(radiusKm, 0.5), 5) * 1000; // clamp 0.5km - 5km
  const key = cacheKey(lat, lng, type, radiusMeters, minRating);
  const cached = cache.get(key);
  if (cached && isFresh(cached)) {
    return cached.data;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", radiusMeters.toString());
  const cfg = PLACE_CONFIG[type];
  if (cfg.type) url.searchParams.set("type", cfg.type);
  if (cfg.keyword) url.searchParams.set("keyword", cfg.keyword);
  url.searchParams.set("components", "country:IN");
  url.searchParams.set("region", "IN");
  url.searchParams.set("language", "en-IN");
  url.searchParams.set("key", env.GOOGLE_PLACES_API_KEY);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    const text = await resp.text();
    const error = new Error(`Places API error: ${resp.status} ${text}`);
    (error as any).status = 502;
    throw error;
  }
  const payload = await resp.json();
  if (payload.status !== "OK" && payload.status !== "ZERO_RESULTS") {
    const error = new Error(`Places API returned status ${payload.status}`);
    (error as any).status = 502;
    throw error;
  }

  const results = (payload.results ?? [])
    .map((p: any) => ({
      name: p.name,
      distance: haversine(lat, lng, p.geometry.location.lat, p.geometry.location.lng), // meters
      rating: p.rating ?? null,
      address: p.vicinity ?? p.formatted_address ?? "",
    }))
    .filter((p: any) => (p.rating ?? 0) >= minRating);

  const response = { results, source: "google-places", cached: false };
  cache.set(key, { timestamp: Date.now(), data: response });
  return response;
}
