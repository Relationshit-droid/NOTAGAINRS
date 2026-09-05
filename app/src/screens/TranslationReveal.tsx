
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const TranslationReveal = () => {

    const originalStatement = "I don't care where we eat...";
    const trueMeaning = "I'm feeling overwhelmed by decisions and just need to feel taken care of tonight.";
    const insight = "This insight suggests a need for emotional safety and leadership in small choices to alleviate mental fatigue.";

    return (
        <ScreenLayout scrollable={true} showHeader={false} contentStyle={styles.contentContainer}>
            <Typography variant="label" color={COLORS.vibrantPink} style={styles.phaseTitle}>WHEN YOU SAID...</Typography>
            <Typography variant="h2" color={COLORS.textSecondary} style={styles.originalStatement}>"{originalStatement}"</Typography>

            <GlassCard style={styles.revealCard}>
                <Typography variant="label" color={COLORS.vibrantPink} style={styles.revealTitle}>THE TRUE MEANING</Typography>
                <Typography variant="h1" style={styles.trueMeaning}>{trueMeaning}</Typography>

                <View style={styles.insightContainer}>
                    <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerLarge}}>💡</Typography>
                    <Typography variant="body" color={COLORS.textSecondary} style={styles.insightText}>{insight}</Typography>
                </View>
            </GlassCard>

            <SquishyButton onPress={() => {}} style={styles.actionButton}>
                <Typography variant="button" color={COLORS.backgroundPrimary}>VIEW ACTION PLAN</Typography>
                <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerLarge}}>▶️</Typography>
            </SquishyButton>
            <Typography variant="caption" color={COLORS.textSecondary} style={styles.nextStepText}>NEXT: DISCOVER 3 WAYS TO RESPOND</Typography>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    contentContainer: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    phaseTitle: { 
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
        marginBottom: SPACING.small,
        textTransform: 'uppercase',
    },
    originalStatement: { 
        fontStyle: 'italic', 
        textAlign: 'center', 
        marginBottom: SPACING.xxlarge 
    },
    revealCard: {
        width: '100%',
        marginBottom: SPACING.xxlarge,
    },
    revealTitle: { 
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
        marginBottom: SPACING.regular,
        textTransform: 'uppercase',
    },
    trueMeaning: { 
        lineHeight: TYPOGRAPHY.fontSize.displayMedium * 1.3,
        marginBottom: SPACING.xlarge 
    },
    insightContainer: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        paddingTop: SPACING.regular, 
        borderTopWidth: 1, 
        borderTopColor: COLORS.borderSubtle 
    },
    insightText: { 
        marginLeft: SPACING.regular, 
        flex: 1 
    },
    actionButton: {
        backgroundColor: COLORS.brightYellow,
        ...SHADOWS.medium,
    },
    nextStepText: { 
        marginTop: SPACING.regular,
        textTransform: 'uppercase',
    }
});

export default TranslationReveal;
