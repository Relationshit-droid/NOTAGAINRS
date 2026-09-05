import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

type SOSPostRepairQuestionnaireProps = {
  navigation: any;
  route: any;
};

interface Question {
  id: string;
  text: string;
  type: 'yes_no_maybe' | 'scale' | 'text';
}

const QUESTIONS: Question[] = [
  { id: 'helped', text: 'Did the repair attempt help?', type: 'yes_no_maybe' },
  { id: 'heard', text: 'Do you feel heard?', type: 'yes_no_maybe' },
  { id: 'specific', text: 'Was the repair specific enough?', type: 'yes_no_maybe' },
  { id: 'core_issue', text: 'Did it address the core issue?', type: 'yes_no_maybe' },
  { id: 'try_again', text: 'Would you try this repair again?', type: 'yes_no_maybe' },
];

const ANSWER_OPTIONS = [
  { value: 'yes', label: 'Yes', color: COLORS.success, icon: 'checkmark-circle' },
  { value: 'maybe', label: 'Maybe', color: COLORS.warning, icon: 'help-circle' },
  { value: 'no', label: 'No', color: COLORS.error, icon: 'close-circle' },
];

export default function SOSPostRepairQuestionnaire({ navigation, route }: SOSPostRepairQuestionnaireProps) {
  const { sessionId, coupleId, repairId } = route.params || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showMarcie, setShowMarcie] = useState(true);
  const [marcieQuote, setMarcieQuote] = useState("Answer honestly. This data shapes your future.");

  const currentQ = QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;
  const currentAnswer = answers[currentQ?.id];

  const handleAnswer = (value: string) => {
    if (!currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    
    // Auto-advance after short delay
    setTimeout(() => {
      if (isLastQuestion) {
        submitQuestionnaire();
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 300);
  };

  const submitQuestionnaire = async () => {
    try {
      // In production, submit to backend
      // await sosApi.submitQuestionnaire(sessionId, answers);
      
      Alert.alert(
        'Questionnaire Complete',
        'Thank you. Your responses have been recorded. Dr. Marcie will analyze them for the final summary.',
        [{ text: 'View Summary', onPress: () => navigation.navigate('SOSResultsSummary', { sessionId, coupleId, repairId, answers })}]
      );
    } catch (error) {
      console.error('Failed to submit questionnaire:', error);
      Alert.alert('Error', 'Failed to submit. Please try again.');
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScreenLayout 
      showHeader={false} 
      scrollable={false}
      showMarcie={showMarcie}
      marcieQuote={marcieQuote}
    >
      <SafeAreaView style={styles.container}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          {QUESTIONS.map((_, index) => (
            <View key={index} style={[
              styles.progressDot,
              index < currentQuestion && styles.progressDotComplete,
              index === currentQuestion && styles.progressDotActive,
            ]} />
          ))}
        </View>

        <Typography variant="label" style={styles.questionCounter}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </Typography>

        {/* Question Card */}
        <GlassCard style={styles.questionCard} padding="large">
          <Typography variant="h2" style={styles.questionText}>{currentQ?.text}</Typography>
        </GlassCard>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {ANSWER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleAnswer(option.value)}
              style={[
                styles.optionCard,
                currentAnswer === option.value && styles.optionCardSelected,
              ]}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                <Ionicons name={option.icon} size={28} color={option.color} />
              </View>
              <Typography 
                variant="h3" 
                style={[
                  styles.optionLabel,
                  currentAnswer === option.value && { color: option.color },
                ]}
              >
                {option.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navContainer}>
          <SquishyButton 
            onPress={goBack}
            disabled={currentQuestion === 0}
            variant="ghost"
            size="large"
            style={styles.backButton}
          >
            <Typography variant="button">BACK</Typography>
          </SquishyButton>

          <SquishyButton 
            onPress={isLastQuestion ? submitQuestionnaire : () => setCurrentQuestion(prev => prev + 1)}
            disabled={!currentAnswer}
            variant={isLastQuestion ? 'primary' : 'secondary'}
            size="large"
            style={styles.nextButton}
          >
            <Typography variant="button">
              {isLastQuestion ? 'SUBMIT' : 'NEXT'}
            </Typography>
          </SquishyButton>
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.small,
    paddingTop: SPACING.xlarge,
    paddingBottom: SPACING.regular,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.borderSubtle,
  },
  progressDotComplete: {
    backgroundColor: COLORS.success,
  },
  progressDotActive: {
    backgroundColor: COLORS.vibrantPink,
    width: 24,
    borderRadius: 5,
  },
  questionCounter: {
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: SPACING.xlarge,
  },
  questionCard: {
    width: '100%',
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xlarge,
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
  },
  questionText: {
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.regular,
    justifyContent: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    width: '100%',
  },
  optionCardSelected: {
    borderColor: COLORS.vibrantPink,
    borderWidth: 2,
    backgroundColor: `${COLORS.vibrantPink}10`,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    color: COLORS.textPrimary,
  },
  navContainer: {
    flexDirection: 'row',
    gap: SPACING.regular,
    paddingHorizontal: SPACING.screenPadding,
    paddingBottom: SPACING.xxlarge,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});