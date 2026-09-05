import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function LegacyDash({ route, navigation }: any) {
    const { gameId } = route.params ?? {};
    const [stage, setStage] = useState(1);
    const [puzzle, setPuzzle] = useState<string[]>([]);
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
        speakMarcie("Welcome to Legacy Dash. Build a legacy that outlasts the lie. Ready? GO!");
    }, [gameId]);

    function completeTask() {
        HapticFeedbackSystem.success();
        if (stage === 1) {
            speakMarcie("Clue Unlocked: FAMILY = ________ + LOVE");
            setStage(2);
        } else if (stage === 2) {
            speakMarcie("Emblem designed. Next: The Origin Story.");
            setStage(3);
            setPuzzle(['[Our family story has unique beginnings]', '[but]', '[our love for you]', '[is the simplest, truest thing.]']);
        } else if (stage === 3) {
            speakMarcie("Sentence assembled like poets. Final Stop.");
            setStage(4);
        } else {
            finish();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 400,
                state: JSON.stringify({ xp: 400 })
            });
        }
        Alert.alert("Legacy Secured", "You looked at the wreckage and said: 'We're building here.'", [
            { text: "Finish", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                <Typography variant="h2">Leg {stage}/4</Typography>

                {stage === 1 && (
                    <View>
                        <Typography variant="body">Task: Match accountability actions to goals.</Typography>
                        <SquishyButton onPress={completeTask} style={styles.actionBtn}>
                            <Typography variant="body">Match: Annual Check-in → Team Feeling</Typography>
                        </SquishyButton>
                    </View>
                )}

                {stage === 2 && (
                    <View>
                        <Typography variant="body">Task: Design Family Emblem.</Typography>
                        <SquishyButton onPress={completeTask} style={styles.actionBtn}>
                            <Typography variant="body">Assemble: Shield + Sprout + Spark</Typography>
                        </SquishyButton>
                    </View>
                )}

                {stage === 3 && (
                    <View>
                        <Typography variant="body">Task: Order the Origin Story Sentence.</Typography>
                        {puzzle.map((p, i) => (
                            <View key={i} style={styles.puzzlePiece}>
                                <Typography variant="caption">{p}</Typography>
                            </View>
                        ))}
                        <SquishyButton onPress={completeTask} style={styles.actionBtn}>
                            <Typography variant="body">Confirm Order</Typography>
                        </SquishyButton>
                    </View>
                )}

                {stage === 4 && (
                    <View>
                        <Typography variant="body">Final Task: Record Legacy Message.</Typography>
                        <Typography variant="instructions">"To our child: You are ours. We chose you."</Typography>
                        <SquishyButton onPress={completeTask} style={styles.actionBtn}>
                            <Typography variant="body">Record Together</Typography>
                        </SquishyButton>
                    </View>
                )}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Legacy Dash',
        description: 'The Amazing Race for Family Legacy',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 400,
        currentStep: stage,
        totalTime: 600,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, stage]);

    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        gap: SPACING.regular,
    },
    actionBtn: {
        marginTop: SPACING.large,
        marginBottom: SPACING.large,
    },
    puzzlePiece: {
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.small,
        marginVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    }
});
