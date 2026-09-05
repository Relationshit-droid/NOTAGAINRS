import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '../../components/ui';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const TRUTH_OR_TRUST_QUESTIONS = [
    {
        id: '1',
        question: 'What is the most meaningful compliment your partner has ever given you?',
        category: 'connection',
        type: 'truth',
        difficulty: 'medium'
    },
    {
        id: '2',
        question: 'Share a moment when you felt truly seen by your partner.',
        category: 'connection',
        type: 'truth',
        difficulty: 'medium'
    },
    {
        id: '3',
        challenge: 'Tell your partner one thing you appreciate about them right now.',
        category: 'affection',
        type: 'trust',
        difficulty: 'easy'
    },
    {
        id: '4',
        question: 'What is something you have been hesitant to share with your partner?',
        category: 'vulnerability',
        type: 'truth',
        difficulty: 'hard'
    },
    {
        id: '5',
        challenge: 'Look into your partner\'s eyes for 30 seconds without speaking.',
        category: 'intimacy',
        type: 'trust',
        difficulty: 'medium'
    }
];

export default function TruthOrTrust({ route, navigation }: any) {
    const navigationHook = useNavigation();
    const { user } = useAuth();
    const { gameId: routeGameId } = route.params || {};
    
    // Get game info from registry
    const gameInfo = getGameByScreen('TruthOrTrust');
    const GAME_ID = gameInfo?.id || 'truth-or-trust';
    const CATEGORY_ID = gameInfo?.categoryId || 'emotional-connection';
    
    // Fetch couple data for coupleId
    const [coupleId, setCoupleId] = useState<string | undefined>(undefined);
    const [coupleLoading, setCoupleLoading] = useState(true);
    
    useEffect(() => {
        const fetchCoupleData = async () => {
            if (!user) {
                setCoupleLoading(false);
                return;
            }
            try {
                const token = await user.getIdToken();
                const couple = await coupleApi.getCoupleForUser(user.uid, token);
                if (couple && couple.id) {
                    setCoupleId(couple.id);
                }
            } catch (err) {
                console.log('No couple linked, playing solo');
            } finally {
                setCoupleLoading(false);
            }
        };
        fetchCoupleData();
    }, [user]);
    
    // Backend session - passes coupleId for couple meter updates on completion
    const {
        session,
        updateScore,
        completeGame,
        isLoading: sessionLoading,
        isSyncing,
        partnerProgress
    } = useGameSession(GAME_ID, CATEGORY_ID, coupleId);
    
    // Game state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const [currentResponse, setCurrentResponse] = useState('');
    const [gameCompleted, setGameCompleted] = useState(false);
    const [partnerResponse, setPartnerResponse] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const handleResponseChange = (text: string) => {
        setCurrentResponse(text);
    };

    const submitResponse = async () => {
        const currentQ = TRUTH_OR_TRUST_QUESTIONS[currentQuestionIndex];
        if (currentQ) {
            const newResponses = { ...responses, [currentQ.id]: currentResponse };
            setResponses(newResponses);
            
            // Calculate score based on response length and depth
            const responsePoints = Math.min(20, Math.floor(currentResponse.length / 10));
            const newScore = score + responsePoints;
            setScore(newScore);

            // Update in backend
            await updateScore(newScore, [{
                questionId: currentQ.id,
                question: currentQ.question || currentQ.challenge,
                response: currentResponse,
                type: currentQ.type,
                points: responsePoints
            }]);

            if (currentQuestionIndex < TRUTH_OR_TRUST_QUESTIONS.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setCurrentResponse('');
                setPartnerResponse(null);
            } else {
                // Game completed
                await finishGame(newScore, newResponses);
            }
        }
    };
    
    const finishGame = async (finalScore: number, finalResponses: Record<string, string>) => {
        setGameCompleted(true);
        
        // Calculate achievements
        const achievements: string[] = [];
        const totalResponses = Object.keys(finalResponses).length;
        const avgResponseLength = Object.values(finalResponses).reduce((acc, r) => acc + r.length, 0) / totalResponses;
        
        if (avgResponseLength > 50) achievements.push('Deep Sharer');
        if (totalResponses === TRUTH_OR_TRUST_QUESTIONS.length) achievements.push('Complete Honesty');
        
        await completeGame(finalScore, Object.entries(finalResponses).map(([id, response]) => ({
            questionId: id,
            response
        })), achievements);
        
        Alert.alert(
            'Truth or Trust Complete! 💕',
            `Final Score: ${finalScore}\nAchievements: ${achievements.join(', ') || 'None'}`,
            [
                {
                    text: 'View Results',
                    onPress: () => navigationHook.navigate('GameResults', {
                        score: finalScore,
                        gameId: GAME_ID,
                        sessionId: session?.id
                    })
                },
                { text: 'Exit', onPress: () => navigationHook.goBack() }
            ]
        );
    };

    const currentQuestion = TRUTH_OR_TRUST_QUESTIONS[currentQuestionIndex];
    const responseType = currentQuestion?.type === 'truth' ? 'Truth Question' : 'Trust Challenge';
    const responseColor = currentQuestion?.type === 'truth' ? COLORS.emotionalConnection : COLORS.romanceHub;

    // Loading state
    if (sessionLoading || coupleLoading) {
        return (
            <ScreenLayout showMarcie={true} marcieQuote="Loading your truth session...">
                <View style={styles.loadingContainer}>
                    <Typography variant="body" center>Starting Truth or Trust...</Typography>
                </View>
            </ScreenLayout>
        );
    }

    const inputArea = (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {!gameCompleted ? (
                <>
                    <GlassCard>
                        <Typography variant="h1" center style={styles.gameTitle}>
                            Truth or Trust
                        </Typography>
                        <Typography variant="h2" center style={styles.subtitle}>
                            Share your truth, build your trust
                        </Typography>

                        <LinearGradient
                            colors={GRADIENTS.romanceHub.colors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientContainer}
                        >
                            <View style={styles.headerContainer}>
                                <Typography 
                                    variant="h3" 
                                    style={[
                                        styles.responseType,
                                        { color: responseColor }
                                    ]}
                                >
                                    {responseType}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    style={styles.questionCounter}
                                >
                                    {currentQuestionIndex + 1}/{TRUTH_OR_TRUST_QUESTIONS.length}
                                </Typography>
                            </View>
                            
                            <Typography 
                                variant="body" 
                                style={styles.questionText}
                            >
                                {currentQuestion?.question || currentQuestion?.challenge}
                            </Typography>

                            <Typography 
                                variant="caption" 
                                style={styles.responseLabel}
                            >
                                Your response:
                            </Typography>
                            
                            <View style={styles.responseContainer}>
                                <SquishyButton 
                                    onPress={() => {}}
                                    variant="ghost"
                                    style={styles.responseBox}
                                >
                                    <Typography 
                                        variant="body" 
                                        style={[
                                            styles.responsePlaceholder,
                                            currentResponse ? styles.responseText : null
                                        ]}
                                    >
                                        {currentResponse || 'Tap to share your response...'}
                                    </Typography>
                                </SquishyButton>
                            </View>
                            
                            <SquishyButton
                                onPress={submitResponse}
                                disabled={!currentResponse.trim()}
                                size="large"
                            >
                                <Typography variant="button">
                                    {currentQuestionIndex === TRUTH_OR_TRUST_QUESTIONS.length - 1 ? 'Finish Game' : 'Next Question'}
                                </Typography>
                            </SquishyButton>
                        </LinearGradient>
                    </GlassCard>
                    
                    {partnerResponse && (
                        <GlassCard style={styles.partnerCard}>
                            <Typography 
                                variant="sass" 
                                style={styles.partnerLabel}
                            >
                                Partner Responded:
                            </Typography>
                            <Typography 
                                variant="body" 
                                style={styles.partnerResponse}
                            >
                                {partnerResponse}
                            </Typography>
                        </GlassCard>
                    )}
                </>
            ) : (
                <GlassCard>
                    <LinearGradient
                        colors={GRADIENTS.romanceHub.colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientContainer}
                    >
                        <Typography variant="h3" style={styles.completedTitle}>
                            Game Completed!
                        </Typography>
                        <Typography variant="body" style={styles.completedText}>
                            You and your partner have shared {TRUTH_OR_TRUST_QUESTIONS.length} meaningful moments together.
                        </Typography>
                        <SquishyButton 
                            onPress={() => navigation.goBack()}
                            size="large"
                        >
                            <Typography variant="button">Return to Menu</Typography>
                        </SquishyButton>
                    </LinearGradient>
                </GlassCard>
            )}
        </ScrollView>
    );

    return (
        <ScreenLayout 
            showHeader={false} 
            scrollable={true} 
            showMarcie={true} 
            marcieQuote="Share your truth, darling. Vulnerability is the currency of connection."
        >
            <View style={styles.container}>
                {isSyncing && (
                    <View style={styles.syncIndicator}>
                        <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
                    </View>
                )}
                {inputArea}
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: SPACING.xxlarge,
    },
    gameTitle: {
        marginBottom: SPACING.small
    },
    subtitle: {
        marginBottom: SPACING.xlarge
    },
    gradientContainer: {
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.regular,
    },
    responseType: {
        marginBottom: SPACING.regular,
        textTransform: 'uppercase',
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    },
    questionCounter: {
        position: 'absolute',
        right: SPACING.regular,
        top: SPACING.regular,
        color: COLORS.textHint,
    },
    questionText: {
        marginBottom: SPACING.xlarge,
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.fontSize.headerMedium,
    },
    responseLabel: {
        color: COLORS.textHint,
        marginBottom: SPACING.small,
    },
    responseContainer: {
        marginBottom: SPACING.xlarge,
    },
    responseBox: {
        backgroundColor: COLORS.backgroundInput,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
        minHeight: 100,
    },
    responsePlaceholder: {
        color: COLORS.textHint,
        fontStyle: 'italic',
    },
    responseText: {
        color: COLORS.textPrimary,
        fontStyle: 'normal',
    },
    partnerCard: {
        marginTop: SPACING.regular,
        padding: SPACING.regular,
    },
    partnerLabel: {
        color: COLORS.aquaTeal,
        marginBottom: SPACING.small,
    },
    partnerResponse: {
        color: COLORS.textSecondary,
    },
    completedTitle: {
        marginBottom: SPACING.regular,
        color: COLORS.success,
    },
    completedText: {
        marginBottom: SPACING.xlarge,
        color: COLORS.textPrimary,
    },
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    syncIndicator: {
        position: 'absolute',
        top: SPACING.small,
        right: SPACING.small,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
        zIndex: 1000,
    },
});