import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const SYMBOLS = ["🏔️ Mountains", "🌊 Ocean", "🏡 Home", "✈️ Travel", "🎨 Art", "👪 Family"];

export default function SharedMeaningMural({ route, navigation }: any) {
  const { gameId } = route.params;
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(sym: string) {
    if (selected.includes(sym)) setSelected(s => s.filter(i => i !== sym));
    else setSelected(s => [...s, sym]);
    HapticFeedbackSystem.selection();
  }

  function finish() {
    if (selected.length === 0) {
      speakMarcie("A blank canvas? How existential.");
      return;
    }
    const match = selected.length > 1;
    speakMarcie(match ? "You picked similar vibes. Cute." : "Interesting mix. Chaos or complexity?");
    Alert.alert("Mural Created", `Symbols: ${selected.join(", ")}`, [{ text: "Hang It", onPress: () => navigation.goBack() }]);
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={styles.container}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>
        
        <GlassCard>
          <Typography variant="h2">Co-Create Your Mural</Typography>
          <Typography variant="body">Pick symbols that represent "Us":</Typography>
          <View style={styles.grid}>
            {SYMBOLS.map((s) => (
              <SquishyButton
                key={s}
                onPress={() => toggle(s)}
                variant={selected.includes(s) ? 'primary' : 'ghost'}
                style={styles.item}
              >
                <Typography 
                  variant="body" 
                  color={selected.includes(s) ? COLORS.deepCosmic : COLORS.textPrimary}
                >
                  {s}
                </Typography>
              </SquishyButton>
            ))}
          </View>
          <SquishyButton onPress={finish} style={styles.btn}>
            <Typography variant="h2">Reveal Mural</Typography>
          </SquishyButton>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: SPACING.small, 
    marginTop: SPACING.regular 
  },
  item: { 
    width: '48%',
    alignItems: 'center' 
  },
  btn: { 
    marginTop: SPACING.large 
  },
});
