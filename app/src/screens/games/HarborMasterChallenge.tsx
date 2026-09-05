/**
 * Harbor Master's Challenge - Love Arcade Game
 * BPD/Emotional Regulation focused cooperative game
 * Couples learn to navigate emotional storms together
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks alignment choices
 * - Completes game with final score
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Typography, ScreenLayout, SquishyButton } from '../../components/ui';

// Theme
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Game Constants
const GAME_ID = 'harbor-storm';
const CATEGORY_ID = 'love-arcade';
const MAX_SCORE = 400;

// Scenarios
interface Choice {
    id: string;
    text: string;
    healthy: boolean;
    points: number;
}

interface Scenario {
    id: number;
    title: string;
    desc: string;
    partner1Choice: string;
    partner2Choice: string;
    choices: Choice[];
    lesson: string;
}

const SCENARIOS: Scenario[] = [
    {
        id: 1,
        title: "The Job Loss Storm",
        desc: "A major stressor hits (job loss). The storm clouds gather. Partner 1 is triggered and dysregulated.",
        partner1Choice: "SSP (Storm-Sensitive Partner) Response:",
        partner2Choice: "SHP (Storm-Helping Partner) Response:",
        choices: [
            { id: 'A', text: "Use TIPP skills (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation)", healthy: true, points: 100 },
            { id: 'B', text: "Withdraw and isolate", healthy: false, points: 20 },
            { id: 'C', text: "Blame external circumstances", healthy: false, points: 30 },
            { id: 'D', text: "Ask for a 20-minute break to self-regulate", healthy: true, points: 90 }
        ],
        lesson: "Co-regulation requires one partner to stay anchored while the other regulates."
    },
    {
        id: 2,
        title: "The Abandonment Trigger",
        desc: "Partner seems distant. Old wounds of abandonment surface. The emotional waves are rising.",
        partner1Choice: "SSP Response:",
        partner2Choice: "SHP Response:",
        choices: [
            { id: 'A', text: "Check the facts before reacting", healthy: true, points: 100 },
            { id: 'B', text: "Accuse and demand reassurance", healthy: false, points: 10 },
            { id: 'C', text: "Validate: 'I see you're hurting'", healthy: true, points: 95 },
            { id: 'D', text: "Get defensive and withdraw", healthy: false, points: 15 }
        ],
        lesson: "Validation doesn't mean agreement. It means 'I see you.'"
    },
    {
        id: 3,
        title: "The Shame Spiral",
        desc: "A mistake was made. Shame threatens to capsize the relationship boat.",
        partner1Choice: "SSP Response:",
        partner2Choice: "SHP Response:",
        choices: [
            { id: 'A', text: "Radical acceptance of the mistake", healthy: true, points: 100 },
            { id: 'B', text: "Self-punishment and rumination", healthy: false, points: 20 },
            { id: 'C', text: "Offer repair without defensiveness", healthy: true, points: 90 },
            { id: 'D', text: "Minimize or deflect", healthy: false, points: 25 }
        ],
        lesson: "Shame can't survive empathy. Repair requires both partners."
    }
];

const HarborMasterChallenge: React.FC = () => {
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
    const [round, setRound] = useState(0);
    const [p1Choice, setP1] = useState<string | null>(null);
    const [p2Choice, setP2] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const currentScenario = SCENARIOS[round];

    // Calculate alignment
    const calculateAlignment = () => {
        if (!p1Choice || !p2Choice) return { score: 0, message: '' };

        const choice1 = currentScenario.choices.find(c => c.id === p1Choice);
        const choice2 = currentScenario.choices.find(c => c.id === p2Choice);

        let roundScore = (choice1?.points || 0) + (choice2?.points || 0);
        let message = '';

        if (choice1?.healthy && choice2?.healthy) {
            roundScore += 100; // Co-regulation bonus
            message = "Perfect alignment! You're sailing together.";
        } else if (choice1?.healthy || choice2?.healthy) {
            roundScore += 50; // One partner anchored
            message = "Good! One partner stayed regulated.";
        } else {
            message = "Stormy seas. Both partners need regulation.";
        }

        return { score: roundScore, message };
    };

    // Reveal choices
    const revealChoices = async () => {
        if (!p1Choice || !p2Choice) {
            Alert.alert("Required", "Both partners must choose a response.");
            return;
        }

        setShowResults(true);
        const { score: roundScore, message } = calculateAlignment();
        const newScore = score + roundScore;
        setScore(newScore);

        // Save to backend
        await updateScore(newScore, false, [{
            scenario: currentScenario.id,
            p1Choice,
            p2Choice,
            roundScore,
            alignment: message
        }]);

        Alert.alert(
            `Scenario ${round + 1} Results`,
            `${message}\n\nRound Score: ${roundScore} points`,
            [
                {
                    text: round < SCENARIOS.length - 1 ? 'Next Scenario' : 'Finish',
                    onPress: () => {
                        if (round < SCENARIOS.length - 1) {
                            setRound(prev => prev + 1);
                            setP1(null);
                            setP2(null);
                            setShowResults(false);
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
        
        let badge = 'Deckhand';
        if (finalScore >= 1000) badge = 'Harbor Master';
        else if (finalScore >= 750) badge = 'First Mate';
        else if (finalScore >= 500) badge = 'Able Seaman';

        await completeGame(finalScore, [{
            completed: true,
            badge,
            scenariosCompleted: SCENARIOS.length
        }]);

        Alert.alert(
            'Harbor Secure! ⚓',
            `Final Score: ${finalScore}/${MAX_SCORE * SCENARIOS.length}\nBadge: ${badge}\n\nYou've earned the Golden Compass!`,
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

    // Get choice details
    const getChoiceDetails = (choiceId: string) => {
        return currentScenario.choices.find(c => c.id === choiceId);
    };

    // Loading state
    if (sessionLoading) {
        return (
            <ScreenLayout showHeader={false} scrollable={false}>
                <View style={styles.loadingContainer}>
                    <Typography variant="h2" style={styles.loadingText}>Entering the Harbor...</Typography>
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
                <Typography variant="h2" style={styles.subtitle}>Navigate emotional storms together</Typography>
                <View style={styles.scoreRow}>
                    <Typography variant="caption" style={styles.scoreText}>Score: {score}</Typography>
                    {isSyncing && <Typography variant="caption">💾</Typography>}
                </View>
                <Typography variant="caption" style={styles.roundText}>
                    Scenario {round + 1} of {SCENARIOS.length}
                </Typography>
            </View>

            {/* Scenario Card */}
            <GlassCard style={styles.scenarioCard}>
                <Typography variant="h2" style={styles.scenarioTitle}>{currentScenario.title}</Typography>
                <Typography variant="body" style={styles.scenarioDesc}>{currentScenario.desc}</Typography>
            </GlassCard>

            {/* Partner 1 Choices */}
            <Typography variant="h3" style={styles.sectionTitle}>🌊 {currentScenario.partner1Choice}</Typography>
            <View style={styles.choicesContainer}>
                {currentScenario.choices.map((choice) => (
                    <SquishyButton
                        key={`p1-${choice.id}`}
                        onPress={() => !showResults && setP1(choice.id)}
                        disabled={showResults}
                        style={[
                            styles.choiceButton,
                            p1Choice === choice.id && styles.selectedChoice,
                            showResults && getChoiceDetails(p1Choice || '')?.healthy && p1Choice === choice.id && styles.healthyChoice,
                            showResults && !getChoiceDetails(p1Choice || '')?.healthy && p1Choice === choice.id && styles.unhealthyChoice
                        ]}
                    >
                        <Typography variant="body" style={[
                            styles.choiceText,
                            p1Choice === choice.id && styles.selectedText
                        ]}>
                            {choice.text}
                        </Typography>
                        {showResults && p1Choice === choice.id && (
                            <Typography variant="caption" style={styles.pointsBadge}>+{choice.points}</Typography>
                        )}
                    </SquishyButton>
                ))}
            </View>

            {/* Partner 2 Choices */}
            <Typography variant="h3" style={styles.sectionTitle}>⚓ {currentScenario.partner2Choice}</Typography>
            <View style={styles.choicesContainer}>
                {currentScenario.choices.map((choice) => (
                    <SquishyButton
                        key={`p2-${choice.id}`}
                        onPress={() => !showResults && setP2(choice.id)}
                        disabled={showResults}
                        style={[
                            styles.choiceButton,
                            p2Choice === choice.id && styles.selectedChoice,
                            showResults && getChoiceDetails(p2Choice || '')?.healthy && p2Choice === choice.id && styles.healthyChoice,
                            showResults && !getChoiceDetails(p2Choice || '')?.healthy && p2Choice === choice.id && styles.unhealthyChoice
                        ]}
                    >
                        <Typography variant="body" style={[
                            styles.choiceText,
                            p2Choice === choice.id && styles.selectedText
                        ]}>
                            {choice.text}
                        </Typography>
                        {showResults && p2Choice === choice.id && (
                            <Typography variant="caption" style={styles.pointsBadge}>+{choice.points}</Typography>
                        )}
                    </SquishyButton>
                ))}
            </View>

            {/* Alignment Meter */}
            {showResults && (
                <GlassCard style={styles.resultCard}>
                    <Typography variant="h3" style={styles.lessonTitle}>💡 Lesson:</Typography>
                    <Typography variant="body" style={styles.lessonText}>{currentScenario.lesson}</Typography>
                </GlassCard>
            )}

            {/* Submit Button */}
            {!showResults && (
                <SquishyButton
                    onPress={revealChoices}
                    disabled={!p1Choice || !p2Choice}
                    style={[styles.submitButton, (!p1Choice || !p2Choice) && styles.disabledButton]}
                >
                    <Typography variant="h3">Reveal Choices</Typography>
                </SquishyButton>
            )}

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
        color: COLORS.info,
    },
    roundText: {
        color: COLORS.textHint,
        marginTop: SPACING.tiny,
    },
    scenarioCard: {
        padding: SPACING.large,
        marginBottom: SPACING.large,
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        borderColor: COLORS.info,
        borderWidth: 1,
    },
    scenarioTitle: {
        color: COLORS.info,
        marginBottom: SPACING.small,
    },
    scenarioDesc: {
        color: COLORS.textPrimary,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
    },
    sectionTitle: {
        color: COLORS.textPrimary,
        marginBottom: SPACING.medium,
    },
    choicesContainer: {
        marginBottom: SPACING.large,
    },
    choiceButton: {
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.medium,
        borderRadius: BORDER_RADIUS.large,
        marginBottom: SPACING.small,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedChoice: {
        borderColor: COLORS.info,
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
    },
    healthyChoice: {
        borderColor: COLORS.success,
        backgroundColor: 'rgba(51, 222, 165, 0.2)',
    },
    unhealthyChoice: {
        borderColor: COLORS.error,
        backgroundColor: 'rgba(225, 22, 55, 0.2)',
    },
    choiceText: {
        color: COLORS.textPrimary,
    },
    selectedText: {
        fontWeight: 'bold',
    },
    pointsBadge: {
        position: 'absolute',
        right: SPACING.small,
        top: SPACING.small,
        backgroundColor: COLORS.brightYellow,
        color: COLORS.backgroundPrimary,
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    },
    resultCard: {
        padding: SPACING.medium,
        marginBottom: SPACING.large,
        backgroundColor: 'rgba(255, 239, 31, 0.1)',
    },
    lessonTitle: {
        color: COLORS.brightYellow,
        marginBottom: SPACING.small,
    },
    lessonText: {
        color: COLORS.textPrimary,
        fontStyle: 'italic',
    },
    submitButton: {
        backgroundColor: COLORS.info,
        paddingVertical: SPACING.medium,
        borderRadius: BORDER_RADIUS.large,
        alignItems: 'center',
        marginTop: SPACING.small,
    },
    disabledButton: {
        opacity: 0.5,
    },
    sessionInfo: {
        color: COLORS.textDisabled,
        textAlign: 'center',
        marginTop: SPACING.xlarge,
    },
});

export default HarborMasterChallenge;
