import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';

const AmazingRaceCrossroadsScreen = () => {
    const [detour, setDetour] = useState<string | null>(null);
    const [roadblock, setRoadblock] = useState<string | null>(null);

    const handleDetourSelect = (option: string) => {
        setDetour(option);
        // In a real app, this would trigger a backend update
    }

    const handleRoadblockSelect = (partner: string) => {
        setRoadblock(partner);
        // In a real app, this would trigger a backend update
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="At relationship crossroads, choices matter! Each decision shapes your journey together. Choose wisely!">
            <ScrollView contentContainerStyle={styles.content}>
                <Typography variant="h1" style={styles.title}>
                    The Love Arcade
                </Typography>
                <Typography variant="h2" style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>

                <View style={styles.decisionHub}>
                    <LinearGradient
                        colors={GRADIENTS.primary.colors}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.card}
                    >
                        <Typography variant="h3" style={styles.cardTitle}>WORD-WOUND PROTOCOL</Typography>
                        <Typography variant="caption" style={styles.cardSubtitle}>PHASE 04: ACTIVE</Typography>
                    </LinearGradient>

                    <LinearGradient
                        colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <Typography variant="h3" style={styles.hubTitle}>DETOUR</Typography>
                        <Typography variant="body" style={styles.hubDescription}>Choose your communication style for the next 500 miles:</Typography>
                        <SquishyButton 
                            style={[styles.optionButton, detour === 'candor' && styles.selectedOption]}
                            onPress={() => handleDetourSelect('candor')}
                        >
                            <Typography variant="h4" style={styles.optionTitle}>Radical Candor</Typography>
                            <Typography variant="body" style={styles.optionDescription}>High intensity, direct feedback, zero filters.</Typography>
                        </SquishyButton>
                        <Typography variant="body" style={styles.orText}>-- OR --</Typography>
                        <SquishyButton 
                            style={[styles.optionButton, detour === 'soft' && styles.selectedOption]}
                             onPress={() => handleDetourSelect('soft')}
                        >
                            <Typography variant="h4" style={styles.optionTitle}>Softened Start-up</Typography>
                            <Typography variant="body" style={styles.optionDescription}>Low impact, high empathy, gradual entry.</Typography>
                        </SquishyButton>
                    </LinearGradient>

                    <LinearGradient
                        colors={[COLORS.warmOrange, COLORS.brightYellow]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.card}
                    >
                        <Typography variant="h3" style={[styles.hubTitle, {color: COLORS.textPrimary}]}>ROADBLOCK</Typography>
                        <Typography variant="body" style={styles.hubDescription}>A personal growth task for ONE partner only:</Typography>
                         <View style={styles.roadblockTask}>
                            <Typography variant="h4" style={styles.optionTitle}>Mirror Meditation</Typography>
                            <Typography variant="body" style={styles.optionDescription}>Facing self-criticism without projection. Takes approx 20 mins.</Typography>
                        </View>
                        <SquishyButton onPress={() => handleRoadblockSelect('user')}>
                            <Typography variant="button">I'll Take This Task</Typography>
                        </SquishyButton>
                    </LinearGradient>
                </View>
                 {/* Simplified representation of the map and moderator for mobile */}
                 <LinearGradient
                    colors={[COLORS.mintGreen, COLORS.softViolet]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.moderatorCard}
                >
                    <Typography variant="h4" style={styles.moderatorName}>Dr. Marcie Liss</Typography>
                    <Typography variant="caption" style={styles.moderatorTitle}>Race Moderator</Typography>
                    <Typography variant="body" style={styles.moderatorQuote}>"Phase 4 Word-Wound Protocol is active. Choose your path wisely, the rift is closing!"</Typography>
                </LinearGradient>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    content: { 
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
    decisionHub: { 
        marginBottom: SPACING.lg 
    },
    card: {
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    cardTitle: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.xxlarge,
    },
    cardSubtitle: { 
        color: COLORS.warmOrange, 
        textTransform: 'uppercase',
        textAlign: 'center',
        marginTop: SPACING.small,
        backgroundColor: 'rgba(255, 118, 0, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    hubTitle: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase', 
        marginBottom: SPACING.regular,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.xxlarge,
    },
    hubDescription: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.regular,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    optionButton: { 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.large, 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle, 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: SPACING.xs,
        ...SHADOWS.small,
    },
    selectedOption: { 
        borderColor: COLORS.vibrantPink, 
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
    },
    optionTitle: { 
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    optionDescription: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    orText: { 
        textAlign: 'center', 
        color: COLORS.vibrantPink, 
        marginVertical: SPACING.regular,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        padding: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    roadblockTask: { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.large, 
        borderWidth: 1, 
        borderColor: 'rgba(255, 118, 0, 0.3)', 
        marginBottom: SPACING.regular,
        ...SHADOWS.small,
    },
    moderatorCard: { 
        alignItems: 'center', 
        padding: SPACING.lg, 
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    moderatorName: { 
        color: COLORS.textPrimary,
        textAlign: 'center',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    moderatorTitle: { 
        color: COLORS.warmOrange, 
        textTransform: 'uppercase', 
        marginBottom: SPACING.regular,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 118, 0, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    moderatorQuote: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.large,
    },
});

export default AmazingRaceCrossroadsScreen;
