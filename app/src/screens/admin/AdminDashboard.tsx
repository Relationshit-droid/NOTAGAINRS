import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ScreenLayout } from "../../layout";
import { Typography, SquishyButton, GlassCard } from "../../components/ui";
import { COLORS, SPACING, BORDER_RADIUS } from "../../theme";
import { useAppStore } from "../../state/store";
import { withAdminGuard } from "../../hoc/withAdminGuard";

const AdminDashboardComponent = ({ navigation }: { navigation: any }) => {
  const adminData = useAppStore(s => s.adminData);

  return (
    <ScreenLayout
      showHeader={true}
      scrollable={true}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Typography variant="h1" color={COLORS.textPrimary} style={{ marginBottom: SPACING.xlarge }}>
          Admin Dashboard
        </Typography>

        {/* Quick Stats Cards */}
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard}>
            <Typography variant="label" color={COLORS.textSecondary}>Total Users</Typography>
            <Typography variant="h2" color={COLORS.textPrimary}>
              {adminData?.analytics?.totalUsers?.toLocaleString() || '128,402'}
            </Typography>
            <Typography variant="caption" color={COLORS.success}>+5.2% this cycle</Typography>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Typography variant="label" color={COLORS.textSecondary}>Active Users</Typography>
            <Typography variant="h2" color={COLORS.textPrimary}>
              {adminData?.analytics?.activeUsers?.toLocaleString() || '98,234'}
            </Typography>
            <Typography variant="caption" color={COLORS.success}>+3.1% this cycle</Typography>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Typography variant="label" color={COLORS.textSecondary}>Total Games</Typography>
            <Typography variant="h2" color={COLORS.textPrimary}>
              {adminData?.analytics?.totalGames?.toLocaleString() || '47'}
            </Typography>
            <Typography variant="caption" color={COLORS.info}>All categories</Typography>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <Typography variant="label" color={COLORS.textSecondary}>Total Sessions</Typography>
            <Typography variant="h2" color={COLORS.textPrimary}>
              {adminData?.analytics?.totalSessions?.toLocaleString() || '1.2M'}
            </Typography>
            <Typography variant="caption" color={COLORS.warning}>Avg: {Math.round(adminData?.analytics?.avgSessionDuration || 42)}m</Typography>
          </GlassCard>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <SquishyButton
            onPress={() => navigation.navigate("AdminAnalytics")}
            style={styles.navButton}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              View Analytics
            </Typography>
          </SquishyButton>
          <SquishyButton
            onPress={() => navigation.navigate("AdminUsers")}
            style={styles.navButton}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              Manage Users
            </Typography>
          </SquishyButton>
          <SquishyButton
            onPress={() => navigation.navigate("AdminGames")}
            style={styles.navButton}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              Manage Games
            </Typography>
          </SquishyButton>
          <SquishyButton
            onPress={() => navigation.navigate("AdminSettings")}
            style={styles.navButton}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              System Settings
            </Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default withAdminGuard(AdminDashboardComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.regular,
    paddingBottom: SPACING.xxlarge,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  navButtons: {
    gap: SPACING.regular,
  },
  navButton: {
    paddingVertical: SPACING.medium,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.medium,
  },
});