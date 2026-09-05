import { Dimensions, PixelRatio } from 'react-native';

export function scaleFont(size: number) {
  const { width } = Dimensions.get('window');
  const base = 375;
  return Math.round(PixelRatio.roundToNearestPixel(size * (width / base)));
}
