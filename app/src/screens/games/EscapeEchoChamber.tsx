/**
 * Escape from the Echo Chamber - Love Arcade Game
 * A digital escape room where couples break repetitive patterns
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Saves progress after each puzzle
 * - Completes game and submits final score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';

// Theme
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

// Game Constants
const GAME_ID = 'echo-chamber-escape';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 100;

// Puzzle Data
interface Puzzle {
    id: number;
    title: string;
    description: string;
    hint: string;
    answers: string[];
    marcieSuccess: string;
    marcieFail: string;
}

const PUZZLES: Puzzle[] = [
    {
        id: 1,
        title: 'The Administrative Love',
        description: 'Shared Terminal: SYSTEM_SCALE: [?] locations | MANAGEMENT: [?] app\n\nFind the number that represents your shared routine.',
        hint: 'How many locations do you manage together? Think about your shared life admin.',
        answers: ['3', 'three', 'notes', 'admin', 'routine'],
        marcieSuccess: "File 1 Decrypted. It wasn't love, it was administration.",
        marcieFail: "Access Denied. The echo grows louder."
    },
    {
        id: 2,
        title: 'The Soulmate Script',
        description: "Audio Clip: 'You're my soulmate.' (Click the empty box?)\n\nWhat word completes this overused phrase?",
        hint: 'What script are you reading from?',
        answers: ['script', 'box', 'delete', 'romance', 'movie'],
        marcieSuccess: "Soulmate script deleted. Next.",
        marcieFail: "Still reading from the same tired script."
    },
    {
        id: 3,
        title: 'The Death of Routine',
        description: "Obituary: 'Expired due to...'\n\nWhat kills relationships slowly?",
        hint: 'What dies when you stop paying attention?',
        answers: ['neglect', 'routine', 'boredom', 'sameness', 'predictability'],
        marcieSuccess: "Obituary written. Now write a new story.",
        marcieFail: "Can't see what's right in front of you."
    }
];

const EscapeEchoChamber: React.FC = () => {
    const navigation = useNavigation();
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
    const [currentStage, setCurrentStage] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const currentPuzzle = PUZZLES[currentStage];

    // Check answer
    const checkAnswer = async () => {
        if (!userInput.trim()) return;

        const normalizedInput = userInput.toLowerCase().trim();
        const isCorrect = currentPuzzle.answers.some(
            answer => normalizedInput.includes(answer.toLowerCase())
        );

        if (isCorrect) {
            // Calculate points (fewer attempts = more points)
            const basePoints = 33;
            const attemptBonus = Math.max(0, (3 - attempts) * 5);
            const puzzleScore = basePoints + attemptBonus;
            
            const newScore = score + puzzleScore;
            setScore(newScore);
            setCompletedPuzzles([...completedPuzzles, currentPuzzle.id]);
            
            // Save to backend
            await updateScore(newScore, false, [
                { 
                    puzzleId: currentPuzzle.id, 
                    solved: true, 
                    attempts: attempts + 1,
                    points: puzzleScore 
                }
            ]);

            // Show success
            Alert.alert(
                'Puzzle Solved! 🔓',
                currentPuzzle.marcieSuccess,
                [
                    { 
                        text: currentStage < PUZZLES.length - 1 ? 'Next Puzzle' : 'Finish', 
                        onPress: () => {
                            if (currentStage < PUZZLES.length - 1) {
                                setCurrentStage(prev => prev + 1);
                                setUserInput('');
                                setAttempts(0);
                                setShowHint(false);
                            } else {
                                finishGame(newScore);
                            }
                        }
                    }
                ]
            );
        } else {
            setAttempts(prev => prev + 1);
            Alert.alert(
                'Incorrect',
                currentPuzzle.marcieFail,
                [{ text: 'Try Again' }]
            );
        }
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        // Calculate badge
        let badge = 'Echo Survivor';
        if (finalScore >= 95) badge = 'Pattern Breaker';
        else if (finalScore >= 85) badge = 'Echo Escapee';
        else if (finalScore >= 70) badge = 'Routine Rebel';

        // Complete in backend
        await completeGame(finalScore, [
            { completed: true, badge, puzzlesSolved: PUZZLES.length }
        ]);

        Alert.alert(
            'Echo Chamber Breached! 🎉',
            `Final Score: ${finalScore}/${MAX_SCORE}\nBadge: ${badge}\n\nYou broke the script!`,
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

    // Reset game
    const resetGame = () => {
        setCurrentStage(0);
        setUserInput('');
        setScore(0);
        setAttempts(0);
        setCompletedPuzzles([]);
        setGameCompleted(false);
        setShowHint(false);
    };

    // Loading state
    if (sessionLoading) {
        return (
            <ScreenLayout showHeader={false} scrollable={true}>
                <View style={styles.container}>
                    <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.background}>
                        <Typography variant="h2" center style={styles.loadingText}>Entering the Echo Chamber...</Typography>
                    </LinearGradient>
                </View>
            </ScreenLayout>
        );
    }

    // Calculate progress percentage
    const progressPercentage = ((currentStage + 1) / PUZZLES.length) * 100;

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <View style={styles.container}>
                <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.background}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Typography variant="h1" center>The Love Arcade</Typography>
                            <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>
                            <Typography variant="h3" center style={styles.gameTitle}>Escape the Echo Chamber</Typography>
                            <Typography variant="body" center style={styles.subtitle}>Break the love script</Typography>
                            <View style={styles.progressContainer}>
                                <Typography variant="caption">
                                    Puzzle {currentStage + 1} of {PUZZLES.length}
                                </Typography>
                                <View style={styles.scoreRow}>
                                    <Typography variant="caption" style={styles.scoreText}>Score: {score}</Typography>
                                    {isSyncing && <Typography variant="caption">💾</Typography>}
                                </View>
                            </View>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { width: `${progressPercentage}%` }
                                ]} 
                            />
                        </View>

                        {/* Puzzle Card */}
                        <GlassCard style={styles.puzzleCard}>
                            <Typography variant="h3">{currentPuzzle?.title}</Typography>
                            <Typography variant="body" style={styles.puzzleDescription}>{currentPuzzle?.description}</Typography>
                            
                            {attempts > 1 && (
                                <SquishyButton 
                                    variant="ghost"
                                    onPress={() => setShowHint(!showHint)}
                                    style={styles.hintButton}
                                >
                                    <Typography variant="button">
                                        {showHint ? 'Hide Hint' : 'Need a Hint?'}
                                    </Typography>
                                </SquishyButton>
                            )}
                            
                            {showHint && (
                                <GlassCard style={styles.hintBox}>
                                    <Typography variant="body">💡 {currentPuzzle?.hint}</Typography>
                                </GlassCard>
                            )}
                        </GlassCard>

                        {/* Input Area */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter solution..."
                                placeholderTextColor={COLORS.textHint}
                                value={userInput}
                                onChangeText={setUserInput}
                                onSubmitEditing={checkAnswer}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            
                            <SquishyButton 
                                onPress={checkAnswer}
                                disabled={!userInput.trim()}
                            >
                                <Typography variant="button">Decrypt File</Typography>
                            </SquishyButton>
                        </View>

                        {/* Attempts Counter */}
                        <Typography variant="caption" center style={styles.attemptsText}>
                            Attempts: {attempts} {attempts > 0 && '(Fewer attempts = more points!)'}
                        </Typography>

                        {/* Reset Button */}
                        <SquishyButton variant="ghost" onPress={resetGame} style={styles.resetButton}>
                            <Typography variant="button">Start Over</Typography>
                        </SquishyButton>

                        {/* Session Info */}
                        {session && (
                            <Typography variant="caption" center style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
                        )}
                    </ScrollView>
                </LinearGradient>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.screenPadding,
        paddingTop: SPACING.xxxlarge,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.large,
    },
    gameTitle: {
        marginTop: SPACING.regular,
    },
    subtitle: {
        marginTop: SPACING.small,
        fontStyle: 'italic',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: SPACING.regular,
        paddingHorizontal: SPACING.small,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        color: COLORS.vibrantPink,
    },
    progressBar: {
        height: 4,
        backgroundColor: COLORS.divider,
        borderRadius: BORDER_RADIUS.small,
        marginBottom: SPACING.xlarge,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.vibrantPink,
        borderRadius: BORDER_RADIUS.small,
    },
    puzzleCard: {
        marginBottom: SPACING.large,
    },
    puzzleDescription: {
        marginTop: SPACING.regular,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
    },
    hintButton: {
        marginTop: SPACING.regular,
        alignSelf: 'flex-start',
    },
    hintBox: {
        marginTop: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
    },
    inputContainer: {
        marginBottom: SPACING.regular,
    },
    input: {
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.input,
        padding: SPACING.regular,
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.fontSize.bodyLarge,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        marginBottom: SPACING.regular,
    },
    attemptsText: {
        marginBottom: SPACING.large,
    },
    resetButton: {
        alignSelf: 'center',
    },
    loadingText: {
        marginTop: 100,
    },
    sessionInfo: {
        marginTop: SPACING.xlarge,
    },
});

export default EscapeEchoChamber;
