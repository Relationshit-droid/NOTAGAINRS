import { ReactNode } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { COLORS, GRADIENTS, BORDER_RADIUS, SPACING, SHADOWS } from '../../theme';

type GlassCardProps = {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: any;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
};

export default function GlassCard({ 
  children, 
  width, 
  height, 
  radius = BORDER_RADIUS.card, 
  style, 
  onPress,
  variant = 'default',
  padding = 'medium'
}: GlassCardProps) {
  const Container = onPress ? Pressable : View;
  
  // Padding configurations - increased for better visual breathing room
  const paddingConfig = {
    none: 0,
    small: SPACING.small,
    medium: SPACING.cardPadding,
    large: SPACING.xlarge,
  };
  
  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          ...SHADOWS.card,
          backgroundColor: COLORS.backgroundCard,
        };
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: COLORS.borderSubtle,
          backgroundColor: 'transparent',
        };
      case 'default':
      default:
        return {
          backgroundColor: COLORS.backgroundCard,
          borderWidth: 1,
          borderColor: COLORS.borderSubtle,
          ...SHADOWS.neonSoft,
        };
    }
  };

  return (
    <Container 
      onPress={onPress} 
      style={[
        styles.container, 
        { 
          width, 
          height, 
          borderRadius: radius,
        },
        getVariantStyles(),
        style
      ]}
    >
      {variant === 'default' && (
        <BlurView 
          intensity={50} 
          tint="dark" 
          style={[styles.blur, { borderRadius: radius }]} 
        />
      )}
      
      {/* Gradient border effect */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.vibrantPink} stopOpacity={Platform.OS === 'android' ? 0.3 : 0.15} />
            <Stop offset="50%" stopColor={COLORS.rosePink} stopOpacity={Platform.OS === 'android' ? 0.2 : 0.1} />
            <Stop offset="100%" stopColor={COLORS.vibrantPink} stopOpacity={Platform.OS === 'android' ? 0.3 : 0.15} />
          </LinearGradient>
        </Defs>
        <Rect
          x={1}
          y={1}
          rx={radius}
          ry={radius}
          width="99%"
          height="99%"
          fill="transparent"
          stroke="url(#borderGradient)"
          strokeWidth={1}
          strokeDasharray="8 12"
        />
      </Svg>
      
      <View style={[styles.content, { borderRadius: radius, padding: paddingConfig[padding] }]}>
        {children}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});
