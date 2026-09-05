import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, ANIMATIONS } from '../../theme';

export default function TimelineDetective({ route, navigation }: any) {
    const { gameId } = route.params;
    const [evidence, setEvidence] = useState<string[]>([]);
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
        speakMarcie("Welcome to Timeline Detective. The lie wasn't an act, it was a system. Let's dismantle it.");
    }, [gameId]);

    function addEvidence(fact: string) {
        HapticFeedbackSystem.selection();
        setEvidence(prev => [...prev, fact]);
        if (evidence.length === 2) {
            setTimeout(() => {
                HapticFeedbackSystem.success();
                speakMarcie("Pattern identified: 'Escalation after emotional neglect'.");
                finish();
            }, ANIMATIONS.duration.slow);
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
        Alert.alert("Case Solved", "Master Forensics Status Unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                <Typography variant="h2">Investigation Board</Typography>
                <Typography variant="instructions">Place evidence on the timeline:</Typography>

                <View style={styles.timeline}>
                    {evidence.map((e, i) => (
                        <View key={i} style={styles.pin}>
                            <Typography variant="caption">{e}</Typography>
                        </View>
                    ))}
                </View>

                <View style={styles.evidencePool}>
                    <SquishyButton onPress={() => addEvidence("Feb 12: Created Profile")} style={styles.evidenceBtn}>
                        <Typography variant="body">Feb 12: Created Profile</Typography>
                    </SquishyButton>
                    <SquishyButton onPress={() => addEvidence("April 15: First Coffee")} style={styles.evidenceBtn}>
                        <Typography variant="body">April 15: First Coffee</Typography>
                    </SquishyButton>
                    <SquishyButton onPress={() => addEvidence("May 20: Discovery Day")} style={styles.evidenceBtn}>
                        <Typography variant="body">May 20: Discovery Day</Typography>
                    </SquishyButton>
                </View>

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Timeline Detective',
        description: 'Reconstruct the double life',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
        currentStep: evidence.length,
        totalTime: 600,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, evidence]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    scrollView: {
        gap: SPACING.medium,
    },
    timeline: {
        height: 100,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        marginBottom: SPACING.large,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.regular,
        gap: SPACING.regular
    },
    pin: {
        backgroundColor: COLORS.emotionalConnection,
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.small
    },
    evidencePool: {
        gap: SPACING.regular
    },
    evidenceBtn: {
        backgroundColor: COLORS.backgroundCard,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.medium,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle
    }
});
