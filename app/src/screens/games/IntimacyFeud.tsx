/**
 * The Intimacy Feud - Love Arcade Game
 * Family Feud style survey game for couples
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Saves guesses and responses
 * - Completes game with final score
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import { useAppNavigation } from '../../hooks/useAppNavigation';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Typography, ScreenLayout, SquishyButton } from '../../components/ui';

// Theme
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

const { width, height } = Dimensions.get('window');

// Game Constants
const GAME_ID = 'intimacy-feud';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 250;

// Survey Questions
interface SurveyAnswer {
    text: string;
    value: number;
    rank: number;
    revealed: boolean;
}

interface SurveyQuestion {
    id: string;
    question: string;
    answers: SurveyAnswer[];
}

const SURVEY_QUESTIONS: SurveyQuestion[] = [
    {
        id: '1',
        question: "What's your partner's biggest complaint about your relationship?",
        answers: [
            { text: "Not enough quality time", value: 42, rank: 1, revealed: false },
            { text: "Poor communication", value: 28, rank: 2, revealed: false },
            { text: "Lack of physical affection", value: 15, rank: 3, revealed: false },
            { text: "Trust issues", value: 10, rank: 4, revealed: false },
            { text: "Different life goals", value: 5, rank: 5, revealed: false }
        ]
    },
    {
        id: '2',
        question: "What's the most important thing for a strong relationship?",
        answers: [
            { text: "Good communication", value: 35, rank: 1, revealed: false },
            { text: "Physical intimacy", value: 25, rank: 2, revealed: false },
            { text: "Shared values", value: 20, rank: 3, revealed: false },
            { text: "Trust", value: 15, rank: 4, revealed: false },
            { text: "Quality time", value: 5, rank: 5, revealed: false }
        ]
    },
    {
        id: '3',
        question: "What's your partner's favorite way to show love?",
        answers: [
            { text: "Words of affirmation", value: 30, rank: 1, revealed: false },
            { text: "Acts of service", value: 25, rank: 2, revealed: false },
            { text: "Gifts", value: 20, rank: 3, revealed: false },
            { text: "Quality time", value: 15, rank: 4, revealed: false },
            { text: "Physical touch", value: 10, rank: 5, revealed: false }
        ]
    }
];

const IntimacyFeud: React.FC = () => {
    const navigation = useAppNavigation();
    const route = useRoute();
    
    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading: sessionLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    // Game state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
    const [strikes, setStrikes] = useState(0);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [guesses, setGuesses] = useState<string[]>([]);

    const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
    const totalPoints = currentQuestion?.answers.reduce((sum, ans) => sum + ans.value, 0) || 0;
    const earnedPoints = currentQuestion?.answers
        .filter(ans => revealedAnswers.has(ans.text))
        .reduce((sum, ans) => sum + ans.value, 0) || 0;

    // Check guess
    const makeGuess = (guess: string) => {
        if (!guess.trim()) return;

        const normalizedGuess = guess.toLowerCase().trim();
        
        // Check if already guessed
        if (guesses.includes(normalizedGuess)) {
            Alert.alert('Already Guessed', 'You already tried that answer!');
            return;
        }

        setGuesses([...guesses, normalizedGuess]);

        // Find matching answer
        const match = currentQuestion?.answers.find(ans => 
            ans.text.toLowerCase().includes(normalizedGuess) ||
            normalizedGuess.includes(ans.text.toLowerCase())
        );

        if (match && !revealedAnswers.has(match.text)) {
            // Correct guess
            const newRevealed = new Set(revealedAnswers);
            newRevealed.add(match.text);
            setRevealedAnswers(newRevealed);
            
            // Update score
            const newScore = score + match.value;
            setScore(newScore);

            // Save to backend
            updateScore(newScore, false, [
                { 
                    questionId: currentQuestion.id,
                    guess: match.text,
                    points: match.value,
                    correct: true
                }
            ]);

            // Check if all answers found
            if (newRevealed.size === currentQuestion.answers.length) {
                setTimeout(() => nextQuestion(), ANIMATIONS.duration.slow * 3);
            }
        } else {
            // Wrong guess - add strike
            const newStrikes = strikes + 1;
            setStrikes(newStrikes);
            
            if (newStrikes >= 3) {
                // Too many strikes, move to next question
                Alert.alert(
                    'Three Strikes!',
                    'Moving to next question...',
                    [{ text: 'OK', onPress: () => nextQuestion() }]
                );
            } else {
                Alert.alert(
                    'Survey Says...',
                    `❌ Not on the board! ${3 - newStrikes} strikes remaining.`,
                    [{ text: 'Try Again' }]
                );
            }
        }
    };

    // Next question
    const nextQuestion = async () => {
        if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setRevealedAnswers(new Set());
            setStrikes(0);
            setGuesses([]);
        } else {
            finishGame();
        }
    };

    // Finish game
    const finishGame = async () => {
        setGameCompleted(true);
        
        // Calculate badge
        let badge = 'Feud Fighter';
        if (score >= 200) badge = 'Survey Champion';
        else if (score >= 150) badge = 'Top Answer';
        else if (score >= 100) badge = 'Board Clearer';

        await completeGame(score, [
            { completed: true, badge, questionsAnswered: SURVEY_QUESTIONS.length }
        ]);

        Alert.alert(
            'Game Complete! 🎉',
            `Final Score: ${score}/${MAX_SCORE}\nBadge: ${badge}`,
            [
                { 
                    text: 'View Results', 
                    onPress: () => navigation.navigate('GameResults', { 
                        score, 
                        badge,
                        gameId: GAME_ID,
                        sessionId: session?.id 
                    }) 
                },
                { text: 'Exit', onPress: () => navigation.goBack() }
            ]
        );
    };

    // Loading state
    if (sessionLoading) {
        return (
            <ScreenLayout showHeader={false} scrollable={false}>
                <View style={styles.loadingContainer}>
                    <Typography variant="h2" style={styles.loadingText}>Loading Survey...</Typography>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout 
            showHeader={false} 
            scrollable={true}
            contentStyle={styles.content}
        >
            {/* Header */}
            <View style={styles.header}>
                <Typography variant="h1" style={styles.title}>The Love Arcade</Typography>
                <Typography variant="h2" style={styles.subtitle}>Survey Says...</Typography>
                <View style={styles.scoreRow}>
                    <Typography variant="caption" style={styles.scoreText}>Score: {score}</Typography>
                    {isSyncing && <Typography variant="caption">💾</Typography>}
                </View>
            </View>

            {/* Question */}
            <GlassCard style={styles.questionCard}>
                <Typography variant="caption" style={styles.questionNumber}>
                    Question {currentQuestionIndex + 1} of {SURVEY_QUESTIONS.length}
                </Typography>
                <Typography variant="h2" style={styles.questionText}>{currentQuestion?.question}</Typography>
            </GlassCard>

            {/* Strikes */}
            <View style={styles.strikesContainer}>
                <Typography variant="body" style={styles.strikesLabel}>Strikes:</Typography>
                <View style={styles.strikesRow}>
                    {[1, 2, 3].map((strikeNum) => (
                        <View 
                            key={strikeNum}
                            style={[
                                styles.strike,
                                strikes >= strikeNum && styles.strikeActive
                            ]}
                        >
                            <Typography variant="body" style={styles.strikeText}>X</Typography>
                        </View>
                    ))}
                </View>
            </View>

            {/* Answer Board */}
            <View style={styles.boardContainer}>
                {currentQuestion?.answers.map((answer, index) => (
                    <View 
                        key={answer.text}
                        style={[
                            styles.answerRow,
                            revealedAnswers.has(answer.text) && styles.answerRevealed
                        ]}
                    >
                        <Typography variant="body" style={styles.answerNumber}>{index + 1}</Typography>
                        <View style={styles.answerContent}>
                            {revealedAnswers.has(answer.text) ? (
                                <>
                                    <Typography variant="body" style={styles.answerText}>{answer.text}</Typography>
                                    <Typography variant="caption" style={styles.answerValue}>{answer.value} pts</Typography>
                                </>
                            ) : (
                                <Typography variant="body" style={styles.hiddenText}>???</Typography>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            {/* Quick Guess Buttons */}
            <View style={styles.quickGuesses}>
                <Typography variant="caption" style={styles.guessLabel}>Quick Guesses:</Typography>
                <View style={styles.guessButtons}>
                    {['Time', 'Communication', 'Trust', 'Affection'].map((guess) => (
                        <SquishyButton
                            key={guess}
                            onPress={() => makeGuess(guess)}
                            style={styles.guessButton}
                        >
                            <Typography variant="body" style={styles.guessButtonText}>{guess}</Typography>
                        </SquishyButton>
                    ))}
                </View>
            </View>

            {/* Skip Button */}
            <SquishyButton onPress={nextQuestion} style={styles.skipButton}>
                <Typography variant="body" style={styles.skipText}>Skip Question →</Typography>
            </SquishyButton>

            {/* Session Info */}
            {session && (
                <Typography variant="caption" style={styles.sessionInfo}>
                    Session: {session.id.slice(0, 8)}...
                </Typography>
            )}
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: SPACING.screenPadding,
        paddingTop: SPACING.xlarge,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.large,
    },
    title: {
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginTop: SPACING.tiny,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.small,
    },
    scoreText: {
        color: COLORS.gradientStart,
    },
    questionCard: {
        padding: SPACING.large,
        marginBottom: SPACING.medium,
    },
    questionNumber: {
        color: COLORS.textHint,
        marginBottom: SPACING.small,
    },
    questionText: {
        color: COLORS.textPrimary,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.headerMedium,
    },
    strikesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.large,
    },
    strikesLabel: {
        color: COLORS.textPrimary,
        marginRight: SPACING.small,
    },
    strikesRow: {
        flexDirection: 'row',
        gap: SPACING.small,
    },
    strike: {
        width: 35,
        height: 35,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.backgroundInput,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
    },
    strikeActive: {
        backgroundColor: COLORS.error,
        borderColor: COLORS.error,
    },
    strikeText: {
        color: COLORS.textPrimary,
        fontWeight: 'bold',
    },
    boardContainer: {
        marginBottom: SPACING.large,
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.medium,
        marginBottom: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
    },
    answerRevealed: {
        backgroundColor: 'rgba(51, 222, 165, 0.1)',
        borderColor: COLORS.success,
    },
    answerNumber: {
        width: 30,
        color: COLORS.textHint,
        fontWeight: 'bold',
    },
    answerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    answerText: {
        color: COLORS.textPrimary,
        flex: 1,
    },
    answerValue: {
        color: COLORS.success,
        fontWeight: 'bold',
    },
    hiddenText: {
        color: COLORS.textDisabled,
    },
    quickGuesses: {
        marginBottom: SPACING.large,
    },
    guessLabel: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.small,
    },
    guessButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.small,
    },
    guessButton: {
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        paddingVertical: SPACING.small,
        paddingHorizontal: SPACING.regular,
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 1,
        borderColor: COLORS.gradientStart,
    },
    guessButtonText: {
        color: COLORS.textPrimary,
    },
    skipButton: {
        alignSelf: 'center',
        paddingVertical: SPACING.medium,
        paddingHorizontal: SPACING.xlarge,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.round,
        marginBottom: SPACING.small,
    },
    skipText: {
        color: COLORS.textSecondary,
    },
    sessionInfo: {
        color: COLORS.textDisabled,
        textAlign: 'center',
        marginTop: SPACING.xlarge,
    },
});

export default IntimacyFeud;
