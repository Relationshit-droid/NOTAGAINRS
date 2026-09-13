/**
 * Asset management utility for Love Arcade app
 * Maps to public/appdocs folder structure as specified in Design Bible
 */
import { storage } from '../lib/firebaseClient';

/**
 * Get a Firebase Storage URL for a given path
 */
export const getStorageUrl = (path: string) => {
  return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(path)}?alt=media`;
};

export const ASSETS = {
  // Dr. Marcie Animations (Legacy webm paths, will fallback to storage)
  animations: {
    idle: { uri: getStorageUrl('animations/marcie-idle.webm') },
    correct: { uri: getStorageUrl('animations/marcie-correct.webm') },
    detective: { uri: getStorageUrl('animations/marcie-detective.webm') },
    healing: { uri: getStorageUrl('animations/marcie-healing-intro.webm') },
    impatient: { uri: getStorageUrl('animations/marcie-impatient.webm') },
    intro: { uri: getStorageUrl('animations/marcie-intro.webm') },
    jeopardy: { uri: getStorageUrl('animations/marcie-jeopardy.webm') },
    laugh: { uri: getStorageUrl('animations/marcie-laugh.webm') },
    listening: { uri: getStorageUrl('animations/marcie-listening.webm') },
    roast: { uri: getStorageUrl('animations/marcie-roast-delivery.webm') },
    roastAlt: { uri: getStorageUrl('animations/marcie-roast-delivery-alternative.webm') },
    shocked: { uri: getStorageUrl('animations/marcie-shocked.webm') },
    shrug: { uri: getStorageUrl('animations/marcie-shrug.webm') },
    sos: { uri: getStorageUrl('animations/marcie-sos-intro.webm') },
    thinking: { uri: getStorageUrl('animations/marcie-thinking.webm') },
    waiting: { uri: getStorageUrl('animations/marcie-waiting.webm') },
    warning: { uri: getStorageUrl('animations/marcie-warning.webm') },
    wrong: { uri: getStorageUrl('animations/marcie-wrong.webm') },
  },

  // Dr. Marcie Images (Legacy require for static assets)