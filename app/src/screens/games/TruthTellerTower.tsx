/**
 * Truth Teller Tower - Love Arcade Game
 * A "Who Wants to Be a Millionaire" style game with couple's questions
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Saves score after each question
 * - Completes game and submits final score
 * 
 * Design Spec:
 * - Game area: midPurple (#3D2A5C)
 * - Game Titles: Inter Black (900)
 * - Dr. Marcie overlays triggered by game state changes
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView, Animated as RNAnimated } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenLayout } from '../../components/ui';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { gamesApi, GameSession } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';
import { useWebSocket } from '../../hooks/useWebSocket';

// Components
import { GlassCard, Typography, SquishyButton } from '../../components/ui';
import GlobalMarcieOverlay, { MarcieAnimationType } from '../../components/DrMarcieOverlay';

// Theme
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, ANIMATIONS, GRADIENTS } from '../../theme';

// Game Constants
const GAME_ID = 'truth-teller-tower';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 100;

// Question Bank
const QUESTIONS = [
    {
        id: 1,
        text: "Before rebuilding, you must name the dragon. What's the #1 reason couples fail Phase 1?",
        options: [
            { id: 'A', text: 'They call it "a rough patch."' },
            { id: 'B', text: 'They skip naming the betrayal and jump to "fixing."' },
            { id: 'C', text: 'They let the betrayed partner define it alone.' },
            { id: 'D', text: 'They use clinical jargon to sound smart.' }
        ],
        correct: 'B',
        marcieReason: "If you don't name the monster, it lives in your basement rent-free.",
        value: 10
    },
    {
        id: 2,
        text: "What's the most dangerous phrase in conflict resolution?",
        options: [
            { id: 'A', text: '"I hate you"' },
            { id: 'B', text: '"Calm down"' },
            { id: 'C', text: '"Let\'s talk"' },
            { id: 'D', text: '"You always..."' }
        ],
        correct: 'B',
        marcieReason: '"Calm down" is emotional gasoline. Never works.',
        value: 20
    },
    {
        id: 3,
        text: "According to Gottman, what's the #1 predictor of divorce?",
        options: [
            { id: 'A', text: 'Financial stress' },
            { id: 'B', text: 'Infidelity' },
            { id: 'C', text: 'Contempt' },
            { id: 'D', text: 'Lack of sex' }
        ],
        correct: 'C',
        marcieReason: 'Contempt is relationship poison. Eye rolls kill marriages.',
        value: 30
    },
    {
        id: 4,
        text: "In the aftermath of betrayal, what must happen FIRST?",
        options: [
            { id: 'A', text: 'Forgiveness' },
            { id: 'B', text: 'Transparency' },
            { id: 'C', text: 'Time apart' },
            { id: 'D', text: 'Couples therapy' }
        ],
        correct: 'B',
        marcieReason: 'You can\'t rebuild on quicksand. Transparency first, trust second.',
        value: 25
    },
    {
        id: 5,
        text: "What's the healthiest way to express anger?",
        options: [
            { id: 'A', text: 'Silent treatment' },
            { id: 'B', text: 'Yelling it out' },
            { id: 'C', text: 'Using "I feel" statements' },
            { id: 'D', text: 'Passive-aggressive notes' }
        ],
        correct: 'C',
        marcieReason: '"I feel" statements own your emotions without attacking. Revolutionary concept.',
        value: 15
    }
];

// Lifelines
interface Lifelines {
    fiftyFifty: boolean;
    askMarcie: boolean;
    doubleConfidence: boolean;
}

// Game state type for Dr. Marcie overlay
 type GameOverlayState = 'intro' | 'playing' | 'thinking' | 'correct' | 'wrong' | 'results';

const TruthTellerTower: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { gameId: routeGameId } = (route.params ?? {}) as { gameId?: string };
    
    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading: sessionLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    // Game state
    const [qIndex, setQIndex] = useState(0);
    const [myAnswer, setMyAnswer] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [lifelines, setLifelines] = useState<Lifelines>({
        fiftyFifty: true,
        askMarcie: true,
        doubleConfidence: true
    });
    const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
    const [marcieHint, setMarcieHint] = useState<string | null>(null);
    const [partnerResponse, setPartnerResponse] = useState<any>(null);
    const [gameOverlayState, setGameOverlayState] = useState<GameOverlayState>('intro');
    const [marcieQuote, setMarcieQuote] = useState<string | undefined>(undefined);

    // WebSocket for real-time sync
    const { sendMessage, lastMessage } = useWebSocket(
        session?.user_id || null,
        auth.currentUser ? null : null
    );

    // Get current question
    const currentQuestion = QUESTIONS[qIndex];

    // Map game overlay state to Marcie animation
    const getMarcieAnimation = (state: GameOverlayState): MarcieAnimationType => {
        switch (state) {
            case 'intro':
                return 'intro';
            case 'playing':
                return 'idle';
            case 'thinking':
                return 'thinking';
            case 'correct':
                return 'correct';
            case 'wrong':
                return 'wrong';
            case 'results':
                return score >= 70 ? 'laugh' : 'shrug';
            default:
                return 'idle';
        }
    };

    // Set initial overlay state
    useEffect(() => {
        const timer = setTimeout(() => {
            setGameOverlayState('playing');
            setMarcieQuote("Welcome to Truth Teller Tower. Let's see how well you know your partner!");
        }, ANIMATIONS.duration.slow);
        return () => clearTimeout(timer);
    }, []);

    // Handle answer selection
    const handleAnswerSelect = (optionId: string) => {
        setMyAnswer(optionId);
        setGameOverlayState('thinking');
        setMarcieQuote(undefined);
    };

    // Handle prediction selection
    const handlePredictionSelect = (optionId: string) => {
        setPrediction(optionId);
    };

    // Use 50:50 lifeline
    const useFiftyFifty = () => {
        if (!lifelines.fiftyFifty || !currentQuestion) return;
        
        const wrongOptions = currentQuestion.options
            .filter(opt => opt.id !== currentQuestion.correct)
            .map(opt => opt.id);
        
        // Randomly eliminate 2 wrong answers
        const toEliminate = wrongOptions
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
        
        setEliminatedOptions(toEliminate);
        setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    };

    // Use Ask Marcie lifeline
    const useAskMarcie = () => {
        if (!lifelines.askMarcie || !currentQuestion) return;
        
        setMarcieHint(currentQuestion.marcieReason);
        setLifelines(prev => ({ ...prev, askMarcie: false }));
        setGameOverlayState('thinking');
        setMarcieQuote(currentQuestion.marcieReason);
    };

    // Use Double Confidence lifeline
    const useDoubleConfidence = () => {
        if (!lifelines.doubleConfidence) return;
        setLifelines(prev => ({ ...prev, doubleConfidence: false }));
    };

    // Submit answer
    const submitAnswer = async () => {
        if (!myAnswer || !prediction || !currentQuestion) return;

        let roundPoints = 0;
        const isCorrect = myAnswer === currentQuestion.correct;
        
        // Points for correct answer
        if (isCorrect) {
            roundPoints += currentQuestion.value;
        }
        
        // Points for predicting partner's answer correctly
        if (prediction === currentQuestion.correct) {
            roundPoints += Math.round(currentQuestion.value / 2);
        }
        
        // Double confidence bonus
        if (!lifelines.doubleConfidence && isCorrect) {
            roundPoints *= 2;
        }

        const newScore = score + roundPoints;
        setScore(newScore);

        // Update overlay based on result
        setGameOverlayState(isCorrect ? 'correct' : 'wrong');
        setMarcieQuote(isCorrect 
            ? "Correct! You're on fire! 🔥" 
            : "Ouch, that's not right. But hey, honesty is the first step!"
        );

        // Save progress to backend
        await updateScore(newScore, false, [
            { 
                questionId: currentQuestion.id, 
                myAnswer, 
                prediction, 
                correct: currentQuestion.correct,
                points: roundPoints 
            }
        ]);

        // Delay before moving to next question
        setTimeout(() => {
            // Move to next question or finish
            if (qIndex < QUESTIONS.length - 1) {
                setQIndex(prev => prev + 1);
                setMyAnswer(null);
                setPrediction(null);
                setEliminatedOptions([]);
                setMarcieHint(null);
                setGameOverlayState('playing');
                setMarcieQuote(undefined);
            } else {
                finishGame(newScore);
            }
        }, ANIMATIONS.duration.slow);
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        setGameOverlayState('results');
        
        // Calculate badge
        let badge = 'Truth Adjacent';
        if (finalScore >= 90) badge = 'The Unfiltered Signal';
        else if (finalScore >= 70) badge = 'Honesty Amplifier';
        else if (finalScore >= 50) badge = 'Reality Checker';

        // Complete game in backend
        await completeGame(finalScore, [
            { completed: true, badge, totalQuestions: QUESTIONS.length }
        ]);

        setMarcieQuote(finalScore >= 70 
            ? `Amazing! You scored ${finalScore} points! You're a Truth Teller champion! 🏆`
            : `You scored ${finalScore} points. Keep practicing - honesty takes time! 💪`
        );

        Alert.alert(
            "Tower Scaled! 🏆",
            `Final Score: ${finalScore}/${MAX_SCORE}\nBadge: ${badge}`,
            [
                { 
                    text: "View Results", 
                    onPress: () => navigation.navigate('GameResults', { 
                        score: finalScore, 
                        badge,
                        gameId: GAME_ID,
                        sessionId: session?.id 
                    }) 
                },
                { text: "Play Again", onPress: () => resetGame() }
            ]
        );
    };

    // Reset game
    const resetGame = () => {
        setQIndex(0);
        setMyAnswer(null);
        setPrediction(null);
        setScore(0);
        setGameCompleted(false);
        setLifelines({
            fiftyFifty: true,
            askMarcie: true,
            doubleConfidence: true
        });
        setEliminatedOptions([]);
        setMarcieHint(null);
        setGameOverlayState('intro');
        setMarcieQuote(undefined);
        
        setTimeout(() => {
            setGameOverlayState('playing');
            setMarcieQuote("Let's try again! Good luck!");
        }, ANIMATIONS.duration.fast);
    };

    // Loading state
    if (sessionLoading) {
        return (
            <ScreenLayout showHeader={false} scrollable={true}>
                <LinearGradient colors={[COLORS.deepCosmic, COLORS.midPurple]} style={styles.background}>
                    <Typography variant="body" center style={styles.loadingText}>
                        Preparing Truth Teller Tower...
                    </Typography>
                </LinearGradient>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            {/* Game Area Background: midPurple */}
            <LinearGradient 
                    colors={[COLORS.deepCosmic, COLORS.midPurple]} 
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.background}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Header - Game Title: Inter Black (900) */}
                        <View style={styles.header}>
                            <Typography variant="h1" center>
                                The Love Arcade
                            </Typography>
                            <Typography variant="h2" center style={styles.subtitle}>
                                +100 Games to Deepen Connection
                            </Typography>
                            <View style={styles.scoreContainer}>
                                <Typography variant="caption">
                                    Score: {score}
                                </Typography>
                                {isSyncing && <Typography variant="caption">💾</Typography>}
                            </View>
                        </View>

                        <Typography variant="h3" center style={styles.gameTitle}>
                            TRUTH TELLER TOWER
                        </Typography>
                        <Typography variant="body" center style={styles.roundText}>
                            Round {qIndex + 1} of {QUESTIONS.length}
                        </Typography>

                        {/* Question */}
                        <GlassCard style={styles.questionCard}>
                            <Typography variant="body">{currentQuestion?.text}</Typography>
                            {marcieHint && (
                                <View style={styles.marcieHint}>
                                    <Typography variant="sass">💡 {marcieHint}</Typography>
                                </View>
                            )}
                        </GlassCard>

                        {/* Your Answer Section */}
                        <Typography variant="instructions" style={styles.sectionTitle}>
                            Your Answer:
                        </Typography>
                        <View style={styles.optionsContainer}>
                            {currentQuestion?.options.map((option) => (
                                <SquishyButton
                                    key={option.id}
                                    onPress={() => handleAnswerSelect(option.id)}
                                    disabled={eliminatedOptions.includes(option.id)}
                                    variant={myAnswer === option.id ? 'primary' : 'ghost'}
                                    style={[
                                        styles.optionButton,
                                        eliminatedOptions.includes(option.id) && styles.eliminatedOption
                                    ]}
                                >
                                    <Typography variant="h4" style={styles.optionLabel}>{option.id}:</Typography>
                                    <Typography variant="body" style={styles.optionText}>{option.text}</Typography>
                                </SquishyButton>
                            ))}
                        </View>

                        {/* Predict Partner Section */}
                        <Typography variant="instructions" style={styles.sectionTitle}>
                            Predict Your Partner's Answer:
                        </Typography>
                        <View style={styles.optionsContainer}>
                            {currentQuestion?.options.map((option) => (
                                <SquishyButton
                                    key={`pred-${option.id}`}
                                    onPress={() => handlePredictionSelect(option.id)}
                                    variant={prediction === option.id ? 'primary' : 'ghost'}
                                    style={styles.predictionButton}
                                >
                                    <Typography variant="h4" style={styles.optionLabel}>{option.id}</Typography>
                                </SquishyButton>
                            ))}
                        </View>

                        {/* Lifelines */}
                        <View style={styles.lifelinesContainer}>
                            <SquishyButton
                                onPress={useFiftyFifty}
                                disabled={!lifelines.fiftyFifty}
                                variant={lifelines.fiftyFifty ? 'primary' : 'ghost'}
                                size="small"
                            >
                                <Typography variant="button">50:50</Typography>
                            </SquishyButton>
                            <SquishyButton
                                onPress={useAskMarcie}
                                disabled={!lifelines.askMarcie}
                                variant={lifelines.askMarcie ? 'primary' : 'ghost'}
                                size="small"
                            >
                                <Typography variant="button">Ask Marcie</Typography>
                            </SquishyButton>
                            <SquishyButton
                                onPress={useDoubleConfidence}
                                disabled={!lifelines.doubleConfidence}
                                variant={lifelines.doubleConfidence ? 'primary' : 'ghost'}
                                size="small"
                            >
                                <Typography variant="button">2x Points</Typography>
                            </SquishyButton>
                        </View>

                        {/* Submit Button */}
                        <SquishyButton
                            onPress={submitAnswer}
                            disabled={!myAnswer || !prediction}
                            size="large"
                        >
                            <Typography variant="button">
                                {qIndex < QUESTIONS.length - 1 ? 'NEXT QUESTION' : 'FINISH GAME'}
                            </Typography>
                        </SquishyButton>

                        {/* Session Info */}
                        {session && (
                            <Typography variant="caption" center style={styles.sessionInfo}>
                                Session: {session.id.slice(0, 8)}...
                            </Typography>
                        )}
                    </ScrollView>
            </LinearGradient>

            {/* Dr. Marcie Overlay - Triggers based on game state */}
            <GlobalMarcieOverlay
                animation={getMarcieAnimation(gameOverlayState)}
                position="bottom-right"
                visible={true}
                quote={marcieQuote}
                showBubble={!!marcieQuote}
                bubbleDuration={ANIMATIONS.duration.slow * 8}
                size="medium"
                gameState={gameOverlayState === 'intro' ? 'intro' : 
                          gameOverlayState === 'thinking' ? 'thinking' : 
                          gameOverlayState === 'results' ? 'results' : 'playing'}
            />
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.screenPadding,
        paddingTop: SPACING.xxxlarge,
        paddingBottom: SPACING.xxxlarge * 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xlarge,
    },
    subtitle: {
        marginTop: SPACING.small,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.regular,
    },
    gameTitle: {
        marginTop: SPACING.large,
        marginBottom: SPACING.small,
    },
    roundText: {
        marginBottom: SPACING.large,
    },
    loadingText: {
        marginTop: 100,
    },
    questionCard: {
        marginBottom: SPACING.xlarge,
        padding: SPACING.large,
    },
    marcieHint: {
        marginTop: SPACING.regular,
        padding: SPACING.regular,
        backgroundColor: 'rgba(252, 12, 132, 0.15)',
        borderRadius: BORDER_RADIUS.large,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.vibrantPink,
    },
    sectionTitle: {
        marginBottom: SPACING.regular,
        textTransform: 'uppercase',
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    },
    optionsContainer: {
        marginBottom: SPACING.xlarge,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(61, 42, 92, 0.6)',
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.large,
        marginBottom: SPACING.small,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedOption: {
        borderColor: COLORS.vibrantPink,
        backgroundColor: 'rgba(252, 12, 132, 0.2)',
    },
    eliminatedOption: {
        opacity: 0.3,
    },
    optionLabel: {
        color: COLORS.vibrantPink,
        marginRight: SPACING.regular,
    },
    optionText: {
        flex: 1,
        lineHeight: TYPOGRAPHY.fontSize.bodyMedium * 1.4,
    },
    predictionButton: {
        width: 56,
        height: 56,
        backgroundColor: 'rgba(61, 42, 92, 0.6)',
        borderRadius: BORDER_RADIUS.round,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPrediction: {
        borderColor: COLORS.mintGreen,
        backgroundColor: 'rgba(55, 207, 151, 0.2)',
    },
    lifelinesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.xlarge,
    },
    sessionInfo: {
        marginTop: SPACING.xxlarge,
    },
});

export default TruthTellerTower;
