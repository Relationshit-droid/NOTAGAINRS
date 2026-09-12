import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

export default function MirrorMode({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [keyword, setKeyword] = useState('');
  const [recording, setRecording] = useState(false);

  function toggleRecord() {
    setRecording(!recording);
    if (!recording) {
      speakMarcie("Recording... describe your partner in 3 words.");
    } else {
      speakMarcie("Analysis complete. You smiled twice. Good job.");
    }
  }

  function submit() {
    if (!keyword) {
      speakMarcie("Guess a word first.");
      return;
    }
    HapticFeedbackSystem.success();
    Alert.alert("Match!", "You guessed 'Resilient'. Correct.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.inputAreaContainer}>
      <GlassCard>
        <Typography variant="h2">Mirror Mode</Typography>
        <Typography variant="body">Record a 15s video describing your partner.</Typography>
        <View style={styles.cam}>
          <Typography variant="body" style={styles.cameraPlaceholder}>[Camera Feed Mock]</Typography>
          {recording && <View style={styles.recDot} />}
        </View>
        <SquishyButton onPress={toggleRecord} style={styles.btn} variant={recording ? 'secondary' : 'primary'}>
          <Typography variant="h2">{recording ? "Stop" : "Record"}</Typography>
        </SquishyButton>

        <Typography variant="body" style={styles.guessLabel}>Guess a word they used:</Typography>
        <TextInput
          style={styles.input}
          placeholder="e.g. Kind"
          placeholderTextColor={COLORS.textHint}
          value={keyword}
          onChangeText={setKeyword}
        />
        <SquishyButton onPress={submit} style={styles.submit}>
          <Typography variant="h2">Submit Guess</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Mirror Mode',
    description: 'Video analysis and keyword matching',
    category: 'emotional' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputAreaContainer: {
    gap: SPACING.regular,
  },
  cam: { 
    height: 150, 
    backgroundColor: COLORS.backgroundPrimary, 
    borderRadius: BORDER_RADIUS.medium, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: SPACING.regular,
  },
  cameraPlaceholder: {
    color: COLORS.textHint,
  },
  recDot: { 
    width: 10, 
    height: 10, 
    borderRadius: BORDER_RADIUS.round, 
    backgroundColor: COLORS.error, 
    position: 'absolute', 
    top: SPACING.regular, 
    right: SPACING.regular,
  },
  btn: { 
    marginTop: SPACING.regular,
  },
  guessLabel: {
    marginTop: SPACING.regular,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    marginTop: SPACING.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  submit: { 
    marginTop: SPACING.regular,
  },
});
