import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout } from '../../components/ui';
import { GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const ROUNDS = [
    {
        q: "What is the purpose of 'Defining the Betrayal Together'?",
        opts: [
            { id: 'A', text: "Assign blame" },
            { id: 'B', text: "Create a shared, factual foundation" },
            { id: 'C', text: "Punish the unfaithful partner" },
            { id: 'D', text: "Make the betrayed partner feel worse" }
        ],
        correct: 'B'
    }
];

export default function TruthTransparencyGauntlet({ route, navigation }: any) {
    const { gameId } = route.params ?? {};
    const [round, setRound] = useState(0);
    const [choice, setChoice] = useState<string | null>(null);
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
        speakMarcie("Welcome to the Gauntlet. The fare is integrity. Don't make me pull over.");
    }, [gameId]);

    function submit() {
        if (!choice) return;
        const correct = ROUNDS[round].correct;
        if (choice === correct) {
            HapticFeedbackSystem.success();
            speakMarcie("Correct. You're building on bedrock, not quicksand.");
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Wrong. Pull over. We need to talk about foundations.");
        }
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 200,
                state: JSON.stringify({ xp: 200 })
            });
        }
        Alert.alert("Ride Complete", "Truth Architects Status: Pending.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = ROUNDS[round];

    const inputArea = (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <GlassCard>
                <Typography variant="h1" center style={styles.gameTitle}>
                    The Love Arcade
                </Typography>
                <Typography variant="h2" center style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>

                <Typography variant="h3" style={styles.questionTitle}>
                    Question {round + 1}
                </Typography>
                <Typography variant="body" style={styles.questionText}>
                    {current.q}
                </Typography>

                {current.opts.map(o => (
                    <SquishyButton
                        key={o.id}
                        onPress={() => setChoice(o.id)}
                        variant={choice === o.id ? 'primary' : 'ghost'}
                        style={[styles.opt, choice === o.id ? styles.selected : {}]}
                    >
                        <Typography 
                            variant="body" 
                            style={choice === o.id ? styles.selectedOptionText : styles.optionText}
                        >
                            {o.text}
                        </Typography>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submit} size="large" style={styles.submitBtn}>
                    <Typography variant="button">Lock In Answer</Typography>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Truth & Transparency Gauntlet',
        description: 'Cash Cab for integrity',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 200,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
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
    questionTitle: {
        marginBottom: SPACING.regular,
    },
    questionText: {
        marginBottom: SPACING.xlarge,
    },
    opt: {
        padding: SPACING.regular,
        marginBottom: SPACING.small,
    },
    selected: {
        backgroundColor: COLORS.brightYellow,
        borderColor: COLORS.brightYellow
    },
    optionText: {
        color: COLORS.textPrimary,
    },
    selectedOptionText: {
        color: COLORS.backgroundPrimary,
    },
    submitBtn: {
        marginTop: SPACING.xlarge,
        marginBottom: SPACING.xlarge
    },
});
