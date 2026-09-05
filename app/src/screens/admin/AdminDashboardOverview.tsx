
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const kpiData = [
  { id: '1', title: 'Total Galactic Users', value: '128,402', change: '+5.2% this cycle', color: COLORS.info },
  { id: '2', title: 'Active SOS Alerts', value: '14', change: '3 critical status', color: COLORS.warning },
  { id: '3', title: 'Cosmic Subscriptions', value: '+12.5%', change: '$142k New ARR', color: COLORS.lavenderPurple },
  { id: '4', title: 'Avg. Session Duration', value: '42m 15s', change: '+1.5% retention', color: COLORS.brightYellow },
];

const activityData = [
    { id: '1', icon: 'warning', title: 'SOS Triggered: Sector 7G', description: 'Couple #8402 reported high emotional turbulence.', time: '2 MINUTES AGO', color: COLORS.warning },
    { id: '2', icon: 'workspace_premium', title: 'New Star Subscription', description: "User 'Vega_Lover' upgraded to Cosmic Tier.", time: '12 MINUTES AGO', color: COLORS.vibrantPink },
    { id: '3', icon: 'auto_awesome', title: 'Milestone Reached', description: "Couple 'Orion' completed the 'Nebula Trust' trial.", time: '45 MINUTES AGO', color: COLORS.lavenderPurple },
    { id: '4', icon: 'person_add', title: 'System Entrance', description: "New couple 'Starlight' initialized connection.", time: '1 HOUR AGO', color: COLORS.vibrantPink },
    { id: '5', icon: 'check_circle', title: 'SOS Resolved', description: 'AI Mediator closed Ticket #2041 successfully.', time: '2 HOURS AGO', color: COLORS.success },
];

const AdminDashboardOverview = () => {

  const renderKpiItem = ({ item }: { item: (typeof kpiData)[number] }) => (
    <GlassCard style={[styles.kpiCard, { borderTopColor: item.color }]}>
      <Typography variant="label" color={COLORS.textSecondary}>
        {item.title}
      </Typography>
      <Typography variant="h2" color={COLORS.textPrimary}>
        {item.value}
      </Typography>
      <Typography variant="caption" color={item.change.startsWith('+') ? COLORS.success : COLORS.error}>
        {item.change}
      </Typography>
    </GlassCard>
  );

  const renderActivityItem = ({ item }: { item: (typeof activityData)[number] }) => (
      <GlassCard style={styles.activityItem}>
        <View style={[styles.activityIcon, { backgroundColor: `${item.color}1A` }]}>
            {/* Using a text placeholder for icon */}
            <Typography variant="h2" color={item.color}>
              {item.icon.charAt(0)}
            </Typography>
        </View>
        <View style={styles.activityDetails}>
            <Typography variant="body" color={COLORS.textPrimary} style={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
              {item.title}
            </Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>
              {item.description}
            </Typography>
            <Typography variant="small" color={COLORS.vibrantPink} style={{ marginTop: SPACING.small }}>
              {item.time}
            </Typography>
        </View>
      </GlassCard>
  )

  return (
    <ScreenLayout
      showHeader={true}
      scrollable={true}
    >
      <View style={styles.headerContainer}>
        <Typography variant="h1" color={COLORS.textPrimary}>
          Cosmic Overview
        </Typography>
        <Typography variant="body" color={COLORS.textSecondary} style={{ marginTop: SPACING.tiny }}>
          Real-time performance tracking for RELATIONSHIT! system nodes.
        </Typography>
      </View>

      <FlatList
        data={kpiData}
        renderItem={renderKpiItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.kpiRow}
        scrollEnabled={false}
      />

        <GlassCard style={styles.chartContainer}>
            <Typography variant="h3" color={COLORS.textPrimary} style={{ marginBottom: SPACING.regular }}>
              User Engagement Trend
            </Typography>
            <View style={styles.chartPlaceholder}>
                <Typography variant="body" color={COLORS.textSecondary}>
                  Chart Placeholder
                </Typography>
            </View>
        </GlassCard>

        <View style={styles.activityFeedContainer}>
            <Typography variant="label" color={COLORS.textPrimary} style={{ marginBottom: SPACING.regular }}>
              Live Activity
            </Typography>
            <FlatList
                data={activityData}
                renderItem={renderActivityItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
            />
        </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
      padding: SPACING.regular,
  },
  kpiRow: {
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.regular,
  },
  kpiCard: {
    borderTopWidth: 3,
    marginBottom: SPACING.regular,
    width: '48%',
  },
  chartContainer: {
      margin: SPACING.regular,
      padding: SPACING.regular,
  },
  chartPlaceholder: {
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.backgroundCard,
      borderRadius: BORDER_RADIUS.large,
  },
  activityFeedContainer: {
      padding: SPACING.regular,
  },
  activityItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: SPACING.regular,
  },
  activityIcon: {
      width: 40,
      height: 40,
      borderRadius: BORDER_RADIUS.medium,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SPACING.regular,
  },
  activityDetails: {
      flex: 1,
  },
});

export default AdminDashboardOverview;
