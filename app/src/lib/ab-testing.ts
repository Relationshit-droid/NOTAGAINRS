import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

type ExperimentConfig = {
  key: string;
  variants: string[];
  weights?: number[];
  enabled?: boolean;
};

const LOCAL_EXPERIMENTS: ExperimentConfig[] = [
  { key: 'translator_v2', variants: ['control', 'new_ui'], weights: [0.5, 0.5], enabled: true },
  { key: 'consequence_tuning', variants: ['v1', 'v2'], weights: [0.7, 0.3], enabled: true },
];

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

export async function getVariant(userId: string, experimentKey: string) {
  const exps = await loadExperiments();
  const exp = exps.find((e) => e.key === experimentKey) || LOCAL_EXPERIMENTS.find((e) => e.key === experimentKey);
  if (!exp || exp.enabled === false) return 'control';
  const h = hash(`${userId}:${experimentKey}`);
  const weights = exp.weights || new Array(exp.variants.length).fill(1 / exp.variants.length);
  const total = weights.reduce((a, b) => a + b, 0);
  const r = (h % 10000) / 10000; // 0..1
  let acc = 0;
  for (let i = 0; i < exp.variants.length; i++) {
    acc += weights[i] / total;
    if (r <= acc) return exp.variants[i];
  }
  return exp.variants[0];
}

export async function loadExperiments(): Promise<ExperimentConfig[]> {
  const cached = await AsyncStorage.getItem('experiments');
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  try {
    const { data, error } = await supabase.from('experiments').select('*');
    if (!error && Array.isArray(data)) {
      const exps = data.map((d: any) => ({ key: d.key, variants: d.variants, weights: d.weights, enabled: d.enabled })) as ExperimentConfig[];
      await AsyncStorage.setItem('experiments', JSON.stringify(exps));
      return exps;
    }
  } catch {}
  return LOCAL_EXPERIMENTS;
}

export async function getFlag(flagKey: string, defaultValue: boolean) {
  const cached = await AsyncStorage.getItem(`flag_${flagKey}`);
  if (cached) return cached === 'true';
  try {
    const { data, error } = await supabase.from('feature_flags').select('*').eq('key', flagKey).single();
    if (!error && data) {
      const val = !!data.enabled;
      await AsyncStorage.setItem(`flag_${flagKey}`, val ? 'true' : 'false');
      return val;
    }
  } catch {}
  return defaultValue;
}

