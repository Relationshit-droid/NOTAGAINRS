import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, SquishyButton, GlassCard } from '../../ui';
import ConfettiBurst from '../../effects/ConfettiBurst';
import { GameResult } from './types';
import { success } from './HapticFeedbackSystem';

type Props = {
  result: GameResult;
  onDone: () => void;
};

export default function ResultsScreen({ result, onDone }: Props) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    success();
    const t = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(t);
  }, [result]);
  return (
    <View style={styles.root}>
      <GlassCard>
        <Text variant="header">Score {result.score}</Text>
        <Text variant="keyword">XP +{result.xpEarned}</Text>
      </GlassCard>
      <SquishyButton style={styles.btn} onPress={onDone}><Text variant="header">Continue</Text></SquishyButton>
      {show && <ConfettiBurst onEnd={() => setShow(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, gap: 12 },
  btn: { alignSelf: 'flex-end' },
});

