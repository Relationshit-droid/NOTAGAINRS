import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const StatCard = ({ icon, label, value, subValue, barPercentage }: { icon: string, label: string, value: string, subValue?: string, barPercentage?: number }) => (
    <GlassCard style={styles.statCard}>
        <View style={styles.statHeader}>
            <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerMedium}}>{icon}</Typography>
            <Typography variant="label" style={styles.statLabel}>{label}</Typography>
        </View>
        <View style={styles.statContent}>
            <Typography variant="displaySmall" style={styles.statValue}>{value}</Typography>
            {subValue && <Typography variant="bodySmall" style={styles.statSubValue}>{subValue}</Typography>}
            {barPercentage && (
                <View style={styles.statBarContainer}>
                    <LinearGradient colors={[COLORS.vibrantPink, COLORS.lavenderPurple]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.statBar, { width: `${barPercentage}%` }]} />
                </View>
            )}
        </View>
    </GlassCard>
);

const MicroBetrayalMiniGolfGame = () => {
    return (
        <ScreenLayout scrollable={true}>
            <View style={styles.statsRow}>
                <StatCard icon="❤️" label="TRUST POINTS" value="1,850" subValue="+15%" />
                <StatCard icon="🔗" label="CONNECTION LEVEL" value="LVL 4" barPercentage={40} />
                <StatCard icon="⛳" label="CURRENT STROKE" value="02" subValue="PAR 3" />
            </View>

            <View style={styles.gameContainer}>
                <View style={styles.golfCourse}>
                    <View style={styles.tee} />
                    <View style={styles.ball} />
                    <View style={styles.hazard}><Typography variant="label" style={styles.hazardText}>HAZARD</Typography></View>
                    <View style={styles.ramp}><Typography variant="label" style={styles.rampText}>RAMP</Typography></View>
                    <View style={styles.hole} />
                </View>
                <View style={styles.controlsSidebar}>
                    <GlassCard style={styles.powerMeterContainer}>
                        <Typography variant="label" style={styles.powerMeterLabel}>POWER</Typography>
                        <View style={styles.powerMeterTrack}>
                            <LinearGradient colors={[COLORS.vibrantPink, COLORS.lavenderPurple]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.powerMeterFill} />
                        </View>
                        <Typography variant="headerMedium" style={styles.powerMeterValue}>65%</Typography>
                    </GlassCard>
                    <SquishyButton title="TAKE SHOT" onPress={() => {}} size="small" />
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    statsRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: SPACING.regular, 
        gap: SPACING.small 
    },
    statCard: { 
        flex: 1, 
        padding: SPACING.medium 
    },
    statHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        opacity: 0.8 
    },
    statLabel: { 
        color: COLORS.textSecondary, 
        marginLeft: SPACING.small, 
        textTransform: 'uppercase' 
    },
    statContent: { 
        marginTop: SPACING.small 
    },
    statValue: { 
        color: COLORS.textPrimary 
    },
    statSubValue: { 
        color: COLORS.mintGreen, 
        fontWeight: 'bold' 
    },
    statBarContainer: { 
        height: 4, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.small, 
        marginTop: SPACING.tiny 
    },
    statBar: { 
        height: '100%' 
    },
    gameContainer: { 
        flexDirection: 'row', 
        height: 350 
    },
    golfCourse: { 
        flex: 3, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.xxlarge, 
        borderWidth: 2, 
        borderColor: COLORS.glowPink, 
        position: 'relative' 
    },
    tee: { 
        position: 'absolute', 
        left: 20, 
        top: '45%', 
        width: 60, 
        height: 40, 
        borderTopWidth: 1, 
        borderBottomWidth: 1, 
        borderColor: COLORS.glowPink 
    },
    ball: { 
        position: 'absolute', 
        left: '25%', 
        top: '50%', 
        width: 20, 
        height: 20, 
        backgroundColor: COLORS.textPrimary, 
        borderRadius: BORDER_RADIUS.round, 
        ...SHADOWS.neon 
    },
    hazard: { 
        position: 'absolute', 
        right: '30%', 
        top: '20%', 
        width: 60, 
        height: 60, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: COLORS.glowPink, 
        borderWidth: 1, 
        borderColor: COLORS.vibrantPink, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    hazardText: { 
        color: COLORS.vibrantPink, 
        textTransform: 'uppercase' 
    },
    ramp: { 
        position: 'absolute', 
        right: '40%', 
        bottom: '15%', 
        width: 80, 
        height: 30, 
        backgroundColor: 'rgba(34, 211, 238, 0.2)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        transform: [{rotate: '-15deg'}] 
    },
    rampText: { 
        color: COLORS.info, 
        textTransform: 'uppercase' 
    },
    hole: { 
        position: 'absolute', 
        right: 20, 
        top: '48%', 
        width: 24, 
        height: 24, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: COLORS.backgroundPrimary, 
        borderWidth: 2, 
        borderColor: COLORS.vibrantPink 
    },
    controlsSidebar: { 
        flex: 1, 
        marginLeft: SPACING.regular, 
        justifyContent: 'space-between' 
    },
    powerMeterContainer: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'space-around' 
    },
    powerMeterLabel: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase', 
        opacity: 0.5 
    },
    powerMeterTrack: { 
        width: 30, 
        height: 150, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'flex-end' 
    },
    powerMeterFill: { 
        height: '65%', 
        borderRadius: BORDER_RADIUS.round 
    },
    powerMeterValue: { 
        color: COLORS.vibrantPink, 
        marginTop: SPACING.small 
    },
});

export default MicroBetrayalMiniGolfGame;
