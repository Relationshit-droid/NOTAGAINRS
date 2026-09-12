import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const ROUNDS = [
    {
        q: "What is the single most important word to include when you tell The Story of Our Family Now?",
        top: ["Choice (48%)", "Truth (22%)", "Baby (15%)", "Resilience (10%)", "Love (5%)"]
    },
    {
        q: "Name something that should be in your 'New Truth Contract' to help manage triggers.",
        top: ["Code word for triggered (52%)", "Scheduled talks (28%)", "No secret convos (12%)", "Plan for social (8%)"]
    }
];

export default function FamilyFeudNewReality({ route, navigation }: any) {
    const { gameId } = route.params ?? {};
    const [round, setRound] = useState(0);
    const [guess, setGuess] = useState<number | null>(null);
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
        speakMarcie("Welcome to Family Feud: Our New Reality Edition! Tonight's opponent? The Ghosts of the Past.");
    }, [gameId]);

    function submitGuess() {
        if (guess === null) return;
        HapticFeedbackSystem.success();
        speakMarcie(`Survey says... It's on the board!`);

        if (round < ROUNDS.length - 1) {
            setRound(r => r + 1);
            setGuess(null);
        } else {
            finish();
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 200,
                state: JSON.stringify({ xp: 200 })
            });
        }
        Alert.alert("Reality Forged", "You matched the survey!", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = ROUNDS[round];

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
                <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
                
                <Typography variant="h3" style={styles.roundTitle}>Round {round + 1}</Typography>
                <Typography variant="body" style={styles.questionText}>{current.q}</Typography>

                {current.top.map((ans, i) => (
                    <SquishyButton
                        key={i}
                        variant={guess === i ? 'primary' : 'ghost'}
                        onPress={() => setGuess(i)}
                        style={styles.opt}
                    >
                        <Typography variant="button" style={guess === i ? styles.selectedAnswerText : styles.answerText}>
                            {guess === i ? ans : `Answer ${i + 1}`}
                        </Typography>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submitGuess} style={styles.submitBtn}>
                    <Typography variant="button">Buzz In</Typography>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Family Feud: New Reality',
        description: 'You vs. The Ghosts of the Past',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 200,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    scrollView: {
        gap: SPACING.regular
    },
    gameTitle: {
        marginBottom: SPACING.small,
    },
    subtitle: {
        marginBottom: SPACING.regular,
    },
    roundTitle: {
        marginTop: SPACING.large,
    },
    questionText: {
        marginBottom: SPACING.large,
    },
    opt: {
        padding: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.medium,
        marginBottom: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        alignItems: 'center'
    },
    answerText: {
        color: COLORS.textSecondary,
    },
    selectedAnswerText: {
        color: COLORS.textPrimary,
    },
    submitBtn: {
        marginTop: SPACING.large,
        marginBottom: SPACING.large,
    },
});
