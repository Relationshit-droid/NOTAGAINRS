import { ReactNode, useRef } from 'react';
import { Pressable, ViewStyle, Platform, Animated, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, BORDER_RADIUS, SPACING, SHADOWS, ANIMATIONS } from '../../theme';

type SquishyButtonProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
};

export default function SquishyButton({ 
  children, 
  style, 
  onPress, 
  accessibilityLabel, 
  disabled = false,
  variant = 'primary',
  size = 'medium'
}: SquishyButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const shadow = useRef(new Animated.Value(0.2)).current;

  // Size configurations - adjusted for better proportions
  const sizeConfig = {
    small: { paddingVertical: SPACING.small, paddingHorizontal: SPACING.regular, minHeight: 40 },
    medium: { paddingVertical: SPACING.regular, paddingHorizontal: SPACING.xlarge, minHeight: 52 },
    large: { paddingVertical: SPACING.large, paddingHorizontal: SPACING.xxlarge, minHeight: 60 },
  };

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, { 
        toValue: 0.96, 
        friction: 8,
        tension: 100,
        useNativeDriver: Platform.OS !== 'web' 
      }),
      Animated.timing(shadow, { 
        toValue: 0.5, 
        duration: ANIMATIONS.duration.fast, 
        useNativeDriver: Platform.OS !== 'web' 
      })
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, { 
        toValue: 1, 
        friction: 8,
        tension: 100,
        useNativeDriver: Platform.OS !== 'web' 
      }),
      Animated.timing(shadow, { 
        toValue: 0.2, 
        duration: ANIMATIONS.duration.fast, 
        useNativeDriver: Platform.OS !== 'web' 
      })
    ]).start();
  };

  const handleHoverIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scale, { 
        toValue: 1.03, 
        duration: ANIMATIONS.duration.fast, 
        useNativeDriver: Platform.OS !== 'web' 
      }),
      Animated.timing(shadow, { 
        toValue: 0.5, 
        duration: ANIMATIONS.duration.fast, 
        useNativeDriver: Platform.OS !== 'web' 
      })
    ]).start();
  };

  const handleHoverOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scale, { 
        toValue: 1, 
        duration: ANIMATIONS.duration.fast, 
        useNativeDriver: Platform.OS !== 'web' 
      }),
      Animated.timing(shadow, { 
        toValue: 0.2, 
        duration: ANIMATIONS.duration.fast, 
        useNativeDriver: Platform.OS !== 'web' 
      })
    ]).start();
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.backgroundCard,
          borderWidth: 1,
          borderColor: COLORS.borderSubtle,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.borderSubtle,
        };
      case 'primary':
      default:
        return null;
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = sizeConfig[size];

  // Animated styles
  const animatedStyle = {
    transform: [{ scale }],
    shadowOpacity: shadow,
    opacity: disabled ? 0.5 : 1,
  };

  const buttonContent = (
    <Animated.View 
      style={[
        animatedStyle,
        {
          borderRadius: BORDER_RADIUS.button,
          overflow: 'hidden',
          minHeight: sizeStyle.minHeight,
          justifyContent: 'center',
          alignItems: 'center',
        },
        variant === 'primary' && {
          ...SHADOWS.buttonGlow,
          shadowOpacity: shadow,
        },
        variantStyle,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={GRADIENTS.primary.colors}
          start={GRADIENTS.primary.start}
          end={GRADIENTS.primary.end}
          style={{
            borderRadius: BORDER_RADIUS.button,
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessible
            accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Button')}
            accessibilityState={{ disabled }}
            focusable={!disabled}
            onPress={() => {
              if (disabled) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onPress && onPress();
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onHoverIn={handleHoverIn}
            onHoverOut={handleHoverOut}
            style={{
              paddingVertical: sizeStyle.paddingVertical,
              paddingHorizontal: sizeStyle.paddingHorizontal,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: sizeStyle.minHeight,
            }}
          >
            {children}
          </Pressable>
        </LinearGradient>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessible
          accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Button')}
          accessibilityState={{ disabled }}
          focusable={!disabled}
          onPress={() => {
            if (disabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress && onPress();
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          style={{
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: sizeStyle.minHeight,
            width: '100%',
          }}
        >
          {children}
        </Pressable>
      )}
    </Animated.View>
  );

  return buttonContent;
}
