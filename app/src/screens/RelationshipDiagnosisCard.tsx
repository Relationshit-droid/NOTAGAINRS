import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const diagnosisData = {
    overallScore: 84,
    frequency: 'Harmonious',
    metrics: {
        trust: 88,
        communication: 72,
        intimacy: 94,
        joy: 81,
        conflict: 60,
        sharedGoals: 75,
    },
    colors: {
        fun: COLORS.brightYellow,
        trust: COLORS.info,
        intimacy: COLORS.vibrantPink,
        communication: COLORS.mintGreen,
        conflict: COLORS.lavenderPurple,
        sharedGoals: COLORS.warmOrange
    }
};

const StatRing = ({ data }: { data: typeof diagnosisData }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const segmentAngle = 360 / Object.keys(data.metrics).length;

    return (
        <View style={styles.ringContainer}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r={radius} stroke="rgba(0,0,0,0.3)" strokeWidth="8" fill="transparent" />
                {Object.entries(data.metrics).map(([key, value], index) => {
                    const strokeDasharray = `${(value / 100) * (circumference / 6)} ${circumference}`;
                    const rotation = -90 + (index * segmentAngle);
                    return (
                        <Circle
                            key={key}
                            cx="50" cy="50" r={radius} stroke={data.colors[key.toLowerCase() as keyof typeof data.colors] || COLORS.textPrimary}
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={-(circumference / 6) * index}
                            originX="50" originY="50"
                            rotation={rotation}
                            strokeLinecap="round"
                        />
                    );
                })}
            </Svg>
            <View style={styles.ringCenterText}>
                <Typography variant="label" style={styles.ringCenterLabel}>OVERALL</Typography>
                <Typography variant="displayLarge" style={styles.ringCenterScore}>{data.overallScore}<Typography variant="headerMedium" style={styles.percentSign}>%</Typography></Typography>
            </View>
        </View>
    );
};

const RelationshipDiagnosisCard = () => {
    return (
        <ScreenLayout scrollable={true}>
            <Typography variant="displayLarge" style={styles.headerTitle}>RELATIONSHIP SYNTHESIS</Typography>
            <Typography variant="label" style={styles.headerSubtitle}>DIAGNOSTIC SCAN #8821-B</Typography>

            <GlassCard style={styles.card}>
                <View style={styles.cardContent}>
                    <StatRing data={diagnosisData} />
                    <View style={styles.analysisSection}>
                        <Typography variant="headerMedium" style={styles.analysisTitle}>CURRENT FREQUENCY: {diagnosisData.frequency.toUpperCase()}</Typography>
                        <Typography variant="bodyMedium" style={styles.analysisText}>
                            Your connection is resonating at a high level. Focus on <Typography variant="bodyMedium" style={{color: diagnosisData.colors.communication}}>COMMUNICATION</Typography> could deepen the bond.
                        </Typography>
                    </View>
                </View>
                <View style={styles.cardFooter}>
                    <Typography variant="bodyMedium" style={styles.footerText}>JOURNEY BEGINS</Typography>
                </View>
            </GlassCard>
            <SquishyButton 
                title="COMMENCE JOURNEY 🚀" 
                onPress={() => {}} 
                style={styles.ctaButton}
            />
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    headerTitle: { 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    headerSubtitle: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        letterSpacing: 2, 
        textAlign: 'center', 
        marginBottom: SPACING.xlarge 
    },
    card: { 
        width: '100%', 
        maxWidth: 960 
    },
    cardContent: { 
        flexDirection: 'row', 
        padding: SPACING.xlarge, 
        alignItems: 'center' 
    },
    ringContainer: { 
        width: 200, 
        height: 200, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    ringCenterText: { 
        position: 'absolute', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    ringCenterLabel: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        letterSpacing: 2 
    },
    ringCenterScore: { 
        color: COLORS.textPrimary 
    },
    percentSign: { 
        color: COLORS.vibrantPink 
    },
    analysisSection: { 
        flex: 1, 
        marginLeft: SPACING.xlarge 
    },
    analysisTitle: { 
        textTransform: 'uppercase' 
    },
    analysisText: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.small 
    },
    cardFooter: { 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderTopWidth: 1, 
        borderColor: COLORS.glowPink, 
        padding: SPACING.regular, 
        flexDirection: 'row', 
        justifyContent: 'center' 
    },
    footerText: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase', 
        letterSpacing: 2 
    },
    ctaButton: { 
        marginTop: SPACING.xxlarge 
    },
});

export default RelationshipDiagnosisCard;
