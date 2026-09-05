import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Text, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function RelationshipCouncil({ route, navigation }: any) {
    const { gameId } = route.params;
    const [article, setArticle] = useState(1);
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
        speakMarcie("Welcome to The Relationship Council. Legislate your future.");
    }, [gameId]);

    function ratify() {
        HapticFeedbackSystem.success();
        speakMarcie("Article Ratified. 'We proactively share plans and honor choice.'");
        finish();
    }

    async function finish() {
        if (sessionId.current) {
            await updateGameSession(sessionId.current, {
                finished_at: new Date().toISOString(),
                score: 500,
                state: JSON.stringify({ xp: 500 })
            });
        }
        Alert.alert("Constitution Signed", "Founding Council Chairs Status.", [
            { text: "Collect XP", onPress: () => navigation.goBack() }
        ]);
    }

    const inputArea = (
        <ScrollView style={styles.scrollView}>
            <GlassCard>
                <Typography variant="h2">Article I: Boundaries</Typography>
                <Typography variant="body" style={styles.prompt}>Prompt: Communication with friends of previous threat categories.</Typography>

                <View style={styles.entry}>
                    <Typography variant="caption">Draft:</Typography>
                    <Typography variant="body" style={styles.draft}>"We proactively share plans involving them and invite partner to join or opt out."</Typography>
                </View>

                <SquishyButton 
                    onPress={ratify} 
                    variant="primary"
                    size="large"
                    style={styles.submitBtn}
                >
                    <Typography variant="button">Ratify Article</Typography>
                </SquishyButton>
            </GlassCard>
        </ScrollView>
    );

    const baseState = useMemo(() => ({
        id: gameId,
        title: 'The Relationship Council',
        description: 'Draft your constitution',
        category: 'arcade' as const,
        difficulty: 'hard' as const,
        xpReward: 500,
        currentStep: article,
        totalTime: 400,
        playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
    }), [gameId, article]);

    return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={finish} />;
}

const styles = StyleSheet.create({
    scrollView: {
        gap: SPACING.regular,
    },
    entry: {
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.medium,
        marginVertical: SPACING.regular,
    },
    draft: {
        fontStyle: 'italic',
        color: COLORS.mintGreen,
        marginTop: SPACING.small,
    },
    prompt: {
        marginTop: SPACING.small,
        marginBottom: SPACING.small,
    },
    submitBtn: {
        marginTop: SPACING.xlarge,
        marginBottom: SPACING.xlarge,
    },
});
