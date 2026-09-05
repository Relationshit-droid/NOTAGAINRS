import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const CASES = [
    {
        scenario: "Partner A texts 'Are you mad?' after a one-word reply. Silence follows.",
        clues: [
            { text: "Trigger: Perceived cold tone", type: "trigger" },
            { text: "Thought: 'They're pulling away'", type: "thought" },
            { text: "Reaction: Rapid texting → Silence", type: "reaction" },
            { text: "Aftermath: Shame spiral", type: "aftermath" }
        ]
    }
];

export default function BPDPatternDetective({ route, navigation }: any) {
    const { gameId } = route.params ?? {};
    const [step, setStep] = useState(0);
    const [mapped, setMapped] = useState<any>({});
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
        speakMarcie("Welcome to Pattern Detective. Love isn't blind, it's forensic.");
    }, [gameId]);

    function mapClue(clue: any) {
        HapticFeedbackSystem.selection();
        setMapped((m: any) => ({ ...m, [clue.type]: clue }));
    }

    function checkCase() {
        // Demo: auto-win if they clicked anything
        HapticFeedbackSystem.success();
        speakMarcie("One hundred points. You didn't just solve the case, you disarmed the bomb.");
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
        Alert.alert("Case Closed", "Master Meteorologists status unlocked.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const current = CASES[step];

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Typography variant="body">Investigate relationship patterns! Understanding triggers helps break destructive cycles.</Typography>
                    </View>
                </View>

                <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
                <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>

                <Typography variant="h2">Case File 1</Typography>
                <Typography variant="body" style={styles.scenarioText}>{current.scenario}</Typography>

                <Typography variant="instructions">Map the clues to the cycle:</Typography>
                <View style={styles.grid}>
                    {current.clues.map((c, i) => (
                        <SquishyButton
                            key={i}
                            onPress={() => mapClue(c)}
                            style={[styles.clue, mapped[c.type] ? styles.mapped : {}]}
                        >
                            <Typography variant="caption">{c.text}</Typography>
                        </SquishyButton>
                    ))}
                </View>

                <SquishyButton onPress={checkCase} style={styles.submitBtn}>
                    <Typography variant="button" style={styles.submitButtonText}>Submit Analysis</Typography>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'BPD Pattern Detective',
        description: 'Decode the storm cycle',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 200,
        currentStep: step,
        totalTime: 300,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, step]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
  scenarioText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.small,
  },
  scrollView: {
    flex: 1,
  },
  submitButtonText: {
    color: COLORS.textPrimary,
  },
    gameTitle: {
        marginBottom: SPACING.small,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.regular,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.small
    },
    clue: {
        padding: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.medium,
        width: '48%',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle
    },
    mapped: {
        backgroundColor: COLORS.mintGreen,
        borderColor: COLORS.mintGreen
    },
    submitBtn: {
        marginTop: SPACING.regular,
        marginBottom: SPACING.regular,
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        marginBottom: SPACING.regular
    },
    avatarContainer: {
        width: SPACING.xxlarge + SPACING.medium,
        height: SPACING.xxlarge + SPACING.medium,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: SPACING.xxlarge,
        height: SPACING.xxlarge,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
    },
});
