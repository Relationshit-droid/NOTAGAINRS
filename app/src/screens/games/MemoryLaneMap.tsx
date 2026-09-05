import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Typography, GlassCard, ScreenLayout, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

type Pin = { name: string; lat?: number; lng?: number; details?: string };

export default function MemoryLaneMap({ route, navigation }: any) {
  const { gameId: routeGameId } = route.params || { gameId: 'memory-lane' };
  const [pin, setPin] = useState<Pin>({ name: '' });
  const [partnerPin, setPartnerPin] = useState<Pin | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const sessionId = useRef<string | null>(null);
  const coupleId = useRef<string | null>(null);

  // Get game info from registry
  const gameInfo = getGameByScreen('MemoryLaneMap');
  const GAME_ID = gameInfo?.id || 'memory-lane-map';
  const CATEGORY_ID = gameInfo?.categoryId || 'emotional-connection';

  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing,
    partnerProgress
  } = useGameSession(GAME_ID, CATEGORY_ID);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        coupleId.current = couple_id;
        const gameSession = await createGameSession(GAME_ID, user.id, couple_id);
        sessionId.current = gameSession.id;
        supabase
          .channel('memory_lane_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `couple_id=eq.${couple_id}` }, (payload: any) => {
            const row: any = payload.new;
            if (row && row.game_id === GAME_ID && row.id !== sessionId.current) {
              try {
                const st = JSON.parse(row.state || '{}');
                if (st.pin) setPartnerPin(st.pin);
              } catch {}
            }
          })
          .subscribe();
      }
    });
  }, [GAME_ID]);

  async function update(field: keyof Pin, value: any) {
    setPin((p) => ({ ...p, [field]: value }));
    if (sessionId.current) updateGameSession(sessionId.current, { state: JSON.stringify({ pin: { ...pin, [field]: value } }) });
    
    // Calculate score based on completeness
    let newScore = 0;
    if (pin.name || field === 'name') newScore += 25;
    if (pin.lat || field === 'lat') newScore += 25;
    if (pin.lng || field === 'lng') newScore += 25;
    if (pin.details || field === 'details') newScore += 25;
    setScore(newScore);
    
    // Update in backend
    await updateScore(newScore, [{
      questionId: field,
      response: String(value),
      points: 25
    }]);
  }

  function distance(a?: Pin, b?: Pin) {
    if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return null;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad((b.lat as number) - (a.lat as number));
    const dLon = toRad((b.lng as number) - (a.lng as number));
    const lat1 = toRad(a.lat as number);
    const lat2 = toRad(b.lat as number);
    const aVal = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c;
  }

  const dist = distance(pin, partnerPin || undefined) || 0;
  const acc = Math.max(0, Math.round(100 - Math.min(100, dist)));

  const baseState = useMemo(() => ({
    id: routeGameId,
    title: 'Memory Lane Map',
    description: 'Drop pins for shared memories',
    category: 'emotional' as const,
    difficulty: 'medium' as const,
    xpReward: 60,
    currentStep: 0,
    totalTime: 90,
    playerData: { vulnerabilityScore: 50, honestyScore: 50, completionTime: 0, partnerSync: acc },
  }), [routeGameId, acc]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const xp = Math.min(90, 60 + Math.round(acc * 0.3));
    const finalScore = score + acc;
    
    if ((pin.name || '').toLowerCase().includes('gas station')) speakMarcie('Your first kiss was at a gas station?');
    
    const achievements: string[] = [];
    if (acc >= 90) achievements.push('Memory Master');
    if (pin.name && pin.lat && pin.lng && pin.details) achievements.push('Complete Memory');
    
    await completeGame(finalScore, [{
      questionId: 'memory_pin',
      response: JSON.stringify(pin),
      accuracy: acc
    }], achievements);
    
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: finalScore, state: JSON.stringify({ pin, partnerPin, xp }) });
    
    navigation.navigate('GameResults', {
      score: finalScore,
      gameId: GAME_ID,
      sessionId: session?.id
    });
  }

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="body">Loading game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const inputArea = (
    <View>
      {isSyncing && (
        <View style={{position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 8, zIndex: 1000}}>
          <Typography variant="caption" style={{color: COLORS.success}}>💾 Saving...</Typography>
        </View>
      )}
      <GlassCard>
        <Typography variant="body">Where was your first kiss?</Typography>
        <TextInput 
          placeholder="Place name" 
          placeholderTextColor={COLORS.textHint}
          style={styles.input} 
          value={pin.name} 
          onChangeText={(t) => update('name', t)} 
        />
        <View style={styles.inputRow}>
          <TextInput 
            placeholder="lat" 
            placeholderTextColor={COLORS.textHint}
            keyboardType="numeric" 
            style={[styles.input, styles.inputSmall]} 
            value={String(pin.lat || '')} 
            onChangeText={(t) => update('lat', parseFloat(t))} 
          />
          <TextInput 
            placeholder="lng" 
            placeholderTextColor={COLORS.textHint}
            keyboardType="numeric" 
            style={[styles.input, styles.inputSmall]} 
            value={String(pin.lng || '')} 
            onChangeText={(t) => update('lng', parseFloat(t))} 
          />
        </View>
        <TextInput 
          placeholder="Memory details" 
          placeholderTextColor={COLORS.textHint}
          style={styles.input} 
          value={pin.details || ''} 
          onChangeText={(t) => update('details', t)} 
        />
        {!!partnerPin && <Typography variant="keyword">Partner chose: {partnerPin.name}</Typography>}
        {!!dist && <Typography variant="keyword">Distance: {dist.toFixed(2)} km</Typography>}
        {!!dist && <Typography variant="keyword">Accuracy: {acc}%</Typography>}
        <SquishyButton onPress={() => onComplete({ score: score + acc, xpEarned: 60 })} style={{marginTop: SPACING.regular}}>
          <Typography variant="button">Complete Memory</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={() => onComplete({ score: score + acc, xpEarned: 60 })} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  input: { 
    backgroundColor: COLORS.backgroundSecondary, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    marginTop: SPACING.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  inputSmall: { 
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
});
