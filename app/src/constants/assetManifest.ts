import { Platform } from 'react-native';

export const INTRO_VIDEO: number[] = [require('../assets/animations/marcie-intro.webm')];

export const CRITICAL_LOGOS: number[] = [
  require('../../assets/logo/mainlogoone.png'),
];

export const LAZY_LOGOS: number[] = [
  require('../../assets/logo/mainlogo.png'),
  require('../../assets/logo/logo1.png'),
  require('../../assets/logo/logo2.png'),
  require('../../assets/logo/logo3.png'),
  require('../../assets/logo/logo4.png'),
  require('../../assets/logo/logo5.png'),
  require('../../assets/logo/logo7.png'),
  require('../../assets/logo/logo8.png'),
  require('../../assets/logo/logo9.png'),
  require('../../assets/logo/logo10.png'),
  require('../../assets/logo/logo11.png'),
  require('../../assets/logo/logo12.png'),
  require('../../assets/logo/logo13.png'),
];

export const LOGO_IMAGES: number[] = [...CRITICAL_LOGOS, ...LAZY_LOGOS];

export const CRITICAL_AVATAR_FRAMES: number[] = [
  require('../../assets/marcieimages/marcieimage1.png'),
];

export const LAZY_AVATAR_FRAMES: number[] = [
  require('../../assets/marcieimages/marcieimage2.png'),
  require('../../assets/marcieimages/marcieimage3.png'),
  require('../../assets/marcieimages/marcieimage4.png'),
  require('../../assets/marcieimages/marcieimage5.png'),
  require('../../assets/marcieimages/marcieimage6.png'),
  require('../../assets/marcieimages/marcieimage7.png'),
  require('../../assets/marcieimages/marcieimage8.png'),
  require('../../assets/marcieimages/marcieimage9.png'),
  require('../../assets/marcieimages/marcieimage10.png'),
  require('../../assets/marcieimages/marcieimage11.png'),
  require('../../assets/marcieimages/marcieimage12.png'),
  require('../../assets/marcieimages/marcieimage13.png'),
  require('../../assets/marcieimages/marcieimage14.png'),
  require('../../assets/marcieimages/marcieimage15.png'),
  require('../../assets/marcieimages/marcieimage16.png'),
  require('../../assets/marcieimages/marcieimage17.png'),
  require('../../assets/marcieimages/marcieimage18.png'),
  require('../../assets/marcieimages/marcieimage19.png'),
  require('../../assets/marcieimages/marcieimage20.png'),
];

export const AVATAR_FRAMES: number[] = [...CRITICAL_AVATAR_FRAMES, ...LAZY_AVATAR_FRAMES];

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
