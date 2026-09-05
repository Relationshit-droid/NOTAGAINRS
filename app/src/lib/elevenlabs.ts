
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseClient';
import * as FileSystem from 'expo-file-system';
import SHA256 from 'crypto-js/sha256';

const functions = getFunctions(app);
const getTtsAudioCallable = httpsCallable(functions, 'getTtsAudio');

export type VoiceSettings = { stability: number; similarity_boost: number; style?: number };

const DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM';

export async function synthesize(text: string, voiceId = DEFAULT_VOICE, settings: VoiceSettings = { stability: 0.75, similarity_boost: 0.75, style: 0.35 }) {
  const cacheKey = SHA256(`${text}-${voiceId}-${JSON.stringify(settings)}`).toString();
  const base = ((FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '') as string;
  const fileUri = base + `marcie_${cacheKey}.mp3`;

  // Check cache
  const info = await FileSystem.getInfoAsync(fileUri);
  if (info.exists) {
    return fileUri;
  }

  try {
    console.log("Requesting TTS audio from cloud function...");
    const result = await getTtsAudioCallable({ text, voiceId });
    const data = result.data as { url: string };

    if (!data.url) {
        throw new Error('Invalid response from TTS function.');
    }

    console.log("Downloading audio from URL:", data.url);
    const downloadResult = await FileSystem.downloadAsync(data.url, fileUri);

    if (downloadResult.status !== 200) {
      throw new Error(`Failed to download audio file. Status: ${downloadResult.status}`);
    }
    
    return downloadResult.uri;
  } catch (error) {
    console.error('Error synthesizing audio via cloud function:', error);
    throw new Error('Failed to synthesize audio.');
  }
}
