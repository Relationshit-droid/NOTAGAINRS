import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { GlassCard, Typography, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../state/store';
import { ScreenLayout } from '../../layout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { withAdminGuard } from '../../hoc/withAdminGuard';

// Basic admin portal stub
function AdminPortalComponent({ navigation }: any) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState({
    activeUsers: 0,
    activeFights: 0,
  });
  const theme = useAppStore(s => s.theme);
  const adminData = useAppStore(s => s.adminData);

  useEffect(() => {
    loadSystemStats();
  }, []);

  async function loadSystemStats() {
    try {
      if (adminData?.analytics) {
        setSystemStats({
          activeUsers: adminData.analytics.activeUsers || 0,
          activeFights: adminData.analytics.totalSessions || 0,
        });
      }
      // In DEMO_MODE, use mock data
      if (!adminData?.analytics) {
        setSystemStats({
          activeUsers: 1337,
          activeFights: 42,
        });
      }
    } catch (error) {
      console.error('[AdminPortal] Failed to load stats:', error);
      setSystemStats({
        activeUsers: 1337,
        activeFights: 42,
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <ScreenLayout scrollable={false} showHeader={false}>
      <View style={styles.center}>
        <Typography variant="body">Loading...</Typography>
      </View>
    </ScreenLayout>
  );

  return (
    <ScreenLayout scrollable={true} showHeader={false}>
      <View style={styles.root}>
        <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={StyleSheet.absoluteFill} />
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.back}>
            <Typography variant="header">Exit</Typography>
          </SquishyButton>
          <Typography variant="header">God Mode</Typography>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <GlassCard style={styles.section}>
            <Typography variant="header" style={{ marginBottom: SPACING.medium }}>System Status</Typography>
            <View style={styles.row}>
              <Typography variant="body">Maintenance Mode</Typography>
              <Switch 
                value={maintenanceMode} 
                onValueChange={async (value) => {
                  setMaintenanceMode(value);
                  try {
                    await supabase.from('admin').update({ maintenanceMode: value }).eq('id', 'systemSettings');
                  } catch (error) {
                    console.error('[AdminPortal] Failed to update maintenance mode:', error);
                  }
                }} 
                trackColor={{ false: COLORS.backgroundCard, true: COLORS.vibrantPink }} 
              />
            </View>
            <View style={styles.row}>
              <Typography variant="body">Active Users</Typography>
              <Typography variant="keyword">{systemStats.activeUsers.toLocaleString()}</Typography>
            </View>
            <View style={styles.row}>
              <Typography variant="body">Active Fights</Typography>
              <Typography variant="keyword" style={{ color: COLORS.vibrantPink }}>{systemStats.activeFights}</Typography>
            </View>
          </GlassCard>

          <GlassCard style={styles.section}>
            <Typography variant="header" style={{ marginBottom: SPACING.medium }}>Quick Actions</Typography>
            <View style={styles.grid}>
              <SquishyButton style={styles.actionBtn} onPress={() => Alert.alert('Sent', 'Push notification sent to all users')}>
                <Typography variant="body">Push Blast</Typography>
              </SquishyButton>
              <SquishyButton style={styles.actionBtn} onPress={() => Alert.alert('Cleared', 'Cache cleared')}>
                <Typography variant="body">Clear Cache</Typography>
              </SquishyButton>
              <SquishyButton style={styles.actionBtn} onPress={() => Alert.alert('Reset', 'Leaderboard reset')}>
                <Typography variant="body">Reset Ranks</Typography>
              </SquishyButton>
              <SquishyButton style={styles.actionBtn} onPress={() => Alert.alert('Exported', 'Database dump initiated')}>
                <Typography variant="body">Dump DB</Typography>
              </SquishyButton>
            </View>
          </GlassCard>

          <GlassCard style={styles.section}>
            <Typography variant="header" style={{ marginBottom: SPACING.medium }}>Recent Flags</Typography>
            <View style={styles.flag}>
              <Typography variant="keyword" style={{ color: COLORS.warning }}>WARN</Typography>
              <Typography variant="body">High conflict detected in Session #994</Typography>
            </View>
            <View style={styles.flag}>
              <Typography variant="keyword" style={{ color: COLORS.error }}>CRIT</Typography>
              <Typography variant="body">API Rate Limit exceeded (Gemini)</Typography>
            </View>
          </GlassCard>
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

// Export with admin guard
export default withAdminGuard(AdminPortalComponent);

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.backgroundPrimary 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: SPACING.regular, 
    paddingTop: SPACING.xxlarge 
  },
  back: { 
    paddingHorizontal: SPACING.small, 
    paddingVertical: SPACING.tiny, 
    backgroundColor: COLORS.backgroundCard, 
    borderRadius: BORDER_RADIUS.medium 
  },
  scroll: { padding: SPACING.regular },
  section: { 
    marginBottom: SPACING.large, 
    padding: SPACING.regular 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.medium 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: SPACING.small 
  },
  actionBtn: { 
    width: '48%', 
    backgroundColor: COLORS.backgroundInput, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    alignItems: 'center' 
  },
  flag: { 
    flexDirection: 'row', 
    gap: SPACING.small, 
    marginBottom: SPACING.small, 
    padding: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.small 
  }
});