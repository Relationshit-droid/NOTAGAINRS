import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../ui';
import { useAppStore } from '../../../state/store';
import { speakMarcie } from '../../../lib/voice-engine';
import { GameState, GameContext } from './types';

type Props = {
  state: GameState;
  context: GameContext;
  speak?: boolean;
};

export default function DrMarcieCommentary({ state, context, speak }: Props) {
  const sarcasm = useAppStore((s) => s.sarcasmLevel);
  const personality = useAppStore((s) => s.marciePersonality);
  const [line, setLine] = useState('');
  const out = useMemo(() => {
    const base = state.difficulty === 'hard' ? 'Deep breath. We go precise.' : state.difficulty === 'medium' ? 'Steady. Name it, don’t dodge it.' : 'Gentle start. Stay present.';
    const tone = sarcasm >= 3 ? 'Spicy honesty incoming.' : sarcasm === 2 ? 'Tact with a wink.' : 'Warm guidance.';
    const phase = context.phase === 'setup' ? 'Set intention.' : context.phase === 'active' ? 'Stay specific.' : 'Integrate and repair.';
    return `${base} ${tone} ${phase}`;
  }, [state.difficulty, sarcasm, context.phase]);
  useEffect(() => {
    setLine(out);
  }, [out]);
  useEffect(() => {
    if (speak && line) speakMarcie(line);
  }, [speak, line]);
  return (
    <View style={styles.wrap}>
      <Text variant="sass">{line}</Text>
      <Text variant="keyword">{personality}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 6 },
});

