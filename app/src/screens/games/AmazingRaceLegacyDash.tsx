import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenLayout, Typography, GlassCard } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const LegacyMilestone = ({ title, status, active, last }: { title: string, status: string, active?: boolean, last?: boolean }) => (
    <View style={styles.milestone}>
        <View style={styles.milestoneIconContainer}>
            <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={styles.milestoneIconGradient}
            >
                <Typography variant="caption" style={styles.milestoneIcon}>
                    {active ? '●' : (status === 'Completed' ? '✓' : '○')}
                </Typography>
            </LinearGradient>
            {!last && <LinearGradient
                colors={COLORS.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.milestoneConnector, active && styles.activeConnector]} />}
        </View>
        <View style={styles.milestoneDetails}>
            <Typography variant="h4" style={[styles.milestoneTitle, !active && status !== 'Completed' && {opacity: 0.4}]}>
                {title}
            </Typography>
            <Typography variant="caption" style={[styles.milestoneStatus, active && {color: COLORS.vibrantPink}]}>
                {status}
            </Typography>
        </View>
    </View>
)

const AmazingRaceLegacyDashScreen = () => {
  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Your legacy dash shows incredible progress! Each milestone represents real growth in your relationship journey.">
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="h1" style={styles.title}>
          The Love Arcade
        </Typography>
        <Typography variant="h2" style={styles.subtitle}>
          +100 Games to Deepen Connection
        </Typography>

        <LinearGradient
            colors={GRADIENTS.primary.colors}
            start={GRADIENTS.primary.start}
            end={GRADIENTS.primary.end}
            style={styles.progressCard}
        >
            <View style={styles.progressHeader}>
                <Typography variant="h3" style={styles.progressTitle}>Overall Team Progress</Typography>
                <Typography variant="h2" style={styles.progressPercentage}>65%</Typography>
            </View>
            <View style={styles.progressBarContainer}>
                <LinearGradient 
                    colors={COLORS.progress}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[styles.progressBar, {width: '65%'}]}/>
            </View>
            <Typography variant="body" style={styles.milestoneCounter}>6/9 Milestones Completed</Typography>
        </LinearGradient>

        <View style={styles.mainGrid}>
            <LinearGradient
                colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.milestoneList}
            >
                 <LegacyMilestone title="Foundation: De-escalation" status="Completed - Day 4" />
                 <LegacyMilestone title="Trust Rebuild: Transparency" status='Active Milestone: "The Shared Calendar Challenge"' active />
                 <LegacyMilestone title="Communication Hub: New Rules" status="Unlocks at 75%" />
                 <LegacyMilestone title="Future Vision: Legacy Planning" status="Final Stretch" last />
            </LinearGradient>
             {/* Map section would be a more complex component */}
            <LinearGradient
                colors={[COLORS.mintGreen, COLORS.softViolet]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mapContainer}
            >
                <Typography variant="h3" style={styles.mapPlaceholderText}>Race Map Area</Typography>
            </LinearGradient>
        </View>

        <LinearGradient
            colors={[COLORS.warmOrange, COLORS.brightYellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.moderatorCard}
        >
             <Typography variant="caption" style={styles.moderatorTitle}>Race Moderator</Typography>
             <Typography variant="h4" style={styles.moderatorName}>Dr. Marcie Liss</Typography>
            <Typography variant="body" style={styles.moderatorQuote}>"You're gaining speed on the Trust Rebuild! Keep pushing together."</Typography>
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
    progressCard: {
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    progressHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: SPACING.regular 
    },
    progressTitle: { 
        color: COLORS.textPrimary,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    progressPercentage: { 
        color: COLORS.textPrimary, 
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.medium,
    },
    progressBarContainer: { 
        height: 16, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: BORDER_RADIUS.medium, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    progressBar: { 
        height: '100%', 
        borderRadius: BORDER_RADIUS.medium 
    },
    milestoneCounter: { 
        color: COLORS.textPrimary, 
        marginTop: SPACING.regular,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    mainGrid: { 
        flexDirection: 'row', 
        gap: SPACING.lg 
    },
    milestoneList: { 
        flex: 1, 
        borderRadius: BORDER_RADIUS.xlarge, 
        padding: SPACING.lg,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    milestone: { 
        flexDirection: 'row', 
        marginBottom: SPACING.regular 
    },
    milestoneIconContainer: { 
        alignItems: 'center', 
        marginRight: SPACING.regular 
    },
    milestoneIconGradient: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    milestoneIcon: { 
        color: COLORS.textPrimary,
    },
    milestoneConnector: { 
        flex: 1, 
        width: 2, 
        borderStyle: 'dashed',
        marginTop: SPACING.xs,
    },
    activeConnector: { 
        backgroundColor: COLORS.vibrantPink,
    },
    milestoneDetails: { 
        flex: 1 
    },
    milestoneTitle: { 
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.medium,
    },
    milestoneStatus: { 
        color: COLORS.textSecondary,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: SPACING.xs,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.small,
    },
    mapContainer: { 
        flex: 2, 
        borderRadius: BORDER_RADIUS.xlarge, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    mapPlaceholderText: { 
        color: COLORS.textPrimary,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.xxlarge,
    },
    moderatorCard: { 
        borderRadius: BORDER_RADIUS.xlarge, 
        padding: SPACING.lg, 
        marginTop: SPACING.lg,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    moderatorTitle: { 
        textTransform: 'uppercase', 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.xs,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.xs,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.small,
    },
    moderatorName: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.regular,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    }
});

export default AmazingRaceLegacyDashScreen;
