import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, GRADIENTS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const ICEBERG_QUESTIONS = [
  {
    id: '1',
    visible: "We always laugh together",
    hidden: "But I sometimes feel lonely even when we're together",
    category: "Connection"
  },
  {
    id: '2',
    visible: "We have similar goals for our future",
    hidden: "But we disagree on how to achieve them",
    category: "Goals"
  },
  {
    id: '3',
    visible: "We're physically intimate regularly",
    hidden: "But I crave more emotional intimacy",
    category: "Intimacy"
  },
  {
    id: '4',
    visible: "We rarely argue",
    hidden: "Because I avoid conflict by shutting down",
    category: "Communication"
  },
  {
    id: '5',
    visible: "We have many friends in common",
    hidden: "But I sometimes feel like we're living separate social lives",
    category: "Social"
  }
];

export default function TheIceberg({ route, navigation }: any) {
  const navigationHook = useNavigation();
  
  // Get game info from registry
  const gameInfo = getGameByScreen('TheIceberg');
  const GAME_ID = gameInfo?.id || 'the-iceberg';
  const CATEGORY_ID = gameInfo?.categoryId || 'healing-hospital';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, {above: number, below: number}>>({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const [aboveSliderValue, setAboveSliderValue] = useState(50);
  const [belowSliderValue, setBelowSliderValue] = useState(50);
  const [score, setScore] = useState(0);

  const handleAboveSliderChange = (value: number) => {
    setAboveSliderValue(Math.round(value));
  };

  const handleBelowSliderChange = (value: number) => {
    setBelowSliderValue(Math.round(value));
  };

  const submitResponse = async () => {
    const currentQ = ICEBERG_QUESTIONS[currentQuestionIndex];
    if (currentQ) {
      const newResponses = {
        ...responses,
        [currentQ.id]: {
          above: aboveSliderValue,
          below: belowSliderValue
        }
      };
      setResponses(newResponses);
      
      const newScore = Object.keys(newResponses).length * 20;
      setScore(newScore);
      
      // Save to backend
      await updateScore(newScore, [{
        questionId: currentQ.id,
        category: currentQ.category,
        above: aboveSliderValue,
        below: belowSliderValue
      }]);

      if (currentQuestionIndex < ICEBERG_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAboveSliderValue(50);
        setBelowSliderValue(50);
      } else {
        setGameCompleted(true);
        await completeGame(newScore, [{
          responses: newResponses,
          completed: true,
          totalQuestions: ICEBERG_QUESTIONS.length
        }]);
        
        navigationHook.navigate('GameResults', {
          score: newScore,
          gameId: GAME_ID,
          sessionId: session?.id
        });
      }
    }
  };

  const currentQuestion = ICEBERG_QUESTIONS[currentQuestionIndex];

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading iceberg...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true} showMarcie={true} marcieQuote="What's visible above the surface? What's hidden below?">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        {!gameCompleted ? (
          <GlassCard>
            <LinearGradient
              colors={GRADIENTS.background.colors}
              start={GRADIENTS.background.start}
              end={GRADIENTS.background.end}
              style={styles.gradientContainer}
            >
              <View style={styles.headerContainer}>
                <Typography variant="h2">The Iceberg</Typography>
                <Typography variant="caption">
                  {currentQuestionIndex + 1}/{ICEBERG_QUESTIONS.length}
                </Typography>
              </View>

              <Typography variant="h3" color={COLORS.emotionalConnection}>
                {currentQuestion.category}
              </Typography>

              <View style={styles.icebergContainer}>
                <View style={styles.aboveWater}>
                  <Typography variant="body" center>Above Water (Visible)</Typography>
                  <Typography variant="body" center color={COLORS.textSecondary}>
                    {currentQuestion.visible}
                  </Typography>
                </View>

                <View style={styles.waterLine}>
                  <Typography variant="caption" color={COLORS.aquaTeal} center>Surface Level</Typography>
                </View>

                <View style={styles.belowWater}>
                  <Typography variant="body" center>Below Water (Hidden)</Typography>
                  <Typography variant="body" center color={COLORS.textSecondary}>
                    {currentQuestion.hidden}
                  </Typography>
                </View>
              </View>

              <View style={styles.sliderContainer}>
                <View style={styles.sliderRow}>
                  <Typography variant="caption" style={styles.sliderLabel}>
                    Visible: {aboveSliderValue}%
                  </Typography>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${aboveSliderValue}%`, backgroundColor: COLORS.gradientStart }]} />
                  </View>
                  <View style={styles.buttonRow}>
                    <SquishyButton onPress={() => handleAboveSliderChange(Math.max(0, aboveSliderValue - 10))} variant="ghost" size="small">
                      <Typography variant="h2">-</Typography>
                    </SquishyButton>
                    <SquishyButton onPress={() => handleAboveSliderChange(Math.min(100, aboveSliderValue + 10))} variant="ghost" size="small">
                      <Typography variant="h2">+</Typography>
                    </SquishyButton>
                  </View>
                </View>

                <View style={styles.sliderRow}>
                  <Typography variant="caption" style={styles.sliderLabel}>
                    Hidden: {belowSliderValue}%
                  </Typography>
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${belowSliderValue}%`, backgroundColor: COLORS.lavenderPurple }]} />
                  </View>
                  <View style={styles.buttonRow}>
                    <SquishyButton onPress={() => handleBelowSliderChange(Math.max(0, belowSliderValue - 10))} variant="ghost" size="small">
                      <Typography variant="h2">-</Typography>
                    </SquishyButton>
                    <SquishyButton onPress={() => handleBelowSliderChange(Math.min(100, belowSliderValue + 10))} variant="ghost" size="small">
                      <Typography variant="h2">+</Typography>
                    </SquishyButton>
                  </View>
                </View>
              </View>

              <SquishyButton onPress={submitResponse}>
                <Typography variant="h2">
                  {currentQuestionIndex === ICEBERG_QUESTIONS.length - 1 ? 'Finish Game' : 'Next Question'}
                </Typography>
              </SquishyButton>
            </LinearGradient>
          </GlassCard>
        ) : (
          <GlassCard>
            <LinearGradient
              colors={GRADIENTS.background.colors}
              start={GRADIENTS.background.start}
              end={GRADIENTS.background.end}
              style={styles.gradientContainer}
            >
              <Typography variant="h2" center color={COLORS.success}>
                Iceberg Fully Revealed!
              </Typography>
              <Typography variant="body" center>
                You and your partner have explored the depths of your relationship dynamics.
              </Typography>
              <Typography variant="h3" center style={styles.finalScore}>
                Final Score: {score}
              </Typography>
              <SquishyButton
                onPress={() => navigationHook.navigate('GameResults', {
                  score,
                  gameId: GAME_ID,
                  sessionId: session?.id
                })}
                style={styles.returnButton}
              >
                <Typography variant="h2">View Results</Typography>
              </SquishyButton>
            </LinearGradient>
          </GlassCard>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncIndicator: {
    position: 'absolute',
    top: SPACING.small,
    right: SPACING.small,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 1000,
  },
  gradientContainer: {
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.regular,
  },
  icebergContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.large,
    marginVertical: SPACING.regular,
    overflow: 'hidden',
  },
  aboveWater: {
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  waterLine: {
    padding: SPACING.small,
    backgroundColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  belowWater: {
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
  },
  sliderContainer: {
    marginVertical: SPACING.regular,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  sliderLabel: {
    width: 100,
  },
  sliderTrack: {
    flex: 1,
    height: SPACING.small,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    marginHorizontal: SPACING.small,
  },
  sliderFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  returnButton: {
    marginTop: SPACING.regular,
  },
  finalScore: {
    marginTop: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
});
