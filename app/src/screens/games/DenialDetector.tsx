import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';

export default function DenialDetector({ navigation }: any) {
  const [transcript, setTranscript] = useState('');
  const [count, setCount] = useState<number | null>(null);

  function analyze() {
    // Simple count of "fine" (case insensitive)
    const matches = transcript.match(/fine/gi);
    const c = matches ? matches.length : 0;
    setCount(c);
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={StyleSheet.absoluteFillObject} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} size="small">
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h1">The Denial Detector</Typography>
        </View>

        <GlassCard style={styles.card} padding="large">
          <Typography variant="h2">Say It: "Everything's fine."</Typography>
          <Typography variant="body">Describe how you feel right now. Don't hold back.</Typography>
          <TextInput
            style={styles.input}
            placeholder="Type what you would say (or use dictation)..."
            placeholderTextColor={COLORS.textHint}
            value={transcript}
            onChangeText={setTranscript}
            multiline
          />
          <SquishyButton onPress={analyze} style={styles.btn}>
            <Typography variant="button">Audit for Denial</Typography>
          </SquishyButton>
        </GlassCard>

        {count !== null && (
          <GlassCard style={styles.card} padding="large">
            <Typography variant="h2" center>"Fine" Count: {count}</Typography>
            {count < 2 ? (
              <Typography variant="body" center style={styles.successText}>
                Low Denial! (+15 XP). You're actually expressing feelings.
              </Typography>
            ) : (
              <Typography variant="body" center style={styles.errorText}>
                Denial Champion. (-5 XP). You said 'fine' {count} times. You are not fine.
              </Typography>
            )}
            <Typography variant="sass" center style={styles.marcieText}>
                Marcie: {count < 2 ? "Proud of you." : "Emotional Bottleneck unlocked. 🏆"}
            </Typography>
            <SquishyButton onPress={() => { setTranscript(''); setCount(null); }} style={[styles.btn, styles.tryAgainBtn]}>
              <Typography variant="button">Try Again</Typography>
            </SquishyButton>
          </GlassCard>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  successText: {
    color: COLORS.success,
  },
  errorText: {
    color: COLORS.error,
  },
  marcieText: {
    marginTop: SPACING.xlarge,
  },
  container: { 
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary
  },
  content: { 
    padding: SPACING.regular, 
    gap: SPACING.regular 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular 
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.large 
  },
  card: { 
    padding: SPACING.large, 
    gap: SPACING.regular,
    ...SHADOWS.card
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    fontSize: TYPOGRAPHY.fontSize.bodyLarge, 
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle
  },
  btn: { 
    backgroundColor: COLORS.error, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center', 
    marginTop: SPACING.small,
    ...SHADOWS.buttonGlow
  },
  tryAgainBtn: {
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle
  }
});
