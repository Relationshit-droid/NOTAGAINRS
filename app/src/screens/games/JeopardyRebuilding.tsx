import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

export default function JeopardyRebuilding({ route, navigation }: any) {
    const { gameId } = route.params;
    const [q, setQ] = useState<any>(null);
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
        speakMarcie("Welcome to Jeopardy: Rebuilding Round. Categories are Potent Promises.");
    }, [gameId]);

    function selectClue(val: number) {
        setQ({ val, text: "This phrase is banned because it weaponizes BPD fear.", ans: "What is 'You're just being dramatic'?" });
    }

    function answer() {
        HapticFeedbackSystem.success();
        speakMarcie("Correct. 'Dramatic' is a war crime in this house.");
        finish();
    }

    async function finish() {
        if (sessionId) {
            await updateGameSession(sessionId, {
                finished_at: new Date().toISOString(),
                score: 2000,
                state: JSON.stringify({ xp: 2000 })
            });
        }
        Alert.alert("Jeopardy Champion", "Relational Integrity Earned.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                {!q ? (
                    <View style={styles.board}>
                        <Typography variant="h2" style={styles.boardTitle}>Linguistic Geneva Convention</Typography>
                        {[100, 200, 300, 400, 500].map(v => (
                            <SquishyButton key={v} onPress={() => selectClue(v)} style={styles.clue}>
                                <Typography variant="h2" style={styles.clueText}>${v}</Typography>
                            </SquishyButton>
                        ))}
                    </View>
                ) : (
                    <View>
                        <Typography variant="h2" style={styles.valueText}>${q.val}</Typography>
                        <Typography variant="body" style={styles.questionText}>{q.text}</Typography>
                        <SquishyButton onPress={answer} style={styles.buzzBtn}>
                            <Typography variant="h3">Buzz In: "What is..."</Typography>
                        </SquishyButton>
                    </View>
                )}
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Jeopardy: Rebuilding Round',
        description: 'The new social contract',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 2000,
        currentStep: q ? 1 : 0,
        totalTime: 400,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, q]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} sessionId={sessionId} />;
}

const styles = StyleSheet.create({
    scrollView: {
        gap: SPACING.small,
    },
    board: { 
        gap: SPACING.small,
    },
    boardTitle: {
        textAlign: 'center',
        marginBottom: SPACING.medium,
    },
    clue: {
        backgroundColor: COLORS.deepCosmic,
        padding: SPACING.medium,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.small,
        borderWidth: 1,
        borderColor: COLORS.brightYellow,
    },
    clueText: {
        color: COLORS.brightYellow,
    },
    valueText: {
        color: COLORS.brightYellow,
    },
    questionText: {
        marginVertical: SPACING.large,
    },
    buzzBtn: {
        backgroundColor: COLORS.emotionalConnection,
        padding: SPACING.large,
        borderRadius: BORDER_RADIUS.large,
        alignItems: 'center',
        marginTop: SPACING.medium,
    },
});
