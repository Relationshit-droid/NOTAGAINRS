import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const HARSH_STARTUPS = [
  "You never listen to me!",
  "Why is the kitchen always a mess?",
  "You care more about your phone than me.",
  "You're always late.",
  "You never help with the kids."
];

export default function GentleStartUpGauntlet({ route, navigation }: any) {
  const { gameId } = route.params;
  const [input, setInput] = useState('');
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
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
  }, [gameId]);

  function checkRewrite() {
    const lower = input.toLowerCase();
    const hasIFeel = lower.includes('i feel');
    const hasAbout = lower.includes('about') || lower.includes('when');
    const hasINeed = lower.includes('i need') || lower.includes('i want') || lower.includes('would you');

    if (hasIFeel && hasAbout && hasINeed) {
      HapticFeedbackSystem.success();
      speakMarcie("Ooh, smooth. I almost felt that myself.");
      if (index < HARSH_STARTUPS.length - 1) {
        setIndex(i => i + 1);
        setInput('');
      } else {
        finish();
      }
    } else {
      HapticFeedbackSystem.warning();
      if (!hasIFeel) speakMarcie("Start with 'I feel'. Don't make me come over there.");
      else if (!hasAbout) speakMarcie("What is this about? Be specific. 'About...' or 'When...'");
      else if (!hasINeed) speakMarcie("And what do you need? Don't leave them guessing.");
      setAttempts(a => a + 1);
    }
  }

  async function finish() {
    const xp = Math.max(100, 300 - (attempts * 10));
    if (sessionId.current) {
      await updateGameSession(sessionId.current, {
        finished_at: new Date().toISOString(),
        score: 100,
        state: JSON.stringify({ attempts, xp })
      });
    }
    Alert.alert("Gauntlet Survived", `You earned ${xp} XP!`, [
      { text: "Victory", onPress: () => navigation.goBack() }
    ]);
  }

  const inputArea = (
    <View style={styles.inputWrapper}>
      <GlassCard>
        <Typography variant="h2">Rewrite this Harsh Start-Up</Typography>
        <Typography variant="sass" style={styles.harsh}>"{HARSH_STARTUPS[index]}"</Typography>
        <Typography variant="body" style={styles.instructionText}>Use: "I feel... about... I need..."</Typography>
        <TextInput
          style={styles.input}
          placeholder="I feel..."
          placeholderTextColor={COLORS.textHint}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <SquishyButton onPress={checkRewrite} style={styles.submitBtn}>
          <Typography variant="body">Check Tone</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Gentle Start-Up Gauntlet',
    description: 'Rewrite harsh startups into gentle ones',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 300,
    currentStep: index,
    totalTime: 120,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={() => finish()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputWrapper: {
    gap: SPACING.regular,
  },
  harsh: {
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    textAlign: 'center',
    marginVertical: SPACING.regular,
    color: COLORS.vibrantPink
  },
  instructionText: {
    marginTop: SPACING.small,
  },
  input: {
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.regular,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: SPACING.small,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  submitBtn: {
    marginTop: SPACING.regular,
  },
});
