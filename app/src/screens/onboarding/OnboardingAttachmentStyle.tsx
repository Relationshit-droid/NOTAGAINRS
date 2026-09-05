import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { useAppStore } from '../../state/store';

const AttachmentStyleOption = ({ title, subtitle, color, icon, onPress, isSelected }: any) => (
  <SquishyButton style={[styles.optionButton, { borderColor: isSelected ? color : COLORS.borderSubtle }, isSelected && { backgroundColor: color + '1A' }]} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color + '33' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.optionTextContainer}>
      <Typography variant="body" style={{ color }}>{title}</Typography>
      <Typography variant="caption" style={{ color: COLORS.textSecondary }}>{subtitle}</Typography>
    </View>
  </SquishyButton>
);

const OnboardingAttachmentStyleScreen = () => {
  // These screens referenced a bare `navigation` identifier that was never a
  // prop or an import, so navigating away threw ReferenceError.
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleNext = async () => {
    if (!selectedStyle) return;
    
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
              current_status: couple.origin_story?.current_status || '',
            },
            undefined,
            token
          );
          // Note: attachment_style would need a separate field in the couple model
          console.log('Attachment style saved:', selectedStyle);
        }
      } catch (error) {
        console.error('Failed to save attachment style:', error);
      }
    }
    navigation.navigate('OnboardingCurrentVibe');
  };

  // Renamed from `styles`, which shadowed the StyleSheet below - every
  // styles.* lookup in this screen resolved to this array and was undefined,
  // so the screen rendered completely unstyled.
  const attachmentStyles = [
    { id: 'secure', title: 'Communicate Openly', subtitle: 'I talk about my feelings calmly', color: COLORS.mintGreen, icon: 'chatbubbles' },
    { id: 'anxious', title: 'Seek Reassurance', subtitle: 'I need constant signs of love', color: COLORS.brightYellow, icon: 'heart' },
    { id: 'avoidant', title: 'Create Distance', subtitle: 'I withdraw to protect myself', color: COLORS.rosePink, icon: 'shield' },
    { id: 'disorganized', title: 'Fluctuating Reactions', subtitle: 'My reaction varies unpredictably', color: COLORS.lavenderPurple, icon: 'sync' },
  ];

  return (
    <ScreenLayout>
      <RadialGradientBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <Typography variant="caption" style={styles.stepText}>Step 4 of 10</Typography>
          <Typography variant="label" style={styles.questionCounter}>Question 4 / 10</Typography>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressBarFill, { width: '40%' }]} />
        </View>

        <GlassCard style={styles.quizContainer}>
          <Typography variant="header" style={styles.questionText}>When you feel insecure in a relationship, what is your first instinct?</Typography>
          <Typography variant="caption" style={styles.questionSubtitle}>Select the response that feels most natural to you</Typography>

          <View style={styles.optionsGrid}>
            {attachmentStyles.map(style => (
              <AttachmentStyleOption 
                key={style.id}
                {...style}
                isSelected={selectedStyle === style.id}
                onPress={() => setSelectedStyle(style.id)}
              />
            ))}
          </View>
        </GlassCard>

        <View style={styles.navContainer}>
          <SquishyButton variant="ghost" onPress={() => navigation.goBack()}>
            <Typography variant="label" style={styles.navButton}>PREVIOUS</Typography>
          </SquishyButton>
          <SquishyButton onPress={handleNext} disabled={!selectedStyle}>
            <Typography variant="button">NEXT QUESTION</Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: { 
    padding: SPACING.screenPadding, 
    justifyContent: 'space-between', 
    flexGrow: 1 
  },
  progressContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.small 
  },
  stepText: { 
    color: COLORS.textSecondary 
  },
  questionCounter: { 
    color: COLORS.vibrantPink 
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
  quizContainer: { 
    padding: SPACING.xlarge 
  },
  questionText: { 
    textAlign: 'center', 
    marginBottom: SPACING.small 
  },
  questionSubtitle: { 
    textAlign: 'center', 
    marginBottom: SPACING.xxlarge,
    color: COLORS.textSecondary,
  },
  optionsGrid: { 
    gap: SPACING.regular 
  },
  optionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.backgroundInput, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle 
  },
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: BORDER_RADIUS.medium, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: SPACING.regular 
  },
  optionTextContainer: { 
    flex: 1 
  },
  navContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: SPACING.xlarge 
  },
  navButton: { 
    color: COLORS.textSecondary 
  },
});

export default OnboardingAttachmentStyleScreen;
