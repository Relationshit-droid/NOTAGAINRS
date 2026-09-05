import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenLayout, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const AdmirationAimArGame = () => {

    const calculateGameResults = () => {
        // Game logic would go here
        console.log("Compliment Launched!");
    }

    const Target = ({ word, top, left, scale = 1 }: { word: string, top: any, left: any, scale?: number }) => (
        <LinearGradient
            colors={GRADIENTS.primary.colors}
            start={GRADIENTS.primary.start}
            end={GRADIENTS.primary.end}
            style={[styles.target, { top, left, transform: [{ scale }] }]}
        >
            <Typography variant="button" style={styles.targetText}>{word}</Typography>
        </LinearGradient>
    )

    return (
        <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Aim for RESILIENT! Precision is key to a healthy relationship. Take the shot!">
            <View style={styles.content}>
                <Typography variant="h1" style={styles.title}>
                    The Love Arcade
                </Typography>
                <Typography variant="h2" style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>
                
                {/* AR background would be a camera view in a real app */}

                <View style={styles.hudHeader}>
                    <Typography variant="h3" style={styles.hudTitle}>Admiration Aim AR</Typography>
                    <LinearGradient
                        colors={GRADIENTS.primary.colors}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.hudScoreContainer}
                    >
                        <Typography variant="h2" style={styles.hudScore}>084,200</Typography>
                    </LinearGradient>
                </View>

                <View style={styles.gameWorld}>
                    <Target word="WITTY" top="20%" left="15%" />
                    <Target word="PATIENT" top="70%" left="20%" />
                    <Target word="RESILIENT" top="40%" left="55%" scale={1.25} />
                    <Target word="STRONG" top="80%" left="60%" />
                    <Target word="CALM" top="15%" left="70%" />

                    {/* Central Crosshair */}
                    <View style={styles.crosshairContainer}>
                        <LinearGradient
                            colors={COLORS.progress}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.crosshair}
                        />
                        <LinearGradient
                            colors={[COLORS.warmOrange, COLORS.brightYellow]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.crosshairInner}
                        />
                    </View>
                </View>

                <View style={styles.controlsFooter}>
                    <SquishyButton onPress={calculateGameResults}>
                        <Typography variant="button">LAUNCH COMPLIMENT</Typography>
                    </SquishyButton>
                </View>
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
    hudHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.backgroundInput,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderSubtle,
    },
    hudTitle: { 
        color: COLORS.vibrantPink,
        textTransform: 'uppercase',
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    hudScoreContainer: {
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.large,
        ...SHADOWS.large,
    },
    hudScore: { 
        color: COLORS.textPrimary,
    },
    gameWorld: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    target: {
        position: 'absolute',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.regular,
        borderRadius: BORDER_RADIUS.xxlarge,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    targetText: {
        color: COLORS.textPrimary,
    },
    crosshairContainer: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crosshair: {
        width: '100%',
        height: '100%',
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    crosshairInner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.large,
    },
    controlsFooter: {
        padding: SPACING.lg,
        alignItems: 'center',
    },
});

export default AdmirationAimArGame;
