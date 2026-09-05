import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, SegmentedControlIOS, TouchableOpacity } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { gamesApi } from '../../lib/api';
import { useAppStore } from '../../state/store';

export default function AnalyticsDashboardScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!user || !userId) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const couple = await coupleApi.getCoupleForUser(userId, token);
      
      if (couple) {
        // In real app, fetch from backend /api/analytics/couple/:id?range=
        // For now, generate mock data
        const mockData = generateMockAnalytics(couple, timeRange);
        setAnalytics(mockData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, userId, timeRange]);

  const generateMockAnalytics = (couple: any, range: string) => {
    const now = new Date();
    const days = range === 'week' ? 7 : range === 'month' ? 30 : range === 'quarter' ? 90 : 365;
    
    return {
      overview: {
        totalSessions: Math.floor(Math.random() * 50) + 20,
        totalMinutes: Math.floor(Math.random() * 500) + 200,
        avgSessionLength: Math.floor(Math.random() * 30) + 15,
        completionRate: Math.floor(Math.random() * 30) + 70,
        trustChange: (Math.random() - 0.3) * 20,
        vulnerabilityChange: (Math.random() - 0.2) * 15,
        romanceChange: (Math.random() - 0.1) * 10,
        connectionChange: (Math.random() - 0.2) * 12,
      },
      categoryBreakdown: [
        { category: 'Emotional Connection', sessions: 12, avgScore: 82, color: COLORS.rosePink },
        { category: 'Conflict Resolution', sessions: 8, avgScore: 75, color: COLORS.vibrantPink },
        { category: 'Intimacy & Romance', sessions: 6, avgScore: 88, color: COLORS.warmOrange },
        { category: 'Growth & Repair', sessions: 5, avgScore: 79, color: COLORS.mintGreen },
        { category: 'Creative Chaos', sessions: 4, avgScore: 71, color: COLORS.lavenderPurple },
        { category: 'Game Show', sessions: 3, avgScore: 85, color: COLORS.brightYellow },
      ],
      weeklyTrend: Array.from({ length: days }, (_, i) => ({
        date: new Date(now.getTime() - (days - i) * 86400000).toISOString().split('T')[0],
        sessions: Math.floor(Math.random() * 3),
        minutes: Math.floor(Math.random() * 45) + 10,
        trust: 50 + Math.random() * 30,
      })),
      partnerComparison: {
        player1: { sessions: 18, avgScore: 81, favoriteCategory: 'Emotional Connection' },
        player2: { sessions: 15, avgScore: 79, favoriteCategory: 'Intimacy & Romance' },
      },
      insights: [
        { type: 'positive', text: 'Conflict resolution scores improved 15% this month', icon: 'trending-up', color: COLORS.mintGreen },
        { type: 'positive', text: 'You both play Emotional Connection games most often', icon: 'heart', color: COLORS.rosePink },
        { type: 'warning', text: 'Creative Chaos category neglected - try Role-Swap Roast!', icon: 'alert-circle', color: COLORS.warmOrange },
        { type: 'info', text: 'Saturday evenings are your peak play time', icon: 'calendar', color: COLORS.aquaTeal },
      ],
      achievements: {
        unlocked: 12,
        total: 28,
        recent: [
          { name: 'Week Warrior', date: '3 days ago', icon: 'flame' },
          { name: 'Trust Builder', date: '1 week ago', icon: 'shield' },
          { name: 'Vulnerability Victor', date: '2 weeks ago', icon: 'heart' },
        ],
      },
    };
  };

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={GRADIENTS.primary.colors} style={styles.loadingGlow}>
            <Ionicons name="analytics" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Analyzing your relationship data...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  if (!analytics) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="header" center>No Data Available</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const timeRangeOptions = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'Year', value: 'year' },
  ];

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Time Range Selector */}
        <GlassCard style={styles.timeRangeCard}>
          <Typography variant="label" style={styles.timeRangeLabel}>TIME RANGE</Typography>
          <SegmentedControlIOS
            values={timeRangeOptions.map(o => o.label)}
            selectedIndex={timeRangeOptions.findIndex(o => o.value === timeRange)}
            onChange={(e) => setTimeRange(timeRangeOptions[e.nativeEvent.selectedSegmentIndex].value as any)}
            selectedSegmentTintColor={COLORS.vibrantPink}
            backgroundColor={COLORS.backgroundSecondary}
          />
        </GlassCard>

        {/* Overview Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard 
            title="Sessions" 
            value={analytics.overview.totalSessions} 
            subtitle={`+${Math.floor(Math.random() * 5) + 1} this ${timeRange}`}
            icon="game-controller"
            color={COLORS.vibrantPink}
            trend="up"
            trendValue={12}
          />
          <MetricCard 
            title="Minutes Played" 
            value={analytics.overview.totalMinutes} 
            subtitle={`Avg ${analytics.overview.avgSessionLength}min/session`}
            icon="time"
            color={COLORS.aquaTeal}
            trend="up"
            trendValue={8}
          />
          <MetricCard 
            title="Completion Rate" 
            value={`${analytics.overview.completionRate}%`} 
            subtitle="Games finished"
            icon="checkmark-circle"
            color={COLORS.mintGreen}
            trend="up"
            trendValue={5}
          />
          <MetricCard 
            title="Trust Level" 
            value={`${Math.max(0, Math.min(100, 65 + analytics.overview.trustChange))}%`} 
            subtitle={`${analytics.overview.trustChange >= 0 ? '+' : ''}${analytics.overview.trustChange.toFixed(1)}% change`}
            icon="trending-up"
            color={COLORS.brightYellow}
            trend={analytics.overview.trustChange >= 0 ? 'up' : 'down'}
            trendValue={Math.abs(analytics.overview.trustChange)}
          />
        </View>

        {/* Relationship Meters */}
        <GlassCard style={styles.metersCard}>
          <Typography variant="label" style={styles.sectionTitle}>RELATIONSHIP METERS</Typography>
          <View style={styles.metersGrid}>
            <MeterItem 
              label="Trust" 
              value={Math.max(0, Math.min(100, 65 + analytics.overview.trustChange))} 
              color={COLORS.brightYellow}
              change={analytics.overview.trustChange}
            />
            <MeterItem 
              label="Vulnerability" 
              value={Math.max(0, Math.min(100, 42 + analytics.overview.vulnerabilityChange))} 
              color={COLORS.rosePink}
              change={analytics.overview.vulnerabilityChange}
            />
            <MeterItem 
              label="Romance" 
              value={Math.max(0, Math.min(100, 58 + analytics.overview.romanceChange))} 
              color={COLORS.warmOrange}
              change={analytics.overview.romanceChange}
            />
            <MeterItem 
              label="Connection" 
              value={Math.max(0, Math.min(100, 71 + analytics.overview.connectionChange))} 
              color={COLORS.aquaTeal}
              change={analytics.overview.connectionChange}
            />
          </View>
        </GlassCard>

        {/* Category Breakdown */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>CATEGORY BREAKDOWN</Typography>
          <View style={styles.categoryBreakdown}>
            {analytics.categoryBreakdown.map((cat: any, index: number) => (
              <CategoryRow key={cat.category} cat={cat} index={index} />
            ))}
          </View>
        </GlassCard>

        {/* Partner Comparison */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>PARTNER COMPARISON</Typography>
          <View style={styles.partnerComparison}>
            <PartnerColumn 
              label="You" 
              data={analytics.partnerComparison.player1} 
              color={COLORS.vibrantPink}
            />
            <View style={styles.divider} />
            <PartnerColumn 
              label="Partner" 
              data={analytics.partnerComparison.player2} 
              color={COLORS.aquaTeal}
            />
          </View>
        </GlassCard>

        {/* Insights */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>DR. MARCIE'S INSIGHTS</Typography>
          <View style={styles.insightsList}>
            {analytics.insights.map((insight: any, index: number) => (
              <InsightItem key={index} insight={insight} />
            ))}
          </View>
        </GlassCard>

        {/* Achievements */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.achievementsHeader}>
            <Typography variant="label" style={styles.sectionTitle}>ACHIEVEMENTS</Typography>
            <Typography variant="caption" style={styles.achievementsProgress}>
              {analytics.achievements.unlocked} / {analytics.achievements.total} unlocked
            </Typography>
          </View>
          <View style={styles.achievementsGrid}>
            {analytics.achievements.recent.map((ach: any, index: number) => (
              <AchievementItem key={index} achievement={ach} recent />
            ))}
          </View>
          <SquishyButton 
            variant="secondary"
            onPress={() => {}}
            style={styles.viewAllButton}
          >
            <Typography variant="button">VIEW ALL ACHIEVEMENTS</Typography>
          </SquishyButton>
        </GlassCard>

        {/* Export Button */}
        <SquishyButton 
          variant="secondary"
          onPress={() => {}}
          style={styles.exportButton}
        >
          <Ionicons name="download" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
          <Typography variant="button">EXPORT REPORT (PDF)</Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
}

const MetricCard = ({ title, value, subtitle, icon, color, trend, trendValue }: any) => (
  <GlassCard style={styles.metricCard}>
    <LinearGradient colors={[color, color + '80']} style={styles.metricIcon}>
      <Ionicons name={icon} size={24} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.metricValue}>{value}</Typography>
    <Typography variant="label" style={styles.metricTitle}>{title}</Typography>
    <Typography variant="caption" style={styles.metricSubtitle}>{subtitle}</Typography>
    <View style={[
      styles.metricTrend,
      { backgroundColor: trend === 'up' ? COLORS.mintGreen + '20' : COLORS.vibrantPink + '20' }
    ]}>
      <Ionicons name={trend === 'up' ? 'trending-up' : 'trending-down'} size={12} color={trend === 'up' ? COLORS.mintGreen : COLORS.vibrantPink} />
      <Typography variant="caption" style={{ color: trend === 'up' ? COLORS.mintGreen : COLORS.vibrantPink, marginLeft: 2 }}>
        {trend === 'up' ? '+' : ''}{trendValue}%
      </Typography>
    </View>
  </GlassCard>
);

const MeterItem = ({ label, value, color, change }: any) => (
  <View style={styles.meterItem}>
    <View style={styles.meterHeader}>
      <Typography variant="label" style={styles.meterLabel}>{label}</Typography>
      <Typography variant="caption" style={[
        styles.meterChange,
        { color: change >= 0 ? COLORS.mintGreen : COLORS.vibrantPink }
      ]}>
        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </Typography>
    </View>
    <View style={styles.meterBarTrack}>
      <View style={[
        styles.meterBarFill,
        { width: `${value}%`, backgroundColor: color }
      ]} />
    </View>
    <Typography variant="header" style={{ color, textAlign: 'right' }}>{Math.round(value)}%</Typography>
  </View>
);

const CategoryRow = ({ cat, index }: any) => (
  <View style={styles.categoryRow}>
    <LinearGradient colors={[cat.color, cat.color + '80']} style={styles.categoryIcon}>
      <Ionicons name="game-controller" size={20} color={COLORS.textPrimary} />
    </LinearGradient>
    <View style={styles.categoryInfo}>
      <Typography variant="label" style={styles.categoryName}>{cat.category}</Typography>
      <View style={styles.categoryMiniStats}>
        <Typography variant="caption" style={styles.miniStat}>
          <Ionicons name="game-controller" size={12} color={COLORS.textHint} style={{ marginRight: 2 }} />
          {cat.sessions} sessions
        </Typography>
        <Typography variant="caption" style={styles.miniStat}>
          <Ionicons name="star" size={12} color={COLORS.brightYellow} style={{ marginRight: 2 }} />
          {cat.avgScore}% avg
        </Typography>
      </View>
    </View>
    <View style={styles.categoryProgress}>
      <View style={[
        styles.miniProgressTrack,
        { backgroundColor: cat.color + '20' }
      ]}>
        <View style={[
          styles.miniProgressFill,
          { width: `${cat.avgScore}%`, backgroundColor: cat.color }
        ]} />
      </View>
    </View>
  </View>
);

const PartnerColumn = ({ label, data, color }: any) => (
  <View style={styles.partnerColumn}>
    <Typography variant="label" style={[styles.partnerLabel, { color }]}>{label}</Typography>
    <View style={styles.partnerStats}>
      <PartnerStat value={data.sessions} label="Sessions" />
      <PartnerStat value={data.avgScore} label="Avg Score" suffix="%" />
      <PartnerStat value={0} label="Fav Category" custom={<Typography variant="caption" color={COLORS.textSecondary}>{data.favoriteCategory}</Typography>} />
    </View>
  </View>
);

const PartnerStat = ({ value, label, suffix, custom }: any) => (
  <View style={styles.partnerStat}>
    {custom || <Typography variant="header" color={COLORS.textPrimary}>{value}{suffix || ''}</Typography>}
    <Typography variant="caption" color={COLORS.textSecondary}>{label}</Typography>
  </View>
);

const InsightItem = ({ insight }: any) => (
  <View style={styles.insightItem}>
    <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
      <Ionicons name={insight.icon} size={20} color={insight.color} />
    </View>
    <Typography variant="body" style={styles.insightText}>{insight.text}</Typography>
  </View>
);

const AchievementItem = ({ achievement, recent }: any) => (
  <View style={[
    styles.achievementItem,
    recent && styles.achievementRecent,
  ]}>
    <LinearGradient colors={GRADIENTS.primary.colors} style={styles.achievementIcon}>
      <Ionicons name={achievement.icon} size={24} color={COLORS.textPrimary} />
    </LinearGradient>
    <View style={styles.achievementInfo}>
      <Typography variant="label" style={styles.achievementName}>{achievement.name}</Typography>
      <Typography variant="caption" style={styles.achievementDate}>{achievement.date}</Typography>
    </View>
    {recent && <Ionicons name="sparkles" size={20} color={COLORS.brightYellow} />}
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
  },
  loadingGlow: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.large,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  timeRangeCard: {
    marginBottom: SPACING.xlarge,
  },
  timeRangeLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.regular,
    color: COLORS.textSecondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  metricCard: {
    width: '48%',
    padding: SPACING.large,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  metricValue: {
    marginBottom: SPACING.tiny,
  },
  metricTitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.tiny,
  },
  metricSubtitle: {
    color: COLORS.textHint,
    fontSize: 11,
    marginBottom: SPACING.regular,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
    alignSelf: 'flex-start',
  },
  metersCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
  metersGrid: {
    gap: SPACING.regular,
  },
  meterItem: {
    gap: SPACING.regular,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meterLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  meterChange: {
    fontWeight: '600',
  },
  meterBarTrack: {
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  meterBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  categoryBreakdown: {
    gap: SPACING.regular,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    marginBottom: SPACING.tiny,
  },
  categoryMiniStats: {
    flexDirection: 'row',
    gap: SPACING.regular,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    color: COLORS.textHint,
  },
  categoryProgress: {
    width: 60,
    alignItems: 'flex-end',
  },
  miniProgressTrack: {
    width: '100%',
    height: 4,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  partnerComparison: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  partnerColumn: {
    flex: 1,
    padding: SPACING.regular,
  },
  partnerLabel: {
    textAlign: 'center',
    marginBottom: SPACING.large,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  partnerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  partnerStat: {
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.borderSubtle,
  },
  insightsList: {
    gap: SPACING.regular,
  },
  insightItem: {
    flexDirection: 'row',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  insightText: {
    flex: 1,
    lineHeight: 22,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  achievementsProgress: {
    color: COLORS.textSecondary,
  },
  achievementsGrid: {
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  achievementRecent: {
    borderWidth: 1,
    borderColor: COLORS.brightYellow + '60',
    backgroundColor: COLORS.brightYellow + '10',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    marginBottom: SPACING.tiny,
  },
  achievementDate: {
    color: COLORS.textHint,
    fontSize: 11,
  },
  viewAllButton: {
    marginTop: SPACING.regular,
  },
  exportButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
  },
});