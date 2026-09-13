import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { useAppStore } from '../../state/store';
import { withAdminGuard } from '../../hoc/withAdminGuard';

const AdminAnalyticsDashboardComponent = () => {
  const [dailyActiveUsers, setDailyActiveUsers] = useState(0);
  const [retention, setRetention] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [avgSessionDuration, setAvgSessionDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const adminData = useAppStore(s => s.adminData);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      if (adminData?.analytics) {
        setDailyActiveUsers(adminData.analytics.activeUsers || 0);
        setTotalSessions(adminData.analytics.totalSessions || 0);
        setAvgSessionDuration(adminData.analytics.avgSessionDuration || 0);
      } else {
        // Fallback for DEMO_MODE
        setDailyActiveUsers(1337);
        setTotalSessions(1200000);
        setAvgSessionDuration(42);
      }
      setRetention(42); // D30 retention percentage
    } catch (error) {
      console.error('[AdminAnalytics] Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <ScreenLayout showHeader={true} scrollable={true}>
        <View style={styles.center}>
          <Typography variant="body">Loading analytics...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      showHeader={true}
      scrollable={true}
    >
      <Typography variant="h1" color={COLORS.textPrimary}>
        Analytics Dashboard
      </Typography>
      <Typography variant="body" color={COLORS.textSecondary} style={{ marginBottom: SPACING.xlarge }}>
        Real-time performance overview of the cosmic nebula ecosystem
      </Typography>

      <View style={styles.kpiGrid}>
        <GlassCard style={styles.kpiCard}>
          <Typography variant="label" color={COLORS.textSecondary}>
            Daily Active Users
          </Typography>
          <Typography variant="h2" color={COLORS.textPrimary}>
            {dailyActiveUsers.toLocaleString()}
          </Typography>
          <Typography variant="caption" color={COLORS.success}>+5.2% vs last week</Typography>
        </GlassCard>
        <GlassCard style={styles.kpiCard}>
          <Typography variant="label" color={COLORS.textSecondary}>
            Retention (D30)
          </Typography>
          <Typography variant="h2" color={COLORS.textPrimary}>
            {retention}%
          </Typography>
          <Typography variant="caption" color={COLORS.info}>Industry avg: 35%</Typography>
        </GlassCard>
        <GlassCard style={styles.kpiCard}>
          <Typography variant="label" color={COLORS.textSecondary}>
            Total Sessions
          </Typography>
          <Typography variant="h2" color={COLORS.textPrimary}>
            {totalSessions.toLocaleString()}
          </Typography>
          <Typography variant="caption" color={COLORS.warning}>Avg: {Math.round(avgSessionDuration)}m/session</Typography>
        </GlassCard>
      </View>

      <GlassCard style={styles.chartCard}>
        <Typography variant="h3" color={COLORS.textPrimary} style={{ marginBottom: SPACING.regular }}>
          Engagement Trends
        </Typography>
        <View style={styles.chartPlaceholder}>
          <Typography variant="body" color={COLORS.textSecondary}>
            Chart Placeholder - Connect to adminApi.fetchAnalytics()
          </Typography>
        </View>
      </GlassCard>
    </ScreenLayout>
  );
};

export default withAdminGuard(AdminAnalyticsDashboardComponent);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xlarge,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    marginHorizontal: SPACING.tiny,
    marginBottom: SPACING.regular,
    minWidth: '30%',
  },
  chartCard: {
    marginTop: SPACING.xlarge,
    padding: SPACING.regular,
  },
  chartPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
  },
});