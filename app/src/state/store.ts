import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppState = {
  sarcasmLevel: number;
  marciePersonality: string;
  points: number;
  trustLevel: number;
  vulnerabilityLevel: number;
  highContrast: boolean;
  reducedMotion: boolean;
  plan: 'free' | 'premium' | 'beta';
  isBeta: boolean;
  previewMode: boolean;
  theme: 'dark' | 'light' | 'noir';
  fontScale: number;
  animationSpeed: number;
  navCurrentScreen: string;
  navPreviousScreen: string;
  onboardingStep: number;
  gameInProgress: boolean;
  sosSessionId?: string;
  setSarcasm: (v: number) => void;
  setPersonality: (v: string) => void;
  addPoints: (v: number) => void;
  setTrust: (v: number) => void;
  setVulnerability: (v: number) => void;
  setHighContrast: (b: boolean) => void;
  setReducedMotion: (b: boolean) => void;
  setPlan: (p: 'free' | 'premium' | 'beta') => void;
  setBeta: (b: boolean) => void;
  setPreviewMode: (b: boolean) => void;
  setTheme: (t: 'dark' | 'light' | 'noir') => void;
  setFontScale: (n: number) => void;
  setAnimationSpeed: (n: number) => void;
  setCurrentScreen: (id: string) => void;
  setOnboardingStep: (n: number) => void;
  setGameInProgress: (b: boolean) => void;
  setSOSSessionId: (id?: string) => void;
  previewRole: 'free' | 'premium' | 'beta' | 'blocked' | null;
  setPreviewRole: (r: 'free' | 'premium' | 'beta' | 'blocked' | null) => void;
  user_id?: string;
  setUserId: (id?: string) => void;
};

export const useAppStore = create<AppState>()(persist((set) => ({
  sarcasmLevel: 1,
  marciePersonality: 'balanced',
  points: 0,
  trustLevel: 0.65,
  vulnerabilityLevel: 0.42,
  highContrast: false,
  reducedMotion: false,
  plan: 'free',
  isBeta: false,
  previewMode: false,
  theme: 'dark',
  fontScale: 1,
  animationSpeed: 1,
  navCurrentScreen: 'Splash',
  navPreviousScreen: '',
  onboardingStep: 0,
  gameInProgress: false,
  sosSessionId: undefined,
  setSarcasm: (v) => set({ sarcasmLevel: v }),
  setPersonality: (v) => set({ marciePersonality: v }),
  addPoints: (v) => set((s) => ({ points: s.points + v })),
  setTrust: (v) => set({ trustLevel: Math.max(0, Math.min(1, v)) }),
  setVulnerability: (v) => set({ vulnerabilityLevel: Math.max(0, Math.min(1, v)) }),
  setHighContrast: (b) => set({ highContrast: b }),
  setReducedMotion: (b) => set({ reducedMotion: b }),
  setPlan: (p) => set({ plan: p }),
  setBeta: (b) => set({ isBeta: b, plan: b ? 'beta' : 'free' }),
  setPreviewMode: (b) => set({ previewMode: b }),
  setTheme: (t) => set({ theme: t }),
  setFontScale: (n) => set({ fontScale: n }),
  setAnimationSpeed: (n) => set({ animationSpeed: n }),
  setCurrentScreen: (id) => set((s) => ({ navPreviousScreen: s.navCurrentScreen, navCurrentScreen: id })),
  setOnboardingStep: (n) => set({ onboardingStep: n }),
  setGameInProgress: (b) => set({ gameInProgress: b }),
  setSOSSessionId: (id) => set({ sosSessionId: id }),
  previewRole: null,
  setPreviewRole: (r) => set({ previewRole: r }),
  user_id: undefined, // Populated from Firebase Auth once the backend syncs
  setUserId: (id) => set({ user_id: id }),
}), { name: 'app_state' }));
