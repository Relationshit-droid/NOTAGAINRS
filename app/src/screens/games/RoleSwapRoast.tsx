import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function RoleSwapRoast({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'role-swap-roast' };
  const [helium, setHelium] = useState(false);
  const [arOn, setArOn] = useState(false);
  const [laughs, setLaughs] = useState(0);
  const [partnerVotes, setPartnerVotes] = useState(0);
  const sessionId = useRef<string | null>(null);
  const coupleId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        coupleId.current = couple_id;
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
        supabase
          .channel('role_swap_roast_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `couple_id=eq.${couple_id}` }, (payload: any) => {
            const row: any = payload.new;
            if (row && row.game_id === gameId && row.id !== sessionId.current) {
              try {
                const st = JSON.parse(row.state || '{}');
                if (st.vote_for && st.vote_for === sessionId.current) setPartnerVotes((v) => Math.min(5, v + 1));
              } catch {}
            }
          })
          .subscribe();
      }
    });
  }, [gameId]);

  function toggleHelium() {
    setHelium((h) => !h);
  }

  function toggleAr() {
    setArOn((a) => !a);
  }

  function addLaugh() {
    setLaughs((l) => Math.min(10, l + 1));
  }

  async function castVote() {
    if (!sessionId.current) return;
    try {
      await updateGameSession(sessionId.current, { state: JSON.stringify({ vote_for: sessionId.current }) });
    } catch {}
  }

  const accuracy = Math.min(100, Math.round(laughs * 10 + (helium ? 10 : 0) + (arOn ? 5 : 0)));
  const sync = Math.min(100, partnerVotes * 20);

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Role-Swap Roast',
    description: 'Impersonate your partner with filters and flair',
    category: 'creative' as const,
    difficulty: 'medium' as const,
    xpReward: 65,
    currentStep: 0,
    totalTime: 75,
    playerData: { vulnerabilityScore: Math.min(100, 60 + (helium ? 10 : 0)), honestyScore: accuracy, completionTime: 0, partnerSync: sync },
  }), [gameId, helium, accuracy, sync]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const bonus = Math.min(35, partnerVotes * 7);
    const xp = Math.min(100, 65 + bonus);
    speakMarcie("Congratulations, you've successfully mocked your partner's trauma. How growth-oriented.");
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ helium, arOn, laughs, partnerVotes, accuracy, xp }) });
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        <Typography variant="body">Use camera, toggle filters, and deliver your impression</Typography>
        <View style={styles.buttonRow}>
          <SquishyButton onPress={toggleHelium} style={styles.btn}>
            <Typography variant="h3">Helium {helium ? 'On' : 'Off'}</Typography>
          </SquishyButton>
          <SquishyButton onPress={toggleAr} style={styles.btn}>
            <Typography variant="h3">AR {arOn ? 'On' : 'Off'}</Typography>
          </SquishyButton>
        </View>
        <View style={styles.buttonRow}>
          <SquishyButton onPress={addLaugh} style={styles.btn}>
            <Typography variant="h3">Laugh +1</Typography>
          </SquishyButton>
          <SquishyButton onPress={castVote} style={styles.btn}>
            <Typography variant="h3">Cast Partner Vote</Typography>
          </SquishyButton>
        </View>
        <View style={styles.scoreContainer}>
          <Typography variant="caption" style={styles.scoreText}>Accuracy {accuracy}%</Typography>
          <Typography variant="caption" style={styles.scoreText}>Partner Votes {partnerVotes}</Typography>
        </View>
      </GlassCard>
    </View>
  );

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={["camera"]} inputArea={inputArea} onComplete={onComplete} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  btn: { 
    flex: 1,
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.healingHospital, 
    borderRadius: BORDER_RADIUS.medium 
  },
  scoreText: {
    color: COLORS.textSecondary
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.small,
    marginTop: SPACING.regular
  },
  scoreContainer: {
    marginTop: SPACING.regular
  }
});
