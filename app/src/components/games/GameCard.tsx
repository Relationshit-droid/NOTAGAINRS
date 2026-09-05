import React, { useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { Typography, SquishyButton } from '../ui';
import * as Haptics from 'expo-haptics';

const loveActuallyLogo = require('../../../assets/logo/mainlogoone.png');

// Enhanced cosmic retro arcade color mapping
const cosmicGlowColors = {
  "Physical Connection": [COLORS.emotionalConnection, COLORS.brightYellow, COLORS.warmOrange],
  "Vulnerability": [COLORS.softViolet, COLORS.lavenderPurple, COLORS.lavenderPurple],
  "Empathy": [COLORS.mintGreen, COLORS.aquaTeal, COLORS.aquaTeal],
  "Playfulness": [COLORS.rosePink, COLORS.vibrantPink, COLORS.blushPink],
  "Intimacy": [COLORS.romanceHub, COLORS.vibrantPink, COLORS.lavenderPurple],
  "Trust": [COLORS.info, COLORS.aquaTeal, COLORS.mintGreen],
  "Communication": [COLORS.brightYellow, COLORS.brightYellow, COLORS.peachOrange],
  "Romance": [COLORS.rosePink, COLORS.vibrantPink, COLORS.blushPink],
  "Conflict Resolution": [COLORS.mintGreen, COLORS.aquaTeal, COLORS.aquaTeal],
  "Emotional Connection": [COLORS.emotionalConnection, COLORS.brightYellow, COLORS.warmOrange],
};

interface GameCardProps {
  category: string;
  title: string;
  description: string;
  onPress: () => void;
  isSelected?: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  duration?: string;
  players?: string;
}

const GameCard = ({
  category,
  title,
  description,
  onPress,
  isSelected = false,
  difficulty = 'Medium',
  duration = '15 min',
  players = '2 players',
}: GameCardProps) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const glowColors = cosmicGlowColors[category] || [COLORS.emotionalConnection, COLORS.brightYellow, COLORS.warmOrange];
  
  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return COLORS.mintGreen;
      case 'Medium': return COLORS.brightYellow;
      case 'Hard': return COLORS.vibrantPink;
      default: return COLORS.brightYellow;
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <SquishyButton
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        variant="ghost"
        style={styles.touchable}
      >
        {/* Multi-layered cosmic glow effect */}
        <View style={styles.glowContainer}>
          <LinearGradient
            colors={[...glowColors, 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.glowOuter, { shadowColor: glowColors[0] }]}
          />
          <LinearGradient
            colors={[glowColors[0], glowColors[1], 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.glowMiddle, { shadowColor: glowColors[1] }]}
          />
          <LinearGradient
            colors={[glowColors[2], 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.glowInner, { shadowColor: glowColors[2] }]}
          />
        </View>
        
        {/* Main card with cosmic retro arcade styling */}
        <BlurView intensity={80} tint="dark" style={[styles.card, isSelected && styles.cardSelected]}>
          {/* Game icon with cosmic ring */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[glowColors[0], glowColors[1]]}
              style={styles.iconRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Image source={loveActuallyLogo} style={styles.logo} />
          </View>
          
          {/* Game title with neon effect */}
          <Typography variant="h3" center style={[styles.title, { color: glowColors[0] }]} numberOfLines={2}>
            {title}
          </Typography>
          
          {/* Game description */}
          <Typography variant="small" center style={styles.description} numberOfLines={3}>
            {description}
          </Typography>
          
          {/* Game metadata */}
          <View style={styles.metadata}>
            <View style={[styles.metadataItem, { backgroundColor: getDifficultyColor(difficulty) }]}>
              <Typography variant="label" color={COLORS.textPrimary}>{difficulty}</Typography>
            </View>
            <View style={styles.metadataItem}>
              <Typography variant="label" color={COLORS.textPrimary}>{duration}</Typography>
            </View>
            <View style={styles.metadataItem}>
              <Typography variant="label" color={COLORS.textPrimary}>{players}</Typography>
            </View>
          </View>
          
          {/* Category badge with cosmic styling */}
          <View style={styles.footer}>
            <LinearGradient
              colors={[glowColors[0], glowColors[1]]}
              style={styles.categoryBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Typography variant="label" color={COLORS.textPrimary}>{category}</Typography>
            </LinearGradient>
          </View>
          
          {/* Selection indicator */}
          {isSelected && (
            <View style={styles.selectionIndicator}>
              <LinearGradient
                colors={[COLORS.brightYellow, COLORS.warmOrange]}
                style={styles.selectionBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Typography variant="label" color={COLORS.textPrimary}>SELECTED</Typography>
              </LinearGradient>
            </View>
          )}
        </BlurView>
      </SquishyButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.card,
    margin: SPACING.small,
    width: 280,
    height: 380,
  },
  
  touchable: {
    flex: 1,
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  glowOuter: {
    position: 'absolute',
    top: -SPACING.regular,
    left: -SPACING.regular,
    right: -SPACING.regular,
    bottom: -SPACING.regular,
    borderRadius: BORDER_RADIUS.card + SPACING.regular,
    ...SHADOWS.large,
    shadowOpacity: 0.6,
  },
  
  glowMiddle: {
    position: 'absolute',
    top: -SPACING.small,
    left: -SPACING.small,
    right: -SPACING.small,
    bottom: -SPACING.small,
    borderRadius: BORDER_RADIUS.card + SPACING.small,
    ...SHADOWS.medium,
    shadowOpacity: 0.7,
  },
  
  glowInner: {
    position: 'absolute',
    top: -SPACING.tiny,
    left: -SPACING.tiny,
    right: -SPACING.tiny,
    bottom: -SPACING.tiny,
    borderRadius: BORDER_RADIUS.card + SPACING.tiny,
    ...SHADOWS.small,
    shadowOpacity: 0.8,
  },
  
  card: {
    flex: 1,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundCard,
  },
  
  cardSelected: {
    borderColor: 'rgba(255, 239, 31, 0.5)',
    borderWidth: 2,
  },
  
  iconContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  
  iconRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
  },
  
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  
  title: {
    marginBottom: SPACING.small,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  description: {
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },
  
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: SPACING.regular,
  },
  
  metadataItem: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.micro,
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: COLORS.backgroundInput,
  },
  
  footer: {
    borderTopWidth: 1,
    borderColor: COLORS.divider,
    paddingTop: SPACING.regular,
    marginTop: SPACING.regular,
    width: '100%',
    alignItems: 'center',
  },
  
  categoryBadge: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.micro,
    borderRadius: BORDER_RADIUS.small,
  },
  
  selectionIndicator: {
    position: 'absolute',
    top: SPACING.small,
    right: SPACING.small,
  },
  
  selectionBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.micro,
    borderRadius: BORDER_RADIUS.small,
  },
});

export default GameCard;
