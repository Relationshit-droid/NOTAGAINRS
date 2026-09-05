import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, Typography, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS } from '../../theme';

const ForeplaySliderGame2Screen = () => {
  const intensity = 75;

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <View style={styles.header}>
        <Typography variant="h1">Foreplay Slider</Typography>
        <Typography variant="body">Partner A: Find the sweet spot. Partner B: Feel the heat.</Typography>
      </View>

      <View style={styles.mainGrid}>
        {/* Left Panel: Controller */}
        <GlassCard style={styles.glassPanel}>
          <Typography variant="label">PARTNER A</Typography>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <LinearGradient 
                colors={[COLORS.rosePink, COLORS.vibrantPink]} 
                style={[styles.sliderFill, { height: `${intensity}%` }]} 
              />
              <View style={[styles.sliderHandle, { bottom: `${intensity}%` }]} />
            </View>
          </View>
          <Typography variant="h1" style={styles.sliderValueText}>{intensity}%</Typography>
        </GlassCard>

        {/* Right Panel: Visualizer */}
        <View style={styles.rightColumn}>
          <GlassCard style={styles.visualizerPanel}>
            <Typography variant="label">AROUSAL LEVEL</Typography>
            <View style={styles.orbContainer}>
              <LinearGradient 
                colors={[COLORS.lavenderPurple, COLORS.vibrantPink]} 
                style={styles.orb}
              >
                <Typography variant="h1" style={styles.orbText}>{intensity}%</Typography>
              </LinearGradient>
            </View>
          </GlassCard>
          <GlassCard style={styles.marciePanel}>
            <View style={styles.marcieAvatar} />
            <Typography variant="marcieDialogue">"Oh, the tension is palpable! We're reaching the climax of this round..."</Typography>
          </GlassCard>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundPrimary },
  header: { alignItems: 'center', padding: SPACING.regular },
  mainGrid: { flex: 1, flexDirection: 'row', padding: SPACING.screenPadding, gap: SPACING.screenPadding },
  glassPanel: {
    flex: 1,
    padding: SPACING.cardPadding,
    alignItems: 'center'
  },
  panelTitle: { color: COLORS.vibrantPink },
  sliderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xlarge },
  sliderTrack: { 
    width: 80, 
    height: '100%', 
    backgroundColor: COLORS.backgroundCard, 
    borderRadius: BORDER_RADIUS.round, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle 
  },
  sliderFill: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    borderRadius: BORDER_RADIUS.round 
  },
  sliderHandle: { 
    position: 'absolute', 
    left: '50%', 
    marginLeft: -24, 
    width: 48, 
    height: 48, 
    borderRadius: BORDER_RADIUS.round, 
    backgroundColor: COLORS.textPrimary
  },
  sliderValueText: { fontSize: TYPOGRAPHY.fontSize.displayMedium },
  rightColumn: { flex: 2, gap: SPACING.screenPadding },
  visualizerPanel: { 
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: SPACING.cardPadding
  },
  visualizerTitle: { 
    color: COLORS.textHint, 
    position: 'absolute', 
    top: SPACING.xlarge 
  },
  orbContainer: { width: 280, height: 280, justifyContent: 'center', alignItems: 'center' },
  orb: { 
    width: '80%', 
    height: '80%', 
    borderRadius: BORDER_RADIUS.round, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  orbText: { fontSize: TYPOGRAPHY.fontSize.displayLarge },
  marciePanel: { 
    flex: 1, 
    flexDirection: 'row', 
    padding: SPACING.regular, 
    gap: SPACING.regular, 
    alignItems: 'center' 
  },
  marcieAvatar: { 
    width: 64, 
    height: 64, 
    borderRadius: BORDER_RADIUS.round, 
    backgroundColor: COLORS.vibrantPink, 
    borderWidth: 2, 
    borderColor: COLORS.vibrantPink 
  }
});

export default ForeplaySliderGame2Screen;
