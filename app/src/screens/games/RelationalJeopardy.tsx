/**
 * Relational Jeopardy - Love Arcade Game
 * Classic Jeopardy format with relationship-themed categories
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks scores and revealed answers
 * - Completes game with final score
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppNavigation } from '../../hooks/useAppNavigation';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';

// Theme
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

const { width, height } = Dimensions.get('window');

// Game Constants
const GAME_ID = 'relational-jeopardy';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 2000;

// Jeopardy Categories
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

const JEOPARDY_CATEGORIES: Category[] = [
    {
        name: "Accountability Plans",
        clues: [
            { value: 100, question: "This involves taking responsibility for your actions", answer: "What is ownership?", revealed: false },
            { value: 200, question: "This is the first step to repairing trust", answer: "What is acknowledgment?", revealed: false },
            { value: 300, question: "This describes making amends for harm caused", answer: "What is restitution?", revealed: false },
            { value: 400, question: "This is about changing harmful patterns", answer: "What is behavioral change?", revealed: false, dailyDouble: true },
            { value: 500, question: "This requires consistent follow-through over time", answer: "What is reliability?", revealed: false }
        ]
    },
    {
        name: "Redefinition",
        clues: [
            { value: 100, question: "This is the process of changing how you see your relationship", answer: "What is reframing?", revealed: false },
            { value: 200, question: "This involves creating new narratives about past events", answer: "What is rewriting history?", revealed: false },
            { value: 300, question: "This means establishing new expectations", answer: "What is setting boundaries?", revealed: false },
            { value: 400, question: "This is about building new traditions", answer: "What is creating rituals?", revealed: false },
            { value: 500, question: "This involves developing a shared vision", answer: "What is co-creating the future?", revealed: false, dailyDouble: true }
        ]
    },
    {
        name: "Integration",
        clues: [
            { value: 100, question: "This refers to incorporating new behaviors", answer: "What is assimilation?", revealed: false },
            { value: 200, question: "This involves blending old and new selves", answer: "What is synthesis?", revealed: false },
            { value: 300, question: "This is about maintaining growth over time", answer: "What is sustainability?", revealed: false, dailyDouble: true },
            { value: 400, question: "This involves bringing insights into daily life", answer: "What is application?", revealed: false },
            { value: 500, question: "This is the ultimate goal of relationship growth", answer: "What is transformation?", revealed: false }
        ]
    },
    {
        name: "Communication",
        clues: [
            { value: 100, question: "This type of listening involves fully focusing on your partner", answer: "What is active listening?", revealed: false },
            { value: 200, question: "This phrase structure helps express feelings without blame", answer: "What is I feel statements?", revealed: false },
            { value: 300, question: "This is the ability to understand your partner's perspective", answer: "What is empathy?", revealed: false },
            { value: 400, question: "This communication style avoids conflict but builds resentment", answer: "What is passive-aggressive?", revealed: false },
            { value: 500, question: "This Gottman term describes criticism, contempt, defensiveness, and stonewalling", answer: "What are the Four Horsemen?", revealed: false }
        ]
    },
    {
        name: "Intimacy",
        clues: [
            { value: 100, question: "This type of intimacy involves emotional closeness", answer: "What is emotional intimacy?", revealed: false },
            { value: 200, question: "This is the foundation of physical intimacy", answer: "What is consent?", revealed: false },
            { value: 300, question: "This practice involves being fully present with your partner", answer: "What is mindfulness?", revealed: false },
            { value: 400, question: "This term describes the fear of emotional closeness", answer: "What is intimacy avoidance?", revealed: false },
            { value: 500, question: "This concept involves sharing your authentic self", answer: "What is vulnerability?", revealed: false }
        ]
    }
];

const RelationalJeopardy: React.FC = () => {
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
    const [categories, setCategories] = useState<Category[]>(JEOPARDY_CATEGORIES);
    const [score, setScore] = useState(0);
    const [selectedClue, setSelectedClue] = useState<{catIndex: number, clueIndex: number} | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [dailyDoubleWager, setDailyDoubleWager] = useState(0);
    const [showDailyDouble, setShowDailyDouble] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [answeredClues, setAnsweredClues] = useState(0);

    const totalClues = categories.reduce((sum, cat) => sum + cat.clues.length, 0);

    // Select a clue
    const selectClue = (catIndex: number, clueIndex: number) => {
        const clue = categories[catIndex].clues[clueIndex];
        if (clue.revealed) return;

        setSelectedClue({ catIndex, clueIndex });
        
        if (clue.dailyDouble) {
            setShowDailyDouble(true);
            setDailyDoubleWager(0);
        }
    };

    // Submit answer
    const submitAnswer = async () => {
        if (!selectedClue) return;

        const { catIndex, clueIndex } = selectedClue;
        const clue = categories[catIndex].clues[clueIndex];
        
        let points = clue.value;
        
        // Daily double logic
        if (clue.dailyDouble && showDailyDouble) {
            points = dailyDoubleWager;
            setShowDailyDouble(false);
        }

        // Check answer (simplified - contains key words)
        const normalizedUser = userAnswer.toLowerCase().trim();
        const normalizedCorrect = clue.answer.toLowerCase().replace('what is ', '').replace('?', '').trim();
        
        const isCorrect = normalizedUser.includes(normalizedCorrect) || 
                         normalizedCorrect.includes(normalizedUser) ||
                         normalizedUser.length > 5 && normalizedCorrect.split(' ').some(word => 
                             normalizedUser.includes(word) && word.length > 3
                         );

        // Update categories
        const newCategories = [...categories];
        newCategories[catIndex].clues[clueIndex].revealed = true;
        setCategories(newCategories);

        if (isCorrect) {
            const newScore = score + points;
            setScore(newScore);
            
            await updateScore(newScore, false, [{
                category: categories[catIndex].name,
                value: points,
                correct: true
            }]);

            Alert.alert('Correct!', `+${points} points`, [{ text: 'Continue' }]);
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

        setAnsweredClues(prev => prev + 1);
        setSelectedClue(null);
        setUserAnswer('');

        // Check if game complete
        if (answeredClues + 1 >= totalClues) {
            finishGame(isCorrect ? score + points : Math.max(0, score - points));
        }
    };

    // Skip clue
    const skipClue = async () => {
        if (!selectedClue) return;
        
        const { catIndex, clueIndex } = selectedClue;
        const newCategories = [...categories];
        newCategories[catIndex].clues[clueIndex].revealed = true;
        setCategories(newCategories);
        
        setAnsweredClues(prev => prev + 1);
        setSelectedClue(null);
        setUserAnswer('');
        setShowDailyDouble(false);

        if (answeredClues + 1 >= totalClues) {
            finishGame(score);
        }
    };

    // Finish game
    const finishGame = async (finalScore: number) => {
        setGameCompleted(true);
        
        let badge = 'Jeopardy Novice';
        if (finalScore >= 1500) badge = 'Jeopardy Champion';
        else if (finalScore >= 1000) badge = 'Quiz Master';
        else if (finalScore >= 500) badge = 'Knowledge Seeker';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            categoriesPlayed: categories.length
        }]);

        Alert.alert(
            'Game Over! 🎉',
            `Final Score: ${finalScore}/${MAX_SCORE}\nBadge: ${badge}`,
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
                    <Typography variant="h2">Loading Jeopardy...</Typography>
                </View>
            </ScreenLayout>
        );
    }

    // Clue selected view
    if (selectedClue) {
        const clue = categories[selectedClue.catIndex].clues[selectedClue.clueIndex];
        
        return (
            <ScreenLayout showHeader={false}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Daily Double */}
                    {showDailyDouble && (
                        <View style={styles.dailyDoubleBanner}>
                            <Typography variant="h1" style={styles.dailyDoubleText}>🎯 DAILY DOUBLE!</Typography>
                            <Typography variant="body" style={styles.wagerText}>Current Score: {score}</Typography>
                            <TextInput
                                style={styles.wagerInput}
                                placeholder="Enter wager..."
                                placeholderTextColor={COLORS.textHint}
                                keyboardType="numeric"
                                value={dailyDoubleWager.toString()}
                                onChangeText={(text) => setDailyDoubleWager(Math.min(score, parseInt(text) || 0))}
                            />
                        </View>
                    )}

                    {/* Question */}
                    <GlassCard style={styles.questionCard}>
                        <Typography variant="caption" style={styles.categoryLabel}>{categories[selectedClue.catIndex].name}</Typography>
                        <Typography variant="h2" style={styles.valueLabel}>${clue.value}</Typography>
                        <Typography variant="body" center>{clue.question}</Typography>
                    </GlassCard>

                    {/* Answer Input */}
                    <TextInput
                        style={styles.answerInput}
                        placeholder="What is...?"
                        placeholderTextColor={COLORS.textHint}
                        value={userAnswer}
                        onChangeText={setUserAnswer}
                        autoFocus
                    />

                    {/* Buttons */}
                    <SquishyButton 
                        onPress={submitAnswer}
                        disabled={!userAnswer.trim() || (showDailyDouble && dailyDoubleWager <= 0)}
                        variant="primary"
                        size="large"
                        style={styles.submitButton}
                    >
                        <Typography variant="button">Submit Answer</Typography>
                    </SquishyButton>

                    <SquishyButton 
                        onPress={skipClue}
                        variant="ghost"
                        size="medium"
                    >
                        <Typography variant="caption" style={styles.skipText}>Skip (-${clue.value})</Typography>
                    </SquishyButton>
                </ScrollView>
            </ScreenLayout>
        );
    }

    // Game board view
    return (
        <ScreenLayout showHeader={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Typography variant="h1" center>Relational Jeopardy!</Typography>
                    <View style={styles.scoreRow}>
                        <Typography variant="h2" style={styles.scoreText}>Score: ${score}</Typography>
                        {isSyncing && <Typography variant="caption">💾</Typography>}
                    </View>
                    <Typography variant="caption" style={styles.progressText}>
                        {answeredClues} / {totalClues} clues
                    </Typography>
                </View>

                {/* Game Board */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.board}>
                        {categories.map((category, catIndex) => (
                            <View key={category.name} style={styles.categoryColumn}>
                                {/* Category Header */}
                                <View style={styles.categoryHeader}>
                                    <Typography variant="caption" center style={styles.categoryName}>{category.name}</Typography>
                                </View>
                                
                                {/* Clues */}
                                {category.clues.map((clue, clueIndex) => (
                                    <TouchableOpacity
                                        key={clue.value}
                                        style={[
                                            styles.clueCell,
                                            clue.revealed && styles.clueRevealed,
                                            clue.dailyDouble && !clue.revealed && styles.dailyDoubleCell
                                        ]}
                                        onPress={() => selectClue(catIndex, clueIndex)}
                                        disabled={clue.revealed}
                                    >
                                        <Typography variant="h3" style={[
                                            styles.clueValue,
                                            clue.revealed && styles.clueValueRevealed
                                        ]}>
                                            {clue.revealed ? '—' : `$${clue.value}`}
                                        </Typography>
                                        {clue.dailyDouble && !clue.revealed && (
                                            <Typography variant="caption" style={styles.ddBadge}>DD</Typography>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>

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
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.regular,
    },
    scoreText: {
        color: COLORS.brightYellow,
        marginRight: SPACING.small,
    },
    progressText: {
        color: COLORS.textHint,
        marginTop: SPACING.small,
    },
    board: {
        flexDirection: 'row',
        paddingVertical: SPACING.regular,
    },
    categoryColumn: {
        width: 140,
        marginRight: SPACING.regular,
    },
    categoryHeader: {
        backgroundColor: '#060ce9',
        padding: SPACING.regular,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.small,
        marginBottom: SPACING.small,
    },
    categoryName: {
        color: COLORS.textPrimary,
        textTransform: 'uppercase',
    },
    clueCell: {
        backgroundColor: '#060ce9',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.small,
        marginBottom: SPACING.small,
    },
    clueRevealed: {
        backgroundColor: 'rgba(6, 12, 233, 0.3)',
    },
    dailyDoubleCell: {
        borderWidth: 2,
        borderColor: COLORS.brightYellow,
    },
    clueValue: {
        color: COLORS.brightYellow,
    },
    clueValueRevealed: {
        color: COLORS.textHint,
    },
    ddBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: COLORS.brightYellow,
        color: COLORS.backgroundPrimary,
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    },
    dailyDoubleBanner: {
        backgroundColor: COLORS.brightYellow,
        padding: SPACING.xlarge,
        borderRadius: BORDER_RADIUS.large,
        marginBottom: SPACING.xlarge,
        alignItems: 'center',
    },
    dailyDoubleText: {
        color: COLORS.backgroundPrimary,
    },
    wagerText: {
        color: COLORS.backgroundPrimary,
        marginTop: SPACING.regular,
    },
    wagerInput: {
        backgroundColor: COLORS.textPrimary,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.medium,
        width: 150,
        textAlign: 'center',
        marginTop: SPACING.regular,
        color: COLORS.backgroundPrimary,
    },
    questionCard: {
        padding: SPACING.cardPadding,
        marginBottom: SPACING.xlarge,
        minHeight: 200,
        justifyContent: 'center',
    },
    categoryLabel: {
        color: COLORS.textHint,
        marginBottom: SPACING.small,
    },
    valueLabel: {
        color: COLORS.brightYellow,
        marginBottom: SPACING.regular,
    },
    answerInput: {
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xlarge,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    submitButton: {
        marginBottom: SPACING.regular,
    },
    skipText: {
        color: COLORS.textHint,
    },
    sessionInfo: {
        color: COLORS.textHint,
        marginTop: SPACING.xlarge,
    },
});

export default RelationalJeopardy;
