import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const AdmirationAimScreen = () => {
  // Placeholder for game state and logic
  const score = 1200;
  const kudos = ["You're an amazing listener.", "I love your sense of humor.", "Thank you for always being there for me."];

  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Expressing admiration strengthens your bond! Each target hit represents a positive trait you appreciate in your partner.">
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="h1" style={styles.title}>
          The Love Arcade
        </Typography>
        <Typography variant="h2" style={styles.subtitle}>
          +100 Games to Deepen Connection
        </Typography>

        <View style={styles.targetContainer}>
          <LinearGradient
            colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ring, styles.outerRing]}
          />
          <LinearGradient
            colors={[COLORS.warmOrange, COLORS.brightYellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ring, styles.middleRing]}
          />
          <LinearGradient
            colors={[COLORS.mintGreen, COLORS.softViolet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ring, styles.innerRing]}
          />
          <LinearGradient
            colors={COLORS.progress}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bullseye}
          />
        </View>

        <GlassCard style={styles.kudosContainer}>
          <Typography variant="h3" style={styles.kudosTitle}>Kudos Corner</Typography>
          {kudos.map((kudo, index) => (
            <Typography key={index} variant="body" style={styles.kudoText}>- {kudo}</Typography>
          ))}
        </GlassCard>

        <View style={styles.scoreAndActionContainer}>
            <View style={styles.scoreContainer}>
                <Typography variant="caption" style={styles.scoreLabel}>Score</Typography>
                <LinearGradient
                  colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.scoreValueContainer}
                >
                  <Typography variant="h2" style={styles.scoreValue}>{score}</Typography>
                </LinearGradient>
            </View>
            
            <SquishyButton>
                <Typography variant="button">Fire!</Typography>
            </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.backgroundPrimary 
  },
  content: { 
    padding: SPACING.lg, 
    alignItems: 'center' 
  },
  title: { 
    textAlign: 'center', 
    marginBottom: SPACING.sm 
  },
  subtitle: { 
    textAlign: 'center', 
    opacity: 0.7, 
    marginBottom: SPACING.lg 
  },
  targetContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxlarge,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.large,
  },
  ring: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
  },
  outerRing: { 
    width: 300, 
    height: 300 
  },
  middleRing: { 
    width: 200, 
    height: 200 
  },
  innerRing: { 
    width: 100, 
    height: 100 
  },
  bullseye: { 
    width: 50, 
    height: 50, 
    borderRadius: BORDER_RADIUS.round 
  },
  kudosContainer: {
    width: '100%',
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  kudosTitle: {
    color: COLORS.vibrantPink,
    textAlign: 'center',
    marginBottom: SPACING.regular,
    backgroundColor: 'rgba(219, 20, 124, 0.2)',
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.xxlarge,
  },
  kudoText: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.large,
  },
  scoreAndActionContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SPACING.regular,
  },
  scoreContainer: {
      alignItems: 'center',
  },
  scoreLabel: {
    color: COLORS.vibrantPink,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(219, 20, 124, 0.2)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.large,
  },
  scoreValueContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  scoreValue: {
    color: COLORS.textPrimary,
  },
});

export default AdmirationAimScreen;
