import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';

import { COLORS, SPACING, BORDER_RADIUS, COMPONENTS } from '../../theme';

export default function TransparencyToss({ navigation }: any) {
  const [toss, setToss] = useState('');
  const [tossed, setTossed] = useState(false);
  const [verified, setVerified] = useState(false);

  function handleToss() {
    if (!toss.trim()) return;
    setTossed(true);
  }

  function handleVerify() {
    setVerified(true);
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
              <Typography variant="body">Back</Typography>
            </SquishyButton>
            <Typography variant="h1">Transparency Toss</Typography>
          </View>

          {!tossed ? (
            <GlassCard style={styles.card}>
              <Typography variant="h2" center>Your Turn to Toss</Typography>
              <Typography variant="body" center>Share a low-stakes truth. Something small you didn't mention.</Typography>
              <TextInput
                style={styles.input}
                placeholder="e.g., I pretended to like your friend's lasagna..."
                placeholderTextColor={COLORS.textHint}
                value={toss}
                onChangeText={setToss}
                multiline
              />
              <SquishyButton onPress={handleToss} style={styles.btn}>
                <Typography variant="h2" color={COLORS.textPrimary}>Toss Truth</Typography>
              </SquishyButton>
            </GlassCard>
          ) : !verified ? (
            <GlassCard style={styles.card}>
              <Typography variant="h2" center>Truth Tossed!</Typography>
              <Typography variant="body" style={styles.truthText}>"{toss}"</Typography>
              <Typography variant="body" center style={styles.verifyLabel}>Partner: Verify this truth.</Typography>
              <SquishyButton onPress={handleVerify} style={[styles.btn, styles.verifyButton]}>
                <Typography variant="h2" color={COLORS.textPrimary}>✅ Verify (+10 XP)</Typography>
              </SquishyButton>
            </GlassCard>
          ) : (
            <GlassCard style={styles.card}>
              <Typography variant="h2" center color={COLORS.success}>Caught & Verified!</Typography>
              <Typography variant="sass" center>
                "You tossed it, they caught it. Trust +1."
              </Typography>
              <SquishyButton onPress={() => { setToss(''); setTossed(false); setVerified(false); }} style={styles.btn}>
                <Typography variant="h2" color={COLORS.textPrimary}>Next Toss</Typography>
              </SquishyButton>
            </GlassCard>
          )}
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
    padding: SPACING.screenPadding, 
    gap: SPACING.regular 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.small 
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.large 
  },
  card: { 
    padding: SPACING.cardPadding, 
    gap: SPACING.regular,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.input, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    fontSize: COMPONENTS.input.height / 3, 
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  btn: { 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center' 
  },
  truthText: { 
    fontStyle: 'italic', 
    color: COLORS.brightYellow, 
    textAlign: 'center',
    marginTop: SPACING.regular,
  },
  verifyLabel: {
    marginTop: SPACING.xlarge,
  },
  verifyButton: {
    backgroundColor: COLORS.success,
  },
});
