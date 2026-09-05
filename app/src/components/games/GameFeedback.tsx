import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '../../utils/haptics';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../../theme';
import { Typography } from '../ui';

interface GameFeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onComplete?: () => void;
}

const GameFeedback: React.FC<GameFeedbackProps> = ({
  type,
  message,
  duration = 3000,
  onComplete,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Trigger haptic feedback based on type
    switch (type) {
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate out after duration
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onComplete) onComplete();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [type, duration, onComplete]);

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'information-circle';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: COLORS.success,
          icon: COLORS.textPrimary,
          text: COLORS.textPrimary,
          shadow: COLORS.success,
        };
      case 'error':
        return {
          background: COLORS.error,
          icon: COLORS.textPrimary,
          text: COLORS.textPrimary,
          shadow: COLORS.error,
        };
      case 'warning':
        return {
          background: COLORS.warning,
          icon: COLORS.textPrimary,
          text: COLORS.textPrimary,
          shadow: COLORS.warning,
        };
      case 'info':
        return {
          background: COLORS.info,
          icon: COLORS.textPrimary,
          text: COLORS.textPrimary,
          shadow: COLORS.info,
        };
      default:
        return {
          background: COLORS.info,
          icon: COLORS.textPrimary,
          text: COLORS.textPrimary,
          shadow: COLORS.info,
        };
    }
  };

  const colors = getColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          shadowColor: colors.shadow,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Ionicons
        name={getIconName() as any}
        size={TYPOGRAPHY.fontSize.displaySmall}
        color={colors.icon}
        style={styles.icon}
      />
      <Typography variant="bodyLarge" style={[styles.message, { color: colors.text }]}>
        {message}
      </Typography>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.large,
    shadowOffset: SHADOWS.medium.shadowOffset,
    shadowOpacity: SHADOWS.medium.shadowOpacity,
    shadowRadius: SHADOWS.medium.shadowRadius,
    elevation: SHADOWS.medium.elevation,
    zIndex: 1000,
  },
  icon: {
    marginRight: SPACING.medium,
  },
  message: {
    flex: 1,
  },
});

export default GameFeedback;
