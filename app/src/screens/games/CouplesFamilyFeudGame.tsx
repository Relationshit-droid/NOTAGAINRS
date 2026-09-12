/**
 * Couples Family Feud - Game Show Category
 * Survey-style game where couples guess top answers
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks revealed answers and strikes
 * - Completes game with final score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Typography } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { ScreenLayout, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Game Constants
const GAME_ID = 'family-feud-couples';
const CATEGORY_ID = 'game-show';

// Survey Data
interface SurveyAnswer {
    text: string;
    points: number;
    revealed: boolean;
}

interface SurveyQuestion {
    question: string;
    answers: SurveyAnswer[];
}

const SURVEY_DATA: SurveyQuestion[] = [
    {
        question: "What's the most annoying thing your partner does?",
        answers: [
            { text: "Leaves towels on the floor", points: 42, revealed: false },
            { text: "Snores loudly", points: 28, revealed: false },
            { text: "Forgets important dates", points: 15, revealed: false },
            { text: "Takes too long to get ready", points: 10, revealed: false },
            { text: "Doesn't replace toilet paper", points: 5, revealed: false }
        ]
    },
    {
        question: "What's your partner's favorite thing about you?",
        answers: [
            { text: "Sense of humor", points: 35, revealed: false },
            { text: "Kindness", points: 25, revealed: false },
            { text: "Physical appearance", points: 20, revealed: false },
            { text: "Intelligence", points: 15, revealed: false },
            { text: "Cooking skills", points: 5, revealed: false }
        ]
    },
    {
        question: "Name something couples fight about most",
        answers: [
            { text: "Money/Finances", points: 45, revealed: false },
            { text: "Household chores", points: 25, revealed: false },
            { text: "Time spent together", points: 15, revealed: false },
            { text: "In-laws/Family", points: 10, revealed: false },
            { text: "Social media/Phone use", points: 5, revealed: false }
        ]
    }
];

const CouplesFamilyFeudGame: React.FC = () => {
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
    const [currentRound, setCurrentRound] = useState(0);
    const [survey, setSurvey] = useState<SurveyQuestion>(SURVEY_DATA[0]);
    const [strikes, setStrikes] = useState(0);
    const [score, setScore] = useState(0);
    const [userGuess, setUserGuess] = useState('');
    const [revealedCount, setRevealedCount] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Submit guess
    const submitGuess = async () => {
        if (!userGuess.trim()) return;

        const normalizedGuess = userGuess.toLowerCase().trim();
        
        // Find matching answer
        const matchIndex = survey.answers.findIndex(ans => 
            ans.text.toLowerCase().includes(normalizedGuess) ||
            normalizedGuess.includes(ans.text.toLowerCase())
        );

        if (matchIndex !== -1 && !survey.answers[matchIndex].revealed) {
            // Correct guess
            const newAnswers = [...survey.answers];
            newAnswers[matchIndex].revealed = true;
            setSurvey({ ...survey, answers: newAnswers });
            
            const points = survey.answers[matchIndex].points;
            const newScore = score + points;
            setScore(newScore);
            setRevealedCount(prev => prev + 1);

            await updateScore(newScore, false, [{
                round: currentRound + 1,
                guess: survey.answers[matchIndex].text,
                points
            }]);

            Alert.alert(
                'Survey Says...',
                `#${matchIndex + 1} Answer! +${points} points`,
                [{ text: 'Great!' }]
            );

            // Check if all answers revealed
            if (revealedCount + 1 >= survey.answers.length) {
                setTimeout(() => nextRound(), 1000);
            }
        } else {
            // Wrong guess - add strike
            const newStrikes = strikes + 1;
            setStrikes(newStrikes);

            if (newStrikes >= 3) {
                Alert.alert(
                    'Three Strikes!',
                    'Moving to next question...',
                    [{ text: 'OK', onPress: () => nextRound() }]
                );
            } else {
                Alert.alert(
                    'Survey Says...',
                    `❌ Not on the board! ${3 - newStrikes} strikes remaining.`,
                    [{ text: 'Try Again' }]
                );
            }
        }

        setUserGuess('');
    };

    // Next round
    const nextRound = () => {
        if (currentRound < SURVEY_DATA.length - 1) {
            const nextRoundIndex = currentRound + 1;
            setCurrentRound(nextRoundIndex);
            setSurvey(SURVEY_DATA[nextRoundIndex]);
            setStrikes(0);
            setRevealedCount(0);
        } else {
            finishGame();
        }
    };

    // Finish game
    const finishGame = async () => {
        setGameCompleted(true);
        
        let badge = 'Survey Participant';
        if (score >= 200) badge = 'Survey Champion';
        else if (score >= 150) badge = 'Top Answer';
        else if (score >= 100) badge = 'Good Guess';

        await completeGame(score, [{
            completed: true,
            badge,
            roundsCompleted: SURVEY_DATA.length
        }]);

        Alert.alert(
            'Game Over! 🎉',
            `Final Score: ${score}\nBadge: ${badge}`,
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
            <ScreenLayout showHeader={false} scrollable={true}>
                <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.richPlum]} style={styles.background}>
                    <Typography variant="h2" style={styles.loadingText}>Loading Survey...</Typography>
                </LinearGradient>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.richPlum]} style={styles.background} />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Typography variant="h1" style={styles.headerTitle}>Couples Family Feud</Typography>
                    <View style={styles.scoreRow}>
                        <Typography variant="h2" style={styles.scoreText}>Score: {score}</Typography>
                        {isSyncing && <Typography variant="caption">💾</Typography>}
                    </View>
                    <Typography variant="body">Round {currentRound + 1} of {SURVEY_DATA.length}</Typography>
                </View>

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
                                <Typography variant="h2" style={styles.strikeText}>X</Typography>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Question */}
                <GlassCard style={styles.questionContainer}>
                    <Typography variant="h2" style={styles.questionText}>{survey.question}</Typography>
                </GlassCard>

                {/* Answer Board */}
                <LinearGradient
                    colors={[COLORS.warmOrange, COLORS.brightYellow]}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={styles.board}
                >
                    {survey.answers.map((answer, index) => (
                        <View key={index} style={styles.answerRow}>
                            <Typography variant="h2" style={styles.answerRank}>{index + 1}</Typography>
                            {answer.revealed ? (
                                <>
                                    <Typography variant="body" style={styles.answerText}>{answer.text}</Typography>
                                    <Typography variant="h2" style={styles.answerPoints}>{answer.points}</Typography>
                                </>
                            ) : (
                                <View style={styles.hiddenAnswer}>
                                    <Typography variant="body" style={styles.hiddenText}>???</Typography>
                                </View>
                            )}
                        </View>
                    ))}
                </LinearGradient>

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Your Guess..." 
                        placeholderTextColor={COLORS.textHint}
                        value={userGuess}
                        onChangeText={setUserGuess}
                        onSubmitEditing={submitGuess}
                    />
                    <SquishyButton 
                        onPress={submitGuess}
                        disabled={!userGuess.trim()}
                    >
                        <Typography variant="button">SURVEY SAYS!</Typography>
                    </SquishyButton>
                </View>

                {/* Progress */}
                <Typography variant="caption" style={styles.progressText}>
                    {revealedCount} of {survey.answers.length} answers revealed
                </Typography>

                {session && (
                    <Typography variant="caption" style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
                )}
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    scrollContainer: {
        padding: SPACING.regular,
        paddingTop: SPACING.xxxlarge,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xlarge,
    },
    headerTitle: {
        marginBottom: SPACING.regular,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        color: COLORS.brightYellow,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: SPACING.xxxlarge * 3,
    },
    strikesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xlarge,
    },
    strikesLabel: {
        color: COLORS.textPrimary,
        marginRight: SPACING.regular,
    },
    strikesRow: {
        flexDirection: 'row',
        gap: SPACING.regular,
    },
    strike: {
        width: 40,
        height: 40,
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
    },
    questionContainer: {
        marginBottom: SPACING.xlarge,
        borderWidth: 2,
        borderColor: COLORS.warmOrange,
    },
    questionText: {
        textAlign: 'center',
    },
    board: {
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        marginBottom: SPACING.xlarge,
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundPrimary,
        padding: SPACING.regular,
        marginBottom: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    answerRank: {
        width: 30,
        color: COLORS.brightYellow,
    },
    answerText: {
        flex: 1,
        color: COLORS.textPrimary,
    },
    answerPoints: {
        color: COLORS.brightYellow,
    },
    hiddenAnswer: {
        flex: 1,
        alignItems: 'center',
    },
    hiddenText: {
        color: COLORS.textHint,
    },
    inputContainer: {
        marginBottom: SPACING.regular,
    },
    input: {
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.fontSize.bodyLarge,
        marginBottom: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    progressText: {
        textAlign: 'center',
        marginBottom: SPACING.regular,
    },
    sessionInfo: {
        textAlign: 'center',
        marginTop: SPACING.regular,
        opacity: 0.5,
    },
});

export default CouplesFamilyFeudGame;
