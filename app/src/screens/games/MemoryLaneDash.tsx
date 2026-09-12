import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

export default function MemoryLaneDash({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [memory, setMemory] = useState('');

  function submit() {
    if (!memory) {
      speakMarcie("Blanking on your own history? Ouch.");
      return;
    }
    speakMarcie("I'll verify that with the archives. Assuming you have any.");
    HapticFeedbackSystem.success();
    Alert.alert("Memory Logged", "Points for nostalgia.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.inputWrapper}>
      <GlassCard>
        <Typography variant="h2">Recall Challenge</Typography>
        <Typography variant="body">Where did you have your first proper date?</Typography>
        <TextInput
            style={styles.input}
            placeholder="e.g. That Italian place..."
            placeholderTextColor={COLORS.textHint}
            value={memory}
            onChangeText={setMemory}
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="h2">Lock In Answer</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Memory Lane Dash',
    description: 'Race to recall details',
    category: 'romance' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    gap: SPACING.regular,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    marginTop: SPACING.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  btn: { 
    marginTop: SPACING.regular,
  },
});
