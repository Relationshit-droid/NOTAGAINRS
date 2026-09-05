import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

export default function NeedsDecoder({ navigation }: any) {
  const [emojis, setEmojis] = useState('');
  const [guess, setGuess] = useState('');
  const [step, setStep] = useState(1);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="ghost" size="small">
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h1">The Needs Decoder</Typography>
        </View>

        {step === 1 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2">Partner A: Send 3 Emojis</Typography>
            <Typography variant="body">Describe your unmet need using only 3 emojis.</Typography>
            <TextInput
              style={styles.input}
              placeholder="e.g., 🌧️☕️🐶"
              placeholderTextColor={COLORS.textHint}
              value={emojis}
              onChangeText={setEmojis}
              maxLength={10}
            />
            <SquishyButton onPress={() => setStep(2)} style={styles.btn}>
              <Typography variant="h2">Send Cipher</Typography>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2">Partner B: Decode It</Typography>
            <Typography variant="h1" style={styles.emojiDisplay}>{emojis}</Typography>
            <Typography variant="body">What does A need?</Typography>
            <TextInput
              style={styles.input}
              placeholder="e.g., You need quiet time with the dog?"
              placeholderTextColor={COLORS.textHint}
              value={guess}
              onChangeText={setGuess}
            />
            <SquishyButton onPress={() => setStep(3)} style={styles.btn}>
              <Typography variant="h2">Check</Typography>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2" style={styles.decodedTitle}>Decoded?</Typography>
            <Typography variant="body">Emojis: <Typography variant="keyword">{emojis}</Typography></Typography>
            <Typography variant="body">Guess: <Typography variant="keyword">{guess}</Typography></Typography>
            <Typography variant="body" style={styles.marcieQuote}>
              Marcie: "If they guessed 'I need a divorce', we have a problem. If they guessed 'snacks', marry them again."
            </Typography>
            <SquishyButton onPress={() => { setStep(1); setEmojis(''); setGuess(''); }} style={styles.btn}>
              <Typography variant="h2">Next Round</Typography>
            </SquishyButton>
          </GlassCard>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { 
    padding: SPACING.screenPadding, 
    gap: SPACING.large,
    flexGrow: 1,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular,
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small,
  },
  card: { 
    padding: SPACING.large, 
    gap: SPACING.regular,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.large, 
    color: COLORS.textPrimary, 
    fontSize: TYPOGRAPHY.fontSize.displaySmall, 
    textAlign: 'center',
  },
  btn: { 
    marginTop: SPACING.regular,
  },
  emojiDisplay: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
    textAlign: 'center',
  },
  decodedTitle: {
    color: COLORS.brightYellow,
    textAlign: 'center',
  },
  marcieQuote: {
    marginTop: SPACING.large,
    fontStyle: 'italic',
    color: COLORS.error,
  },
});
