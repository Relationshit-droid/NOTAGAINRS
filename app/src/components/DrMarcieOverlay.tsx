import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ViewStyle,
  Animated as RNAnimated,
  Easing,
  Platform,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { COLORS, GRADIENTS, BORDER_RADIUS, SPACING, SHADOWS, ANIMATIONS } from '../theme';
import Typography from './ui/Typography';
import { ASSETS } from '../utils/assets';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type MarcieAnimation = 
  | 'intro'
  | 'idle'
  | 'point'
  | 'celebrate'
  | 'thinking'
  | 'nod'
  | 'shake'
  | 'waiting'
  | 'correct'
  | 'wrong'
  | 'shocked'
  | 'laugh'
  | 'shrug'
  | 'impatient'
  | 'detective'
  | 'listening'
  | 'warning'
  | 'jeopardy'
  | 'roast'
  | 'healing'
  | 'sos'
  | 'welcome'
  | 'error'
  | 'success'
  | 'loading'
  | 'lost'
  | 'settings'
  | 'notification'
  | 'empty'
  | 'login'
  | 'logout'
  | 'search'
  | 'permissions'
  | 'delete'
  | 'uploading'
  | 'syncing'
  | 'offline'
  | 'wrapUp';

export type MarciePosition = 
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'center'
  | 'floating';

interface DrMarcieOverlayProps {
  animation?: MarcieAnimation;
  position?: MarciePosition;
  visible?: boolean;
  quote?: string;
  showBubble?: boolean;
  bubbleDuration?: number;
  onAnimationComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  zIndex?: number;
}

const SIZE_CONFIG = {
  small: { width: 100, height: 100 },
  medium: { width: 150, height: 150 },
  large: { width: 200, height: 200 },
};

/**
 * Helper to get the correct animation source
 */
const getAnimationSource = (animation: MarcieAnimation) => {
  // Use the new videoAnimations if available
  if (animation in ASSETS.videoAnimations) {
    return (ASSETS.videoAnimations as any)[animation];
  }
  
  // Fallback to traditional animations
  switch (animation) {
    case 'idle': return ASSETS.animations.idle;
    case 'intro': return ASSETS.animations.intro;
    case 'correct': return ASSETS.animations.correct;
    case 'wrong': return ASSETS.animations.wrong;
    case 'thinking': return ASSETS.animations.thinking;
    case 'waiting': return ASSETS.animations.waiting;
    case 'laugh': return ASSETS.animations.laugh;
    case 'shrug': return ASSETS.animations.shrug;
    case 'impatient': return ASSETS.animations.impatient;
    case 'detective': return ASSETS.animations.detective;
    case 'listening': return ASSETS.animations.listening;
    case 'shocked': return ASSETS.animations.shocked;
    case 'warning': return ASSETS.animations.warning;
    case 'jeopardy': return ASSETS.animations.jeopardy;
    case 'roast': return ASSETS.animations.roast;
    case 'healing': return ASSETS.animations.healing;
    case 'sos': return ASSETS.animations.sos;
    default: return ASSETS.animations.idle;
  }
};

/**
 * Get position style with safe area consideration
 */
const getPositionStyle = (position: MarciePosition): ViewStyle => {
  const base: ViewStyle = { position: 'absolute' };
  const safeBottomMargin = 120;
  const sideMargin = SPACING.screenPadding;
  
  switch (position) {
    case 'bottom-right':
      return { ...base, right: sideMargin, bottom: safeBottomMargin };
    case 'bottom-left':
      return { ...base, left: sideMargin, bottom: safeBottomMargin };
    case 'bottom-center':
      return { ...base, left: SCREEN_WIDTH / 2 - 75, bottom: safeBottomMargin };
    case 'top-right':
      return { ...base, right: sideMargin, top: 100 };
    case 'top-left':
      return { ...base, left: sideMargin, top: 100 };
    case 'center':
      return { ...base, left: SCREEN_WIDTH / 2 - 75, top: SCREEN_HEIGHT / 2 - 100 };
    case 'floating':
      return { ...base, right: sideMargin, bottom: safeBottomMargin };
    default:
      return { ...base, right: sideMargin, bottom: safeBottomMargin };
  }
};

export default function DrMarcieOverlay({
  animation = 'idle',
  position = 'bottom-right',
  visible = true,
  quote,
  showBubble = true,
  bubbleDuration = 5000,
  onAnimationComplete,
  size = 'medium',
  style,
  zIndex = 9999,
}: DrMarcieOverlayProps) {
  const [bubbleVisible, setBubbleVisible] = useState(showBubble && !!quote);
  const [currentAnimation, setCurrentAnimation] = useState(animation);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const floatAnim = useRef(new RNAnimated.Value(0)).current;

  const sizeConfig = SIZE_CONFIG[size];

  useEffect(() => {
    if (visible) {
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATIONS.duration.normal,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATIONS.duration.fast,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (quote && showBubble) {
      setBubbleVisible(true);
      const timer = setTimeout(() => {
        setBubbleVisible(false);
      }, bubbleDuration);
      return () => clearTimeout(timer);
    }
  }, [quote, showBubble, bubbleDuration]);

  useEffect(() => {
    if (position === 'floating') {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(floatAnim, {
            toValue: -10,
            duration: ANIMATIONS.duration.slower,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          RNAnimated.timing(floatAnim, {
            toValue: 0,
            duration: ANIMATIONS.duration.slower,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [position]);

  useEffect(() => {
    setCurrentAnimation(animation);
  }, [animation]);

  if (!visible) return null;

  const positionStyle = getPositionStyle(position);

  return (
    <RNAnimated.View
      style={[
        styles.container,
        positionStyle,
        { zIndex },
        position === 'floating' && { transform: [{ translateY: floatAnim }] },
        { opacity: fadeAnim },
        style,
      ]}
      pointerEvents="none"
    >
      {bubbleVisible && quote && (
        <View style={styles.bubbleContainer}>
          <View style={styles.speechBubble}>
            <Typography variant="marcieDialogue" color={COLORS.textPrimary} center>
              {quote}
            </Typography>
          </View>
          <View style={styles.bubbleTriangle} />
        </View>
      )}

      <View style={[styles.characterContainer, { width: sizeConfig.width, height: sizeConfig.height }]}>
        <View style={[styles.glowEffect, { width: sizeConfig.width, height: sizeConfig.height }]} />
        
        <View style={[styles.character, { width: sizeConfig.width, height: sizeConfig.height }]}>
          <Video
            source={getAnimationSource(currentAnimation)}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted={true}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                onAnimationComplete?.();
              }
            }}
          />
        </View>

        <View style={styles.crown} />
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 9999,
  },
  bubbleContainer: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: SPACING.regular,
    alignItems: 'center',
    maxWidth: 280,
  },
  speechBubble: {
    backgroundColor: COLORS.backgroundModal,
    borderRadius: BORDER_RADIUS.bubble,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.regular,
    borderWidth: 1,
    borderColor: COLORS.vibrantPink,
    ...SHADOWS.neonSoft,
  },
  bubbleTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.backgroundModal,
    marginTop: -1,
  },
  characterContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    backgroundColor: COLORS.deepCosmic,
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
  },
  glowEffect: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.vibrantPink,
    opacity: 0.2,
    transform: [{ scale: 1.2 }],
  },
  crown: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.brightYellow,
    borderWidth: 2,
    borderColor: COLORS.deepCosmic,
  },
});
