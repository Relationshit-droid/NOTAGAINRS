import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { userApi, coupleApi, gamesApi } from '../../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardHome({ navigation }: any) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [coupleData, setCoupleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const token = await user.getIdToken();
        
        // Get user data
        const userData = await userApi.get(user.uid, token);
        setUserData(userData);
        
        // Get couple data
        const couple = await coupleApi.getCoupleForUser(user.uid, token);
        if (couple) {
          setCoupleData(couple);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const metrics = [
    { name: 'Trust Meter', value: coupleData?.relationship_meters?.trust || coupleData?.trust_meter || 0.5, color: COLORS.mintGreen },
    { name: 'Vulnerability', value: coupleData?.relationship_meters?.vulnerability || coupleData?.vulnerability_meter || 0.4, color: COLORS.softViolet },
    { name: 'Romance', value: coupleData?.relationship_meters?.romance || coupleData?.romance_meter || 0.6, color: COLORS.romanceHub },
    { name: 'Connection', value: coupleData?.relationship_meters?.connection || coupleData?.connection_meter || 0.55, color: COLORS.emotionalConnection },
  ];

  const recentActivities = [
    { id: 1, game: 'Truth Teller Tower', date: 'Today', score: 85 },
    { id: 2, game: 'Gratitude Cloud', date: 'Yesterday', score: 72 },
    { id: 3, game: 'Apology Auction', date: '2 days ago', score: 90 },
  ];

  const renderMetricCard = (metric: any) => (
    <GlassCard key={metric.name} style={styles.metricCard} variant="outlined">
      <Typography variant="label" style={{ color: metric.color, marginBottom: SPACING.small }}>
        {metric.name}
      </Typography>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${metric.value * 100}%`, 
                backgroundColor: metric.color 
              }
            ]} 
          />
        </View>
        <Typography variant="caption" style={{ color: COLORS.textSecondary, marginTop: SPACING.small }}>
          {(metric.value * 100).toFixed(0)}%
        </Typography>
      </View>
    </GlassCard>
  );

  const renderActivityItem = (activity: any) => (
    <SquishyButton 
      key={activity.id}
      onPress={() => navigation.navigate('GamePlayScreen', { gameId: activity.game.toLowerCase().replace(/\s+/g, '-') })}
      variant="secondary"
      size="small"
    >
      <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activityGradient}
      >
        <View style={styles.activityContent}>
          <Typography variant="body" style={{ color: COLORS.textPrimary }}>
            {activity.game}
          </Typography>
          <Typography variant="caption" style={{ color: COLORS.textSecondary }}>
            {activity.date}
          </Typography>
        </View>
        <View style={styles.scoreContainer}>
          <Typography variant="header" style={{ color: COLORS.textPrimary }}>
            {activity.score}
          </Typography>
        </View>
      </LinearGradient>
    </SquishyButton>
  );

  return (
    <ScreenLayout showHeader={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="header" style={styles.title}>Welcome Back!</Typography>
          <Typography variant="body" style={styles.subtitle}>
            {userData?.display_name ? `Hi, ${userData.display_name}` : 'Ready to strengthen your bond?'}
          </Typography>
        </View>

        <GlassCard style={styles.coupleCard}>
          <Typography variant="header" style={{ marginBottom: SPACING.regular }}>
            Your Connection
          </Typography>
          
          <View style={styles.coupleInfo}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={GRADIENTS.avatarRing.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarRing}
              >
                <View style={styles.avatarPlaceholder}>
                  <Typography variant="header">
                    {userData?.display_name?.charAt(0) || 'U'}
                  </Typography>
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.connectionInfo}>
              <Typography variant="body" style={{ marginBottom: SPACING.tiny }}>
                Together for {coupleData?.streak_days || 0} days
              </Typography>
              <Typography variant="caption" style={{ color: COLORS.textSecondary }}>
                Total points: {coupleData?.total_points || 0}
              </Typography>
            </View>
          </View>
        </GlassCard>

        <Typography variant="header" style={styles.sectionTitle}>Relationship Metrics</Typography>
        <View style={styles.metricsGrid}>
          {metrics.map(renderMetricCard)}
        </View>

        <Typography variant="header" style={styles.sectionTitle}>Recent Activities</Typography>
        <View style={styles.activitiesContainer}>
          {recentActivities.map(renderActivityItem)}
        </View>

        <SquishyButton onPress={() => navigation.navigate('MainGameLibrary')}>
          <Typography variant="button">Play Again</Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxlarge,
  },
  header: {
    marginBottom: SPACING.large,
  },
  title: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  coupleCard: {
    marginBottom: SPACING.large,
    padding: SPACING.xlarge,
  },
  coupleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: SPACING.regular,
  },
  avatarRing: {
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.tiny,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.xxlarge,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    marginVertical: SPACING.regular,
  },
  metricsGrid: {
    flexDirection: 'column',
    gap: SPACING.regular,
    marginBottom: SPACING.large,
  },
  metricCard: {
    width: '100%',
  },
  progressContainer: {
    alignItems: 'flex-start',
  },
  progressBar: {
    width: '100%',
    height: SPACING.small,
    backgroundColor: COLORS.divider,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.small,
  },
  activitiesContainer: {
    marginBottom: SPACING.large,
  },
  activityGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
  },
  activityContent: {
    flex: 1,
  },
  scoreContainer: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.backgroundPrimary,
    borderRadius: BORDER_RADIUS.medium,
  },
});