import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const STRESSORS = ["Work Deadlines", "Money", "Family Drama", "Health", "Chores", "Sleep"];

export default function StressSynergyLab({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(s: string) {
    if (selected.includes(s)) setSelected(prev => prev.filter(i => i !== s));
    else setSelected(prev => [...prev, s]);
    HapticFeedbackSystem.selection();
  }

  function submit() {
    const count = selected.length;
    let rx = "Prescription: Hug for 20 seconds.";
    if (count > 3) rx = "Prescription: Cancel everything. Order takeout.";

    speakMarcie(`Detected ${count} stressors. ${rx}`);
    Alert.alert("Lab Results", rx, [{ text: "Apply Treatment", onPress: () => navigation.goBack() }]);
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={styles.container}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <GlassCard>
          <Typography variant="h2">Analyze Stressors</Typography>
          <Typography variant="body">What is weighing on you today?</Typography>
          <View style={styles.grid}>
            {STRESSORS.map((s) => (
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
          <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="h2">Synthesize Plan</Typography>
          </SquishyButton>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: SPACING.small, 
    marginTop: SPACING.regular 
  },
  item: { 
    flex: 1,
    minWidth: '45%',
  },
  btn: { 
    marginTop: SPACING.regular 
  },
});
