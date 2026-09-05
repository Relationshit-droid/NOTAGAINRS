
import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const actionSteps = [
    {
        title: 'THE APPROACH',
        description: 'Active Listening: Shift your mindset to hear their needs without formulating a rebuttal.',
        category: 'MINDSET SHIFT',
        icon: '🧠',
        color: COLORS.brightYellow
    },
    {
        title: 'THE ACTION',
        description: '10-Minute Check-in: Set aside focused, phone-free time tonight to discuss how you feel.',
        category: 'BEHAVIORAL TASK',
        icon: '💬',
        color: COLORS.info
    },
    {
        title: 'THE MAINTENANCE',
        description: 'Gratitude: Express one specific thing you appreciate about how they handled this talk.',
        category: 'LONG-TERM BOND',
        icon: '💖',
        color: COLORS.vibrantPink
    },
];

const ActionCard = ({ step }) => (
    <GlassCard style={[styles.card, { borderColor: `${step.color}80` }]}>
        <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${step.color}20` }]}>
                <Typography style={{fontSize: TYPOGRAPHY.fontSize.displaySmall}}>{step.icon}</Typography>
            </View>
        </View>
        <Typography variant="h3" style={styles.cardTitle}>{step.title}</Typography>
        <Typography variant="body" color={COLORS.textSecondary} style={styles.cardDescription}>{step.description}</Typography>
        <Typography variant="caption" style={[styles.cardCategory, { color: step.color }]}>{step.category}</Typography>
    </GlassCard>
);

const TranslatorActionPlan = () => {
    const [scheduleReflection, setScheduleReflection] = useState(true);

    return (
        <ScreenLayout scrollable={true} showHeader={false}>
            <Typography variant="h1" center style={styles.headerTitle}>YOUR ACTION PLAN</Typography>
            <Typography variant="label" center color={COLORS.textSecondary} style={styles.headerSubtitle}>
                CONCRETE STEPS TO HONOR YOUR DECODED CONNECTION
            </Typography>

            <View style={styles.cardsContainer}>
                {actionSteps.map((step, index) => <ActionCard key={index} step={step} />)}
            </View>

            <GlassCard style={styles.reflectionContainer}>
                <View style={{flex: 1}}>
                    <Typography variant="h3" style={styles.reflectionTitle}>SCHEDULE REFLECTION</Typography>
                    <Typography variant="body" color={COLORS.textSecondary} style={styles.reflectionSubtitle}>
                        Get a reminder to revisit this plan in 48 hours.
                    </Typography>
                </View>
                <Switch 
                    value={scheduleReflection}
                    onValueChange={setScheduleReflection}
                    trackColor={{ false: COLORS.textHint, true: COLORS.info }}
                    thumbColor={scheduleReflection ? COLORS.textPrimary : COLORS.textSecondary}
                />
            </GlassCard>

            <SquishyButton onPress={() => {}} style={styles.commitButton}>
                <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerLarge}}>✅</Typography>
                <Typography variant="button" style={styles.commitButtonText}>COMMIT TO PLAN</Typography>
            </SquishyButton>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    headerTitle: { 
        textTransform: 'uppercase' 
    },
    headerSubtitle: { 
        marginBottom: SPACING.xxlarge,
        textTransform: 'uppercase',
    },
    cardsContainer: { 
        marginBottom: SPACING.xxlarge, 
        gap: SPACING.regular 
    },
    card: { 
        marginBottom: SPACING.regular,
    },
    cardHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: SPACING.medium 
    },
    iconContainer: { 
        width: 50, 
        height: 50, 
        borderRadius: BORDER_RADIUS.medium, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    cardTitle: { 
        marginBottom: SPACING.small,
        textTransform: 'uppercase' 
    },
    cardDescription: { 
        lineHeight: TYPOGRAPHY.fontSize.bodyLarge * 1.5,
        flex: 1, 
        marginBottom: SPACING.regular 
    },
    cardCategory: { 
        textTransform: 'uppercase',
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    },
    reflectionContainer: { 
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: SPACING.xxlarge,
    },
    reflectionTitle: { 
        textTransform: 'uppercase' 
    },
    reflectionSubtitle: { 
        marginTop: SPACING.tiny 
    },
    commitButton: { 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    commitButtonText: { 
        marginLeft: SPACING.small,
    },
});

export default TranslatorActionPlan;
