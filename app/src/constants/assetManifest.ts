import { Platform } from 'react-native';

export const CRITICAL_LOGOS: number[] = [
  require('../../assets/logo/RSICONNB.png'),
];

export const LAZY_LOGOS: number[] = [
  require('../../assets/logo/RSTRANSPARENTICONNB.png'),
  require('../../assets/logo/RSBLACKNBSQUARE.png'),
  require('../../assets/logo/RSWHITENBSQUARE.png'),
  require('../../assets/logo/RSBLACKNBBANNER.png'),
  require('../../assets/logo/RSWHITENBBANNER.png'),
];

export const LOGO_IMAGES: number[] = [...CRITICAL_LOGOS, ...LAZY_LOGOS];

// Marcie avatar frames removed - using video assets instead
export const AVATAR_FRAMES: number[] = [];

export const FONT_SOURCES: Record<string, number> = {
  'BarbieDream-Regular': require('../../assets/fonts/barbie.ttf'),
  'Cheese-Regular': require('../../assets/fonts/cheese.ttf'),
  'HolidayChristmas-Regular': require('../../assets/fonts/holiday.ttf'),
  'SweetPink-Regular': require('../../assets/fonts/sweet.ttf'),
  'WonderfulSometimes-Regular': require('../../assets/fonts/wonderful.ttf'),
  'Cute-Regular': require('../../assets/fonts/cute.ttf'),
  'Nietha-Regular': require('../../assets/fonts/nietha.ttf'),
  'Pink-Regular': require('../../assets/fonts/pink.ttf'),
  'Smile-Regular': require('../../assets/fonts/smile.ttf'),
};