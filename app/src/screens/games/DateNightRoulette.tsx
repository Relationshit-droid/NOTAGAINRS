import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';

import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Game Constants
const GAME_ID = 'date-night-roulette';
const CATEGORY_ID = 'romance-hub';
const MAX_SCORE = 150;

const DATE_IDEAS = [
    "Picnic in the car at 8 p.m.",
    "Cook dinner together blindfolded",
    "Stargazing with hot chocolate",
    "Indoor camping with blanket fort",
    "Sunrise breakfast at the beach",
    "DIY spa night at home",
    "Explore a new neighborhood",
    "Game night with snacks",
    "Movie marathon with themes",
    "Dance party in the living room"
];

export default function DateNightRoulette({ navigation }: any) {
    const [currentIdea, setCurrentIdea] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    useEffect(() => {
        speakMarcie("You got 'Blanket fort + pineapple pizza debate'? Destiny.");
    }, []);

    const spinWheel = async () => {
        if (isSpinning) return;
        
        setIsSpinning(true);
        setCurrentIdea(null);
        
        // Simulate wheel spinning
        let spins = 0;
        const spinInterval = setInterval(() => {
            setCurrentIdea(DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)]);
            spins++;
            
            if (spins > 15) {
                clearInterval(spinInterval);
                const finalIdea = DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)];
                setCurrentIdea(finalIdea);
                setIsSpinning(false);
                
                // Update score for spinning
                updateScore(30);
            }
        }, 100);
    };

    const markAsDone = async () => {
        if (gameCompleted) return;
        setGameCompleted(true);
        
        const finalScore = currentIdea ? 40 : 0;
        await completeGame(finalScore, [{
            completed: true,
            dateIdea: currentIdea,
            postedProof: false
        }]);
        
        speakMarcie("Date night planned! Can't wait to hear how it goes.");
    };

    // Loading state
    if (isLoading) {
        return (
            <ScreenLayout showHeader={false} scrollable={true}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.gradientStart} />
                    <Typography variant="h2" style={styles.loadingText}>Loading Date Night Roulette...</Typography>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Sync Indicator */}
                {isSyncing && (
                    <View style={styles.syncIndicator}>
                        <Typography variant="caption">💾 Saving...</Typography>
                    </View>
                )}

                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
                        <Typography variant="body">Back</Typography>
                    </SquishyButton>
                    <Typography variant="h1" style={styles.title}>Date Night Roulette</Typography>
                </View>

                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Typography variant="sass">Spin the wheel for unique date night ideas! Strengthen your connection with creative activities.</Typography>
                    </View>
                </View>

                <GlassCard style={styles.card}>
                    <Typography variant="h2" style={styles.cardTitle}>Type: Wheel spin + filters</Typography>
                    <Typography variant="body">Mechanics: Spin → "Picnic in car, 8 p.m., only songs from 2007."</Typography>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Typography variant="h2" style={styles.cardTitle}>Scoring</Typography>
                    <Typography variant="body">
                        ✅ Did it = +30{'\n'}
                        ✅ Posted proof (no faces) = +10
                    </Typography>
                </GlassCard>

                {/* Wheel Result Display */}
                {currentIdea && (
                    <GlassCard style={styles.resultCard}>
                        <Typography variant="caption" style={styles.resultLabel}>Your Date Night:</Typography>
                        <Typography variant="h2" style={styles.resultText}>{currentIdea}</Typography>
                    </GlassCard>
                )}

                <View style={styles.actionArea}>
                    <SquishyButton 
                        onPress={spinWheel} 
                        style={[styles.playBtn, isSpinning && styles.spinningBtn]} 
                        disabled={isSpinning}
                    >
                        <Typography variant="h2" color={COLORS.textPrimary}>
                            {isSpinning ? 'Spinning...' : 'Spin Wheel'}
                        </Typography>
                    </SquishyButton>
                    
                    {currentIdea && !isSpinning && (
                        <SquishyButton 
                            onPress={markAsDone} 
                            style={styles.doneBtn}
                            disabled={gameCompleted}
                        >
                            <Typography variant="h2" color={COLORS.textPrimary}>
                                {gameCompleted ? 'Completed!' : 'Mark as Done'}
                            </Typography>
                        </SquishyButton>
                    )}
                </View>

                {session && (
                    <Typography variant="caption" style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
                )}
            </ScrollView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    content: { 
        padding: SPACING.screenPadding, 
        gap: SPACING.regular 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.small, 
        marginTop: SPACING.regular 
    },
    backBtn: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.small, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large 
    },
    title: { 
        flex: 1,
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        marginBottom: SPACING.regular
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.xxlarge,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
    card: { 
        padding: SPACING.cardPadding,
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    cardTitle: {
        marginBottom: SPACING.small,
    },
    resultCard: {
        padding: SPACING.cardPadding,
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 2,
        borderColor: COLORS.gradientStart,
        alignItems: 'center',
    },
    resultLabel: {
        marginBottom: SPACING.small,
        opacity: 0.7,
    },
    resultText: {
        textAlign: 'center',
        color: COLORS.gradientStart,
    },
    actionArea: { 
        marginTop: SPACING.xxlarge, 
        alignItems: 'center',
        gap: SPACING.regular,
    },
    playBtn: { 
        width: '80%', 
        ...SHADOWS.buttonGlow,
    },
    spinningBtn: {
        opacity: 0.7,
    },
    doneBtn: {
        width: '80%',
        backgroundColor: COLORS.success,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: SPACING.regular,
    },
    syncIndicator: {
        position: 'absolute',
        top: SPACING.regular,
        right: SPACING.regular,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
        zIndex: 1,
    },
    sessionInfo: {
        textAlign: 'center',
        marginTop: SPACING.xlarge,
        opacity: 0.3,
    },
});
