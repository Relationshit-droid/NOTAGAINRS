import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const recentBids = [
    {
        icon: 'sms' as const,
        title: '"Text 🌧️ u up?"',
        time: 'Received 11:42 PM',
        latency: '22m 14s',
        status: 'Turned Away'
    },
    {
        icon: 'restaurant' as const,
        title: '"What\'s for dinner? 🍝"',
        time: 'Received 6:15 PM',
        latency: '0m 45s',
        status: 'Turned Toward'
    },
    {
        icon: 'visibility' as const,
        title: '"Look at this weird bird! 🦜"',
        time: 'Received 3:30 PM',
        latency: '1m 12s',
        status: 'Turned Toward'
    },
    {
        icon: 'forum' as const,
        title: '"Did you see the news about..."',
        time: 'Received 1:05 PM',
        latency: '4m 59s',
        status: 'Turned Toward'
    }
];

const BidRow = ({ bid }: { bid: typeof recentBids[0] }) => (
    <View style={styles.bidRow}>
        <View style={styles.bidRowContent}>
            <View style={styles.bidIconContainer}>
                <MaterialIcons name={bid.icon} size={24} color={COLORS.vibrantPink} />
            </View>
            <View>
                <Typography variant="body">{bid.title}</Typography>
                <Typography variant="caption">{bid.time}</Typography>
            </View>
        </View>
        <View style={[styles.statusContainer, bid.status === 'Turned Toward' ? styles.statusToward : styles.statusAway]}>
            <Typography variant="caption" style={bid.status === 'Turned Toward' ? styles.statusTextToward : styles.statusTextAway}>{bid.status.toUpperCase()}</Typography>
        </View>
    </View>
);

const TurningTowardTallyGame1 = () => {
    return (
        <ScreenLayout showHeader={true} scrollable={true}>
            <Typography variant="h1" center>Turning Toward Tally</Typography>
            <Typography variant="h2" center style={styles.subtitle}>Bid Responsiveness Scorecard</Typography>

            <View style={styles.statsGrid}>
                <GlassCard style={styles.statBox}>
                    <Typography variant="caption">Daily Win Rate</Typography>
                    <Typography variant="h1">85%</Typography>
                </GlassCard>
                <GlassCard style={styles.statBox}>
                    <Typography variant="caption">Avg. Bid Latency</Typography>
                    <Typography variant="h1">2m 14s</Typography>
                </GlassCard>
                <GlassCard style={styles.statBox}>
                    <Typography variant="caption">Successful Turns</Typography>
                    <Typography variant="h1">18/21</Typography>
                </GlassCard>
            </View>

            <GlassCard style={styles.bidsTable}>
                <Typography variant="h3" style={styles.bidsTableTitle}>Recent Bid Activity</Typography>
                <View>
                    {recentBids.map((bid, index) => <BidRow key={index} bid={bid} />)}
                </View>
            </GlassCard>

            <SquishyButton onPress={() => {}} style={styles.primaryButton}>
                <Typography variant="button">Initiate Bid for Connection</Typography>
            </SquishyButton>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    subtitle: {
        marginBottom: SPACING.xlarge,
    },
    statsGrid: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: SPACING.xlarge 
    },
    statBox: { 
        alignItems: 'center', 
        width: '32%',
        padding: SPACING.small,
    },
    bidsTable: { 
        marginBottom: SPACING.xlarge 
    },
    bidsTableTitle: {
        marginBottom: SPACING.regular,
    },
    bidRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: SPACING.regular, 
        borderBottomWidth: 1, 
        borderBottomColor: COLORS.divider 
    },
    bidRowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bidIconContainer: { 
        width: 40, 
        height: 40, 
        borderRadius: BORDER_RADIUS.medium, 
        backgroundColor: COLORS.backgroundInput, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: SPACING.regular 
    },
    statusContainer: { 
        paddingVertical: SPACING.tiny, 
        paddingHorizontal: SPACING.small, 
        borderRadius: BORDER_RADIUS.small 
    },
    statusToward: { 
        backgroundColor: `${COLORS.success}20`, 
        borderWidth: 1, 
        borderColor: `${COLORS.success}50` 
    },
    statusAway: { 
        backgroundColor: `${COLORS.error}20`, 
        borderWidth: 1, 
        borderColor: `${COLORS.error}50` 
    },
    statusTextToward: {
        color: COLORS.success,
    },
    statusTextAway: {
        color: COLORS.error,
    },
    primaryButton: { 
        backgroundColor: COLORS.vibrantPink, 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.button, 
        alignItems: 'center' 
    },
});

export default TurningTowardTallyGame1;
