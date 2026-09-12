import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const ROUNDS = [
    {
        statement: "You're going to leave me just like everyone else!",
        options: [
            { id: 'A', text: "That's ridiculous. You know I'm not.", type: 'bad' },
            { id: 'B', text: "I hear you're scared I might leave. I'm not going anywhere.", type: 'good' },
            { id: 'C', text: "Let's talk later.", type: 'neutral' },
            { id: 'D', text: "Ugh, not this again.", type: 'bad' }
        ]
    }
];

export default function ValidationGameShow({ route, navigation }: any) {
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
        speakMarcie("Welcome to The Validation Game Show. Spin the wheel to build a bridge, not a wall.");
    }, [gameId]);

    function submit() {
        if (!choice) return;
        HapticFeedbackSystem.success();
        speakMarcie("Jackpot. 5 stars means your nervous system just whispered 'Safe'.");
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 450,
                state: JSON.stringify({ xp: 450 })
            });
        }
        Alert.alert("Bridge Built", "Validation Virtuosos unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = ROUNDS[round];

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                <Typography variant="h2" center>Round {round + 1}</Typography>
                <Typography variant="sass" center style={styles.statementText}>Partner A says: "{current.statement}"</Typography>

                <Typography variant="instructions" center style={styles.instructionsText}>Partner B, choose your response:</Typography>
                {current.options.map(o => (
                    <SquishyButton
                        key={o.id}
                        onPress={() => setChoice(o.id)}
                        style={[styles.opt, choice === o.id ? styles.selected : {}]}
                    >
                        <Typography variant="body" style={choice === o.id ? styles.optionTextSelected : styles.optionText}>{o.text}</Typography>
                    </SquishyButton>
                ))}

                <SquishyButton onPress={submit} style={styles.submitBtn}>
                    <Typography variant="button">Lock In Response</Typography>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Validation Game Show',
        description: 'Spin for connection',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 250,
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
    statementText: {
        marginBottom: SPACING.regular,
    },
    instructionsText: {
        marginBottom: SPACING.regular,
    },
    opt: {
        padding: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.medium,
        marginBottom: SPACING.small,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle
    },
    selected: {
        backgroundColor: COLORS.brightYellow,
        borderColor: COLORS.brightYellow
    },
    optionText: {
        color: COLORS.textPrimary,
    },
    optionTextSelected: {
        color: COLORS.backgroundPrimary,
    },
    submitBtn: {
        marginTop: SPACING.xlarge,
        backgroundColor: COLORS.emotionalConnection,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.button,
        alignItems: 'center',
        marginBottom: SPACING.xlarge
    },
});
