import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { ScreenLayout, Typography, GlassCard } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, ANIMATIONS, GRADIENTS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

// Game Constants
const GAME_ID = 'six-second-kiss';
const CATEGORY_ID = 'romance-hub';
const MAX_SCORE = 100;

const SixSecondKissChallenge2 = () => {
    const [player1Hold, setPlayer1Hold] = useState(false);
    const [player2Hold, setPlayer2Hold] = useState(false);
    const [countdown, setCountdown] = useState(6);
    const [connection, setConnection] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const scaleAnim1 = useRef(new Animated.Value(1)).current;
    const scaleAnim2 = useRef(new Animated.Value(1)).current;

    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(c => Math.max(0, c - 0.01));
                setConnection(c => Math.min(100, c + 0.1));
            }, 10);
        } else if (countdown <= 0 && !gameCompleted) {
            setIsRunning(false);
            setCountdown(0);
            setConnection(100);
            finishGame();
        }
        return () => clearTimeout(timer);
    }, [isRunning, countdown, gameCompleted]);

    useEffect(() => {
        setIsRunning(player1Hold && player2Hold);
    }, [player1Hold, player2Hold]);

    useEffect(() => {
        Animated.spring(scaleAnim1, {
            toValue: player1Hold ? 0.95 : 1,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
        }).start();
    }, [player1Hold]);

    useEffect(() => {
        Animated.spring(scaleAnim2, {
            toValue: player2Hold ? 0.95 : 1,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
        }).start();
    }, [player2Hold]);

    // Update score during gameplay
    useEffect(() => {
        if (connection > 0 && !gameCompleted && session) {
            const score = Math.floor((connection / 100) * MAX_SCORE);
            updateScore(score);
        }
    }, [connection, gameCompleted, session]);

    const finishGame = async () => {
        if (gameCompleted) return;
        setGameCompleted(true);
        
        const finalScore = Math.floor((connection / 100) * MAX_SCORE);
        await completeGame(finalScore, [{
            completed: true,
            connectionStrength: connection,
            timeElapsed: 6 - countdown
        }]);
    };

    const PlayerTouchPoint = ({ player, onHold, isHolding, scaleAnim }: { 
        player: string; 
        onHold: (val: boolean) => void; 
        isHolding: boolean;
        scaleAnim: Animated.Value;
    }) => (
        <Animated.View style={[styles.playerTouchPointAnimated, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={[styles.touchPoint, isHolding && styles.touchPointActive]}
            >
                <TouchableOpacity 
                    style={styles.touchPointInner} 
                    onPressIn={() => onHold(true)} 
                    onPressOut={() => onHold(false)} 
                    activeOpacity={0.8}
                >
                    <Image 
                        style={styles.avatar} 
                        source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg'}} 
                    />
                    <View style={styles.touchIconContainer}>
                        <MaterialIcons name="back_hand" size={40} color={COLORS.textPrimary} />
                    </View>
                </TouchableOpacity>
                <Typography variant="caption" style={styles.playerLabel}>{player} HOLD</Typography>
            </LinearGradient>
        </Animated.View>
    );

    // Loading state
    if (isLoading) {
        return (
            <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Loading your kiss challenge...">
                <View style={styles.loadingContainer}>
                    <Typography variant="h2" style={styles.loadingText}>Loading...</Typography>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Maintaining physical connection during this challenge helps strengthen emotional bonds. The 6-second rule is scientifically proven to deepen intimacy!">
            <View style={styles.content}>
                {/* Sync Indicator */}
                {isSyncing && (
                    <View style={styles.syncIndicator}>
                        <Typography variant="caption">💾 Saving...</Typography>
                    </View>
                )}

                <Typography variant="h1" style={styles.title}>
                    The Love Arcade
                </Typography>
                <Typography variant="h2" style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>

                <View style={styles.gameArea}>
                    <PlayerTouchPoint 
                        player="PLAYER 1" 
                        onHold={setPlayer1Hold} 
                        isHolding={player1Hold} 
                        scaleAnim={scaleAnim1}
                    />
                    
                    <View style={styles.centerSection}>
                        <LinearGradient
                            colors={COLORS.progress}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.timerCircle}
                        >
                            <Typography variant="h1" style={styles.timerText}>
                                {Math.ceil(countdown)}
                                <Typography variant="body" style={styles.timerSec}>s</Typography>
                            </Typography>
                        </LinearGradient>
                        
                        <View style={styles.progressContainer}>
                            <Typography variant="caption" style={styles.progressLabel}>Connection Strength</Typography>
                            <LinearGradient
                                colors={GRADIENTS.primary.colors}
                                start={GRADIENTS.primary.start}
                                end={GRADIENTS.primary.end}
                                style={styles.progressBarBg}
                            >
                                <View style={[styles.progressFill, { width: `${connection}%` }]}>
                                    <LinearGradient
                                        colors={[COLORS.warmOrange, COLORS.brightYellow]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.progressFillInner}
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                    </View>

                    <PlayerTouchPoint 
                        player="PLAYER 2" 
                        onHold={setPlayer2Hold} 
                        isHolding={player2Hold} 
                        scaleAnim={scaleAnim2}
                    />
                </View>

                {session && (
                    <Typography variant="caption" style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
                )}
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    content: { 
        flex: 1, 
        padding: SPACING.lg 
    },
    title: { 
        textAlign: 'center', 
        marginBottom: SPACING.sm 
    },
    subtitle: { 
        textAlign: 'center', 
        opacity: 0.7, 
        marginBottom: SPACING.lg 
    },
    gameArea: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%' 
    },
    playerTouchPointAnimated: {
        // Animated transform applied inline via style prop
    },
    touchPoint: { 
        width: 140, 
        height: 140, 
        borderRadius: BORDER_RADIUS.round, 
        overflow: 'hidden',
        ...SHADOWS.large,
    },
    touchPointInner: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(255,0,72,0.2)'
    },
    touchPointActive: { 
        ...SHADOWS.neon,
    },
    avatar: { 
        width: 120, 
        height: 120, 
        borderRadius: BORDER_RADIUS.round, 
        opacity: 0.6 
    },
    touchIconContainer: { 
        ...StyleSheet.absoluteFillObject, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.3)' 
    },
    playerLabel: { 
        textAlign: 'center', 
        marginTop: SPACING.regular,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    centerSection: { 
        alignItems: 'center', 
        flex: 1, 
        marginHorizontal: SPACING.regular 
    },
    timerCircle: { 
        width: 100, 
        height: 100, 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'center', 
        alignItems: 'center',
        ...SHADOWS.neon,
        marginBottom: SPACING.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
    },
    timerText: { 
        color: COLORS.textPrimary,
    },
    timerSec: { 
        color: COLORS.warmOrange,
    },
    progressContainer: { 
        width: '100%', 
        alignItems: 'center' 
    },
    progressLabel: { 
        marginBottom: SPACING.small,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    progressBarBg: {
        height: 12, 
        width: '100%', 
        borderRadius: BORDER_RADIUS.medium, 
        overflow: 'hidden',
        ...SHADOWS.small,
    },
    progressFill: { 
        height: '100%', 
        borderRadius: BORDER_RADIUS.medium,
    },
    progressFillInner: {
        height: '100%', 
        borderRadius: BORDER_RADIUS.medium,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
    },
    syncIndicator: {
        position: 'absolute',
        top: SPACING.regular,
        right: SPACING.regular,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    },
    sessionInfo: {
        textAlign: 'center',
        marginTop: SPACING.xlarge,
        opacity: 0.3,
    },
});

export default SixSecondKissChallenge2;
