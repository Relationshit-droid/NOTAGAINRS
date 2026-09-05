import { Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../../theme';

type RadialGradientBackgroundProps = {
  noiseDensity?: number;
  variant?: 'default' | 'dark' | 'purple';
};

export default function RadialGradientBackground({ 
  noiseDensity = 0.0006,
  variant = 'default'
}: RadialGradientBackgroundProps) {
  
  const getGradientColors = () => {
    switch (variant) {
      case 'dark':
        return [COLORS.backgroundSecondary, COLORS.backgroundPrimary] as const;
      case 'purple':
        return [COLORS.richPlum, COLORS.deepCosmic] as const;
      case 'default':
      default:
        return GRADIENTS.background.colors;
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={GRADIENTS.background.start}
      end={GRADIENTS.background.end}
      style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 0 }}
      pointerEvents="none"
    >
      {Platform.OS !== 'web' && (
        <View style={{ flex: 1 }} pointerEvents="none" />
      )}
    </LinearGradient>
  );
}
