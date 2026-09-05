import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout } from '../../components/ui';
import { GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function TrustBingo({ route, navigation }: any) {
    const { gameId } = route.params;
    const [marked, setMarked] = useState<number[]>([]);
    const [sessionId, setSessionId] = useState<string | undefined>(undefined);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }: any) => {
            const user = data.session?.user;
            if (user) {
                const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
                if (couple.data?.couple_code) {
                    const session = await createGameSession(gameId, user.id, couple.data.couple_code);
                    setSessionId(session.id);
                }
            }
        });
        speakMarcie("Welcome to Trust-Building Bingo. The prize is trust compound interest.");
    }, [gameId]);

    function toggle(i: number) {
        HapticFeedbackSystem.selection();
        if (marked.includes(i)) {
            setMarked(marked.filter(m => m !== i));
        } else {
            setMarked([...marked, i]);
        }
    }

    function checkBingo() {
        // Demo: if 3 marked, win
        if (marked.length >= 3) {
            HapticFeedbackSystem.success();
            speakMarcie("BINGO. You didn't just play a game. You laid bricks.");
            finish();
        } else {
            Alert.alert("Keep Building", "Not enough squares yet.");
        }
    }

    async function finish() {
        if (sessionId) {
            await updateGameSession(sessionId, {
                finished_at: new Date().toISOString(),
                score: 500,
                state: JSON.stringify({ xp: 500 })
            });
        }
        Alert.alert("Fortress Builders", "Trust Compounded.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const SQUARES = [
        "Planned phone-free date", "Shared schedule proactively", "Said 'I feel... I need...'",
        "Acknowledged effort", "15-min check-in", "Shared vulnerable feeling"
    ];

    const inputArea = (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <GlassCard>
                <Typography variant="h1" center style={styles.gameTitle}>
                    The Love Arcade
                </Typography>
                <Typography variant="h2" center style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>

                <Typography variant="h3" style={styles.boardTitle}>
                    This Week's Board
                </Typography>
                <View style={styles.grid}>
                    {SQUARES.map((s, i) => (
                        <SquishyButton
                            key={i}
                            onPress={() => toggle(i)}
                            variant={marked.includes(i) ? 'primary' : 'ghost'}
                            style={styles.square}
                        >
                            <Typography variant="caption" center>{s}</Typography>
                        </SquishyButton>
                    ))}
                </View>

                <SquishyButton onPress={checkBingo} size="large" style={styles.submitBtn}>
                    <Typography variant="button">Call BINGO</Typography>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Trust-Building Bingo',
        description: 'Micro-actions for trust',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 500,
        currentStep: marked.length,
        totalTime: 604800, // 1 week in seconds (mock)
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, marked]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} sessionId={sessionId} />;
}

const styles = StyleSheet.create({
    scrollContent: {
        gap: SPACING.regular,
    },
    gameTitle: {
        marginBottom: SPACING.small
    },
    subtitle: {
        marginBottom: SPACING.xlarge
    },
    boardTitle: {
        marginBottom: SPACING.regular,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.small,
        justifyContent: 'center'
    },
    square: {
        width: '30%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.small,
    },
    submitBtn: {
        marginTop: SPACING.xlarge,
        marginBottom: SPACING.xlarge
    },
});
