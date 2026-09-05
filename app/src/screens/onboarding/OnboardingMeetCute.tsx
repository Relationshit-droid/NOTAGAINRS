import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Typography, GlassCard, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { useAppStore } from '../../state/store';

export default function OnboardingMeetCute({ navigation }: any) {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: 'first_meet',
      question: 'Where did you first meet your partner?',
      options: [
        { value: 'work', label: 'At Work' },
        { value: 'friends', label: 'Through Friends' },
        { value: 'travel', label: 'While Traveling' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'first_impression',
      question: 'What was your first impression of them?',
      options: [
        { value: 'kind', label: 'Kind & Caring' },
        { value: 'funny', label: 'Funny & Witty' },
        { value: 'attractive', label: 'Attractive & Charismatic' },
        { value: 'intelligent', label: 'Intelligent & Thoughtful' }
      ]
    },
    {
      id: 'memorable_date',
      question: 'What was your most memorable early date?',
      options: [
        { value: 'dinner', label: 'A Nice Dinner' },
        { value: 'outdoor', label: 'Outdoor Activity' },
        { value: 'arts', label: 'Arts & Culture' },
        { value: 'adventure', label: 'Adventure Activity' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save onboarding data to backend
      if (user && userId) {
        try {
          const token = await user.getIdToken();
          // Get couple ID first
          const couple = await coupleApi.getCoupleForUser(userId, token);
          if (couple && couple.id) {
            // Save what we have so far (meet_cute and first_impression)
            await coupleApi.updateOriginStory(
              couple.id,
              userId,
              {
                meet_cute: answers.first_meet || '',
                first_impression: answers.first_impression || '',
                turning_point: '',
                current_status: '',
              },
              undefined,
              token
            );
          }
        } catch (error) {
          console.error('Failed to save onboarding data:', error);
        }
      }
      navigation.navigate('OnboardingCurrentVibe');
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <ScreenLayout>
      <RadialGradientBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="header" style={styles.title}>Your Love Story</Typography>
          <Typography variant="body" style={styles.subtitle}>Let's start with the beginning</Typography>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.stepIndicator}>
            <Typography variant="caption" style={styles.stepText}>
              Step {currentStep + 1} of {questions.length}
            </Typography>
          </View>

          <Typography variant="header" style={styles.questionText}>
            {currentQuestion.question}
          </Typography>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <SquishyButton
                key={option.value}
                variant={answers[currentQuestion.id] === option.value ? 'primary' : 'secondary'}
                style={[
                  styles.option,
                  answers[currentQuestion.id] === option.value && styles.selectedOption
                ]}
                onPress={() => handleAnswer(currentQuestion.id, option.value)}
              >
                <Typography
                  variant="body"
                  style={{
                    color: answers[currentQuestion.id] === option.value ? COLORS.textPrimary : COLORS.textSecondary
                  }}
                >
                  {option.label}
                </Typography>
              </SquishyButton>
            ))}
          </View>

          <SquishyButton 
            onPress={nextStep}
            disabled={!answers[currentQuestion.id]}
          >
            <Typography variant="button">
              {currentStep === questions.length - 1 ? 'Finish Setup' : 'Next Question'}
            </Typography>
          </SquishyButton>
        </GlassCard>

        <GlassCard style={styles.storyCard} variant="outlined">
          <Typography variant="header" style={{ marginBottom: SPACING.regular }}>
            Your Story So Far
          </Typography>
          <Typography variant="body" style={{ color: COLORS.textSecondary }}>
            {Object.keys(answers).length > 0
              ? "You're building a beautiful narrative together. Every answer adds another layer to your unique love story."
              : "Share your story and help us understand your relationship's foundation."}
          </Typography>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxlarge,
  },
  header: {
    marginBottom: SPACING.xlarge,
    alignItems: 'center',
  },
  title: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    marginBottom: SPACING.large,
    padding: SPACING.xlarge,
  },
  stepIndicator: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.regular,
  },
  stepText: {
    color: COLORS.textSecondary,
  },
  questionText: {
    marginBottom: SPACING.large,
  },
  optionsContainer: {
    gap: SPACING.regular,
    marginBottom: SPACING.large,
  },
  option: {
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  selectedOption: {
    borderColor: COLORS.vibrantPink,
    backgroundColor: COLORS.vibrantPink + '1A',
  },
  storyCard: {
    padding: SPACING.xlarge,
  },
});
