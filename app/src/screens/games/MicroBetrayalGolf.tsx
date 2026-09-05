import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

export default function MicroBetrayalGolf({ navigation }: any) {
  const [angle, setAngle] = useState(0);
  const [power, setPower] = useState(50);
  const [strokes, setStrokes] = useState(0);
  const [hole, setHole] = useState(false);
  const [feedback, setFeedback] = useState("Aim for Repair.");
  const [score, setScore] = useState(0);

  // Get game info from registry
  const gameInfo = getGameByScreen('MicroBetrayalGolf');
  const GAME_ID = gameInfo?.id || 'micro-betrayal-golf';
  const CATEGORY_ID = gameInfo?.categoryId || 'healing-hospital';

  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);

  async function putt() {
    const newStrokes = strokes + 1;
    setStrokes(newStrokes);

    if (Math.abs(angle) < 10 && power > 40 && power < 80) {
      setHole(true);
      setFeedback("HOLE IN ONE (or close enough)!");

      // Calculate final score based on strokes
      const finalScore = Math.max(10, 100 - (newStrokes * 10));
      setScore(finalScore);

      // Update score and complete game
      await updateScore(finalScore, [{ strokes: newStrokes, angle, power, success: true }]);
      await completeGame(finalScore, [{ strokes: newStrokes, angle, power, success: true, completed: true }]);
    } else {
      if (power < 40) setFeedback("Too weak. Like your apology.");
      else if (power > 80) setFeedback("Too strong! You're escalating.");
      else setFeedback("Off course. You missed the repair ramp.");

      // Update progress during gameplay
      const currentScore = Math.max(0, 50 - (newStrokes * 5));
      await updateScore(currentScore, [{ strokes: newStrokes, angle, power, success: false }]);
    }
  }

  async function reset() {
    setStrokes(0);
    setHole(false);
    setAngle(0);
    setPower(50);
    setFeedback("Aim for Repair.");
    setScore(0);
  }

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading mini golf...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Initializing session...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showMarcie={true} marcieQuote={hole ? "Sunk it? Impressive." : "Aim for Repair."} showHeader={false} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton 
            variant="ghost" 
            size="small"
            onPress={() => navigation.goBack()}
          >
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h2">Micro-Betrayal Golf</Typography>
        </View>

        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}

        <Typography variant="h1" style={styles.mainTitle}>
          The Love Arcade
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          +100 Games to Deepen Connection
        </Typography>

        <GlassCard style={styles.course}>
          <View style={[styles.hole, hole && styles.holeSuccess]}>
            <Typography variant="caption">REPAIR</Typography>
          </View>

          <View style={styles.ballContainer}>
            <Typography variant="h1">{hole ? '⛳️' : '⚪️'}</Typography>
          </View>

          <View style={styles.controls}>
            <Typography variant="body">Angle: {Math.round(angle)}°</Typography>
            <Slider
              style={styles.slider}
              minimumValue={-45}
              maximumValue={45}
              value={angle}
              onValueChange={setAngle}
              minimumTrackTintColor={COLORS.success}
            />

            <Typography variant="body">Power: {Math.round(power)}%</Typography>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={power}
              onValueChange={setPower}
              minimumTrackTintColor={COLORS.vibrantPink}
            />
          </View>

          {!hole ? (
            <SquishyButton variant="primary" size="large" onPress={putt}>
              <Typography variant="button" color={COLORS.textPrimary}>PUTT</Typography>
            </SquishyButton>
          ) : (
            <SquishyButton variant="secondary" size="large" onPress={reset}>
              <Typography variant="button" color={COLORS.textPrimary}>Next Hole</Typography>
            </SquishyButton>
          )}

          <Typography 
            variant="body" 
            style={[styles.feedback, hole && styles.feedbackSuccess]}
          >
            {feedback}
          </Typography>

          {hole && (
            <Typography variant="sass" style={styles.marcieComment}>
              Marcie: "Sunk it in {strokes} strokes? Impressive."
            </Typography>
          )}
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: { 
    padding: SPACING.lg, 
    gap: SPACING.lg 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.sm 
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.lg,
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
    alignSelf: 'flex-end',
  },
  course: { 
    padding: SPACING.lg, 
    minHeight: 400 
  },
  hole: { 
    width: 50, 
    height: 50, 
    borderRadius: BORDER_RADIUS.round, 
    borderWidth: 2, 
    borderColor: COLORS.textPrimary, 
    alignItems: 'center', 
    justifyContent: 'center', 
    alignSelf: 'center' 
  },
  controls: { 
    gap: SPACING.sm, 
    marginVertical: SPACING.lg 
  },
  holeSuccess: {
    backgroundColor: COLORS.success,
  },
  ballContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  feedback: {
    marginTop: SPACING.lg,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  feedbackSuccess: {
    color: COLORS.success,
  },
  marcieComment: {
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
