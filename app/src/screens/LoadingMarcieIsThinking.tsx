
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const LoadingMarcieIsThinkingScreen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <LinearGradient 
                colors={[COLORS.deepCosmicPurple, COLORS.midPurple]}
                style={styles.background} 
            />
            
            <View style={styles.mainContent}>
                <View style={styles.animationContainer}>
                    <Typography variant="body" style={styles.lottiePlaceholder}>[Lottie Animation]</Typography>
                </View>

                <Typography variant="gameTitle" style={styles.title}>MARCIE IS THINKING...</Typography>
                <Typography variant="h2" style={styles.subtitle}>VARIANT 5 OF 10</Typography>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <LinearGradient colors={[COLORS.vibrantPink, COLORS.lavenderPurple]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.progressBar} />
                    </View>
                    <Typography variant="caption" style={styles.progressText}>SYNCING NODES... 50%</Typography>
                </View>
            </View>

            <GlassCard style={styles.footer} variant="outlined">
                <Typography variant="label" style={styles.footerTitle}>GAME INSIGHT</Typography>
                <Typography variant="body" style={styles.footerText}>"Communication is the bridge between two hearts. Take this moment to breathe and reflect on one thing you appreciate about your partner today."</Typography>
            </GlassCard>

        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: { ...StyleSheet.absoluteFillObject },
    mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.screenPadding },
    animationContainer: {
        width: 250,
        height: 250,
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 10,
        borderColor: COLORS.vibrantPink,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xxlarge,
        ...SHADOWS.neon,
        backgroundColor: COLORS.backgroundInput,
    },
    lottiePlaceholder: { color: COLORS.textPrimary, fontWeight: 'bold' },
    title: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.small, 
        textTransform: 'uppercase' 
    },
    subtitle: { 
        color: COLORS.vibrantPink, 
        textAlign: 'center', 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    progressContainer: { marginTop: SPACING.xxlarge, width: '80%' },
    progressBarBackground: { 
        height: 4, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.small, 
        overflow: 'hidden' 
    },
    progressBar: { height: '100%', width: '50%' },
    progressText: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        textAlign: 'center', 
        marginTop: SPACING.small, 
        fontWeight: 'bold' 
    },
    footer: { 
        margin: SPACING.regular, 
        padding: SPACING.screenPadding,
    },
    footerTitle: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.small,
    },
    footerText: { 
        color: COLORS.textPrimary, 
        textAlign: 'center' 
    },
});

export default LoadingMarcieIsThinkingScreen;
