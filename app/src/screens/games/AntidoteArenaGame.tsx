import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const AntidoteButton = ({ title, description, icon }: { title: string, description: string, icon: string }) => (
    <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={styles.antidoteButton}
    >
        <View style={styles.antidoteIconContainer}>
            <Typography variant="h2" style={styles.antidoteIcon}>{icon}</Typography>
        </View>
        <View>
            <Typography variant="h4" style={styles.antidoteTitle}>{title}</Typography>
            <Typography variant="body" style={styles.antidoteDescription}>{description}</Typography>
        </View>
    </LinearGradient>
)

const AntidoteArenaGameScreen = () => {
  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="The horsemen of relationship apocalypse can be defeated! Use these antidotes to counter destructive communication patterns.">
      <View style={styles.content}>
        <Typography variant="h1" style={styles.title}>
          The Love Arcade
        </Typography>
        <Typography variant="h2" style={styles.subtitle}>
          +100 Games to Deepen Connection
        </Typography>

        <View style={styles.headerSection}>
            <Typography variant="h1" style={styles.mainTitle}>ANTIDOTE ARENA</Typography>
            <Typography variant="body" style={styles.subtitleText}>The "Horseman" of Contempt is attacking! Buzz in with the cure.</Typography>
        </View>

        <LinearGradient
            colors={[COLORS.lavenderPurple, COLORS.softViolet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.soundwaveContainer}
        >
            {/* Simplified soundwave visualization */}
            <Typography variant="h2" style={styles.soundwaveIcon}>♪</Typography>
            <Typography variant="caption" style={styles.soundwaveStatus}>Contemptuous Tone Detected</Typography>
        </LinearGradient>

        <View style={styles.antidoteGrid}>
            <AntidoteButton title="Gentle Start-Up" description="Counter criticism with soft phrasing." icon="🧠" />
            <AntidoteButton title="Appreciation" description="Build culture of admiration." icon="❤️" />
            <AntidoteButton title="Responsibility" description="Accept your part of the conflict." icon="✓" />
            <AntidoteButton title="Self-Soothing" description="Calm your physiological response." icon="🧘" />
        </View>

        <LinearGradient
            colors={[COLORS.mintGreen, COLORS.softViolet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.marcieHostFeed}
        >
             <Typography variant="caption" style={styles.marcieTitle}>Dr. Marcie Liss</Typography>
             <Typography variant="body" style={styles.marcieQuote}>"Chef's kiss contempt level, honey. Quick, what's the cure?"</Typography>
        </LinearGradient>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    content: { 
        flex: 1, 
        padding: SPACING.lg, 
        justifyContent: 'space-between' 
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
    headerSection: { 
        alignItems: 'center', 
        marginBottom: SPACING.lg 
    },
    mainTitle: { 
        color: COLORS.textPrimary, 
        fontStyle: 'italic',
        textShadowColor: COLORS.vibrantPink,
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10,
    },
    subtitleText: { 
        color: COLORS.vibrantPink, 
        textAlign: 'center',
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.xxlarge,
        marginTop: SPACING.small,
    },
    soundwaveContainer: {
        borderRadius: BORDER_RADIUS.xxlarge,
        padding: SPACING.xlarge,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    soundwaveIcon: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.regular,
    },
    soundwaveStatus: { 
        color: COLORS.warmOrange, 
        textTransform: 'uppercase', 
        letterSpacing: 3,
        backgroundColor: 'rgba(255, 118, 0, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.large,
    },
    antidoteGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-around' 
    },
    antidoteButton: {
        width: '45%',
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        marginBottom: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    antidoteIconContainer: { 
        width: 50, 
        height: 50, 
        borderRadius: BORDER_RADIUS.large, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    antidoteIcon: { 
        color: COLORS.textPrimary,
    },
    antidoteTitle: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    antidoteDescription: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    marcieHostFeed: {
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        marginTop: SPACING.lg,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    marcieTitle: { 
        textTransform: 'uppercase', 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.xs,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.xs,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.small,
    },
    marcieQuote: { 
        color: COLORS.textPrimary,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    }
});

export default AntidoteArenaGameScreen;
