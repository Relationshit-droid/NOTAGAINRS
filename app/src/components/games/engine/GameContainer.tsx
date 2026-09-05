import { ReactNode, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Text, GlassCard, SquishyButton } from '../../ui';
import DrMarcieOverlay from '../../DrMarcieOverlay';
import { GameState, GameContext, GameResult, InputType } from './types';
import InputHandler from './InputHandler';
import DrMarcieCommentary from './DrMarcieCommentary';
import { selection, warning, success } from './HapticFeedbackSystem';
import { speakMarcie } from '../../../lib/voice-engine';
import { enforceSkipPenalty } from '../../../lib/consequence-engine';
import { auth } from '../../../lib/firebaseClient';
import { gamesApi } from '../../../lib/api';

type Props = {
  state: GameState;
  inputs: InputType[];
  onComplete: (result: GameResult) => void;
  onSkip?: () => void;
  inputArea?: ReactNode;
  sessionId?: string; // Sync ID
};

export default function GameContainer({ state, inputs, onComplete, onSkip, inputArea, sessionId }: Props) {
  const [phase, setPhase] = useState<GameContext['phase']>('setup');
  const [remaining, setRemaining] = useState(state.totalTime);
  const [value, setValue] = useState<any>('');
  const float = useSharedValue(0);

  useEffect(() => { float.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true); }, []);
  useEffect(() => { const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000); return () => clearInterval(t); }, [state.totalTime]);

  // NOTE: real-time partner sync was removed from this component. It previously
  // listened directly on Firestore `game_sessions`, which is now backend-owned.
  // Realtime sync (WebSocket) is deferred and not part of the MVP.

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: (float.value - 0.5) * 8 }] }));
  const score = useMemo(() => computeScore(state), [state]);
  const xp = useMemo(() => computeXp(state, score), [state, score]);

  function start() {
    setPhase('active');
    selection();
    speakMarcie('Begin');
  }

  async function finish() {
    const result: GameResult = { score, xpEarned: xp, details: { value } };
    success();

    // Complete the session through the backend if we have a session ID.
    if (sessionId) {
      try {
        const currentUser = auth.currentUser;
        const token = currentUser ? await currentUser.getIdToken() : undefined;
        await gamesApi.completeSession(
          sessionId,
          {
            final_score: result.score,
            responses: [{ value }],
            game_state: { value, score: result.score, xpEarned: result.xpEarned },
          },
          token
        );
      } catch (error) {
        console.error('Error completing game session on backend:', error);
      }
    }

    onComplete(result);
    setPhase('results');
  }

  async function skip() {
    warning();
    await enforceSkipPenalty(1);
    onSkip && onSkip();
  }

  return (
    <View style={styles.root}>
      <GlassCard>
        <View style={styles.header}>
          <Text variant="header">{state.title}</Text>
          <Text variant="keyword">{mm}:{ss}</Text>
        </View>
        <View style={styles.scoreRow}>
          <Text variant="body">Score {score}</Text>
          <Text variant="body">XP +{xp}</Text>
        </View>
        <View style={{ minHeight: 200 }}>
          {phase !== 'results' && (inputArea ?? <InputHandler type={inputs[0]} value={value} onChange={setValue} />)}
        </View>
        <View style={styles.actions}>
          {phase === 'setup' && <SquishyButton onPress={start} style={styles.btn}><Text variant="header">Start</Text></SquishyButton>}
          {phase === 'active' && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <SquishyButton onPress={finish} style={styles.btn}><Text variant="header">Finish</Text></SquishyButton>
              <SquishyButton onPress={skip} style={styles.skip}><Text variant="header">Skip</Text></SquishyButton>
            </View>
          )}
        </View>
      </GlassCard>
      <Animated.View style={[styles.marcieWrap, style]}>
        <DrMarcieOverlay animation="idle" quote={undefined} showBubble={false} position="bottom-right" visible size="medium" />
        <DrMarcieCommentary state={state} context={{ phase, inputType: inputs[0] }} speak={phase === 'active'} />
      </Animated.View>
    </View>
  );
}

function computeScore(s: GameState) {
  const d = s.difficulty === 'hard' ? 1.2 : s.difficulty === 'medium' ? 1.0 : 0.8;
  const v = Math.min(100, Math.max(0, s.playerData.vulnerabilityScore));
  const h = Math.min(100, Math.max(0, s.playerData.honestyScore));
  const t = Math.max(0, s.totalTime - s.playerData.completionTime);
  const c = Math.min(100, Math.max(0, s.playerData.partnerSync));
  const base = 0.35 * v + 0.35 * h + 0.2 * c + 0.1 * Math.min(100, Math.round((t / Math.max(1, s.totalTime)) * 100));
  return Math.round(base * d);
}

function computeXp(s: GameState, score: number) {
  const mult = s.difficulty === 'hard' ? 1.5 : s.difficulty === 'medium' ? 1.2 : 1.0;
  const bonus = score >= 80 ? 0.5 : score >= 60 ? 0.3 : score >= 40 ? 0.1 : 0;
  return Math.round(s.xpReward * (mult + bonus));
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marcieWrap: { alignItems: 'center', gap: 8 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actions: { marginTop: 12 },
});