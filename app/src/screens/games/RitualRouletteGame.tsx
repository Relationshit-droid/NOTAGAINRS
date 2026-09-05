import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, ANIMATIONS } from '../../theme';

const rituals = [
    { name: 'The Toast', icon: 'wine-bar', color: COLORS.lavenderPurple },
    { name: 'Reflection', icon: 'dark-mode', color: COLORS.blushPink },
    { name: 'Reading', icon: 'menu-book', color: COLORS.deepCosmic },
    { name: 'Connection', icon: 'auto-awesome', color: COLORS.aquaTeal },
    { name: 'Generosity', icon: 'volunteer-activism', color: COLORS.lavenderPurple },
    { name: 'Creativity', icon: 'camera-alt', color: COLORS.blushPink },
];

const RitualRouletteGame = () => {
    const [spinAnim] = useState(new Animated.Value(0));
    const [selectedRitual, setSelectedRitual] = useState<typeof rituals[0] | null>(null);

    const spinWheel = () => {
        const randomNumber = Math.floor(Math.random() * rituals.length);
        const toValue = 360 * 5 + (360 - (360 / rituals.length) * randomNumber);

        Animated.timing(spinAnim, {
            toValue,
            duration: ANIMATIONS.duration.slower * 6,
            useNativeDriver: true,
        }).start(() => {
            setSelectedRitual(rituals[randomNumber]);
        });
    };

    const spin = spinAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    });

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <View style={styles.container}>
                <Typography variant="h1" center style={styles.header}>Ritual Roulette</Typography>
                <Typography variant="body" center style={styles.subHeader}>Spin the wheel to discover your shared evening ritual.</Typography>

                <View style={styles.gameContainer}>
                    <View style={styles.wheelContainer}>
                        <View style={styles.pointer}>
                            <MaterialIcons name="expand-more" size={TYPOGRAPHY.fontSize.displayMedium} color={COLORS.aquaTeal} />
                        </View>
                        <Animated.View style={[styles.wheel, { transform: [{ rotate: spin }] }]}>
                            {rituals.map((ritual, i) => (
                                <View 
                                    key={i} 
                                    style={[
                                        styles.wheelSection, 
                                        { transform: [{ rotate: `${(360 / rituals.length) * i}deg` }] }
                                    ]}
                                >
                                    <MaterialIcons 
                                        name={ritual.icon as any} 
                                        size={32} 
                                        color={COLORS.textPrimary} 
                                        style={styles.wheelIcon} 
                                    />
                                </View>
                            ))}
                            <SquishyButton onPress={spinWheel} style={styles.spinButton}>
                                <Typography variant="h2" style={styles.spinButtonText}>SPIN</Typography>
                            </SquishyButton>
                        </Animated.View>
                    </View>

                    <View style={styles.proofContainer}>
                        <GlassCard>
                            <Typography variant="h3" style={styles.marcieTitle}>Dr. Marcie Liss</Typography>
                            <Typography variant="sass" style={styles.marcieComment}>"This ritual is a total 10/10 for you! It's going to unlock some amazing vibes tonight."</Typography>
                        </GlassCard>
                        <GlassCard style={styles.logProofCard}>
                            <Typography variant="h3" style={styles.logProofTitle}>Log Proof</Typography>
                            <SquishyButton onPress={() => {}} style={styles.uploadZone}>
                                <MaterialIcons name="add-a-photo" size={32} color={COLORS.textSecondary} />
                                <Typography variant="body" style={styles.uploadText}>Snap a photo together</Typography>
                            </SquishyButton>
                            <Typography variant="caption" center style={styles.orText}>OR</Typography>
                            <SquishyButton onPress={() => {}} style={styles.voiceNoteZone}>
                                <MaterialIcons name="mic" size={24} color={COLORS.textPrimary} />
                                <Typography variant="body" style={styles.voiceNoteText}>Record a Voice Note</Typography>
                            </SquishyButton>
                            <SquishyButton onPress={() => {}}>
                                <Typography variant="button">SUBMIT PROOF</Typography>
                            </SquishyButton>
                        </GlassCard>
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        padding: SPACING.screenPadding 
    },
    header: { 
        marginBottom: SPACING.small 
    },
    subHeader: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.xlarge 
    },
    gameContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        gap: SPACING.xlarge 
    },
    wheelContainer: { 
        flex: 1, 
        alignItems: 'center' 
    },
    pointer: { 
        position: 'absolute', 
        top: -SPACING.large, 
        zIndex: 2 
    },
    wheel: { 
        width: 350, 
        height: 350, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 12, 
        borderColor: COLORS.borderSubtle, 
        backgroundColor: COLORS.backgroundSecondary, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    wheelSection: { 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    wheelIcon: { 
        transform: [{ translateY: -150 }]
    },
    spinButton: { 
        width: 100, 
        height: 100, 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1 
    },
    spinButtonText: { 
        color: COLORS.textPrimary 
    },
    proofContainer: { 
        flex: 1, 
        gap: SPACING.xlarge 
    },
    marcieTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small 
    },
    marcieComment: { 
        color: COLORS.textSecondary 
    },
    logProofCard: { 
        gap: SPACING.regular 
    },
    logProofTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small 
    },
    uploadZone: { 
        borderStyle: 'dashed', 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.xlarge, 
        alignItems: 'center', 
        gap: SPACING.small 
    },
    uploadText: { 
        color: COLORS.textSecondary 
    },
    orText: { 
        color: COLORS.textHint 
    },
    voiceNoteZone: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        gap: SPACING.regular 
    },
    voiceNoteText: { 
        color: COLORS.textPrimary 
    },
});

export default RitualRouletteGame;
