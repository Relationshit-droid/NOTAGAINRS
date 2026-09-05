import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, GlassCard, Text, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function NewlywedHeart({ route, navigation }: any) {
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
        speakMarcie("Welcome to The Newlywed Game: Heart Edition. Guess the soul weather.");
    }, [gameId]);

    function submit() {
        // Demo: Assume correct guess
        if (choice === 'B') {
            HapticFeedbackSystem.success();
            speakMarcie("Correct. She doesn't need 'sorry', she needs validation that her rage is justified.");
            finish();
        } else {
            HapticFeedbackSystem.error();
            speakMarcie("Missed. Listen closer to the storm.");
        }
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 450,
                state: JSON.stringify({ xp: 450 })
            });
        }
        Alert.alert("Heart Sync Masters", "Empathetic Accuracy: High.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                <Typography variant="h2">Round 1: Survivor's Fury</Typography>
                <Typography variant="body" style={styles.instructions}>
                    "When she is feeling her rage about the words, what does she most need from him in that moment?"
                </Typography>

                <View style={styles.opts}>
                    <SquishyButton 
                        onPress={() => setChoice('A')} 
                        variant={choice === 'A' ? 'primary' : 'secondary'}
                        size="medium"
                        style={styles.btn}
                    >
                        <Typography variant="body">A) Silence</Typography>
                    </SquishyButton>
                    <SquishyButton 
                        onPress={() => setChoice('B')} 
                        variant={choice === 'B' ? 'primary' : 'secondary'}
                        size="medium"
                        style={styles.btn}
                    >
                        <Typography variant="body">B) Validation</Typography>
                    </SquishyButton>
                    <SquishyButton 
                        onPress={() => setChoice('C')} 
                        variant={choice === 'C' ? 'primary' : 'secondary'}
                        size="medium"
                        style={styles.btn}
                    >
                        <Typography variant="body">C) Space</Typography>
                    </SquishyButton>
                </View>

                <SquishyButton 
                    onPress={submit} 
                    variant="primary"
                    size="large"
                    style={styles.submitBtn}
                >
                    <Typography variant="button">Lock In Prediction</Typography>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Newlywed Game: Heart Edition',
        description: 'Guess soul weather',
        category: 'arcade' as const,
        difficulty: 'medium' as const,
        xpReward: 450,
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
    opts: { 
        gap: SPACING.regular,
        marginTop: SPACING.regular,
    },
    btn: {
        backgroundColor: COLORS.backgroundInput,
    },
    sel: { 
        backgroundColor: COLORS.brightYellow, 
        borderColor: COLORS.brightYellow 
    },
    instructions: {
        marginBottom: SPACING.regular,
        marginTop: SPACING.small,
    },
    submitBtn: {
        marginTop: SPACING.xlarge,
        marginBottom: SPACING.xlarge,
    },
});
