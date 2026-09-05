import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function RewriteMemory({ navigation }: any) {
  const [memory, setMemory] = useState('');
  const [rewrite, setRewrite] = useState('');
  const [step, setStep] = useState(1);

  return (
    <ScreenLayout showHeader={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton 
            onPress={() => navigation.goBack()} 
            variant="secondary"
            size="small"
            style={styles.backBtn}
          >
            <Typography variant="button">Back</Typography>
          </SquishyButton>
          <Typography variant="h1">Rewrite the Memory</Typography>
        </View>

        {step === 1 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2">Step 1: The Fragment</Typography>
            <Typography variant="body" style={styles.instructions}>Type a fragment of a painful memory.</Typography>
            <TextInput
              style={styles.input}
              placeholder="e.g., The night I found the texts..."
              placeholderTextColor={COLORS.textHint}
              value={memory}
              onChangeText={setMemory}
              multiline
            />
            <SquishyButton 
              onPress={() => setStep(2)} 
              variant="primary"
              size="large"
              style={styles.btn}
            >
              <Typography variant="button">Next</Typography>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2">Step 2: The Edit</Typography>
            <Typography variant="body" style={styles.instructions}>Partner: Rewrite it with hope or absurdity.</Typography>
            <Typography variant="body" style={styles.memoryText}>"{memory}"</Typography>
            <TextInput
              style={styles.input}
              placeholder="e.g., ...and then a raccoon stole his phone."
              placeholderTextColor={COLORS.textHint}
              value={rewrite}
              onChangeText={setRewrite}
              multiline
            />
            <SquishyButton 
              onPress={() => setStep(3)} 
              variant="primary"
              size="large"
              style={styles.btn}
            >
              <Typography variant="button">Submit Edit</Typography>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2" style={styles.successTitle}>Analysis: Poetic</Typography>
            <Typography variant="body">Original: "{memory}"</Typography>
            <Typography variant="body" style={styles.rewriteText}>Rewrite: "{rewrite}"</Typography>
            <Typography variant="sass" style={styles.marcieQuote}>
              Marcie: "28/30. You took the sting out. That's alchemy."
            </Typography>
            <SquishyButton 
              onPress={() => { setStep(1); setMemory(''); setRewrite(''); }} 
              variant="primary"
              size="large"
              style={styles.btn}
            >
              <Typography variant="button">Again</Typography>
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
    gap: SPACING.xlarge,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small,
  },
  card: { 
    padding: SPACING.cardPadding, 
    gap: SPACING.regular,
  },
  instructions: {
    marginTop: SPACING.small,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  btn: { 
    marginTop: SPACING.regular,
  },
  memoryText: { 
    fontStyle: 'italic', 
    color: COLORS.textSecondary, 
    marginVertical: SPACING.regular,
  },
  successTitle: {
    color: COLORS.success,
  },
  rewriteText: { 
    marginTop: SPACING.regular,
  },
  marcieQuote: { 
    marginTop: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
});
