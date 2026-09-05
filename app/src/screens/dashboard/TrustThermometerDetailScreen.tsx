import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import TrustThermometer from '../../components/ui/TrustThermometer';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { useAppStore } from '../../state/store';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TrustThermometerDetailScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const navigation = useAppNavigation();
  const [trustData, setTrustData] = useState({
    current: 65,
    weeklyChange: 5,
    monthlyChange: 12,
    breakdown: {
      reliability: 70,
      transparency: 60,
      vulnerability: 65,
      consistency: 68,
      repair: 62,
    },
    history: [
      { date: 'Mon', value: 62 },
      { date: 'Tue', value: 64 },
      { date: 'Wed', value: 63 },
      { date: 'Thu', value: 66 },
      { date: 'Fri', value: 67 },
      { date: 'Sat', value: 65 },
      { date: 'Sun', value: 65 },
    ],
    milestones: [
      { threshold: 25, title: 'Fragile Foundation', description: 'Trust is easily broken', unlocked: true },
      { threshold: 50, title: 'Building Blocks', description: 'Consistent reliability emerging', unlocked: true },
      { threshold: 75, title: 'Solid Foundation', description: 'Deep trust established', unlocked: false },
      { threshold: 90, title: 'Unshakeable Bond', description: 'Complete safety & security', unlocked: false },
    ],
    insights: [
      { icon: 'trending-up', text: 'Trust increased 5% this week after successful repair attempts', color: COLORS.mintGreen },
      { icon: 'shield-checkmark', text: 'Consistency score highest - you show up for each other', color: COLORS.aquaTeal },
      { icon: 'alert-circle', text: 'Transparency needs work - share more daily experiences', color: COLORS.vibrantPink },
    ],
    loading: true,
    refreshing: false,
  });

  const fetchTrustData = async () => {
    if (!user || !userId) return;
    try {
      const token = await user.getIdToken();
      const couple = await coupleApi.getCoupleForUser(userId, token);
      if (couple && couple.id) {
        // In real app, fetch from backend /api/couples/:id/trust-history
        // For now, use mock data with couple's trust_meter
        setTrustData(prev => ({
          ...prev,
          current: Math.round(couple.trust_meter * 100),
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch trust data:', error);
      setTrustData(prev => ({ ...prev, loading: false }));
    }
  };

  const onRefresh = async () => {
    setTrustData(prev => ({ ...prev, refreshing: true }));
    await fetchTrustData();
    setTrustData(prev => ({ ...prev, refreshing: false }));
  };

  useEffect(() => {
    fetchTrustData();
  }, [user, userId]);

  const getTrustLevelLabel = (value: number) => {
    if (value < 25) return { label: 'Fragile', color: COLORS.vibrantPink, desc: 'Trust is easily shattered' };
    if (value < 50) return { label: 'Building', color: COLORS.warmOrange, desc: 'Foundation forming' };
    if (value < 75) return { label: 'Solid', color: COLORS.aquaTeal, desc: 'Deep trust established' };
    return { label: 'Unshakeable', color: COLORS.mintGreen, desc: 'Complete safety & security' };
  };

  const currentLevel = getTrustLevelLabel(trustData.current);

  if (trustData.loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <TrustThermometer level={0.65} width={80} height={240} />
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Analyzing trust patterns...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={trustData.refreshing} onRefresh={onRefresh} colors={COLORS.vibrantPink} />
        }
      >
        {/* Current Trust Level */}
        <GlassCard style={styles.mainCard} variant="elevated">
          <View style={styles.cardHeader}>
            <View>
              <Typography variant="label" style={styles.cardTitle}>TRUST THERMOMETER</Typography>
              <Typography variant="caption" style={styles.cardSubtitle}>Real-time relationship trust metric</Typography>
            </View>
            <View style={styles.levelBadge}>
              <LinearGradient colors={[currentLevel.color, currentLevel.color + '80']} style={styles.badgeGradient}>
                <Typography variant="label" color={COLORS.backgroundPrimary} style={styles.badgeText}>{currentLevel.label}</Typography>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.thermometerWrapper}>
            <TrustThermometer 
              level={trustData.current / 100} 
              width={100} 
              height={280}
              weeklyChange={trustData.weeklyChange}
            />
          </View>

          <View style={styles.currentLevelDesc}>
            <Typography variant="body" center style={styles.levelDesc}>{currentLevel.desc}</Typography>
          </View>

          <View style={styles.changeRow}>
            <View style={styles.changeItem}>
              <Typography variant="caption" color={COLORS.textSecondary}>This Week</Typography>
              <Typography variant="header" style={{ color: trustData.weeklyChange >= 0 ? COLORS.mintGreen : COLORS.vibrantPink }}>
                {trustData.weeklyChange >= 0 ? '+' : ''}{trustData.weeklyChange}%
              </Typography>
            </View>
            <View style={styles.changeDivider} />
            <View style={styles.changeItem}>
              <Typography variant="caption" color={COLORS.textSecondary}>This Month</Typography>
              <Typography variant="header" style={{ color: trustData.monthlyChange >= 0 ? COLORS.mintGreen : COLORS.vibrantPink }}>
                {trustData.monthlyChange >= 0 ? '+' : ''}{trustData.monthlyChange}%
              </Typography>
            </View>
          </View>
        </GlassCard>

        {/* Trust Breakdown */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>TRUST BREAKDOWN</Typography>
          <Typography variant="caption" style={styles.sectionSubtitle}>Five pillars of relational trust</Typography>
          
          <View style={styles.breakdownGrid}>
            {Object.entries(trustData.breakdown).map(([key, value]) => (
              <TrustPillarItem 
                key={key}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value}
                color={getPillarColor(key)}
              />
            ))}
          </View>
        </GlassCard>

        {/* Trust History Chart */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>7-DAY TREND</Typography>
          <TrustHistoryChart data={trustData.history} />
        </GlassCard>

        {/* Milestones */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>TRUST MILESTONES</Typography>
          <Typography variant="caption" style={styles.sectionSubtitle}>Unlock deeper connection levels</Typography>
          
          <View style={styles.milestonesList}>
            {trustData.milestones.map((milestone, index) => (
              <MilestoneItem 
                key={milestone.threshold}
                milestone={milestone}
                currentTrust={trustData.current}
                isLast={index === trustData.milestones.length - 1}
              />
            ))}
          </View>
        </GlassCard>

        {/* Insights */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>DR. MARCIE'S INSIGHTS</Typography>
          
          <View style={styles.insightsList}>
            {trustData.insights.map((insight, index) => (
              <InsightItem key={index} insight={insight} />
            ))}
          </View>
        </GlassCard>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <SquishyButton 
            onPress={() => navigation.navigate('SOSConfirmation')}
            style={styles.primaryAction}
          >
            <Typography variant="button">EMERGENCY REPAIR</Typography>
          </SquishyButton>
          <SquishyButton 
            onPress={() => navigation.navigate('RepairReportCard')}
            variant="secondary"
            style={styles.secondaryAction}
          >
            <Typography variant="button">REPAIR REPORT CARD</Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const TrustPillarItem = ({ title, value, color }: { title: string; value: number; color: string }) => (
  <View style={styles.pillarItem}>
    <View style={[styles.pillarBarContainer, { height: Math.max(60, value * 1.2) }]}>
      <View style={[styles.pillarBarFill, { backgroundColor: color, height: value + '%' }]} />
    </View>
    <Typography variant="label" style={styles.pillarValue}>{value}%</Typography>
    <Typography variant="caption" style={styles.pillarTitle}>{title}</Typography>
  </View>
);

const TrustHistoryChart = ({ data }: { data: Array<{ date: string; value: number }> }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartBars}>
        {data.map((point, index) => (
          <View key={index} style={styles.chartBarWrapper}>
            <View style={[
              styles.chartBar,
              { 
                height: ((point.value - minValue) / range) * 100 + '%',
                backgroundColor: point.value >= 65 ? COLORS.mintGreen : COLORS.vibrantPink,
              }
            ]} />
            <Typography variant="caption" style={styles.chartLabel}>{point.date}</Typography>
          </View>
        ))}
      </View>
      <View style={styles.chartLegend}>
        <Typography variant="caption" color={COLORS.textSecondary}>{minValue}%</Typography>
        <Typography variant="caption" color={COLORS.textSecondary}>{maxValue}%</Typography>
      </View>
    </View>
  );
};

const MilestoneItem = ({ milestone, currentTrust, isLast }: { milestone: any; currentTrust: number; isLast: boolean }) => {
  const achieved = currentTrust >= milestone.threshold;
  const progress = Math.min(100, (currentTrust / milestone.threshold) * 100);
  
  return (
    <View style={styles.milestoneItem}>
      <View style={styles.milestoneConnector}>
        {!isLast && <View style={[styles.connectorLine, { opacity: achieved ? 1 : 0.3 }]} />}
        <View style={[
          styles.milestoneDot,
          { backgroundColor: achieved ? COLORS.mintGreen : COLORS.borderSubtle },
        ]}>
          {achieved && <Ionicons name="checkmark" size={14} color={COLORS.backgroundPrimary} />}
        </View>
      </View>
      <View style={styles.milestoneContent}>
        <View style={styles.milestoneHeader}>
          <Typography variant="label" style={[styles.milestoneTitle, { color: achieved ? COLORS.textPrimary : COLORS.textSecondary }]}>
            {milestone.title} ({milestone.threshold}%)
          </Typography>
          {achieved && <Ionicons name="lock-open" size={20} color={COLORS.mintGreen} />}
        </View>
        <Typography variant="caption" style={[styles.milestoneDesc, { color: achieved ? COLORS.textSecondary : COLORS.textHint }]}>
          {milestone.description}
        </Typography>
        <View style={styles.milestoneProgress}>
          <View style={[styles.progressBar, { backgroundColor: achieved ? COLORS.mintGreen : COLORS.borderSubtle }]}>
            <View style={[styles.progressFill, { width: progress + '%', backgroundColor: achieved ? COLORS.mintGreen : COLORS.vibrantPink }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const InsightItem = ({ insight }: { insight: { icon: string; text: string; color: string } }) => (
  <View style={styles.insightItem}>
    <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
      <Ionicons name={insight.icon} size={20} color={insight.color} />
    </View>
    <Typography variant="body" style={styles.insightText}>{insight.text}</Typography>
  </View>
);

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xlarge,
  },
  cardTitle: {
    marginBottom: SPACING.tiny,
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
  },
  levelBadge: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.tiny,
  },
  badgeGradient: {
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.tiny,
  },
  badgeText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  thermometerWrapper: {
    alignItems: 'center',
    marginVertical: SPACING.xlarge,
  },
  currentLevelDesc: {
    marginTop: SPACING.regular,
    paddingHorizontal: SPACING.large,
  },
  levelDesc: {
    fontStyle: 'italic',
    color: COLORS.textSecondary,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xlarge,
    paddingHorizontal: SPACING.large,
  },
  changeItem: {
    alignItems: 'center',
  },
  changeDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.borderSubtle,
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  sectionTitle: {
    marginBottom: SPACING.tiny,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xlarge,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
  },
  pillarItem: {
    width: '48%',
    alignItems: 'center',
  },
  pillarBarContainer: {
    width: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.regular,
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'relative',
  },
  pillarBarFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: BORDER_RADIUS.round,
  },
  pillarValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.tiny,
  },
  pillarTitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: SPACING.regular,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: SPACING.regular,
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: '100%',
    borderRadius: BORDER_RADIUS.small,
    minHeight: 4,
  },
  chartLabel: {
    marginTop: SPACING.small,
    color: COLORS.textSecondary,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.regular,
  },
  milestonesList: {
    gap: SPACING.regular,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  milestoneConnector: {
    alignItems: 'center',
    marginRight: SPACING.regular,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.mintGreen,
    marginTop: 24,
  },
  milestoneDot: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.backgroundPrimary,
  },
  milestoneContent: {
    flex: 1,
    marginTop: 4,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.tiny,
  },
  milestoneTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  milestoneDesc: {
    marginBottom: SPACING.regular,
    lineHeight: 18,
  },
  milestoneProgress: {
    height: 6,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressBar: {
    flex: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
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
  actionButtons: {
    marginTop: SPACING.xlarge,
    gap: SPACING.regular,
    paddingHorizontal: SPACING.regular,
  },
  primaryAction: {
    flex: 1,
  },
  secondaryAction: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
});

function getPillarColor(pillar: string) {
  const colors: Record<string, string> = {
    reliability: COLORS.aquaTeal,
    transparency: COLORS.vibrantPink,
    vulnerability: COLORS.rosePink,
    consistency: COLORS.mintGreen,
    repair: COLORS.warmOrange,
  };
  return colors[pillar] || COLORS.vibrantPink;
}

export { getPillarColor };