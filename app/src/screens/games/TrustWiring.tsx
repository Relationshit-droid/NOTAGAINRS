import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout } from '../../components/ui';
import { GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const CHALLENGES = [
    {
        alarm: "Unclear Social Plans",
        need: "Clarity",
        desc: "The light's flashing yellow. I need to know who, where, when.",
        tools: [
            { id: 'correct', text: "Proactive Transparency Template" },
            { id: 'wrong1', text: "Defensive Justification" },
            { id: 'wrong2', text: "Silent Withdrawal" }
        ]
    }
];

export default function TrustWiring({ route, navigation }: any) {
    const { gameId } = route.params ?? {};
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
        speakMarcie("Welcome to Trust Wiring Simulator. Partner B sees the alarm. Partner A holds the tools.");
    }, [gameId]);

    function fixWire(toolId: string) {
        if (toolId === 'correct') {
            HapticFeedbackSystem.success();
            speakMarcie("Wire secured. Alarm deactivated.");
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Short circuit. Try again.");
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
        Alert.alert("Pattern Rewired", "Master Electricians Status.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = CHALLENGES[round];

    const inputArea = (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <GlassCard>
                <Typography variant="h1" center style={styles.gameTitle}>
                    The Love Arcade
                </Typography>
                <Typography variant="h2" center style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>

                <Typography variant="h3" style={styles.challengeTitle}>
                    Challenge {round + 1}
                </Typography>

                <View style={styles.console}>
                    <Typography variant="keyword" style={styles.alarmText}>
                        ALARM: {current.alarm}
                    </Typography>
                    <Typography variant="body">
                        Partner B says: "{current.desc}"
                    </Typography>
                </View>

                <Typography variant="instructions" style={styles.instructions}>
                    Partner A, select tool:
                </Typography>
                <View style={styles.tools}>
                    {current.tools.map(t => (
                        <SquishyButton 
                            key={t.id} 
                            onPress={() => fixWire(t.id)} 
                            variant="ghost"
                            style={styles.toolBtn}
                        >
                            <Typography variant="body">{t.text}</Typography>
                        </SquishyButton>
                    ))}
                </View>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Trust Wiring Simulator',
        description: 'Rewire the circuit',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
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
    challengeTitle: {
        marginBottom: SPACING.regular,
    },
    console: {
        backgroundColor: COLORS.backgroundPrimary,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.medium,
        borderWidth: 1,
        borderColor: COLORS.brightYellow,
        marginBottom: SPACING.xlarge
    },
    alarmText: {
        color: COLORS.brightYellow,
    },
    instructions: {
        marginBottom: SPACING.regular,
    },
    tools: { 
        gap: SPACING.regular 
    },
    toolBtn: {
        padding: SPACING.regular,
    }
});
