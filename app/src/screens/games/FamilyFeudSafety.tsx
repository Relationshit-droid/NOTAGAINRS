import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const SURVEYS = [
    {
        q: "What is the #1 thing a survivor needs to feel after verbal violence to stabilize?",
        answers: [
            { text: "SAFETY", points: 92 },
            { text: "Apology", points: 5 },
            { text: "Love", points: 3 }
        ]
    }
];

export default function FamilyFeudSafety({ route, navigation }: any) {
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
        speakMarcie("Welcome to Family Feud: Safety Edition. 100 trauma therapists answered.");
    }, [gameId]);

    function guess(idx: number) {
        if (idx === 0) {
            HapticFeedbackSystem.success();
            speakMarcie("Number one answer! Safety. The floor must hold before you can stand.");
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Good answer, but not the top one. Try again.");
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
        Alert.alert("Safety Architects", "Top Answer Found.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = SURVEYS[round];

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
                <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
                
                <Typography variant="h3" style={styles.roundTitle}>Survey Says...</Typography>
                <Typography variant="body" style={styles.questionText}>{current.q}</Typography>

                {current.answers.map((a, i) => (
                    <SquishyButton key={i} onPress={() => guess(i)} style={styles.ansBtn}>
                        <Typography variant="button">{a.text} ??</Typography>
                    </SquishyButton>
                ))}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Family Feud: Safety Edition',
        description: 'You vs. Ghosts of Past',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 500,
        currentStep: round,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, round]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    scrollView: {
        gap: SPACING.regular,
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
    ansBtn: {
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.medium,
        marginBottom: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle
    }
});
