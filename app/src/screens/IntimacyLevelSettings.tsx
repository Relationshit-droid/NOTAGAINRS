import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import Typography from '../components/ui/Typography';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

interface IntimacySliderProps {
  icon: string;
  label: string;
  description: string;
  value: number;
  color: string;
  onValueChange: (value: number) => void;
}

const IntimacySlider = ({ icon, label, description, value, color }: IntimacySliderProps) => (
  <View style={styles.sliderContainer}>
    <Typography variant="h3" color={COLORS.textPrimary}>{icon}</Typography>
    <View style={styles.sliderTextContainer}>
      <Typography variant="label" color={COLORS.textPrimary}>{label}</Typography>
      <Typography variant="caption" color={COLORS.textSecondary}>{description}</Typography>
    </View>
    <Typography variant="h2" color={color}>{value}/10</Typography>
  </View>
);

const IntimacyLevelSettingsScreen = () => {
  const [physical] = useState(8);
  const [emotional] = useState(6);
  const [intellectual] = useState(5);
  const [social] = useState(9);
  const [spiritual] = useState(7);
  const [adventurous] = useState(6);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Typography variant="gameTitle" color={COLORS.textPrimary} center style={styles.pageTitle}>
          Intimacy LEVEL Settings
        </Typography>
        <Typography variant="body" color={COLORS.textSecondary} center style={styles.pageSubtitle}>
          Set your cosmic boundaries. These values help the game tailor dialogue and activities to your comfort zone.
        </Typography>

        <GlassCard variant="outlined" style={styles.slidersPanel} padding="medium">
          <IntimacySlider 
            icon="✋" 
            label="PHYSICAL BOUNDARIES" 
            description="Physical touch and personal space levels" 
            value={physical} 
            color={COLORS.vibrantPink} 
            onValueChange={() => {}} 
          />
          <IntimacySlider 
            icon="❤️" 
            label="EMOTIONAL INTIMACY" 
            description="Vulnerability and heart-to-heart sharing" 
            value={emotional} 
            color={COLORS.brightYellow} 
            onValueChange={() => {}} 
          />
          <IntimacySlider 
            icon="🧠" 
            label="INTELLECTUAL CONNECTION" 
            description="Deep debates and conceptual challenges" 
            value={intellectual} 
            color={COLORS.brightYellow} 
            onValueChange={() => {}} 
          />
          <IntimacySlider 
            icon="👥" 
            label="SOCIAL COMFORT" 
            description="Public displays and social interactions" 
            value={social} 
            color={COLORS.info} 
            onValueChange={() => {}} 
          />
          <IntimacySlider 
            icon="✨" 
            label="SPIRITUAL ALIGNMENT" 
            description="Shared values and cosmic beliefs" 
            value={spiritual} 
            color={COLORS.mintGreen} 
            onValueChange={() => {}} 
          />
          <IntimacySlider 
            icon="🚀" 
            label="ADVENTUROUSNESS" 
            description="Willingness to try cosmic surprises" 
            value={adventurous} 
            color={COLORS.lavenderPurple} 
            onValueChange={() => {}} 
          />
        </GlassCard>

        <View style={styles.summaryContainer}>
          <GlassCard variant="outlined" style={styles.partnerMatchContainer} padding="large">
            <Typography variant="label" color={COLORS.vibrantPink} center>
              PARTNER MATCH
            </Typography>
            <Typography variant="gameTitle" color={COLORS.vibrantPink} center style={styles.partnerMatchValue}>
              94%
            </Typography>
          </GlassCard>
          <View style={styles.syncSummary}>
            <Typography variant="h4" color={COLORS.textPrimary}>
              SYNC SUMMARY
            </Typography>
            <Typography variant="body" color={COLORS.textSecondary} style={styles.syncSummaryDescription}>
              Your zones are highly compatible with your partner's current settings.
            </Typography>
            <Typography variant="body" color={COLORS.textPrimary} style={styles.syncSummaryLetters}>
              Phb Emi Inc Soc Spi Adv
            </Typography>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  scrollContent: { 
    padding: SPACING.screenPadding 
  },
  pageTitle: { 
    marginBottom: SPACING.small 
  },
  pageSubtitle: { 
    marginBottom: SPACING.xlarge, 
    paddingHorizontal: SPACING.large 
  },
  slidersPanel: { 
    marginBottom: SPACING.xlarge 
  },
  sliderContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: SPACING.regular,
    gap: SPACING.regular
  },
  sliderTextContainer: { 
    flex: 1 
  },
  summaryContainer: { 
    flexDirection: 'row', 
    gap: SPACING.regular, 
    marginTop: SPACING.large, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  partnerMatchContainer: { 
    alignItems: 'center', 
    justifyContent: 'center',
    minWidth: SPACING.xxxlarge * 3
  },
  partnerMatchValue: { 
    marginTop: SPACING.small 
  },
  syncSummary: { 
    flex: 1 
  },
  syncSummaryDescription: { 
    marginVertical: SPACING.small 
  },
  syncSummaryLetters: { 
    letterSpacing: SPACING.small 
  },
});

export default IntimacyLevelSettingsScreen;
