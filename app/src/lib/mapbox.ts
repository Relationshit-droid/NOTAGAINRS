import { instrumentFetch } from './perf';
import { ENV } from './env';

const API_KEY = ENV.MAPBOX_API_KEY;

export type GeocodeResult = { name: string; center: [number, number] | null; bbox?: number[] };

export async function geocode(place: string, privacy: 'coarse' | 'precise' = 'coarse'): Promise<GeocodeResult[]> {
  if (!API_KEY) return [];
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${API_KEY}`;
  
  let res: any;
  for (let i = 0; i < 3; i++) {
    try {
      res = await instrumentFetch(url, undefined, 'mapbox_geocode');
      if (res.ok) break;
    } catch (e) {
      if (i === 2) throw e;
      await new Promise(r => setTimeout(r, 300 * (i + 1)));
    }
  }

  const json = await (res as any).json();
  return (json?.features || []).map((f: any) => {
    const c = Array.isArray(f.center) ? (privacy === 'precise' ? f.center : [Math.round(f.center[0] * 10) / 10, Math.round(f.center[1] * 10) / 10]) : null;
    return { name: f.place_name, center: c, bbox: f.bbox } as GeocodeResult;
  });
}
