import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, ANIMATIONS } from '../../theme';

const TONES = ["Sarcastic", "Anxious", "Warm", "Playful"];
const SENTENCE = "We need to talk about the budget.";

export default function ToneShiftChallenge({ route, navigation }: any) {
  const { gameId } = route.params;
  const [currentTone, setCurrentTone] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  function toggleRec() {
    setIsRecording(!isRecording);
    if (!isRecording) {
      speakMarcie(`Record: "${SENTENCE}" in a ${TONES[currentTone]} tone.`);
    } else {
      // Simulating analysis
      HapticFeedbackSystem.success();
      speakMarcie("Analysis: 85% match. Moving on.");
      if (currentTone < TONES.length - 1) {
        setCurrentTone(c => c + 1);
      } else {
        finish();
      }
    }
  }

  function finish() {
    Alert.alert("Vocal Range Certified", "You mastered the tones.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.container}>
      <GlassCard>
        <Typography variant="h2">Tone: {TONES[currentTone]}</Typography>
        <Typography variant="body" style={styles.sentence}>{SENTENCE}</Typography>
        <View style={styles.mic}>
            <Typography variant="h1">🎙️</Typography>
            {isRecording && <View style={styles.wave} />}
        </View>
        <SquishyButton onPress={toggleRec} variant={isRecording ? 'secondary' : 'primary'} size="large">
          <Typography variant="button">{isRecording ? "Stop & Analyze" : "Record"}</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Tone Shift',
    description: 'Master your vocal tone',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 300,
    currentStep: currentTone,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, currentTone]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  sentence: { 
    textAlign: 'center', 
    marginVertical: SPACING.xlarge, 
    fontStyle: 'italic' 
  },
  mic: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 100 
  },
  wave: { 
    position: 'absolute', 
    width: 80, 
    height: 80, 
    borderRadius: BORDER_RADIUS.xxlarge, 
    borderWidth: 4, 
    borderColor: COLORS.emotionalConnection, 
    opacity: 0.5 
  },
});
