import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const OfflineMode = () => {
    return (
        <ScreenLayout showMarcie={false}>
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.background} />
                <View style={styles.content}>
                    
                    <View style={styles.iconContainer}>
                        <LinearGradient 
                            colors={[COLORS.vibrantPink, COLORS.lavenderPurple]}
                            style={styles.planet}
                        >
                            <View style={styles.wifiOffContainer}>
                                <Typography variant="h1" style={styles.emoji}>🛰️</Typography>
                            </View>
                        </LinearGradient>
                    </View>

                    <Typography variant="h1" style={styles.title}>SIGNAL LOST IN THE NEBULA</Typography>
                    <Typography variant="body" style={styles.subtitle}>The stars are temporarily misaligned. Please check your internet connection and try re-syncing.</Typography>

                    <SquishyButton 
                        onPress={() => {}}
                        variant="primary"
                        size="large"
                        style={styles.retryButton}
                    >
                        <Typography variant="h2" style={styles.emojiSmall}>🔄</Typography>
                        <Typography variant="button" style={styles.retryButtonText}>RETRY CONNECTION</Typography>
                    </SquishyButton>

                    <SquishyButton 
                        onPress={() => {}}
                        variant="ghost"
                        style={styles.miniGameButton}
                    >
                        <Typography variant="body" style={styles.emojiSmall}>🎮</Typography>
                        <Typography variant="button" style={styles.miniGameButtonText}>PLAY OFFLINE MINI-GAME</Typography>
                    </SquishyButton>

                    <Typography variant="body" style={styles.quoteText}>"The space between stars is where we find ourselves."</Typography>

                </View>
            </SafeAreaView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.deepCosmic 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    content: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: SPACING.xlarge 
    },
    iconContainer: { 
        marginBottom: SPACING.xl, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    planet: { 
        width: 180, 
        height: 180, 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'center', 
        alignItems: 'center', 
        ...SHADOWS.neonSoft 
    },
    wifiOffContainer: { 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        borderRadius: BORDER_RADIUS.round, 
        padding: SPACING.xl, 
        borderWidth: 1, 
        borderColor: `${COLORS.vibrantPink}50` 
    },
    emoji: {
        fontSize: TYPOGRAPHY.fontSize.displayLarge * 2,
    },
    emojiSmall: {
        fontSize: TYPOGRAPHY.fontSize.headerLarge,
    },
    title: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.md, 
        textTransform: 'uppercase' 
    },
    subtitle: { 
        color: COLORS.textSecondary, 
        textAlign: 'center', 
        marginBottom: SPACING.xl, 
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge
    },
    retryButton: { 
        width: '80%', 
        marginBottom: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    retryButtonText: { 
        color: COLORS.textPrimary, 
        marginLeft: SPACING.sm, 
        textTransform: 'uppercase', 
        letterSpacing: TYPOGRAPHY.letterSpacing.button 
    },
    miniGameButton: { 
        flexDirection: 'row', 
        backgroundColor: COLORS.backgroundInput, 
        paddingVertical: SPACING.md, 
        paddingHorizontal: SPACING.lg, 
        borderRadius: BORDER_RADIUS.large, 
        borderWidth: 1, 
        borderColor: `${COLORS.vibrantPink}50`,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    miniGameButtonText: { 
        color: COLORS.textPrimary, 
        marginLeft: SPACING.sm, 
        textTransform: 'uppercase' 
    },
    quoteText: { 
        fontStyle: 'italic', 
        color: COLORS.textSecondary, 
        marginTop: SPACING.xl, 
        textAlign: 'center' 
    },
});

export default OfflineMode;
