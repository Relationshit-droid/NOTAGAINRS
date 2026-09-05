import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const ManeuverButton = ({ icon, text, isActive }: { icon: string; text: string; isActive?: boolean }) => (
    <SquishyButton 
        variant={isActive ? 'primary' : 'ghost'}
        style={[styles.maneuver, isActive && styles.maneuverActive]}
        onPress={() => {}}
    >
        <Typography variant="h3" style={styles.maneuverIcon}>{icon}</Typography>
        <Typography variant="caption" style={styles.maneuverText}>{text}</Typography>
    </SquishyButton>
);

const HarborMastersChallengeScreen = () => {
    return (
        <ScreenLayout showHeader={false}>
            <View style={styles.header}>
                <Typography variant="h2" style={styles.headerTitle} center>
                    HARBOR MASTER'S CHALLENGE
                </Typography>
            </View>

            <ScrollView contentContainerStyle={styles.mainContent}>
                <GlassCard style={styles.stormBanner}>
                    <Typography variant="h3">STORM LEVEL: HIGH INTENSITY</Typography>
                    <Typography variant="body" style={styles.stormSubtitle}>
                        Emotional turbulence detected.
                    </Typography>
                    <View style={styles.stormMeter}>
                        <LinearGradient
                            colors={[COLORS.vibrantPink, COLORS.lavenderPurple]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.stormMeterFill} />
                    </View>
                </GlassCard>

                <View style={styles.dashboard}>
                    <GlassCard style={styles.stormVisualizer} padding="large">
                        <Typography variant="h3" style={styles.visualizerText}>
                            MANEUVER REQUIRED
                        </Typography>
                    </GlassCard>

                    <GlassCard style={styles.maneuverWheel}>
                        <Typography variant="label" style={styles.wheelTitle}>
                            MANEUVER WHEEL
                        </Typography>
                        <View style={styles.wheelGrid}>
                            <ManeuverButton icon="💨" text="DEEP BREATHING" isActive={true} />
                            <ManeuverButton icon="👣" text="GROUNDING" />
                            <ManeuverButton icon="💖" text="AFFIRMATION" />
                            <ManeuverButton icon="👁️" text="SENSING" />
                            <ManeuverButton icon="🎶" text="AUDITORY CALM" />
                            <ManeuverButton icon="💪" text="MUSCLE FOCUS" />
                        </View>
                    </GlassCard>
                </View>

                 <GlassCard style={styles.footerBar}>
                    <Typography variant="label" style={styles.footerText} center>
                        CO-REGULATION ACTIVE
                    </Typography>
                </GlassCard>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        padding: SPACING.lg, 
        borderBottomWidth: 1, 
        borderColor: `${COLORS.vibrantPink}80`, 
        backgroundColor: COLORS.backgroundInput,
    },
    headerTitle: {},
    mainContent: { 
        padding: SPACING.lg 
    },
    stormBanner: { 
        marginBottom: SPACING.lg,
    },
    stormTitle: {},
    stormSubtitle: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.xs,
    },
    stormMeter: { 
        height: SPACING.sm, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: SPACING.xs, 
        marginTop: SPACING.sm,
    },
    stormMeterFill: { 
        height: '100%', 
        width: '85%', 
        borderRadius: SPACING.xs,
    },
    dashboard: { 
        flexDirection: 'row', 
        gap: SPACING.lg, 
        flex: 1 
    },
    stormVisualizer: { 
        flex: 2, 
        justifyContent: 'flex-end',
    },
    visualizerText: {},
    maneuverWheel: { 
        flex: 1, 
        padding: SPACING.lg,
    },
    wheelTitle: { 
        color: COLORS.vibrantPink,
        marginBottom: SPACING.lg,
    },
    wheelGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
    },
    maneuver: { 
        width: '48%', 
        aspectRatio: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: SPACING.sm,
    },
    maneuverActive: { 
        borderColor: COLORS.vibrantPink,
        ...SHADOWS.neonSoft,
    },
    maneuverIcon: {},
    maneuverText: { 
        textAlign: 'center', 
        marginTop: SPACING.xs,
    },
    footerBar: { 
        marginTop: SPACING.lg,
    },
    footerText: {},
});

export default HarborMastersChallengeScreen;
