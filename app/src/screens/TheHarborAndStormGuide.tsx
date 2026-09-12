
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

type ToolCardProps = { icon: string; title: string; description: string };

const ToolCard = ({ icon, title, description }: ToolCardProps) => (
    <SquishyButton variant="ghost" style={styles.toolCard}>
        <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerLarge, marginBottom: SPACING.small}}>{icon}</Typography>
        <Typography variant="h4" style={styles.toolTitle}>{title}</Typography>
        <Typography variant="caption" color={COLORS.textSecondary} style={styles.toolDescription}>{description}</Typography>
    </SquishyButton>
);

const TheHarborAndStormGuide = () => {
    return (
        <ScreenLayout scrollable={true} showHeader={false}>
            <View style={styles.header}>
                <Typography variant="h1" center>NAVIGATE YOUR CONNECTION</Typography>
                <Typography variant="label" center color={COLORS.textSecondary} style={styles.headerSubtitle}>
                    DR. MARCIE LISS IS HERE TO GUIDE YOUR JOURNEY.
                </Typography>
            </View>

            <View style={styles.dashboardContainer}>
                {/* The Storm Section */}
                <GlassCard style={[styles.section, styles.stormSection]}>
                    <View style={styles.sectionHeader}>
                        <Typography style={{fontSize: TYPOGRAPHY.fontSize.displaySmall}}>⚡️</Typography>
                        <Typography variant="h2" style={styles.sectionTitle}>THE STORM</Typography>
                    </View>
                    <ToolCard icon="⏱️" title="THE 5-MINUTE PAUSE" description="Instant de-escalation protocol." />
                    <ToolCard icon="🗺️" title="CONFLICT MAPPING" description="Identify argument patterns." />
                </GlassCard>

                {/* The Harbor Section */}
                <GlassCard style={[styles.section, styles.harborSection]}>
                    <View style={styles.sectionHeader}>
                        <Typography style={{fontSize: TYPOGRAPHY.fontSize.displaySmall}}>⚓</Typography>
                        <Typography variant="h2" style={styles.sectionTitle}>THE HARBOR</Typography>
                    </View>
                    <ToolCard icon="👁️" title="EYE-CONTACT MEDITATION" description="2-minute grounding exercise." />
                    <ToolCard icon="💖" title="APPRECIATION ANCHOR" description="Log your gratitude." />
                </GlassCard>
            </View>

            <View style={styles.signalFlareContainer}>
                <SquishyButton 
                    onPress={() => {}}
                    style={styles.signalFlareButton}
                >
                    <Typography style={{fontSize: TYPOGRAPHY.fontSize.displayLarge}}>🚨</Typography>
                </SquishyButton>
                <Typography variant="label" color={COLORS.vibrantPink} style={styles.signalFlareText}>SIGNAL FLARE</Typography>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        marginBottom: SPACING.xlarge 
    },
    headerSubtitle: { 
        marginTop: SPACING.small,
        textTransform: 'uppercase',
    },
    dashboardContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        gap: SPACING.regular 
    },
    section: {
        flex: 1,
        padding: SPACING.regular,
    },
    stormSection: {
        backgroundColor: `${COLORS.peachOrange}20`,
        borderColor: `${COLORS.peachOrange}80`,
    },
    harborSection: {
        backgroundColor: `${COLORS.info}20`,
        borderColor: `${COLORS.info}80`,
    },
    sectionHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.small, 
        marginBottom: SPACING.regular 
    },
    sectionTitle: { 
        textTransform: 'uppercase' 
    },
    toolCard: {
        backgroundColor: `${COLORS.backgroundPrimary}40`,
        padding: SPACING.medium,
        marginBottom: SPACING.regular,
        borderRadius: BORDER_RADIUS.large,
    },
    toolTitle: { 
        textTransform: 'uppercase' 
    },
    toolDescription: { 
        marginTop: SPACING.tiny 
    },
    signalFlareContainer: { 
        alignItems: 'center', 
        marginVertical: SPACING.xxxlarge 
    },
    signalFlareButton: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.round,
        ...SHADOWS.neon,
    },
    signalFlareText: { 
        marginTop: SPACING.regular,
        textTransform: 'uppercase' 
    },
});

export default TheHarborAndStormGuide;
