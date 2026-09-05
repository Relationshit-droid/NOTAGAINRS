import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const TrustThermometer = () => {
    const trustLevel = 80;

    return (
        <ScreenLayout showHeader={false}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Typography variant="h1" style={styles.headerTitle} center>
                    TRUST THERMOMETER
                </Typography>
                <Typography variant="body" style={styles.headerSubtitle} center>
                    Visualizing your connection's foundation.
                </Typography>

                <View style={styles.mainContent}>
                    {/* Thermometer Display */}
                    <View style={styles.thermometerContainer}>
                        <View style={styles.thermometerGlass}>
                            <LinearGradient 
                                colors={[COLORS.vibrantPink, COLORS.lavenderPurple]} 
                                style={[styles.thermometerFill, { height: `${trustLevel}%` }]} 
                            />
                        </View>
                        <View style={styles.thermometerBase}>
                            <Typography variant="body">❤️</Typography>
                        </View>
                    </View>

                    {/* Info Cards */}
                    <View style={styles.infoContainer}>
                         <GlassCard style={styles.levelCard}>
                            <Typography variant="label" style={{ color: COLORS.vibrantPink }}>
                                CURRENT LEVEL
                            </Typography>
                            <Typography variant="h1" style={styles.levelValue}>
                                {trustLevel}%
                            </Typography>
                            <Typography variant="small" style={{ color: COLORS.vibrantPink }}>
                                +5% from last week
                            </Typography>
                        </GlassCard>
                         <GlassCard style={styles.trendCard}>
                            <Typography variant="label">SYNCHRONIZATION</Typography>
                            <Typography variant="body" style={styles.trendBody}>
                                The gap in perception has narrowed by 12% this week.
                            </Typography>
                        </GlassCard>
                    </View>
                </View>

                <GlassCard style={styles.questCard}>
                     <Typography variant="h2">🚀</Typography>
                    <View style={{flex: 1}}>
                        <Typography variant="label">RECOMMENDED: THE DEEP DIVE</Typography>
                        <Typography variant="body" style={styles.questSubtitle}>
                            A vulnerability exercise to reach 85% trust.
                        </Typography>
                    </View>
                </GlassCard>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    scrollView: { 
        padding: SPACING.lg 
    },
    headerTitle: { 
        marginBottom: SPACING.sm,
    },
    headerSubtitle: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.xl,
    },
    mainContent: { 
        flexDirection: 'row', 
        gap: SPACING.lg, 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        marginBottom: SPACING.xl 
    },
    thermometerContainer: { 
        alignItems: 'center', 
        width: SPACING.xxlarge * 2.5 
    },
    thermometerGlass: { 
        width: SPACING.xxlarge * 1.5, 
        height: SPACING.xxxlarge * 5, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderWidth: 2, 
        borderColor: `${COLORS.vibrantPink}80`, 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'flex-end', 
        overflow: 'hidden' 
    },
    thermometerFill: { 
        width: '100%' 
    },
    thermometerBase: { 
        width: SPACING.xxlarge * 2, 
        height: SPACING.xxlarge * 2, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderWidth: 2, 
        borderColor: `${COLORS.vibrantPink}80`, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: -SPACING.md 
    },
    infoContainer: { 
        flex: 1, 
        gap: SPACING.lg 
    },
    levelCard: { 
        alignItems: 'center',
    },
    levelValue: { 
        color: COLORS.vibrantPink,
        marginVertical: SPACING.sm,
    },
    trendCard: {},
    trendBody: { 
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
    },
    questCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.lg,
    },
    questSubtitle: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.xs,
    },
});

export default TrustThermometer;
