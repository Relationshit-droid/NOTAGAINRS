import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { useAppStore } from '../../state/store';

const flags = [
  { text: 'Bad with money', icon: 'card', color: COLORS.brightYellow },
  { text: 'Late for everything', icon: 'time', color: COLORS.warmOrange },
  { text: 'Always on their phone', icon: 'phone-portrait', color: COLORS.mintGreen },
  { text: 'Workaholic', icon: 'briefcase', color: COLORS.aquaTeal },
  { text: 'Love bombing', icon: 'heart', color: COLORS.vibrantPink },
  { text: 'Hot & Cold', icon: 'thermometer', color: COLORS.lavenderPurple },
];

const RedFlagTile = ({ text, icon, color, isSelected, onPress }: any) => (
  <SquishyButton 
    onPress={onPress} 
    style={[styles.tile, isSelected && { borderColor: color, backgroundColor: color + '1A' }]}
  >
    <Ionicons name={icon} size={24} color={color} />
    <Typography variant="body" style={styles.tileText}>{text}</Typography>
    {isSelected && (
      <View style={[styles.checkIcon, { backgroundColor: color }]}>
        <Ionicons name="checkmark" size={16} color={COLORS.textPrimary} />
      </View>
    )}
  </SquishyButton>
);

const OnboardingRedFlagScreen = () => {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);

  const toggleFlag = (flagText: string) => {
    setSelectedFlags(prev => 
      prev.includes(flagText) ? prev.filter(f => f !== flagText) : [...prev, flagText]
    );
  };

  const handleSubmit = async () => {
    if (user && userId) {
      try {
        const token = await user.getIdToken();
        const couple = await coupleApi.getCoupleForUser(userId, token);
        if (couple && couple.id) {
          const firstRedFlag = selectedFlags.join(', ');
          await coupleApi.updateOriginStory(
            couple.id,
            userId,
            {
              meet_cute: couple.origin_story?.meet_cute || '',
              first_impression: couple.origin_story?.first_impression || '',
              turning_point: '',
              current_status: couple.origin_story?.current_status || '',
            },
            firstRedFlag,
            token
          );
        }
      } catch (error) {
        console.error('Failed to save red flag:', error);
      }
    }
    navigation.navigate('OnboardingAttachmentStyle');
  };

  return (
    <ScreenLayout>
      <RadialGradientBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressHeader}>
          <Typography variant="label" style={styles.progressSubtitle}>Assessment Phase</Typography>
          <Typography variant="caption" style={styles.progressStep}>Step 2 / 10</Typography>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressBarFill, { width: '20%' }]} />
        </View>

        <GlassCard style={styles.mainPanel}>
          <Typography variant="header" style={styles.title}>What was the first "red flag" you ignored?</Typography>
          <Typography variant="body" style={styles.subtitle}>Self-awareness is the first step toward healing. Select all that apply.</Typography>

          <View style={styles.tilesContainer}>
            {flags.map(flag => (
              <RedFlagTile 
                key={flag.text} 
                {...flag} 
                isSelected={selectedFlags.includes(flag.text)}
                onPress={() => toggleFlag(flag.text)}
              />
            ))}
          </View>

          <SquishyButton onPress={handleSubmit}>
            <Typography variant="button">Submit Selection</Typography>
          </SquishyButton>
          
          <SquishyButton variant="ghost" style={styles.skipButton} onPress={handleSubmit}>
            <Typography variant="caption" style={styles.skipText}>None of these apply to me</Typography>
          </SquishyButton>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: { 
    padding: SPACING.screenPadding, 
    paddingVertical: SPACING.xlarge 
  },
  progressHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.small 
  },
  progressSubtitle: { 
    color: COLORS.mintGreen 
  },
  progressStep: { 
    color: COLORS.textSecondary 
  },
  progressBar: { 
    height: 6, 
    backgroundColor: COLORS.textPrimary + '0D', 
    borderRadius: BORDER_RADIUS.small, 
    marginBottom: SPACING.xlarge 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: COLORS.vibrantPink, 
    borderRadius: BORDER_RADIUS.small 
  },
  mainPanel: { 
    padding: SPACING.xlarge 
  },
  title: { 
    textAlign: 'center', 
    marginBottom: SPACING.small 
  },
  subtitle: { 
    textAlign: 'center', 
    marginBottom: SPACING.xlarge,
    color: COLORS.textSecondary,
  },
  tilesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: SPACING.xlarge 
  },
  tile: { 
    width: '48%', 
    aspectRatio: 1.2, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.xlarge, 
    padding: SPACING.regular, 
    marginBottom: SPACING.regular, 
    justifyContent: 'space-between', 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle 
  },
  tileText: { 
    color: COLORS.textPrimary 
  },
  checkIcon: { 
    alignSelf: 'flex-end', 
    width: 24, 
    height: 24, 
    borderRadius: BORDER_RADIUS.round / 2, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: { 
    marginTop: SPACING.regular 
  },
  skipText: { 
    textAlign: 'center',
    color: COLORS.textHint,
  },
});

export default OnboardingRedFlagScreen;
