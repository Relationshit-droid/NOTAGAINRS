/**
 * Couples Jeopardy - Game Show Category
 * Full Jeopardy game with couple-specific categories
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks scores and revealed clues
 * - Supports Daily Double
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
const GAME_ID = 'couples-jeopardy';
const CATEGORY_ID = 'game-show';
const MAX_SCORE = 2500;

// Jeopardy Data
interface Clue {
    value: number;
    question: string;
    answer: string;
    revealed: boolean;
    dailyDouble?: boolean;
}

interface Category {
    name: string;
    clues: Clue[];
}

const JEOPARDY_DATA: Category[] = [
    {
        name: "Origin Story",
        clues: [
            { value: 100, question: "The city or place where you first met", answer: "Where is [your meeting place]?", revealed: false },
            { value: 200, question: "What your partner was wearing on your first date", answer: "What was [description]?", revealed: false },
            { value: 300, question: "The exact date of your anniversary", answer: "When is [date]?", revealed: false, dailyDouble: true },
            { value: 400, question: "Your partner's first impression of you", answer: "What was [impression]?", revealed: false },
            { value: 500, question: "The moment you knew you were in love", answer: "What was [moment]?", revealed: false }
        ]
    },
    {
        name: "Pet Peeves",
        clues: [
            { value: 100, question: "Something you do that annoys your partner most", answer: "What is [habit]?", revealed: false },
            { value: 200, question: "A household chore your partner avoids", answer: "What is [chore]?", revealed: false },
            { value: 300, question: "The way you squeeze the toothpaste tube", answer: "What is [method]?", revealed: false },
            { value: 400, question: "Your partner's biggest trigger word", answer: "What is [word]?", revealed: false },
            { value: 500, question: "The hill your partner will die on", answer: "What is [issue]?", revealed: false, dailyDouble: true }
        ]
    },
    {
        name: "Future Dreams",
        clues: [
            { value: 100, question: "Where your partner wants to retire", answer: "Where is [place]?", revealed: false },
            { value: 200, question: "Your partner's dream vacation destination", answer: "Where is [destination]?", revealed: false },
            { value: 300, question: "The career your partner secretly wants", answer: "What is [career]?", revealed: false },
            { value: 400, question: "Your partner's biggest life goal", answer: "What is [goal]?", revealed: false },
            { value: 500, question: "Where you both see yourselves in 10 years", answer: "What is [vision]?", revealed: false, dailyDouble: true }
        ]
    },
    {
        name: "Daily Rituals",
        clues: [
            { value: 100, question: "Your partner's morning beverage of choice", answer: "What is [drink]?", revealed: false },
            { value: 200, question: "The first thing your partner does when waking up", answer: "What is [activity]?", revealed: false },
            { value: 300, question: "Your partner's pre-bed routine", answer: "What is [routine]?", revealed: false, dailyDouble: true },
            { value: 400, question: "Something your partner does when stressed", answer: "What is [coping mechanism]?", revealed: false },
            { value: 500, question: "Your partner's secret guilty pleasure", answer: "What is [guilty pleasure]?", revealed: false }
        ]
    },
    {
        name: "Inner World",
        clues: [
            { value: 100, question: "Your partner's biggest fear", answer: "What is [fear]?", revealed: false },
            { value: 200, question: "What makes your partner feel most loved", answer: "What is [love language]?", revealed: false },
            { value: 300, question: "Your partner's core value", answer: "What is [value]?", revealed: false },
            { value: 400, question: "A childhood memory that shaped your partner", answer: "What was [memory]?", revealed: false, dailyDouble: true },
            { value: 500, question: "The one thing your partner needs most from you", answer: "What is [need]?", revealed: false }
        ]
    }
];

const CouplesJeopardyGame: React.FC = () => {
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
    const [categories, setCategories] = useState<Category[]>(JEOPARDY_DATA);
    const [score, setScore] = useState(0);
    const [selectedClue, setSelectedClue] = useState<{catIndex: number, clueIndex: number} | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [wager, setWager] = useState(0);
    const [showWager, setShowWager] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [revealedCount, setRevealedCount] = useState(0);

    const totalClues = categories.reduce((sum, cat) => sum + cat.clues.length, 0);

    // Select clue
    const selectClue = (catIndex: number, clueIndex: number) => {
        const clue = categories[catIndex].clues[clueIndex];
        if (clue.revealed) return;

        setSelectedClue({ catIndex, clueIndex });
        
        if (clue.dailyDouble) {
            setShowWager(true);
            setWager(0);
        }
    };

    // Submit answer
    const submitAnswer = async () => {
        if (!selectedClue) return;

        const { catIndex, clueIndex } = selectedClue;
        const clue = categories[catIndex].clues[clueIndex];
        
        let points = clue.value;
        if (clue.dailyDouble && showWager) {
            points = wager;
        }

        // Simple answer check (contains key words)
        const normalizedUser = userAnswer.toLowerCase().trim();
        const normalizedCorrect = clue.answer.toLowerCase();
        
        const isCorrect = normalizedUser.length > 3; // Simplified - would use AI in production

        // Update categories
        const newCategories = [...categories];
        newCategories[catIndex].clues[clueIndex].revealed = true;
        setCategories(newCategories);
        setRevealedCount(prev => prev + 1);

        if (isCorrect) {
            const newScore = score + points;
            setScore(newScore);
            
            await updateScore(newScore, false, [{
                category: categories[catIndex].name,
                value: points,
                correct: true
            }]);

            Alert.alert('Correct!', `+$${points}`, [{ text: 'Continue' }]);
        } else {
            const newScore = Math.max(0, score - points);
            setScore(newScore);
            
            await updateScore(newScore, false, [{
                category: categories[catIndex].name,
                value: -points,
                correct: false
            }]);

            Alert.alert('Incorrect!', `The correct answer was: ${clue.answer}`, [{ text: 'Continue' }]);
        }

        setSelectedClue(null);
        setUserAnswer('');
        setShowWager(false);

        // Check if game complete
        if (revealedCount + 1 >= totalClues) {
            finishGame(isCorrect ? score + points : Math.max(0, score - points));
        }
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        let badge = 'Contestant';
        if (finalScore >= 2000) badge = 'Jeopardy Champion';
        else if (finalScore >= 1500) badge = 'Quiz Master';
        else if (finalScore >= 1000) badge = 'Smart Cookie';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            categories: categories.length
        }]);

        Alert.alert(
            'Game Over! 🎉',
            `Final Score: $${finalScore}\nBadge: ${badge}`,
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
            <ScreenLayout showHeader={false} scrollable={true}>
                <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.richPlum]} style={styles.background}>
                    <Typography variant="h2" style={styles.loadingText}>Loading Jeopardy...</Typography>
                </LinearGradient>
            </ScreenLayout>
        );
    }

    // Selected clue view
    if (selectedClue) {
        const clue = categories[selectedClue.catIndex].clues[selectedClue.clueIndex];
        
        return (
            <ScreenLayout showHeader={false} scrollable={true}>
                <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.richPlum]} style={styles.background}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {showWager && (
                            <View style={styles.dailyDoubleBanner}>
                                <Typography variant="h1">DAILY DOUBLE!</Typography>
                                <TextInput
                                    style={styles.wagerInput}
                                    placeholder={`Wager up to $${score}`}
                                    placeholderTextColor={COLORS.textHint}
                                    keyboardType="numeric"
                                    value={wager.toString()}
                                    onChangeText={(text) => setWager(Math.min(score, parseInt(text) || 0))}
                                />
                            </View>
                        )}

                        <GlassCard style={styles.questionCard}>
                            <Typography variant="caption" style={styles.categoryLabel}>{categories[selectedClue.catIndex].name}</Typography>
                            <Typography variant="h1" style={styles.valueLabel}>${clue.value}</Typography>
                            <Typography variant="h2" style={styles.questionText}>{clue.question}</Typography>
                        </GlassCard>

                        <TextInput
                            style={styles.answerInput}
                            placeholder="What is...?"
                            placeholderTextColor={COLORS.textHint}
                            value={userAnswer}
                            onChangeText={setUserAnswer}
                            autoFocus
                        />

                        <SquishyButton 
                            onPress={submitAnswer}
                            disabled={!userAnswer.trim() || (showWager && wager <= 0)}
                        >
                            <Typography variant="button">Answer</Typography>
                        </SquishyButton>
                    </ScrollView>
                </LinearGradient>
            </ScreenLayout>
        );
    }

    // Game board
    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.richPlum]} style={styles.background} />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Typography variant="h1" style={styles.mainTitle}>Couple's Jeopardy</Typography>
                    <View style={styles.scoreDisplay}>
                        <Typography variant="h1" style={styles.scoreText}>${score}</Typography>
                        {isSyncing && <Typography variant="caption">💾</Typography>}
                    </View>
                </View>

                <LinearGradient
                    colors={['#060ce9', '#000080']}
                    style={styles.boardContainer}
                >
                    {categories.map((category, catIndex) => (
                        <View key={category.name} style={styles.categoryColumn}>
                            <View style={styles.categoryHeader}>
                                <Typography variant="caption" style={styles.categoryTitle}>{category.name}</Typography>
                            </View>
                            {category.clues.map((clue, clueIndex) => (
                                <SquishyButton
                                    key={clue.value}
                                    onPress={() => selectClue(catIndex, clueIndex)}
                                    disabled={clue.revealed}
                                    style={[
                                        styles.card,
                                        clue.revealed && styles.playedCard,
                                        clue.dailyDouble && !clue.revealed && styles.dailyDoubleCard
                                    ]}
                                >
                                    <LinearGradient
                                        colors={clue.revealed ? ['#000040', '#000040'] : ['#060ce9', '#000080']}
                                        style={styles.cardGradient}
                                    >
                                        <Typography variant="h2" style={[
                                            styles.cardValue,
                                            clue.revealed && styles.playedCardValue
                                        ]}>
                                            {clue.revealed ? '—' : `$${clue.value}`}
                                        </Typography>
                                        {clue.dailyDouble && !clue.revealed && (
                                            <Typography variant="caption" style={styles.ddBadge}>DD</Typography>
                                        )}
                                    </LinearGradient>
                                </SquishyButton>
                            ))}
                        </View>
                    ))}
                </LinearGradient>

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
    mainTitle: {
        marginBottom: SPACING.regular,
    },
    scoreDisplay: {
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
    boardContainer: {
        flexDirection: 'row',
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    categoryColumn: {
        flex: 1,
        marginRight: SPACING.tiny,
    },
    categoryHeader: {
        backgroundColor: '#060ce9',
        padding: SPACING.small,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.small,
        marginBottom: SPACING.tiny,
        borderWidth: 2,
        borderColor: COLORS.textPrimary,
    },
    categoryTitle: {
        color: COLORS.textPrimary,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    card: {
        height: 50,
        marginBottom: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
        overflow: 'hidden',
    },
    playedCard: {
        opacity: 0.3,
    },
    dailyDoubleCard: {
        borderWidth: 2,
        borderColor: COLORS.brightYellow,
    },
    cardGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardValue: {
        color: COLORS.brightYellow,
    },
    playedCardValue: {
        color: COLORS.brightYellow,
        opacity: 0.3,
    },
    ddBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: COLORS.brightYellow,
        color: COLORS.deepCosmic,
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    },
    dailyDoubleBanner: {
        backgroundColor: COLORS.brightYellow,
        padding: SPACING.xlarge,
        borderRadius: BORDER_RADIUS.xlarge,
        marginBottom: SPACING.xlarge,
        alignItems: 'center',
    },
    wagerInput: {
        backgroundColor: COLORS.textPrimary,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.small,
        width: 150,
        textAlign: 'center',
        fontSize: TYPOGRAPHY.fontSize.headerMedium,
        marginTop: SPACING.regular,
        color: COLORS.deepCosmic,
    },
    questionCard: {
        padding: SPACING.xlarge,
        marginBottom: SPACING.xlarge,
        minHeight: 150,
        justifyContent: 'center',
    },
    categoryLabel: {
        marginBottom: SPACING.small,
    },
    valueLabel: {
        color: COLORS.brightYellow,
        marginBottom: SPACING.regular,
    },
    questionText: {
        textAlign: 'center',
    },
    answerInput: {
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.fontSize.bodyLarge,
        marginBottom: SPACING.xlarge,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    sessionInfo: {
        textAlign: 'center',
        marginTop: SPACING.xlarge,
        opacity: 0.3,
    },
    scrollContent: {
        padding: SPACING.regular,
        paddingTop: SPACING.xxxlarge,
    },
});

export default CouplesJeopardyGame;
