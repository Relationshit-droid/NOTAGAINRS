import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATIONS } from '../../theme';

export default function DealOrNoDealAccountability({ route, navigation }: any) {
    const { gameId } = route.params;
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
        speakMarcie("Welcome to Deal or No Deal: Accountability. The suitcases contain truth.");
    }, [gameId]);

    function chooseDeal(d: boolean) {
        if (d) {
            HapticFeedbackSystem.success();
            speakMarcie("Deal accepted. Full Responsibility Declaration signed.");
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("No Deal. Protocol terminated. Truth honored.");
            navigation.goBack();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 500,
                state: JSON.stringify({ xp: 500 })
            });
        }
        Alert.alert("Accountability Accepted", "Phase 1 Unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <GlassCard padding="large">
                <Typography variant="h2" style={styles.cardTitle}>The Banker's Offer</Typography>
                <Typography variant="body" style={styles.descriptionText}>
                    "I offer the Full Responsibility Declaration:
                    1. Naming the crime as verbal violence.
                    2. Specificity of harm.
                    3. 100% ownership.
                    4. Commitment to transformation."
                </Typography>

                <Typography variant="instructions" style={styles.question}>Will you accept full, unilateral responsibility?</Typography>

                <View style={styles.opts}>
                    <SquishyButton onPress={() => chooseDeal(true)} style={[styles.btn, styles.deal]}>
                        <Typography variant="h3" style={styles.dealText}>DEAL</Typography>
                    </SquishyButton>
                    <SquishyButton onPress={() => chooseDeal(false)} style={[styles.btn, styles.nodeal]}>
                        <Typography variant="h3" style={styles.nodealText}>NO DEAL</Typography>
                    </SquishyButton>
                </View>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Deal or No Deal: Accountability',
        description: 'Take full responsibility',
        category: 'accountability' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
        currentStep: 0,
        totalTime: 60,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId]);

    return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    scrollContainer: {
        gap: SPACING.regular,
    },
    cardTitle: {
        color: COLORS.textPrimary,
        marginBottom: SPACING.regular,
    },
    descriptionText: {
        marginBottom: SPACING.regular,
    },
    question: {
        marginBottom: SPACING.large,
    },
    opts: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: SPACING.regular,
    },
    btn: {
        width: '45%',
    },
    deal: {
        backgroundColor: COLORS.success,
    },
    nodeal: {
        backgroundColor: COLORS.error,
    },
    dealText: {
        color: COLORS.textPrimary,
    },
    nodealText: {
        color: COLORS.textPrimary,
    },
});
