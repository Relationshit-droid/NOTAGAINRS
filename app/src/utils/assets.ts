/**
 * Asset management utility for Love Arcade app
 * Maps to public/appdocs folder structure as specified in Design Bible
 */
import { storage } from '../lib/firebaseClient';
import { ref, getDownloadURL } from 'firebase/storage';

// Base storage bucket URL (updated based on firebaseClient.ts storageBucket)
const STORAGE_BUCKET = "love-actually-thegame.appspot.com"; 

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

  // Dr. Marcie Video Animations (New high-quality videos in Firebase Storage)
  videoAnimations: {
    welcome: { uri: getStorageUrl('videos/animation12ohoney4.mov') },
    error: { uri: getStorageUrl('videos/animation1didnt work.mov') },
    success: { uri: getStorageUrl('videos/animation42lookatyou.mov') },
    loading: { uri: getStorageUrl('videos/animation20yesyesiknow.mov') },
    warning: { uri: getStorageUrl('videos/animation18heyso.mov') },
    lost: { uri: getStorageUrl('videos/animation13yourlost.mov') },
    settings: { uri: getStorageUrl('videos/animation10settings.mov') },
    notification: { uri: getStorageUrl('videos/animation17pssthey.mov') },
    empty: { uri: getStorageUrl('videos/animation32thisisawkward.mov') },
    login: { uri: getStorageUrl('videos/animation28welcomeback.mov') },
    logout: { uri: getStorageUrl('videos/animation23leavingalready.mov') },
    search: { uri: getStorageUrl('videos/animation9searching.mov') },
    permissions: { uri: getStorageUrl('videos/animation8ineedtoaskyouforsomething.mov') },
    delete: { uri: getStorageUrl('videos/animation25wannadelete.mov') },
    uploading: { uri: getStorageUrl('videos/animation24uploading.mov') },
    syncing: { uri: getStorageUrl('videos/animation15linkingdata.mov') },
    offline: { uri: getStorageUrl('videos/animation2lookwhosoffline.mov') },
    wrapUp: { uri: getStorageUrl('videos/animation31andthatsawrap.mov') },
    welwellwell: { uri: getStorageUrl('videos/animation41welwellwell.mov') },
    ikewyouhadit: { uri: getStorageUrl('videos/animation11ikewyouhadit.mov') },
  },

  // Dr. Marcie Images (Legacy require for static assets)
  marcieImages: {
    avatar1: require('../../assets/marcieimages/marcieimage1.png'),
    avatar15: require('../../assets/marcieimages/marcieimage15.png'),
    avatar25: require('../../assets/marcieimages/marcieimage25.png'),
    avatar35: require('../../assets/marcieimages/marcieimage35.png'),
  },

  // App Logos
  logos: {
    mainLogo: require('../../assets/logo/mainlogo.png'),
    mainLogoOne: require('../../assets/logo/mainlogoone.png'),
  },

  // Fonts
  fonts: {
    barbie: require('../../assets/fonts/barbie.ttf'),
  },

  // Default avatar
  defaultAvatar: require('../../assets/marcieimages/marcieimage1.png'),
};

/**
 * Get appropriate Dr. Marcie animation based on game context
 */
export const getMarcieAnimation = (context: string) => {
  return (ASSETS.animations as any)[context] || ASSETS.animations.idle;
};

/**
 * Get appropriate Dr. Marcie image based on personality level
 */
export const getMarcieImage = (personalityLevel: number = 1) => {
  const imageMap: Record<number, any> = {
    1: ASSETS.marcieImages.avatar1,
    2: ASSETS.marcieImages.avatar15,
    3: ASSETS.marcieImages.avatar25,
    4: ASSETS.marcieImages.avatar35,
  };
  
  return imageMap[personalityLevel] || ASSETS.marcieImages.avatar1;
};

export default ASSETS;
