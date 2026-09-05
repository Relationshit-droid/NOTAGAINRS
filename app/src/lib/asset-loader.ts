import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

type Manifest = {
  video?: number[];
  logos?: number[];
  avatars?: number[];
  fonts?: Record<string, number>;
};

export async function preloadAssets(manifest: Manifest) {
  const imageModules: number[] = [];
  if (manifest.video && manifest.video.length) imageModules.push(...manifest.video);
  if (manifest.logos && manifest.logos.length) imageModules.push(...manifest.logos);
  if (manifest.avatars && manifest.avatars.length) imageModules.push(...manifest.avatars);
  const imageTasks = imageModules.map((m) => Asset.fromModule(m).downloadAsync());
  const fontTask = manifest.fonts && Object.keys(manifest.fonts).length ? Font.loadAsync(manifest.fonts) : Promise.resolve();
  const [imagesResult] = await Promise.allSettled([Promise.allSettled(imageTasks), fontTask]);
  if (imagesResult.status === 'fulfilled') {
    const failures = (imagesResult.value as PromiseSettledResult<void>[]).filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      console.warn('asset_preload_failures', failures.length);
    }
  }
}

export async function initAppAssets(manifest: Manifest) {
  if (Platform.OS !== 'web') {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch {}
  }
  try {
    await preloadAssets(manifest);
  } finally {
    if (Platform.OS !== 'web') {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }
  }
}
