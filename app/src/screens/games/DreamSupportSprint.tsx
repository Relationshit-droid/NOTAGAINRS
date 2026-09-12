import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

export default function DreamSupportSprint({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [dream, setDream] = useState('');
  const [support, setSupport] = useState('');

  function submit() {
    if (!dream || !support) {
      speakMarcie("Fill out both fields. Dreams need scaffolding.");
      return;
    }
    speakMarcie("Solid plan. Now actually do it.");
    HapticFeedbackSystem.success();
    Alert.alert("Support Pledged", "Added to your shared calendar.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.gapContainer}>
      <GlassCard>
        <Typography variant="h2" center style={styles.gameTitle}>The Love Arcade</Typography>
        <Typography variant="h3" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
        
        <Typography variant="h3" style={styles.sectionTitle}>Dream Support</Typography>
        <Typography variant="body">Partner's Dream:</Typography>
        <TextInput
            style={styles.input}
            placeholder="e.g. Learn Guitar"
            placeholderTextColor={COLORS.textHint}
            value={dream}
            onChangeText={setDream}
        />
        <Typography variant="body" style={styles.inputLabel}>Your Specific Support:</Typography>
        <TextInput
            style={styles.input}
            placeholder="e.g. I will take the kids for 1hr on Saturdays"
            placeholderTextColor={COLORS.textHint}
            value={support}
            onChangeText={setSupport}
            multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="button">Commit Support</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Dream Support Sprint',
    description: 'Make dreams feasible together',
    category: 'romance' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  gapContainer: {
    gap: SPACING.regular,
  },
  sectionTitle: {
    marginTop: SPACING.large,
  },
  inputLabel: {
    marginTop: SPACING.regular,
  },
  gameTitle: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    marginBottom: SPACING.regular,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    marginTop: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  btn: { 
    marginTop: SPACING.large,
  },
});
