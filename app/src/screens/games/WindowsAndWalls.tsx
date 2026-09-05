import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderHandlers } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ScreenLayout, GlassCard, Typography } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, BORDER_RADIUS, SPACING, ANIMATIONS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

type Behavior = { text: string; category: 'window' | 'wall' };

const BEHAVIORS: Behavior[] = [
  { text: 'Sharing phone passcode', category: 'window' },
  { text: 'Closing door for therapy', category: 'wall' },
  { text: 'Hiding purchase history', category: 'wall' },
  { text: 'Sharing location during work trips', category: 'window' },
  { text: 'Deleted messages', category: 'wall' },
  { text: 'Open calendar access', category: 'window' },
];

export default function WindowsAndWalls({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'windows-walls' };
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<{ choice: 'window' | 'wall'; correct: boolean }[]>([]);
  const [score, setScore] = useState(0);

  // Get game info from registry
  const gameInfo = getGameByScreen('WindowsAndWalls');
  const GAME_ID = gameInfo?.id || 'windows-and-walls';
  const CATEGORY_ID = gameInfo?.categoryId || 'healing-hospital';

  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing,
    partnerProgress
  } = useGameSession(GAME_ID, CATEGORY_ID);

  const x = useSharedValue(0);
  const rotate = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { rotate: `${rotate.value}deg` }] }));
  
  const pan = useMemo<GestureResponderHandlers>(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => { x.value = g.dx; rotate.value = g.dx * 0.05; },
      onPanResponderRelease: async (_, g) => {
        const choice = g.dx > 60 ? 'wall' : g.dx < -60 ? 'window' : null;
        if (choice) {
          const item = BEHAVIORS[index];

          // "Correct" if it matches the predefined category
          const isCorrect = (choice === item.category);

          const newDecisions = [...decisions, { choice, correct: isCorrect }];
          setDecisions(newDecisions);
          
          // Calculate and update score
          const correctCount = newDecisions.filter(d => d.correct).length;
          const newScore = Math.min(100, correctCount * 15);
          setScore(newScore);
          
          // Update in backend
          await updateScore(newScore, newDecisions.map((d, i) => ({
            behavior: BEHAVIORS[i]?.text,
            choice: d.choice,
            correct: d.correct
          })));
          
          HapticFeedbackSystem.selection();

          if (item.text.includes('phone') && choice === 'window') {
            speakMarcie("Checking your partner's phone isn't a window, honey. It's a magnifying glass.");
            speakMarcie("You think checking your partner's phone is a 'window'? Honey, that's a wrecking ball.");
          }

          x.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
          rotate.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
          const next = Math.min(BEHAVIORS.length - 1, index + 1);
          setIndex(next);
          
          // Complete game if all behaviors are sorted
          if (next === BEHAVIORS.length - 1 && newDecisions.length === BEHAVIORS.length - 1) {
            // Will complete on next render
          }
        } else {
          x.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
          rotate.value = withTiming(0, { duration: ANIMATIONS.duration.normal });
        }
      },
    }).panHandlers;
  }, [index, decisions, session]);

  const alignment = useMemo(() => {
    const correctCount = decisions.filter(d => d.correct).length;
    return decisions.length ? Math.round((correctCount / decisions.length) * 100) : 0;
  }, [decisions]);

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Windows & Walls',
    description: 'Sort behaviors into Transparency (Window) or Privacy (Wall)',
    category: 'healing' as const,
    difficulty: 'medium' as const,
    xpReward: 70,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 60, honestyScore: 60, completionTime: index * 5, partnerSync: alignment },
  }), [gameId, index, alignment]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const boundaryBonus = Math.min(30, decisions.filter(d => d.correct).length * 5);
    const xp = Math.min(100, 70 + boundaryBonus);
    
    // Determine achievements
    const achievements: string[] = [];
    if (alignment >= 80) achievements.push('Boundary Expert');
    if (decisions.length === BEHAVIORS.length) achievements.push('Complete Sort');
    
    // Complete the game
    await completeGame(score, decisions.map((d, i) => ({
      behavior: BEHAVIORS[i]?.text,
      choice: d.choice,
      correct: d.correct
    })), achievements);
    
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        <Typography variant="body">Swipe LEFT for Window (Transparency), RIGHT for Wall (Privacy)</Typography>
        
        {/* Sync Indicator */}
        {isSyncing && (
          <View style={{backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 8, marginVertical: SPACING.small, alignSelf: 'center'}}>
            <Typography variant="caption" style={{color: COLORS.success}}>💾 Saving...</Typography>
          </View>
        )}
        
        {/* Progress Indicator */}
        <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: SPACING.small}}>
          <Typography variant="caption">{index + 1} / {BEHAVIORS.length}</Typography>
        </View>
        
        <Animated.View style={[styles.card, style]} {...pan}>
          <Typography variant="h2">{BEHAVIORS[index]?.text}</Typography>
        </Animated.View>
        <View style={styles.legend}>
          <Typography variant="caption" color={COLORS.success}>← Window</Typography>
          <Typography variant="caption" color={COLORS.error}>Wall →</Typography>
        </View>
        
        {/* Score display */}
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.regular}}>
          <Typography variant="caption">Score: {score} XP | Alignment: {alignment}%</Typography>
        </View>
      </GlassCard>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="body">Loading game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={["slider"]} inputArea={inputArea} onComplete={onComplete} sessionId={session?.id} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { 
    marginTop: SPACING.regular, 
    padding: SPACING.xlarge, 
    borderRadius: BORDER_RADIUS.large, 
    backgroundColor: COLORS.backgroundSecondary, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    alignItems: 'center', 
    minHeight: 150, 
    justifyContent: 'center' 
  },
  legend: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: SPACING.regular 
  }
});
