import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../state/store';
import { useGameSession } from '../hooks/useGameSession';
import { getGameByScreen } from '../lib/gameRegistry';

interface GamePlayRouteParams {
  gameId: string;
  gameName: string;
  game: any;
}

export default function LoveArcadeGamePlayScreen() {
  const navigation = useNavigation();
  const route = useRoute<GamePlayRouteParams>();
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const { gameId, gameName, game } = route.params || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [lifelinesUsed, setLifelinesUsed] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes per question

  // Backend session
  const gameInfo = getGameByScreen(gameName?.replace(/\s+/g, '') || '');
  const GAME_ID = gameInfo?.id || gameId;
  const CATEGORY_ID = gameInfo?.categoryId || 'love-arcade';
  
  const { updateScore, completeGame, isSyncing } = useGameSession(GAME_ID, CATEGORY_ID);

  // Mock questions for demo
  const questions = game?.questions || [
    { id: '1', question: 'What\'s your ideal first date?', type: 'multiple_choice', options: ['Picnic', 'Dinner', 'Adventure', 'Movie'], correctAnswer: 'Adventure' },
    { id: '2', question: 'Describe your partner in 3 words', type: 'text', correctAnswer: '' },
    { id: '3', question: 'What\'s your love language?', type: 'multiple_choice', options: ['Words', 'Acts', 'Gifts', 'Time', 'Touch'], correctAnswer: 'Time' },
    { id: '4', question: 'Rate your communication 1-10', type: 'slider', min: 1, max: 10, correctAnswer: 7 },
    { id: '5', question: 'Share a secret desire', type: 'text', correctAnswer: '' },
  ];

  useEffect(() => {
    // Timer for each question
    const timer = setInterval(() => {
      if (timeRemaining > 0 && !showFeedback) {
        setTimeRemaining(t => t - 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFeedback, timeRemaining]);

  const handleSubmit = async () => {
    const q = questions[currentQuestion];
    if (!q) return;

    const isCorrect = q.type === 'multiple_choice' ? currentResponse === q.correctAnswer : true;
    const points = isCorrect ? 100 : 0;
    const newScore = score + points;

    setAnswers(prev => ({ ...prev, [q.id]: { answer: currentResponse, correct: isCorrect, points } }));
    setScore(newScore);
    await updateScore(newScore, Object.values(answers));

    setFeedback({ correct: isCorrect, points, correctAnswer: q.correctAnswer });
    setShowFeedback(true);
    setTimeRemaining(0);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentResponse('');
      setShowFeedback(false);
      setFeedback(null);
      setTimeRemaining(300);
    } else {
      finishGame();
    }
  };

  const useLifeline = (lifeline: string) => {
    if (lifelinesUsed.includes(lifeline)) {
      Alert.alert('Already Used', 'You\'ve already used this lifeline!');
      return;
    }
    setLifelinesUsed(prev => [...prev, lifeline]);
    Alert.alert('Lifeline Used', `${lifeline} activated!`);
  };

  const finishGame = async () => {
    setGameCompleted(true);
    await completeGame(score, Object.values(answers), []);
    Alert.alert(
      'Game Complete! 🎉',
      `Final Score: ${score}\nLifelines Used: ${lifelinesUsed.length}`,
      [
        { text: 'View Results', onPress: () => navigation.navigate('LoveArcadeGameResults', { gameId, score, sessionId: 'mock' }) },
        { text: 'Back to Arcade', onPress: () => navigation.navigate('LoveArcadeHub') }
      ]
    );
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress Bar */}
        <GlassCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Typography variant="label" style={styles.progressLabel}>QUESTION {currentQuestion + 1} / {questions.length}</Typography>
            <Typography variant="header" style={styles.progressScore}>{score} pts</Typography>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressBarFill,
                { width: `${progress}%`, backgroundColor: COLORS.vibrantPink }
              ]} />
            </View>
          </View>
          <View style={styles.timerContainer}>
            <Ionicons name={timeRemaining < 60 ? 'alert-circle' : 'time'} size={16} color={timeRemaining < 60 ? COLORS.error : COLORS.textHint} />
            <Typography variant="caption" style={{ color: timeRemaining < 60 ? COLORS.error : COLORS.textHint, marginLeft: 4 }}>
              {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
            </Typography>
          </View>
        </GlassCard>

        {/* Lifelines */}
        <GlassCard style={styles.lifelinesCard}>
          <Typography variant="label" style={styles.lifelinesLabel}>LIFELINES</Typography>
          <View style={styles.lifelinesGrid}>
            {game?.lifelines?.map((lifeline: string) => (
              <TouchableOpacity
                key={lifeline}
                style={[
                  styles.lifelineButton,
                  lifelinesUsed.includes(lifeline) && styles.lifelineUsed,
                ]}
                onPress={() => useLifeline(lifeline)}
                disabled={lifelinesUsed.includes(lifeline)}
              >
                <Ionicons name="heart" size={20} color={lifelinesUsed.includes(lifeline) ? COLORS.textHint : COLORS.rosePink} />
                <Typography variant="caption" style={{ color: lifelinesUsed.includes(lifeline) ? COLORS.textHint : COLORS.textPrimary }}>
                  {lifeline}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Question */}
        <GlassCard style={styles.questionCard}>
          <Typography variant="header" style={styles.questionText} numberOfLines={3}>
            {currentQ?.question || 'Loading question...'}
          </Typography>

          {currentQ?.type === 'multiple_choice' && (
            <View style={styles.optionsContainer}>
              {currentQ.options?.map((opt: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    currentResponse === opt && styles.optionSelected,
                  ]}
                  onPress={() => setCurrentResponse(opt)}
                  disabled={showFeedback}
                >
                  <Typography variant="body" style={{
                    color: currentResponse === opt ? COLORS.textPrimary : COLORS.textSecondary,
                    fontWeight: currentResponse === opt ? '700' : '400',
                  }}>
                    {opt}
                  </Typography>
                  {showFeedback && currentResponse === opt && (
                    <Ionicons name={opt === currentQ.correctAnswer ? 'checkmark-circle' : 'close-circle'} 
                      size={20} 
                      color={opt === currentQ.correctAnswer ? COLORS.mintGreen : COLORS.error} 
                      style={styles.optionFeedbackIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentQ?.type === 'text' && (
            <TextInput
              style={styles.textInput}
              placeholder="Type your answer..."
              value={currentResponse}
              onChangeText={setCurrentResponse}
              multiline
              numberOfLines={4}
              placeholderTextColor={COLORS.textHint}
              disabled={showFeedback}
            />
          )}

          {currentQ?.type === 'slider' && (
            <View style={styles.sliderContainer}>
              <View style={styles.sliderLabels}>
                <Typography variant="caption">{currentQ.min || 1}</Typography>
                <Typography variant="caption">{currentQ.max || 10}</Typography>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={currentQ.min || 1}
                maximumValue={currentQ.max || 10}
                step={1}
                value={parseFloat(currentResponse) || (currentQ.min || 1)}
                onValueChange={value => setCurrentResponse(value.toString())}
                minimumTrackTintColor={COLORS.vibrantPink}
                maximumTrackTintColor={COLORS.borderSubtle}
                disabled={showFeedback}
              />
              <Typography variant="header" style={styles.sliderValue} color={COLORS.vibrantPink}>
                {currentResponse || (currentQ.min || 1)}
              </Typography>
            </View>
          )}
        </GlassCard>

        {/* Feedback */}
        {showFeedback && feedback && (
          <GlassCard style={[styles.feedbackCard, feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
            <View style={styles.feedbackHeader}>
              <Ionicons name={feedback.correct ? 'checkmark-circle' : 'close-circle'} 
                size={32} 
                color={feedback.correct ? COLORS.mintGreen : COLORS.error} 
              />
              <Typography variant="header" style={{ color: feedback.correct ? COLORS.mintGreen : COLORS.error }}>
                {feedback.correct ? 'CORRECT!' : 'NOT QUITE'}
              </Typography>
            </View>
            {feedback.correct && (
              <Typography variant="body" style={styles.feedbackPoints}>
                +{feedback.points} POINTS
              </Typography>
            )}
            {!feedback.correct && feedback.correctAnswer && (
              <Typography variant="body" style={styles.feedbackAnswer}>
                Correct answer: {feedback.correctAnswer}
              </Typography>
            )}
            <Typography variant="caption" style={styles.feedbackMarcie}>
              "{feedback.correct ? 'Well done, darling!' : 'Not quite what I was looking for, but I appreciate the effort.'}"
            </Typography>
          </GlassCard>
        )}

        {/* Submit/Next Button */}
        {!showFeedback && (
          <SquishyButton 
            onPress={handleSubmit}
            disabled={!currentResponse.trim()}
            style={styles.submitButton}
          >
            <Typography variant="button">{currentQuestion === questions.length - 1 ? 'FINISH GAME' : 'SUBMIT'}</Typography>
          </SquishyButton>
        )}

        {showFeedback && (
          <SquishyButton 
            onPress={handleNext}
            style={styles.nextButton}
          >
            <Typography variant="button">{currentQuestion === questions.length - 1 ? 'SEE RESULTS' : 'NEXT QUESTION'}</Typography>
          </SquishyButton>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  progressCard: {
    marginBottom: SPACING.regular,
    padding: SPACING.large,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressScore: {
    color: COLORS.brightYellow,
  },
  progressBarContainer: {
    marginBottom: SPACING.regular,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  lifelinesCard: {
    marginBottom: SPACING.regular,
    padding: SPACING.large,
  },
  lifelinesLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.regular,
    color: COLORS.rosePink,
  },
  lifelinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.regular,
  },
  lifelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    borderColor: COLORS.rosePink + '40',
  },
  lifelineUsed: {
    opacity: 0.5,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundSecondary,
  },
  questionCard: {
    marginBottom: SPACING.regular,
    padding: SPACING.xlarge,
  },
  questionText: {
    marginBottom: SPACING.xlarge,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: SPACING.regular,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  optionSelected: {
    borderColor: COLORS.vibrantPink,
    borderWidth: 2,
    backgroundColor: COLORS.vibrantPink + '10',
  },
  optionFeedbackIcon: {
    marginLeft: SPACING.regular,
  },
  textInput: {
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.regular,
    color: COLORS.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sliderContainer: {
    marginTop: SPACING.regular,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.regular,
  },
  slider: {
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: SPACING.regular,
  },
  feedbackCard: {
    marginBottom: SPACING.regular,
    padding: SPACING.xlarge,
    alignItems: 'center',
  },
  feedbackCorrect: {
    borderWidth: 2,
    borderColor: COLORS.mintGreen,
    backgroundColor: COLORS.mintGreen + '10',
  },
  feedbackIncorrect: {
    borderWidth: 2,
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '10',
  },
  feedbackHeader: {
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  feedbackPoints: {
    color: COLORS.brightYellow,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.regular,
  },
  feedbackAnswer: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.regular,
  },
  feedbackMarcie: {
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  submitButton: {
    marginBottom: SPACING.regular,
  },
  nextButton: {
    marginBottom: SPACING.regular,
    backgroundColor: COLORS.vibrantPink,
  },
});

import { Slider } from '@react-native-community/slider';