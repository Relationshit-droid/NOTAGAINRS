import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const CONFLICT = "I feel ignored when you game all night.";

export default function RoleSwap({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [reply, setReply] = useState('');

  function submit() {
    speakMarcie("Interesting perspective. You sound just like them. Almost.");
    HapticFeedbackSystem.success();
    Alert.alert("Scene Cut", "Swap complete.", [{ text: "Wrap", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.container}>
      <GlassCard>
        <Typography variant="h2" style={styles.titleText}>Role Swap</Typography>
        <Typography variant="body">Partner says:</Typography>
        <Typography variant="sass" style={styles.line}>"{CONFLICT}"</Typography>
        <Typography variant="body">Reply AS THEM (defend yourself as they would):</Typography>
        <TextInput
            style={styles.input}
            placeholder="Type their usual response..."
            placeholderTextColor={COLORS.textHint}
            value={reply}
            onChangeText={setReply}
            multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="h2">Send Line</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Role Swap',
    description: 'Walk a mile in their arguments',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 350,
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
  container: { 
    gap: SPACING.regular 
  },
  titleText: { 
    marginBottom: SPACING.regular 
  },
  line: { 
    textAlign: 'center', 
    marginVertical: SPACING.large, 
    color: COLORS.emotionalConnection, 
    fontStyle: 'italic' 
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: 80,
    marginVertical: SPACING.regular
  },
  btn: { 
    marginTop: SPACING.regular, 
    backgroundColor: COLORS.success, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center' 
  },
});
