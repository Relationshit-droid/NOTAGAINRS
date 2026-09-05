import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, Typography, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const GraffitiPrompt = ({ text }: { text: string }) => (
    <GlassCard style={styles.promptContainer} padding="small">
        <Typography variant="body" style={styles.promptText}>{text}</Typography>
    </GlassCard>
);

const GratitudeGraffitiScreen = () => {
    return (
        <ScreenLayout showHeader={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <View>
                        <Typography variant="h1" style={styles.headerTitle}>
                            ROUND 2: GRATITUDE GRAFFITI
                        </Typography>
                        <Typography variant="body" style={styles.headerSubtitle}>
                            Collaborate to draw metaphors of appreciation.
                        </Typography>
                    </View>
                    {/* Timer component would go here */}
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.sidebar}>
                        <Typography variant="label" style={styles.sidebarTitle}>
                            INSPIRATION PROMPTS
                        </Typography>
                        <GraffitiPrompt text={'"You\'re the guac to my toast."'} />
                        <GraffitiPrompt text='"The wifi signal to my heart."' />
                        <GraffitiPrompt text='"The anchor in my storm."' />
                    </View>

                    <GlassCard style={styles.canvasContainer} padding="none">
                        <View style={styles.canvasPlaceholder}>
                            <Typography variant="h1" style={styles.graffitiTextPink}>GUAC 🥑</Typography>
                            <Typography variant="h1" style={styles.graffitiTextTeal}>TOAST 🍞</Typography>
                        </View>
                    </GlassCard>
                </View>

                <View style={styles.marcieContainer}>
                     <Typography variant="h1" style={styles.marcieAvatar}>😊</Typography>
                    <GlassCard style={styles.marcieBubble} padding="small">
                        <Typography variant="body">
                            "I'm loving those neon choices! That <Typography variant="body" style={{color: COLORS.vibrantPink}}>guac metaphor</Typography> is absolutely brilliant!"
                        </Typography>
                    </GlassCard>
                </View>

            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    scrollContent: { 
        padding: SPACING.lg 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: SPACING.lg 
    },
    headerTitle: {},
    headerSubtitle: { 
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    mainContent: { 
        flexDirection: 'row', 
        gap: SPACING.lg 
    },
    sidebar: { 
        width: SPACING.xxxlarge * 3, 
        gap: SPACING.sm 
    },
    sidebarTitle: { 
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    promptContainer: {
        borderWidth: 1, 
        borderColor: `${COLORS.vibrantPink}80`,
    },
    promptText: { 
        color: COLORS.textSecondary, 
        fontStyle: 'italic',
        fontSize: TYPOGRAPHY.fontSize.bodySmall,
    },
    canvasContainer: { 
        flex: 1, 
        minHeight: SPACING.xxxlarge * 8, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    canvasPlaceholder: { 
        alignItems: 'center' 
    },
    graffitiTextPink: { 
        color: COLORS.vibrantPink,
        textShadowColor: COLORS.vibrantPink, 
        textShadowRadius: SPACING.md, 
        fontStyle: 'italic',
    },
    graffitiTextTeal: { 
        color: COLORS.aquaTeal,
        textShadowColor: COLORS.aquaTeal, 
        textShadowRadius: SPACING.md, 
        fontStyle: 'italic',
    },
    marcieContainer: { 
        position: 'absolute', 
        bottom: SPACING.lg, 
        right: SPACING.lg, 
        width: SPACING.xxxlarge * 5, 
        alignItems: 'flex-end' 
    },
    marcieAvatar: { 
        marginBottom: -SPACING.md, 
        zIndex: 1,
    },
    marcieBubble: { 
        borderBottomRightRadius: 0,
        borderColor: `${COLORS.vibrantPink}4D`,
        borderWidth: 1,
    },
});

export default GratitudeGraffitiScreen;
