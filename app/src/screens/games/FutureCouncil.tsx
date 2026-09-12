import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function FutureCouncil({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [round, setRound] = useState(0);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      if (user) {
        const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
        if (couple.data?.couple_code) {
          const session = await createGameSession(gameId, user.id, couple.data.couple_code);
          sessionId.current = session.id;
        }
      }
    });
    speakMarcie("Welcome to The Future Council. You survived the fire. Now design the city.");
  }, [gameId]);

  function ratify() {
    HapticFeedbackSystem.success();
    speakMarcie("Decree Ratified. 'We proactively protect our relationship.'");
    finish();
  }

  async function finish() {
    if (sessionId.current) {
      await updateGameSession(sessionId.current, {
        finished_at: new Date().toISOString(),
        score: 500,
        state: JSON.stringify({ xp: 500 })
      });
    }
    Alert.alert("Council Adjourned", "Decree Drafters Status: Certified.", [
      { text: "Collect XP", onPress: () => navigation.goBack() }
    ]);
  }

  const inputArea = (
    <ScrollView style={styles.scrollContent}>
      <GlassCard>
        <Typography variant="h2">Scenario 1: Relapse Prevention</Typography>
        <Typography variant="body">An old dating app contact messages: "Hey."</Typography>

        <View style={styles.entry}>
          <Typography variant="instructions">Partner A (Action):</Typography>
          <Typography variant="body" style={styles.draft}>"Show message + Block contact."</Typography>
        </View>

        <View style={styles.entry}>
          <Typography variant="instructions">Partner B (Value):</Typography>
          <Typography variant="body" style={styles.draft}>"Proactive protection."</Typography>
        </View>

        <SquishyButton onPress={ratify} style={styles.submitBtn}>
          <Typography variant="body">Ratify Decree</Typography>
        </SquishyButton>
      </GlassCard>
    </ScrollView>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'The Future Council',
    description: 'Draft future laws',
    category: 'arcade' as const,
    difficulty: 'hard' as const,
    xpReward: 500,
    currentStep: round,
    totalTime: 400,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, round]);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { gap: SPACING.regular },
  entry: {
    backgroundColor: COLORS.backgroundInput,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.medium,
    marginVertical: SPACING.small
  },
  draft: {
    fontStyle: 'italic',
    color: COLORS.success,
    marginTop: SPACING.tiny
  },
  submitBtn: {
    marginTop: SPACING.xlarge,
    marginBottom: SPACING.xlarge
  }
});
