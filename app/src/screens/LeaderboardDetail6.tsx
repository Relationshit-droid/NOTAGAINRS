import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

interface WaveformBarProps {
  height: number;
}

const WaveformBar = ({ height }: WaveformBarProps) => (
  <View style={[styles.waveformBar, { height }]} />
);

const LeaderboardDetail6Screen = () => {
  const waveformHeights = [48, 80, 128, 192, 96, 160, 224, 128, 256, 176, 208, 112, 192, 80, 144, 64, 32];

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.background} />
      
      <View style={styles.header}>
        <Typography variant="label" color={COLORS.textSecondary}>
          VENTING FREQUENCIES...
        </Typography>
        <TouchableOpacity>
          <GlassCard variant="outlined" padding="small">
            <Typography variant="label" color={COLORS.textPrimary}>
              PRIVATE SESSION
            </Typography>
          </GlassCard>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <Typography variant="gameTitle" color={COLORS.textPrimary} center>
          SOUNDPROOF BOOTH
        </Typography>
        <View style={styles.waveformContainer}>
          {waveformHeights.map((h, i) => <WaveformBar key={i} height={h} />)}
        </View>
        <Typography variant="body" color={COLORS.textSecondary} center style={styles.quote}>
          "Speak your truth without filters. Let the nebula absorb the weight of your words."
        </Typography>
      </View>

      <View style={styles.footer}>
        <GlassCard variant="outlined" style={styles.footerContent} padding="medium">
          <Typography variant="label" color={COLORS.textPrimary}>
            INPUT GAIN: 75%
          </Typography>
          <SquishyButton variant="secondary">
            <Typography variant="button" color={COLORS.textPrimary}>
              RELEASE TO PARTNER
            </Typography>
          </SquishyButton>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: SPACING.regular, 
    borderBottomWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    backgroundColor: COLORS.backgroundInput 
  },
  mainContent: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: SPACING.screenPadding 
  },
  waveformContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 256, 
    gap: SPACING.small, 
    marginVertical: SPACING.xxxlarge 
  },
  waveformBar: {
    width: SPACING.tiny,
    backgroundColor: COLORS.info,
    borderRadius: BORDER_RADIUS.small,
  },
  quote: { 
    maxWidth: 300,
    fontStyle: 'italic'
  },
  footer: { 
    padding: SPACING.regular 
  },
  footerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
});

export default LeaderboardDetail6Screen;
