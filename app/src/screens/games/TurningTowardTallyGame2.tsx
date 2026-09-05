import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard, Typography, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const timelineEvents = [
    { icon: 'touch-app' as const, color: COLORS.info, title: 'Physical Bid', subtitle: '2m response time', status: 'Synchronized' },
    { icon: 'chat-bubble' as const, color: COLORS.emotionalConnection, title: 'Verbal Bid', subtitle: 'Instant turn-toward', status: '+50pts' },
    { icon: 'volunteer-activism' as const, color: COLORS.success, title: 'Service Bid', subtitle: '15m response time', status: 'Processed' },
    { icon: 'error' as const, color: COLORS.error, title: 'Failed Sync', subtitle: 'Turned away', status: 'Missed bid penalty' },
    { icon: 'hotel-class' as const, color: COLORS.lavenderPurple, title: 'Quality Time Bid', subtitle: 'Ongoing Session', status: 'Active' },
];

const StatCard = ({ label, value, trend }: { label: string; value: string; trend: string }) => (
    <GlassCard style={styles.statCard}>
        <Typography variant="caption">{label}</Typography>
        <Typography variant="h1">{value}</Typography>
        <Typography variant="small" style={styles.trendText}>{trend}</Typography>
    </GlassCard>
);

const TimelineItem = ({ event }: { event: typeof timelineEvents[0] }) => (
    <View style={styles.timelineItem}>
        <View style={[styles.timelineIconContainer, { borderColor: event.color }]}>
            <MaterialIcons name={event.icon} size={24} color={event.color} />
        </View>
        <View style={styles.timelineTextContainer}>
            <Typography variant="body">{event.title}</Typography>
            <Typography variant="caption">{event.subtitle} <Typography variant="caption" style={[styles.eventStatus, { color: event.color }]}>{event.status}</Typography></Typography>
        </View>
    </View>
);

const TurningTowardTallyGame2 = () => {
    return (
        <ScreenLayout showHeader={true} scrollable={true}>
            <Typography variant="h1" center>Turning Toward Tally</Typography>
            <Typography variant="h2" center style={styles.subtitle}>Live audit of your connection bids.</Typography>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
                <StatCard label="Days in Sync" value="12 Days" trend="+2%" />
                <StatCard label="Emotional Currency" value="4,250" trend="+540" />
                <StatCard label="Response Rate" value="92%" trend="+5%" />
            </ScrollView>

            <GlassCard style={styles.timelineContainer}>
                <Typography variant="h3" style={styles.timelineTitle}>24-Hour Bid Timeline</Typography>
                {timelineEvents.map((event, index) => <TimelineItem key={index} event={event} />)}
            </GlassCard>

            <View style={styles.auditorTip}>
                <MaterialIcons name="lightbulb" size={24} color={COLORS.warning} style={styles.tipIcon}/>
                <Typography variant="body" style={styles.tipText}>Decrease screen time during dinner to boost Emotional Currency by <Typography variant="body" style={styles.tipHighlight}>+25%</Typography>.</Typography>
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    subtitle: {
        marginBottom: SPACING.xlarge,
    },
    statsRow: { 
        marginBottom: SPACING.xlarge 
    },
    statCard: { 
        padding: SPACING.regular, 
        marginRight: SPACING.regular, 
        width: 160,
        alignItems: 'center',
    },
    trendText: {
        color: COLORS.success,
    },
    timelineContainer: { 
        marginBottom: SPACING.xlarge 
    },
    timelineTitle: {
        marginBottom: SPACING.regular,
    },
    timelineItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: SPACING.regular 
    },
    timelineIconContainer: { 
        width: 40, 
        height: 40, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: SPACING.regular 
    },
    timelineTextContainer: { 
        flex: 1 
    },
    auditorTip: { 
        flexDirection: 'row', 
        backgroundColor: COLORS.backgroundCard, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        alignItems: 'center' 
    },
    tipIcon: {
        marginRight: SPACING.regular,
    },
    tipText: {
        flex: 1,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
    },
    tipHighlight: {
        color: COLORS.success,
    },
    eventStatus: {
        // Dynamic color applied inline
    },
});

export default TurningTowardTallyGame2;
