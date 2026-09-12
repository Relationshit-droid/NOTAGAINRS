/**
 * Chopped: Family Forge Edition - Love Arcade Game
 * Based on Chopped cooking show - couples craft responses to family challenges
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks ingredient selections
 * - Completes game with final score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';

import { useRoute } from '@react-navigation/native';
import { useAppNavigation } from '../../hooks/useAppNavigation';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';

// Theme
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

// Game Constants
const GAME_ID = 'family-forge';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 500;

// Challenge Baskets
interface Ingredient {
    id: string;
    text: string;
    points: number;
}

interface Basket {
    name: string;
    scenario: string;
    baseIngredients: Ingredient[];
    seasoningIngredients: Ingredient[];
}

const BASKETS: Basket[] = [
    {
        name: "The Sleep Training Standoff",
        scenario: "Disagreement on sleep training + Resentment + Exhaustion",
        baseIngredients: [
            { id: 'A', text: "Let's research together tonight.", points: 100 },
            { id: 'B', text: "I'll take tonight. You decide tomorrow.", points: 80 },
            { id: 'C', text: "Can we table this and just hold each other?", points: 60 }
        ],
        seasoningIngredients: [
            { id: 'A', text: "Hand on arm: 'I trust your instinct.'", points: 100 },
            { id: 'B', text: "Let's ask pediatrician — no blame.", points: 80 },
            { id: 'C', text: "Laugh: 'Remember when we thought this would be hard?'", points: 60 }
        ]
    },
    {
        name: "The In-Law Invasion",
        scenario: "Unsolicited advice + Holiday stress + Different traditions",
        baseIngredients: [
            { id: 'A', text: "We present a united front, then discuss privately.", points: 100 },
            { id: 'B', text: "You handle your parents, I'll handle mine.", points: 70 },
            { id: 'C', text: "Let's create our own holiday ritual.", points: 90 }
        ],
        seasoningIngredients: [
            { id: 'A', text: "Thank them, then do what works for us.", points: 80 },
            { id: 'B', text: "Humor: 'We're still figuring it out too!'", points: 100 },
            { id: 'C', text: "Validate: 'They mean well, but...'", points: 60 }
        ]
    },
    {
        name: "The Discipline Divide",
        scenario: "Different parenting styles + Child pushing boundaries + Tired",
        baseIngredients: [
            { id: 'A', text: "Let's discuss our non-negotiables.", points: 100 },
            { id: 'B', text: "Tag team: I'll step in when you need a break.", points: 90 },
            { id: 'C', text: "Consistency first, perfection never.", points: 80 }
        ],
        seasoningIngredients: [
            { id: 'A', text: "Lower voice, not standards.", points: 100 },
            { id: 'B', text: "Model the behavior we want.", points: 90 },
            { id: 'C', text: "Repair after rupture.", points: 80 }
        ]
    }
];

const ChoppedFamily: React.FC = () => {
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
    const [round, setRound] = useState(0);
    const [baseChoice, setBaseChoice] = useState<string | null>(null);
    const [seasoningChoice, setSeasoningChoice] = useState<string | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    const currentBasket = BASKETS[round];

    // Calculate round score
    const calculateRoundScore = () => {
        if (!baseChoice || !seasoningChoice) return 0;
        const base = currentBasket.baseIngredients.find(b => b.id === baseChoice);
        const seasoning = currentBasket.seasoningIngredients.find(s => s.id === seasoningChoice);
        return (base?.points || 0) + (seasoning?.points || 0);
    };

    // Submit dish for the round
    const submitDish = async () => {
        if (!baseChoice || !seasoningChoice) return;

        const roundScore = calculateRoundScore();
        const newTotal = totalScore + roundScore;
        setTotalScore(newTotal);

        // Update backend score
        await updateScore(roundScore);

        if (round < BASKETS.length - 1) {
            // Next round
            setRound(prev => prev + 1);
            setBaseChoice(null);
            setSeasoningChoice(null);
        } else {
            // Game complete
            setGameComplete(true);
            await completeGame(newTotal, { 
                roundsCompleted: BASKETS.length,
                finalScore: newTotal 
            });
            
            Alert.alert(
                'Service Complete!',
                `Final Score: ${newTotal}/${MAX_SCORE}\n\n${newTotal >= 400 ? 'Perfect plating! You two are culinary soulmates.' : 'Good effort! Even chopped contestants get a second chance.'}`,
                [{ text: 'Back to Kitchen', onPress: () => navigation.goBack() }]
            );
        }
    };

    if (sessionLoading) {
        return (
            <ScreenLayout showHeader={true} scrollable={true}>
                <Typography variant="h1" center style={styles.loadingText}>Heating up the kitchen...</Typography>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={true} scrollable={true}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Typography variant="h1" center style={styles.gameTitle}>Chopped: Family Forge</Typography>
                        <Typography variant="body" center style={styles.subtitleText}>
                            Craft the perfect response to family challenges
                        </Typography>
                    </View>

                    {/* Score Display */}
                    <View style={styles.scoreRow}>
                        <Typography variant="body">Total Score:</Typography>
                        <Typography variant="h2" style={styles.scoreText}>{totalScore}</Typography>
                    </View>
                    <Typography variant="caption" center style={styles.roundText}>
                        Round {round + 1} of {BASKETS.length}
                    </Typography>

                    {/* Current Basket */}
                    <GlassCard style={styles.basketCard}>
                        <View style={styles.basketHeader}>
                            <Typography variant="h2" style={styles.basketEmoji}>🧺</Typography>
                            <Typography variant="h2">{currentBasket.name}</Typography>
                        </View>
                        <Typography variant="body" style={styles.scenario}>
                            Scenario: {currentBasket.scenario}
                        </Typography>
                    </GlassCard>

                    {/* Base Ingredients */}
                    <Typography variant="h3" style={styles.sectionTitle}>Choose Your Base Ingredient:</Typography>
                    <View style={styles.ingredientsContainer}>
                        {currentBasket.baseIngredients.map((ing) => (
                            <SquishyButton
                                key={ing.id}
                                onPress={() => setBaseChoice(ing.id)}
                                style={[
                                    styles.ingredientButton,
                                    baseChoice === ing.id && styles.selectedIngredient
                                ]}
                            >
                                <Typography 
                                    variant="body" 
                                    style={[
                                        styles.ingredientText,
                                        baseChoice === ing.id && styles.selectedText
                                    ]}
                                >
                                    {ing.text}
                                </Typography>
                                <Typography variant="caption" style={styles.pointsText}>
                                    {ing.points} points
                                </Typography>
                            </SquishyButton>
                        ))}
                    </View>

                    {/* Seasoning */}
                    <Typography variant="h3" style={styles.sectionTitle}>Choose Your Seasoning:</Typography>
                    <View style={styles.ingredientsContainer}>
                        {currentBasket.seasoningIngredients.map((ing) => (
                            <SquishyButton
                                key={ing.id}
                                onPress={() => setSeasoningChoice(ing.id)}
                                style={[
                                    styles.ingredientButton,
                                    seasoningChoice === ing.id && styles.selectedSeasoning
                                ]}
                            >
                                <Typography 
                                    variant="body"
                                    style={[
                                        styles.ingredientText,
                                        seasoningChoice === ing.id && styles.selectedText
                                    ]}
                                >
                                    {ing.text}
                                </Typography>
                                <Typography variant="caption" style={styles.pointsText}>
                                    {ing.points} points
                                </Typography>
                            </SquishyButton>
                        ))}
                    </View>

                    {/* Preview */}
                    {baseChoice && seasoningChoice && (
                        <GlassCard style={styles.previewCard}>
                            <Typography variant="h3" style={styles.previewTitle}>Your Dish Preview:</Typography>
                            <Typography variant="body" style={styles.previewText}>
                                {currentBasket.baseIngredients.find(b => b.id === baseChoice)?.text}
                            </Typography>
                            <Typography variant="h2" center style={styles.previewPlus}>+</Typography>
                            <Typography variant="body" style={styles.previewText}>
                                {currentBasket.seasoningIngredients.find(s => s.id === seasoningChoice)?.text}
                            </Typography>
                            <Typography variant="caption" center style={styles.previewScore}>
                                Estimated: {calculateRoundScore()} points
                            </Typography>
                        </GlassCard>
                    )}

                    {/* Submit Button */}
                    <SquishyButton
                        onPress={submitDish}
                        disabled={!baseChoice || !seasoningChoice}
                        style={[styles.submitButton, (!baseChoice || !seasoningChoice) && styles.disabledButton]}
                    >
                        <Typography variant="button" style={styles.buttonText}>
                            {round < BASKETS.length - 1 ? 'Plate the Dish' : 'Complete Service'}
                        </Typography>
                    </SquishyButton>

                    {/* Session Info */}
                    {session && (
                        <Typography variant="caption" center style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
                    )}
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    scrollContent: {
        padding: SPACING.regular,
        paddingTop: SPACING.xlarge,
    },
    gameTitle: {
        marginBottom: SPACING.small,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.regular,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.regular,
    },
    subtitleText: {
        color: COLORS.textSecondary,
        marginTop: SPACING.tiny,
        fontStyle: 'italic',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.small,
    },
    scoreText: {
        color: COLORS.gradientStart,
        fontWeight: 'bold',
    },
    roundText: {
        color: COLORS.textSecondary,
        marginTop: SPACING.tiny,
    },
    loadingText: {
        marginTop: SPACING.xxxlarge,
        marginBottom: SPACING.regular,
    },
    basketCard: {
        padding: SPACING.regular,
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(139, 69, 19, 0.3)',
        borderColor: '#8B4513',
        borderWidth: 2,
    },
    basketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.small,
    },
    basketEmoji: {
        marginRight: SPACING.small,
    },
    scenario: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    sectionTitle: {
        color: COLORS.brightYellow,
        marginBottom: SPACING.regular,
    },
    ingredientsContainer: {
        marginBottom: SPACING.regular,
    },
    ingredientButton: {
        marginBottom: SPACING.small,
    },
    selectedIngredient: {
        borderColor: COLORS.gradientStart,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
    },
    selectedSeasoning: {
        borderColor: COLORS.brightYellow,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
    },
    ingredientText: {
        color: COLORS.textPrimary,
        marginBottom: SPACING.micro,
    },
    selectedText: {
        fontWeight: 'bold',
    },
    pointsText: {
        color: COLORS.textHint,
    },
    previewCard: {
        padding: SPACING.regular,
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(51, 222, 165, 0.1)',
    },
    previewTitle: {
        color: COLORS.success,
        marginBottom: SPACING.small,
    },
    previewText: {
        color: COLORS.textPrimary,
        fontStyle: 'italic',
    },
    previewPlus: {
        color: COLORS.success,
        marginVertical: SPACING.tiny,
    },
    previewScore: {
        color: COLORS.brightYellow,
        marginTop: SPACING.small,
    },
    submitButton: {
        marginTop: SPACING.small,
    },
    disabledButton: {
        opacity: 0.5,
    },
    sessionInfo: {
        color: COLORS.textHint,
        marginTop: SPACING.regular,
    },
    buttonText: {
        color: COLORS.textPrimary,
    },
});

export default ChoppedFamily;
