import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const QUESTIONS = [
  {
    id: 1,
    text: "What is one thing you've been wanting to share but haven't found the right moment?",
    category: 'DEEP DIVE',
  },
  {
    id: 2,
    text: "What is your favorite memory of us together?",
    category: 'MEMORY LANE',
  },
  {
    id: 3,
    text: "What is one thing you appreciate about your partner?",
    category: 'APPRECIATION',
  },
];

const GamePlayScreen = ({ navigation }: any) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      navigation?.navigate('GameResults');
    }
  };

  return (
    <ScreenLayout 
      showMarcie={true} 
      marcieQuote="Take your time and answer honestly."
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            The Love Arcade
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            +100 Games to Deepen Connection
          </Typography>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={GRADIENTS.progress.colors}
                start={GRADIENTS.progress.start}
                end={GRADIENTS.progress.end}
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
            <Typography variant="caption" style={styles.progressText}>
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </Typography>
          </View>

          {/* Question Card */}
          <GlassCard style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Ionicons name="help-circle" size={32} color={COLORS.vibrantPink} />
              <Typography variant="label" style={styles.categoryLabel}>
                {question.category}
              </Typography>
            </View>
            
            <Typography variant="h2" style={styles.question}>
              {question.text}
            </Typography>
          </GlassCard>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            <SquishyButton
              variant={selectedAnswer === 'ready' ? 'primary' : 'ghost'}
              size="large"
              onPress={() => setSelectedAnswer('ready')}
              style={styles.optionButton}
            >
              <Typography variant="body" style={styles.optionText}>
                I'm ready to share
              </Typography>
            </SquishyButton>
            
            <SquishyButton
              variant={selectedAnswer === 'time' ? 'primary' : 'ghost'}
              size="large"
              onPress={() => setSelectedAnswer('time')}
              style={styles.optionButton}
            >
              <Typography variant="body" style={styles.optionText}>
                I need more time
              </Typography>
            </SquishyButton>
            
            <SquishyButton
              variant={selectedAnswer === 'skip' ? 'primary' : 'ghost'}
              size="large"
              onPress={() => setSelectedAnswer('skip')}
              style={styles.optionButton}
            >
              <Typography variant="body" style={styles.optionText}>
                Skip this question
              </Typography>
            </SquishyButton>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <Typography variant="body" style={styles.timerText}>
              No time limit
            </Typography>
          </View>

          <SquishyButton
            variant="primary"
            size="large"
            onPress={handleNext}
            style={styles.nextButton}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              {currentQuestion < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Game'}
            </Typography>
          </SquishyButton>
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: `${COLORS.textPrimary}10`,
    borderRadius: 3,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  questionCard: {
    marginBottom: SPACING.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  categoryLabel: {
    color: COLORS.vibrantPink,
  },
  question: {
    lineHeight: TYPOGRAPHY.fontSize.headerMedium * 1.3,
  },
  optionsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: `${COLORS.textPrimary}20`,
  },
  optionText: {
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    opacity: 0.6,
    marginBottom: SPACING.lg,
  },
  timerText: {
    textAlign: 'center',
  },
  nextButton: {
    marginTop: SPACING.md,
  },
});

export default GamePlayScreen;
