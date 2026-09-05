import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const CARDS = [
  { text: "I messed up", type: "Guilt" },
  { text: "I'm a failure", type: "Shame" },
  { text: "I hurt you", type: "Guilt" },
  { text: "I am bad", type: "Shame" },
  { text: "I made a mistake", type: "Guilt" },
  { text: "I am unlovable", type: "Shame" },
];

export default function GuiltShameSort({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");

  function handleSwipe(choice: "Guilt" | "Shame") {
    const current = CARDS[index];
    const correct = current.type === choice;

    if (correct) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Wrong. "${current.text}" is ${current.type}.`);
    }

    if (index < CARDS.length - 1) {
      setTimeout(() => {
        setIndex(index + 1);
        setFeedback("");
      }, 1000);
    } else {
      setFinished(true);
    }
  }

  return (
    <ScreenLayout 
      showHeader={false} 
      scrollable={true}
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Typography variant="body">Back</Typography>
        </SquishyButton>
        <Typography variant="h1" style={styles.title}>The Love Arcade</Typography>
      </View>

      <Typography variant="h2" style={styles.subtitle}>
        +100 Games to Deepen Connection
      </Typography>

      {!finished ? (
        <GlassCard style={styles.card}>
          <Typography variant="body" style={styles.instruction}>
            Sort the thought:
          </Typography>
          <View style={styles.cardContent}>
            <Typography variant="h2" style={styles.cardText}>{CARDS[index].text}</Typography>
          </View>

          {feedback ? (
            <Typography 
              variant="h2" 
              style={[
                styles.feedbackText,
                { color: feedback === "Correct!" ? COLORS.success : COLORS.emotionalConnection }
              ]}
            >
              {feedback}
            </Typography>
          ) : null}

          <View style={styles.actions}>
            <SquishyButton onPress={() => handleSwipe("Guilt")} style={[styles.btn, styles.guiltBtn]}>
              <Typography variant="h3">Guilt (Healthy)</Typography>
            </SquishyButton>
            <SquishyButton onPress={() => handleSwipe("Shame")} style={[styles.btn, styles.shameBtn]}>
              <Typography variant="h3">Shame (Toxic)</Typography>
            </SquishyButton>
          </View>
        </GlassCard>
      ) : (
        <GlassCard style={styles.card}>
          <Typography variant="h2" style={styles.completeTitle}>Sorting Complete</Typography>
          <Typography variant="h1" style={styles.scoreText}>{score}/{CARDS.length}</Typography>
          <Typography variant="body" style={styles.marcieQuote}>
            Marcie: "Remember: Guilt says 'I did something bad'. Shame says 'I am bad'. Know the difference."
          </Typography>
          <SquishyButton 
            onPress={() => { setIndex(0); setScore(0); setFinished(false); }} 
            style={styles.retryBtn}
          >
            <Typography variant="h3">Retry</Typography>
          </SquishyButton>
        </GlassCard>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
    gap: SPACING.large,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  backBtn: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
  },
  title: {
    color: COLORS.textPrimary,
    flex: 1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.medium,
  },
  card: {
    padding: SPACING.xlarge,
    gap: SPACING.large,
    minHeight: 400,
    justifyContent: 'center',
  },
  instruction: {
    textAlign: 'center',
  },
  cardContent: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  cardText: {
    textAlign: 'center',
  },
  feedbackText: {
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.small,
    marginTop: SPACING.large,
  },
  btn: {
    flex: 1,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
  },
  guiltBtn: {
    backgroundColor: COLORS.success,
  },
  shameBtn: {
    backgroundColor: COLORS.emotionalConnection,
  },
  completeTitle: {
    textAlign: 'center',
  },
  scoreText: {
    textAlign: 'center',
    color: COLORS.success,
  },
  marcieQuote: {
    textAlign: 'center',
    marginTop: SPACING.medium,
  },
  retryBtn: {
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    backgroundColor: COLORS.gradientStart,
    marginTop: SPACING.large,
  },
});
