import { instrumentFetch } from './perf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from './env';

export type GifItem = { id: string; url: string; preview: string; title: string };

const API_KEY = ENV.GIPHY_API_KEY;

async function checkRate(limit = 100, windowMs = 24 * 3600 * 1000) {
  const now = Date.now();
  const stored = await AsyncStorage.getItem('giphy_rate_limit');
  let data = stored ? JSON.parse(stored) : { start: now, count: 0 };
  
  if (now - data.start > windowMs) {
    data = { start: now, count: 0 };
  }
  
  if (data.count >= limit) throw new Error('rate_limited');
  
  data.count++;
  await AsyncStorage.setItem('giphy_rate_limit', JSON.stringify(data));
}

export async function searchGifs(query: string, limit = 12, rating: 'pg' | 'pg-13' = 'pg') {
  if (!API_KEY) return [] as GifItem[];
  await checkRate();
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&rating=${rating}&lang=en`;
  
  let res: any;
  for (let i = 0; i < 3; i++) {
    try {
      res = await instrumentFetch(url, undefined, 'giphy_search');
      if (res.ok) break;
    } catch (e) {
      if (i === 2) throw e;
      await new Promise(r => setTimeout(r, 300 * (i + 1)));
    }
  }

  const json = await (res as any).json();
  return (json?.data || []).map((d: any) => ({
    id: d.id,
    url: d.images?.original?.url || d.url,
    preview: d.images?.preview_gif?.url || d.images?.fixed_height_small?.url,
    title: d.title || '',
  })) as GifItem[];
}
