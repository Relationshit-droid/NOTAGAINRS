import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

export default function BidRadar({ route, navigation }: any) {
  const { gameId } = route.params;
  const [bid, setBid] = useState('');
  const [isReceived, setIsReceived] = useState(false);
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

  async function submit() {
    if (!bid.trim()) {
        speakMarcie("Silence is golden, but it doesn't count as a bid. Type something.");
        return;
    }

    // Simulate AI checking
    speakMarcie(isReceived ? "Noted. Let's see if they remember making it." : "Logged. If they missed this, they owe you chocolate.");
    HapticFeedbackSystem.success();

    const xp = 150;
    if (sessionId.current) {
        await updateGameSession(sessionId.current, {
            finished_at: new Date().toISOString(),
            score: 100,
            state: JSON.stringify({ bid, isReceived, xp })
        });
    }

    Alert.alert("Bid Logged", "We'll cross-reference this with your partner's logs.", [
        { text: "OK", onPress: () => navigation.goBack() }
    ]);
  }

  const inputArea = (
    <View style={styles.inputArea}>
      <GlassCard>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Typography variant="sass">Log emotional bids to track connection attempts! Recognize when you make or receive bids for attention.</Typography>
          </View>
        </View>

        <Typography variant="h2">Log a Bid</Typography>
        <Typography variant="body">What was the bid?</Typography>
        <TextInput
            style={styles.input}
            placeholder="e.g. sighed while cooking..."
            placeholderTextColor={COLORS.textHint}
            value={bid}
            onChangeText={setBid}
            multiline
        />
        <View style={styles.toggleRow}>
            <SquishyButton
                onPress={() => setIsReceived(false)}
                style={[styles.toggleBtn, !isReceived ? styles.activeBtn : {}]}
            >
                <Typography variant="body" style={isReceived ? styles.toggleTextInactive : styles.toggleTextActive}>I Made It</Typography>
            </SquishyButton>
            <SquishyButton
                onPress={() => setIsReceived(true)}
                style={[styles.toggleBtn, isReceived ? styles.activeBtn : {}]}
            >
                <Typography variant="body" style={isReceived ? styles.toggleTextActive : styles.toggleTextInactive}>I Received It</Typography>
            </SquishyButton>
        </View>
        <SquishyButton onPress={submit} style={styles.submitBtn}>
          <Typography variant="button" style={styles.buttonText}>Submit to Marcie</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Bid Radar',
    description: 'Log real-world emotional bids',
    category: 'emotional' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  inputArea: {
    gap: SPACING.regular,
  },
  input: {
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.regular,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: SPACING.small,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: SPACING.small,
    marginTop: SPACING.regular,
  },
  toggleBtn: {
    flex: 1,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  activeBtn: {
    backgroundColor: COLORS.mintGreen,
  },
  toggleTextActive: {
    color: COLORS.backgroundPrimary,
  },
  toggleTextInactive: {
    color: COLORS.textPrimary,
  },
  buttonText: {
    color: COLORS.textPrimary,
  },
  submitBtn: {
    marginTop: SPACING.regular,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.regular,
    marginBottom: SPACING.regular
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular
  },
});
