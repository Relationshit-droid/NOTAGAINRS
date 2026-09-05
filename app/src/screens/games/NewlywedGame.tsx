/**
 * Newlywed Game - Game Show Category
 * Couples predict each other's answers to intimate questions
 *
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks predictions and matches
 * - Completes game with sync score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAppNavigation } from '../../hooks/useAppNavigation';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { ScreenLayout, GlassCard, Text, Typography, SquishyButton } from '../../components/ui';

// Theme
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

// Game Constants
const GAME_ID = 'newlywed-game';
const CATEGORY_ID = 'game-show';
const MAX_SCORE = 300;

// Question Rounds
interface Option {
    id: string;
    text: string;
}

interface Round {
    question: string;
    options: Option[];
}

const ROUNDS: Round[] = [
    {
        question: "When your partner thinks about your relationship challenges, which causes more stress right now?",
        options: [
            { id: 'A', text: "Communication issues" },
            { id: 'B', text: "Time/Schedule conflicts" },
            { id: 'C', text: "External stress (work/family)" },
            { id: 'D', text: "Intimacy/Connection" }
        ]
    },
    {
        question: "Finish this sentence from your partner's perspective: 'What makes me feel most loved is...'",
        options: [
            { id: 'A', text: "Physical affection" },
            { id: 'B', text: "Quality time together" },
            { id: 'C', text: "Words of affirmation" },
            { id: 'D', text: "Acts of service" }
        ]
    },
    {
        question: "What's your partner's biggest fear about your future together?",
        options: [
            { id: 'A', text: "Growing apart over time" },
            { id: 'B', text: "Financial struggles" },
            { id: 'C', text: "Losing the spark/passion" },
            { id: 'D', text: "Not achieving shared goals" }
        ]
    }
];

const NewlywedGame: React.FC = () => {
    const navigation = useAppNavigation();
    
    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading: sessionLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    // Game state
    const [round, setRound] = useState(0);
    const [myAnswer, setMyAnswer] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    const currentRound = ROUNDS[round];

    // Submit answers
    const submit = async () => {
        if (!myAnswer || !prediction) {
            Alert.alert("Required", "Please answer for yourself AND predict your partner's answer.");
            return;
        }

        const isMatch = myAnswer === prediction;
        const roundScore = isMatch ? 100 : 50;
        const newScore = score + roundScore;
        setScore(newScore);
        
        if (isMatch) {
            setMatches(prev => prev + 1);
        }

        // Save to backend
        await updateScore(newScore, false, [{
            round: round + 1,
            myAnswer,
            prediction,
            match: isMatch,
            roundScore
        }]);

        const feedback = isMatch 
            ? "💕 Perfect Match! You're in sync!" 
            : "🤔 Good try! Keep learning about each other.";

        Alert.alert(
            `Round ${round + 1} Complete`,
            `${feedback}\n\n+${roundScore} points`,
            [
                {
                    text: round < ROUNDS.length - 1 ? 'Next Question' : 'Finish',
                    onPress: () => {
                        if (round < ROUNDS.length - 1) {
                            setRound(prev => prev + 1);
                            setMyAnswer(null);
                            setPrediction(null);
                        } else {
                            finishGame(newScore);
                        }
                    }
                }
            ]
        );
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        let badge = 'Strangers';
        if (matches === 3) badge = 'Soulmates';
        else if (matches === 2) badge = 'In Sync';
        else if (matches === 1) badge = 'Getting There';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            matches,
            totalRounds: ROUNDS.length
        }]);

        Alert.alert(
            'Heart Sync Complete! 💕',
            `Final Score: ${finalScore}/${MAX_SCORE}\nMatches: ${matches}/${ROUNDS.length}\nBadge: ${badge}`,
            [
                { 
                    text: 'View Results', 
                    onPress: () => navigation.navigate('GameResults', { 
                        score: finalScore, 
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
            <ScreenLayout showHeader={false}>
                <View style={styles.centerContent}>
                    <Typography variant="h2">Loading Questions...</Typography>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Typography variant="h1" center>The Newlywed Game</Typography>
                    <Typography variant="h2" center style={styles.subtitle}>How well do you know each other?</Typography>
                    <View style={styles.scoreRow}>
                        <Typography variant="h3" style={styles.scoreText}>Score: {score}</Typography>
                        {isSyncing && <Typography variant="caption">💾</Typography>}
                    </View>
                    <Typography variant="caption" center style={styles.roundText}>
                        Question {round + 1} of {ROUNDS.length} • Matches: {matches}
                    </Typography>
                </View>

                {/* Question Card */}
                <GlassCard style={styles.questionCard}>
                    <Typography variant="body" center>{currentRound.question}</Typography>
                </GlassCard>

                {/* Your Answer */}
                <Typography variant="h3" style={styles.sectionTitle}>Your Answer:</Typography>
                <View style={styles.optionsContainer}>
                    {currentRound.options.map((option) => (
                        <SquishyButton
                            key={`my-${option.id}`}
                            onPress={() => setMyAnswer(option.id)}
                            variant={myAnswer === option.id ? 'primary' : 'secondary'}
                            size="medium"
                            style={styles.optionButton}
                        >
                            <Typography variant="body">{option.text}</Typography>
                        </SquishyButton>
                    ))}
                </View>

                {/* Your Prediction */}
                <Typography variant="h3" style={styles.sectionTitle}>Predict Your Partner's Answer:</Typography>
                <View style={styles.optionsContainer}>
                    {currentRound.options.map((option) => (
                        <SquishyButton
                            key={`pred-${option.id}`}
                            onPress={() => setPrediction(option.id)}
                            variant={prediction === option.id ? 'primary' : 'ghost'}
                            size="medium"
                            style={styles.predictionButton}
                        >
                            <Typography variant="body">{option.text}</Typography>
                        </SquishyButton>
                    ))}
                </View>

                {/* Submit */}
                <SquishyButton
                    onPress={submit}
                    disabled={!myAnswer || !prediction}
                    variant="primary"
                    size="large"
                    style={styles.submitButton}
                >
                    <Typography variant="button">Reveal Match</Typography>
                </SquishyButton>

                {/* Session Info */}
                {session && (
                    <Typography variant="caption" center style={styles.sessionInfo}>
                        Session: {session.id.slice(0, 8)}...
                    </Typography>
                )}
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: SPACING.screenPadding,
        paddingTop: SPACING.xlarge,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xlarge,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginTop: SPACING.small,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.regular,
    },
    scoreText: {
        color: COLORS.vibrantPink,
        marginRight: SPACING.small,
    },
    roundText: {
        color: COLORS.textHint,
        marginTop: SPACING.small,
    },
    questionCard: {
        padding: SPACING.cardPadding,
        marginBottom: SPACING.xlarge,
    },
    sectionTitle: {
        color: COLORS.brightYellow,
        marginBottom: SPACING.regular,
    },
    optionsContainer: {
        marginBottom: SPACING.xlarge,
        gap: SPACING.small,
    },
    optionButton: {
        marginBottom: SPACING.small,
    },
    predictionButton: {
        marginBottom: SPACING.small,
    },
    submitButton: {
        marginTop: SPACING.regular,
    },
    sessionInfo: {
        color: COLORS.textHint,
        marginTop: SPACING.xlarge,
    },
});

export default NewlywedGame;
