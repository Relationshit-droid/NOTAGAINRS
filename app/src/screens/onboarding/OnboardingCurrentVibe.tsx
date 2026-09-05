import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { useAppStore } from '../../state/store';

const OnboardingVibeScreen = () => {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [sliderValue, setSliderValue] = useState(0.65);

  const handleNext = async () => {
    if (user && userId) {
      try {
        const token = await user.getIdToken();
        const couple = await coupleApi.getCoupleForUser(userId, token);
        if (couple && couple.id) {
          await coupleApi.updateOriginStory(
            couple.id,
            userId,
            {
              meet_cute: couple.origin_story?.meet_cute || '',
              first_impression: couple.origin_story?.first_impression || '',
              turning_point: '',
              current_status: sliderValue.toString(),
            },
            undefined,
            token
          );
        }
      } catch (error) {
        console.error('Failed to save onboarding data:', error);
      }
    }
    navigation.navigate('OnboardingAttachmentStyle');
  };

  return (
    <ScreenLayout>
      <RadialGradientBackground />
      <View style={styles.contentContainer}>
        <View style={styles.progressContainer}>
          <Typography variant="label" style={styles.progressLabel}>Onboarding</Typography>
          <Typography variant="caption" style={styles.progressStep}>Step 3 of 10</Typography>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressBarFill, { width: '30%' }]} />
        </View>

        <GlassCard style={styles.mainPanel}>
          <Typography variant="header" style={styles.title}>What's your current vibe?</Typography>
          <Typography variant="body" style={styles.subtitle}>How are things feeling between you two right now? This helps us tailor the game's intensity.</Typography>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabels}>
              <Typography variant="body" style={styles.sliderLabel}>Icy</Typography>
              <Typography variant="body" style={styles.sliderLabel}>Flaming</Typography>
            </View>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${sliderValue * 100}%` }]} />
              <View style={[styles.sliderHandle, { left: `${sliderValue * 100}%` }]} />
            </View>
          </View>
          <Typography variant="caption" style={styles.sliderInstruction}>Drag the glow to set the mood</Typography>
        </GlassCard>

        <SquishyButton onPress={handleNext}>
          <Typography variant="button">Next Step</Typography>
        </SquishyButton>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  contentContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: SPACING.screenPadding 
  },
  progressContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.small 
  },
  progressLabel: { 
    color: COLORS.vibrantPink 
  },
  progressStep: { 
    color: COLORS.textSecondary 
  },
  progressBar: { 
    height: 6, 
    backgroundColor: COLORS.textPrimary + '1A', 
    borderRadius: BORDER_RADIUS.small, 
    marginBottom: SPACING.xlarge 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: COLORS.vibrantPink, 
    borderRadius: BORDER_RADIUS.small 
  },
  mainPanel: { 
    padding: SPACING.xxlarge, 
    marginBottom: SPACING.xlarge 
  },
  title: { 
    textAlign: 'center', 
    marginBottom: SPACING.regular 
  },
  subtitle: { 
    textAlign: 'center', 
    marginBottom: SPACING.xxlarge,
    color: COLORS.textSecondary,
  },
  sliderContainer: { 
    marginBottom: SPACING.regular, 
    alignItems: 'center' 
  },
  sliderLabels: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: SPACING.regular 
  },
  sliderLabel: { 
    color: COLORS.textPrimary 
  },
  sliderTrack: { 
    height: 12, 
    width: '100%', 
    borderRadius: BORDER_RADIUS.small, 
    backgroundColor: COLORS.textPrimary + '1A',
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.vibrantPink,
    borderRadius: BORDER_RADIUS.small,
  },
  sliderHandle: { 
    position: 'absolute', 
    top: -4, 
    width: 20, 
    height: 20, 
    borderRadius: BORDER_RADIUS.round / 2, 
    backgroundColor: COLORS.vibrantPink,
    marginLeft: -10,
    shadowColor: COLORS.vibrantPink, 
    shadowRadius: 10, 
    shadowOpacity: 0.8 
  },
  sliderInstruction: { 
    textAlign: 'center',
    color: COLORS.textHint,
  },
});

export default OnboardingVibeScreen;
