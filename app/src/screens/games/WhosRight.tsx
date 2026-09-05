import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

type Segment = { text: string; label: 'criticism' | 'contempt' | 'defensiveness' | 'stonewalling' | 'neutral' };

const TRANSCRIPT: Segment[] = [
  { text: 'You always forget to call me back.', label: 'criticism' },
  { text: 'Maybe if you were worth calling.', label: 'contempt' },
  { text: 'I only forgot once.', label: 'defensiveness' },
  { text: '(silence)', label: 'stonewalling' },
  { text: 'Let\'s set a reminder together.', label: 'neutral' },
];

export default function WhosRight({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'whos-right' };
  const [selected, setSelected] = useState<Record<number, Segment['label']>>({});

  // Get game info from registry
  const gameInfo = getGameByScreen('WhosRight');
  const GAME_ID = gameInfo?.id || 'whos-right';
  const CATEGORY_ID = gameInfo?.categoryId || 'conflict-resolution';

  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing,
    partnerProgress
  } = useGameSession(GAME_ID, CATEGORY_ID);

  function toggle(i: number, label: Segment['label']) {
    setSelected((s) => ({ ...s, [i]: s[i] === label ? undefined as any : label }));
  }

  const accuracy = useMemo(() => {
    const totalFlags = TRANSCRIPT.filter((t) => t.label !== 'neutral').length;
    const correct = TRANSCRIPT.reduce((acc, seg, i) => acc + ((selected[i] && seg.label !== 'neutral' && selected[i] === seg.label) ? 1 : 0), 0);
    return totalFlags ? Math.round((correct / totalFlags) * 100) : 0;
  }, [selected]);

  useEffect(() => {
    if (accuracy < 50 && Object.keys(selected).length) speakMarcie("That's not criticism, that's a character assassination. Tone it down.");
  }, [accuracy, selected]);

  // Update score when selections change
  useEffect(() => {
    if (Object.keys(selected).length > 0 && session) {
      const selections = Object.entries(selected).map(([index, label]) => ({
        index: parseInt(index),
        selectedLabel: label,
        isCorrect: TRANSCRIPT[parseInt(index)]?.label === label
      }));
      
      updateScore(accuracy, selections);
    }
  }, [selected, accuracy]);

  const inputArea = (
    <View>
      <GlassCard>
        <Typography variant="instructions" center>Highlight harmful patterns</Typography>
        
        {/* Sync Indicator */}
        {isSyncing && (
          <View style={{backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 8, marginVertical: SPACING.small, alignSelf: 'center'}}>
            <Typography variant="caption" style={{color: COLORS.success}}>💾 Saving...</Typography>
          </View>
        )}
        
        {TRANSCRIPT.map((seg, i) => (
          <View key={i} style={styles.row}>
            <Typography variant="body">{seg.text}</Typography>
            <View style={styles.badgeRow}>
              {(['criticism', 'contempt', 'defensiveness', 'stonewalling'] as Segment['label'][]).map((l) => (
                <Pressable key={l} onPress={() => toggle(i, l)} style={[styles.badge, selected[i] === l ? styles.badgeOn : {}]}>
                  <Typography variant="caption">{l}</Typography>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <SquishyButton style={styles.btn} onPress={() => { HapticFeedbackSystem.selection(); }}>
          <Typography variant="button">Review</Typography>
        </SquishyButton>
        <Typography variant="caption" center>Accuracy {accuracy}%</Typography>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: "Who's Right?",
    description: 'Identify contempt patterns accurately',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 70,
    currentStep: Object.keys(selected).length,
    totalTime: 60,
    playerData: { vulnerabilityScore: 50, honestyScore: 50, completionTime: 0, partnerSync: 0 },
  }), [gameId, selected]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const xp = Math.min(110, 70 + Math.round(accuracy * 0.4));
    
    // Determine achievements
    const achievements: string[] = [];
    if (accuracy >= 80) achievements.push('Pattern Master');
    if (accuracy === 100) achievements.push('Perfect Score');
    
    // Complete the game
    await completeGame(accuracy, Object.entries(selected).map(([index, label]) => ({
      index: parseInt(index),
      text: TRANSCRIPT[parseInt(index)]?.text,
      selectedLabel: label,
      correctLabel: TRANSCRIPT[parseInt(index)]?.label,
      isCorrect: TRANSCRIPT[parseInt(index)]?.label === label
    })), achievements);
    
    navigation.goBack();
  }

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

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} sessionId={session?.id} />;
}

const styles = StyleSheet.create({
  row: { 
    marginTop: SPACING.regular, 
    gap: SPACING.small 
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  badge: { 
    paddingHorizontal: SPACING.small, 
    paddingVertical: SPACING.tiny, 
    borderRadius: BORDER_RADIUS.xlarge, 
    backgroundColor: COLORS.backgroundPrimary, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle 
  },
  badgeOn: { 
    backgroundColor: COLORS.healingHospital 
  },
  btn: { 
    alignSelf: 'flex-end', 
    marginTop: SPACING.regular, 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.success, 
    borderRadius: BORDER_RADIUS.button 
  },
});
