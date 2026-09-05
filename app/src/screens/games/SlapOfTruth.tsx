import React, { useState, useMemo } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderHandlers } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { HapticFeedbackSystem } from '../../components/games/engine';
import { COLORS, SPACING, BORDER_RADIUS, ANIMATIONS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

type Scenario = { text: string; expected: 'green' | 'red' };

const SCENARIOS: Scenario[] = [
  { text: 'Checking phone during conversation', expected: 'red' },
  { text: 'Setting boundaries respectfully', expected: 'green' },
  { text: 'Ghosting after a fight', expected: 'red' },
  { text: 'Apologizing without being asked', expected: 'green' },
  { text: 'Bringing up past mistakes repeatedly', expected: 'red' },
];

export default function SlapOfTruth({ route, navigation }: any) {
  const navigationHook = useNavigation();
  
  // Get game info from registry
  const gameInfo = getGameByScreen('SlapOfTruth');
  const GAME_ID = gameInfo?.id || 'slap-of-truth';
  const CATEGORY_ID = gameInfo?.categoryId || 'conflict-resolution';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<{ choice: 'green' | 'red'; correct: boolean }[]>([]);
  const [score, setScore] = useState(0);

  const x = useSharedValue(0);
  const rotate = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { rotate: `${rotate.value}deg` }]
  }));

  const pan = useMemo<GestureResponderHandlers>(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => { x.value = g.dx; rotate.value = g.dx * 0.05; },
      onPanResponderRelease: async (_, g) => {
        const choice = g.dx > 60 ? 'green' : g.dx < -60 ? 'red' : null;
        if (choice) {
          const scenario = SCENARIOS[index];
          const correct = (choice === scenario.expected);
          const newDecisions = [...decisions, { choice, correct }];
          setDecisions(newDecisions);
          
          const newScore = newDecisions.filter(d => d.correct).length * 20;
          setScore(newScore);
          
          // Save to backend
          await updateScore(newScore, [{
            scenario: scenario.text,
            choice,
            correct,
            index
          }]);
          
          if (choice === 'green' && correct) HapticFeedbackSystem.success();
          else if (choice === 'red' && correct) HapticFeedbackSystem.success();
          else HapticFeedbackSystem.warning();
          
          x.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
          rotate.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
          const next = Math.min(SCENARIOS.length - 1, index + 1);
          setIndex(next);
          
          // Complete game if last scenario
          if (next === SCENARIOS.length - 1) {
            await completeGame(newScore, [{
              decisions: newDecisions,
              accuracy: Math.round((newDecisions.filter(d => d.correct).length / newDecisions.length) * 100)
            }]);
            
            navigationHook.navigate('GameResults', {
              score: newScore,
              gameId: GAME_ID,
              sessionId: session?.id
            });
          }
        } else {
          x.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
          rotate.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
        }
      },
    }).panHandlers;
  }, [index, decisions, updateScore, completeGame, session, navigationHook, x, rotate]);

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading slap of truth...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true} showMarcie={true} marcieQuote="Swipe green for healthy, red for toxic.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <GlassCard>
          <Typography variant="body">Swipe right for Green flag, left for Red flag</Typography>
          <Animated.View style={[styles.card, style]} {...pan}>
            <Typography variant="h2" center>{SCENARIOS[index]?.text}</Typography>
          </Animated.View>
        </GlassCard>

        <View style={styles.scoreContainer}>
          <Typography variant="caption" color={COLORS.textSecondary}>Current Score</Typography>
          <Typography variant="h2" color={COLORS.success}>{score}</Typography>
        </View>

        <View style={styles.buttonContainer}>
          <SquishyButton
            onPress={async () => {
              const finalScore = decisions.filter(d => d.correct).length * 20;
              await completeGame(finalScore, [{
                decisions,
                accuracy: Math.round((decisions.filter(d => d.correct).length / decisions.length) * 100)
              }]);
              navigationHook.navigate('GameResults', {
                score: finalScore,
                gameId: GAME_ID,
                sessionId: session?.id
              });
            }}
            variant="primary"
          >
            <Typography variant="h2">Complete</Typography>
          </SquishyButton>
        </View>
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
  card: {
    marginTop: SPACING.regular,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    minHeight: 120,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: SPACING.large,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: SPACING.medium,
  },
});
