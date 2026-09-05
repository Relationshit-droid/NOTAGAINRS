import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

export default function EscapismRoom({ navigation }: any) {
  const [answer, setAnswer] = useState('');
  const [solved, setSolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (active && timeLeft > 0 && !solved) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), ANIMATIONS.duration.slow);
    } else if (timeLeft === 0) {
      setActive(false);
    }
    return () => clearInterval(interval);
  }, [active, timeLeft, solved]);

  function checkAnswer() {
    // Simple check
    if (answer.toLowerCase().includes('phone') || answer.toLowerCase().includes('scroll')) {
      setSolved(true);
      setActive(false);
    }
  }

  function start() {
    setAnswer('');
    setSolved(false);
    setTimeLeft(60);
    setActive(true);
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Typography variant="h1" center>The Love Arcade</Typography>
            <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>
          </View>

          <GlassCard style={styles.card}>
            <View style={styles.riddleHeader}>
              <Typography variant="h3">Riddle</Typography>
              <Typography variant="h3" style={timeLeft < 10 ? styles.timerWarning : styles.timerNormal}>{timeLeft}s</Typography>
            </View>

            <Typography variant="body" style={styles.riddleText}>
              "I have a black mirror but no reflection. I connect you to the world but disconnect you from the person next to you. What am I?"
            </Typography>

            {!active && !solved && (
              <SquishyButton onPress={start} style={styles.startButton}>
                <Typography variant="button">Start Timer</Typography>
              </SquishyButton>
            )}

            {active && (
              <>
                  <TextInput
                      style={styles.input}
                      placeholder="Type your answer..."
                      placeholderTextColor={COLORS.textHint}
                      value={answer}
                      onChangeText={setAnswer}
                  />
                  <SquishyButton onPress={checkAnswer}>
                      <Typography variant="button">Unlock Door</Typography>
                  </SquishyButton>
              </>
            )}

            {solved && (
              <View style={styles.resultContainer}>
                  <Typography variant="h2" center style={styles.successText}>ESCAPED!</Typography>
                  <Typography variant="body" center style={styles.marcieQuote}>
                      Marcie: "Correct. Now put it down."
                  </Typography>
              </View>
            )}

            {!solved && !active && timeLeft === 0 && (
              <Typography variant="body" center style={styles.failureText}>
                  Trapped in the Binge Basement. Try again.
              </Typography>
            )}
          </GlassCard>
        </ScrollView>
      </LinearGradient>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  safeArea: {
    flex: 1,
  },
  content: { 
    padding: SPACING.screenPadding, 
    gap: SPACING.large 
  },
  header: { 
    marginBottom: SPACING.regular 
  },
  card: { 
    padding: SPACING.large, 
    gap: SPACING.regular 
  },
  riddleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerWarning: {
    color: COLORS.error,
  },
  timerNormal: {
    color: COLORS.success,
  },
  riddleText: {
    marginTop: SPACING.regular,
  },
  startButton: {
    marginTop: SPACING.large,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginVertical: SPACING.regular,
  },
  resultContainer: {
    marginTop: SPACING.large,
  },
  successText: {
    color: COLORS.success,
  },
  marcieQuote: {
    fontStyle: 'italic',
    marginTop: SPACING.regular,
  },
  failureText: {
    color: COLORS.error,
    marginTop: SPACING.large,
  },
});
