import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const GuiltVsShameSortScreen = () => {
    return (
        <ScreenLayout showHeader={false}>
            <View style={styles.header}>
                <Typography variant="label">8 / 10</Typography>
            </View>
            
            <View style={styles.gameContainer}>
                <Typography variant="h1" style={styles.title} center>
                    GUILT VS. SHAME SORT
                </Typography>
                <Typography variant="body" style={styles.subtitle} center>
                    Rapid-fire: Where does this feeling belong?
                </Typography>

                <View style={styles.cardContainer}>
                    <SquishyButton 
                        variant="ghost" 
                        style={[styles.actionButton, styles.fixButton]}
                        onPress={() => {}}
                    >
                        <Typography variant="h1">🔧</Typography>
                    </SquishyButton>

                    <GlassCard style={styles.card}>
                        <Typography variant="h2" style={styles.cardTitle} center>
                            "I'M UNLOVABLE"
                        </Typography>
                        <View style={styles.divider} />
                        <Typography variant="body" style={styles.cardDescription} center>
                            This thought focuses on who you are at your core, rather than what you've done.
                        </Typography>
                    </GlassCard>

                    <SquishyButton 
                        variant="ghost" 
                        style={[styles.actionButton, styles.trashButton]}
                        onPress={() => {}}
                    >
                        <Typography variant="h1">🗑️</Typography>
                    </SquishyButton>
                </View>

                <View style={styles.streakContainer}>
                    <Typography variant="label" style={styles.streakText}>
                        STREAK: 12
                    </Typography>
                </View>
            </View>

            <View style={styles.footer}>
                {/* Footer stats would go here */}
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        padding: SPACING.lg, 
        alignItems: 'center' 
    },
    gameContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: SPACING.lg 
    },
    title: { 
        marginBottom: SPACING.sm,
    },
    subtitle: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.xl,
    },
    cardContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        width: '100%' 
    },
    actionButton: { 
        width: SPACING.xxxlarge * 1.5, 
        height: SPACING.xxxlarge * 1.5, 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2,
    },
    fixButton: { 
        borderColor: COLORS.aquaTeal, 
        backgroundColor: `${COLORS.aquaTeal}33`,
    },
    trashButton: { 
        borderColor: COLORS.vibrantPink, 
        backgroundColor: `${COLORS.vibrantPink}33`,
    },
    card: {
        width: SPACING.xxxlarge * 5.5,
        height: SPACING.xxxlarge * 8,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    cardTitle: { 
        marginBottom: SPACING.md,
    },
    divider: { 
        height: SPACING.tiny, 
        width: SPACING.xl, 
        backgroundColor: COLORS.vibrantPink, 
        borderRadius: SPACING.tiny / 2, 
        marginBottom: SPACING.md 
    },
    cardDescription: { 
        color: COLORS.textSecondary,
    },
    streakContainer: { 
        marginTop: SPACING.xl, 
        paddingVertical: SPACING.sm, 
        paddingHorizontal: SPACING.lg, 
        borderRadius: BORDER_RADIUS.xlarge, 
        backgroundColor: `${COLORS.brightYellow}33`, 
        borderWidth: 1, 
        borderColor: `${COLORS.brightYellow}80`,
    },
    streakText: { 
        color: COLORS.brightYellow,
    },
    footer: { 
        padding: SPACING.lg, 
        borderTopWidth: 1, 
        borderColor: COLORS.divider,
    },
});

export default GuiltVsShameSortScreen;
