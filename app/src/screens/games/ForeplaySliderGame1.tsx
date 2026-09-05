import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const ForeplaySliderGame1Screen = () => {
  const [sliderValue, setSliderValue] = useState(75);

  const intensityLevels = ['Subtle', 'Playful', 'Warming', 'Passion', 'Intense'];

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <View style={styles.header}>
        <Typography variant="h1">Foreplay Slider</Typography>
        <Typography variant="caption">Variant 4 of 10</Typography>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.sliderSection}>
          <View style={styles.intensityMarkers}>
            {intensityLevels.map(level => <Typography key={level} variant="caption">{level}</Typography>)}
          </View>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={sliderValue}
              onValueChange={setSliderValue}
              minimumTrackTintColor={COLORS.vibrantPink}
              maximumTrackTintColor={COLORS.backgroundCard}
              thumbTintColor={COLORS.aquaTeal}
            />
          </View>

          <View style={styles.statsContainer}>
            <GlassCard style={styles.statBox}>
              <Typography variant="caption">Arousal Meter</Typography>
              <Typography variant="h1" style={styles.statValue}>{Math.round(sliderValue)}%</Typography>
            </GlassCard>
            <GlassCard style={styles.syncBox}>
              <Typography variant="body" style={styles.syncStatus}>Harmony achieved</Typography>
            </GlassCard>
          </View>
        </View>

        <SquishyButton style={styles.confirmButton}>
          <Typography variant="body">Confirm Setting</Typography>
        </SquishyButton>
      </View>

      <GlassCard style={styles.marcieContainer}>
        <Typography variant="marcieDialogue">"Sparks are flying! Partner A, I can feel the tension rising..."</Typography>
      </GlassCard>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundPrimary },
  header: { alignItems: 'center', padding: SPACING.regular },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.screenPadding },
  sliderSection: { flexDirection: 'row', alignItems: 'center', gap: SPACING.regular },
  intensityMarkers: { height: 380, justifyContent: 'space-between', alignItems: 'flex-end' },
  sliderContainer: { justifyContent: 'center', alignItems: 'center', height: 450, width: 50 },
  slider: { height: 400, width: 200, transform: [{ rotate: '-90deg' }] },
  statsContainer: { gap: SPACING.regular, width: 200 },
  statBox: { padding: SPACING.regular },
  statLabel: { color: COLORS.textSecondary },
  statValue: { fontSize: TYPOGRAPHY.fontSize.displayLarge },
  syncBox: { padding: SPACING.regular },
  syncStatus: { fontStyle: 'italic' },
  confirmButton: { marginTop: SPACING.xlarge },
  marcieContainer: { 
    position: 'absolute', 
    bottom: SPACING.xlarge, 
    left: SPACING.screenPadding, 
    width: 300,
    padding: SPACING.regular
  }
});

export default ForeplaySliderGame1Screen;
