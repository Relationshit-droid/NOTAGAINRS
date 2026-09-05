import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

export default function ApologyWorkshop({ route, navigation }: any) {
    const { gameId } = route.params ?? {};
    const [station, setStation] = useState<'forge' | 'altar'>('forge');
    const [pillar, setPillar] = useState(1);
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
        speakMarcie("Welcome to The Apology & Release Workshop. No groveling. Structural integrity only.");
    }, [gameId]);

    function buildPillar() {
        HapticFeedbackSystem.success();
        if (pillar < 4) {
            setPillar(p => p + 1);
            speakMarcie(pillar === 1 ? "Regret placed." : pillar === 2 ? "Responsibility acknowledged." : "Empathy validated.");
        } else {
            setStation('altar');
            speakMarcie("Apology forged. Proceed to the Release Altar.");
        }
    }

    function release() {
        HapticFeedbackSystem.success();
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 250,
                state: JSON.stringify({ xp: 250 })
            });
        }
        Alert.alert("Workshop Closed", "Master Crafters Status Earned.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Typography variant="sass">Master the art of genuine apologies! Build your acknowledgment with each pillar.</Typography>
                    </View>
                </View>

                <Typography variant="h2">{station === 'forge' ? `The Forge: Pillar ${pillar}/4` : 'The Release Altar'}</Typography>

                {station === 'forge' && (
                    <View>
                        <Typography variant="instructions">Assemble the phrase block:</Typography>
                        <SquishyButton onPress={buildPillar} style={styles.actionBtn}>
                            <Typography variant="body">
                                {pillar === 1 ? "I am deeply sorry for..." :
                                    pillar === 2 ? "This was my choice..." :
                                        pillar === 3 ? "I understand it made you feel..." :
                                            "To ensure this never happens again..."}
                            </Typography>
                        </SquishyButton>
                    </View>
                )}

                {station === 'altar' && (
                    <View>
                        <Typography variant="instructions">Release 'The Victim' identity.</Typography>
                        <SquishyButton onPress={release} style={styles.actionBtn}>
                            <Typography variant="body">Say: "I survived. Now I build."</Typography>
                        </SquishyButton>
                    </View>
                )}

            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'Apology & Release Workshop',
        description: 'Build apologies, release weight',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 250,
        currentStep: pillar,
        totalTime: 500,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, pillar, station]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    scrollView: {
        gap: SPACING.regular,
    },
    actionBtn: {
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
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
});
