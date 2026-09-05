import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Text, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const INGREDIENTS = ["Coffee", "Tea", "News", "Music", "Cuddles", "Walk", "Silence", "Podcast"];

export default function RitualBuilder({ route, navigation }: any) {
  const { gameId } = route.params;
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    if (selected.includes(item)) {
      setSelected(s => s.filter(i => i !== item));
    } else {
      if (selected.length >= 3) {
        speakMarcie("Three ingredients max. Keep it simple.");
        return;
      }
      setSelected(s => [...s, item]);
      HapticFeedbackSystem.selection();
    }
  }

  function submit() {
    if (selected.length < 2) {
      speakMarcie("A ritual needs at least two things. Try harder.");
      return;
    }
    const name = selected.join(" + ");
    speakMarcie(`Ah, the "${name}" ritual. Very cozy.`);
    Alert.alert("Ritual Built", `You created: ${name}`, [{ text: "Save", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.container}>
      <GlassCard>
        <Typography variant="h2">Build a Morning Ritual</Typography>
        <Typography variant="body" style={styles.instructions}>Select 2-3 ingredients:</Typography>
        <View style={styles.grid}>
          {INGREDIENTS.map((ing) => (
            <SquishyButton
              key={ing}
              onPress={() => toggle(ing)}
              variant={selected.includes(ing) ? 'primary' : 'ghost'}
              size="small"
              style={styles.item}
            >
              <Typography 
                variant="button" 
                style={selected.includes(ing) ? styles.selectedIngredientText : styles.unselectedIngredientText}
              >
                {ing}
              </Typography>
            </SquishyButton>
          ))}
        </View>
        <Typography variant="caption" center style={styles.selectedText}>
            {selected.join(" + ")}
        </Typography>
        <SquishyButton 
          onPress={submit} 
          variant="primary"
          size="large"
          style={styles.submit}
        >
          <Typography variant="button">Build Ritual</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Ritual Builder',
    description: 'Design a shared habit',
    category: 'creative' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  instructions: {
    marginTop: SPACING.small,
    marginBottom: SPACING.regular,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: SPACING.regular, 
    marginTop: SPACING.regular,
  },
  item: { 
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle,
  },
  selectedIngredientText: {
    color: COLORS.backgroundPrimary,
  },
  unselectedIngredientText: {
    color: COLORS.textPrimary,
  },
  selectedText: {
    marginTop: SPACING.xlarge,
  },
  submit: { 
    marginTop: SPACING.xlarge,
  },
});
