import { Audio } from 'expo-av';
import { vertexAIService } from './vertex-ai-service';

export async function speakMarcie(
  text: string,
  emotion: 'sassy' | 'serious' | 'playful' | 'concerned' = 'sassy'
) {
  try {
    const result = await vertexAIService.synthesizeSpeech(text, {
      voiceId: 'en-US-Neural2-F', // Female voice for Dr. Marcie
      speed: 1.0,
      pitch: 0,
      emotion,
    });

    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: result.audioUrl });
    await sound.playAsync();
  } catch (e: any) {
    console.error('TTS error, falling back to browser TTS:', e);
    try {
      const w: any = typeof window !== 'undefined' ? window : null;
      if (w && w.speechSynthesis && w.SpeechSynthesisUtterance) {
        const u = new w.SpeechSynthesisUtterance(text);
        u.rate = 1.0;
        u.pitch = 1.0;
        w.speechSynthesis.cancel();
        w.speechSynthesis.speak(u);
      }
    } catch {}
  }
}

export async function speakMarcieCached(text: string) {
  // Keep backward compatibility
  return speakMarcie(text, 'sassy');
}
