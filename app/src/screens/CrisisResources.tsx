import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const resources = [
    { 
        title: '988 Suicide & Crisis Lifeline',
        description: 'Free, confidential support available 24/7.',
        action: 'Call 988',
        onPress: () => Linking.openURL('tel:988'),
        icon: 'call-outline' as const,
        color: COLORS.vibrantPink
    },
    {
        title: 'Domestic Violence Hotline',
        description: 'Safety planning and crisis intervention.',
        action: 'Call 1-800-799-7233',
        onPress: () => Linking.openURL('tel:1-800-799-7233'),
        icon: 'shield-outline' as const,
        color: COLORS.lavenderPurple
    },
    {
        title: 'Crisis Text Line',
        description: 'Text HOME to 741741 to connect with a counselor.',
        action: 'Text HOME to 741741',
        onPress: () => Linking.openURL('sms:741741'),
        icon: 'chatbubble-ellipses-outline' as const,
        color: COLORS.info
    }
];

const ResourceCard = ({ title, description, action, onPress, icon, color }: { 
    title: string, 
    description: string, 
    action: string, 
    onPress: () => void, 
    icon: any, 
    color: string 
}) => (
    <GlassCard style={[styles.card, { borderLeftColor: color }]}>
        <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon} size={28} color={color} />
            </View>
            <Typography variant="header" style={[styles.cardTitle, { color }]}>{title}</Typography>
        </View>
        <Typography variant="body" style={styles.cardDescription}>{description}</Typography>
        <SquishyButton 
            onPress={onPress}
            variant="primary"
            size="large"
            style={[styles.actionButton, { backgroundColor: color }]}
        >
            {action}
        </SquishyButton>
    </GlassCard>
);

const CrisisResourcesScreen = () => {
    return (
        <ScreenLayout showMarcie={true} marcieQuote="Your safety is the priority. Help is available.">
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Typography variant="h1" style={styles.headerTitle}>IMMEDIATE HELP</Typography>
                        <Typography variant="body" style={styles.headerSubtitle}>
                            If you are in danger, call 911. Your safety is the priority.
                        </Typography>
                    </View>

                    {resources.map((res, index) => <ResourceCard key={index} {...res} />)}

                    <SquishyButton 
                        onPress={() => {}}
                        variant="ghost"
                        style={styles.safetyExitButton}
                    >
                        <Ionicons name="exit-outline" size={20} color={COLORS.error} />
                        <Typography variant="button" style={styles.safetyExitText}>QUICK EXIT</Typography>
                    </SquishyButton>
                </ScrollView>
            </SafeAreaView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: { 
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    header: { 
        marginBottom: SPACING.lg, 
        alignItems: 'center',
    },
    headerTitle: { 
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    headerSubtitle: { 
        textAlign: 'center', 
        opacity: 0.7,
    },
    card: { 
        marginBottom: SPACING.lg,
        borderLeftWidth: 4,
        padding: SPACING.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.round,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: { 
        flex: 1,
    },
    cardDescription: { 
        opacity: 0.7, 
        marginBottom: SPACING.lg, 
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyMedium,
    },
    actionButton: { 
        width: '100%',
    },
    safetyExitButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: SPACING.sm, 
        marginTop: SPACING.lg, 
        padding: SPACING.md, 
        borderRadius: BORDER_RADIUS.large,
        backgroundColor: `${COLORS.error}15`,
        borderWidth: 1,
        borderColor: `${COLORS.error}30`,
    },
    safetyExitText: { 
        color: COLORS.error,
    },
});

export default CrisisResourcesScreen;
