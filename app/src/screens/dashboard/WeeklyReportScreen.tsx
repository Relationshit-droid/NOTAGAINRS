import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { gamesApi } from '../../lib/api';
import { useAppStore } from '../../state/store';
import { TrustThermometer } from '../../components/ui/TrustThermometer';

export default function WeeklyReportScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [report, setReport] = useState<any>(null);
  const [pastReports, setPastReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week

  const fetchReport = async () => {
    if (!user || !userId) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const couple = await coupleApi.getCoupleForUser(userId, token);
      
      if (couple) {
        // In real app, fetch from backend /api/reports/weekly/:coupleId?week=
        const mockReport = generateMockReport(couple, selectedWeek);
        const mockPastReports = generateMockPastReports(couple);
        setReport(mockReport);
        setPastReports(mockPastReports);
      }
    } catch (error) {
      console.error('Failed to fetch weekly report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [user, userId, selectedWeek]);

  const generateMockReport = (couple: any, weekOffset: number) => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - (weekOffset * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const sessions = Math.floor(Math.random() * 5) + 2;
    const trustChange = (Math.random() - 0.3) * 10;
    const newTrust = Math.max(0, Math.min(100, couple.trust_meter * 100 + trustChange));
    
    return {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      sessions,
      totalMinutes: sessions * (Math.floor(Math.random() * 30) + 15),
      gamesPlayed: [
        { name: 'Truth or Trust', category: 'Emotional Connection', score: 85, date: 'Mon' },
        { name: 'Conflict Dice', category: 'Conflict Resolution', score: 78, date: 'Wed' },
        { name: 'Date Night Roulette', category: 'Intimacy & Romance', score: 92, date: 'Fri' },
      ].slice(0, sessions),
      trustChange,
      newTrust,
      vulnerabilityChange: (Math.random() - 0.2) * 8,
      romanceChange: (Math.random() - 0.1) * 5,
      connectionChange: (Math.random() - 0.15) * 7,
      insights: [
        'Trust increased after Wednesday\'s Conflict Dice session',
        'Friday\'s Date Night boosted romance meter significantly',
        'Consider scheduling a Growth & Repair game this weekend',
      ],
      partnerHighlights: {
        player1: { mvp: 'Best listener during Truth or Trust', growth: 'Opened up about past fears' },
        player2: { mvp: 'Great repair attempt on Wednesday', growth: 'Expressed needs clearly' },
      },
      drMarcieNote: `This week you played ${sessions} games together. ${trustChange >= 0 ? 'Trust is trending up - keep the momentum!' : 'Trust dipped slightly - schedule a repair session.'} Your ${sessions > 3 ? 'consistent' : 'developing'} rhythm is ${sessions > 3 ? 'building a strong foundation' : 'finding its footing'}.`,
      nextWeekSuggestion: sessions > 3 
        ? 'Try a Creative Chaos game to shake things up!'
        : 'Aim for 4 sessions next week to build consistency.',
    };
  };

  const generateMockPastReports = (couple: any) => {
    const reports = [];
    for (let i = 1; i <= 8; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (i * 7));
      reports.push({
        weekOffset: i,
        weekStart: weekStart.toISOString().split('T')[0],
        sessions: Math.floor(Math.random() * 5) + 1,
        trustChange: (Math.random() - 0.3) * 10,
        highlight: ['Great progress!', 'Trust building', 'Connection deepening', 'Repair successful', 'Fun week!'][Math.floor(Math.random() * 5)],
      });
    }
    return reports;
  };

  const formatWeekRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`;
  };

  const goToWeek = (offset: number) => {
    setSelectedWeek(offset);
  };

  const isCurrentWeek = selectedWeek === 0;

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <TrustThermometer level={0.65} width={80} height={240} />
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Generating your weekly report...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  if (!report) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="header" center>No Report Available</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const weekRange = formatWeekRange(report.weekStart, report.weekEnd);

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Week Selector */}
        <View style={styles.weekSelector}>
          <TouchableOpacity onPress={() => goToWeek(selectedWeek + 1)} style={styles.weekNavButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => goToWeek(0)}
            style={[styles.currentWeekButton, isCurrentWeek && styles.currentWeekActive]}
          >
            <Typography variant="label" style={[
              styles.weekLabel,
              isCurrentWeek && styles.weekLabelActive,
            ]}>
              {isCurrentWeek ? 'THIS WEEK' : weekRange}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => goToWeek(selectedWeek - 1)} disabled={isCurrentWeek} style={[styles.weekNavButton, isCurrentWeek && styles.weekNavButtonDisabled]}>
            <Ionicons name="chevron-forward" size={24} color={isCurrentWeek ? COLORS.textHint : COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Past Weeks Quick Select */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pastWeeksScroll}>
          {pastReports.slice(0, 6).map((r, index) => (
            <TouchableOpacity 
              key={r.weekOffset}
              onPress={() => goToWeek(r.weekOffset)}
              style={[
                styles.pastWeekChip,
                selectedWeek === r.weekOffset && styles.pastWeekChipActive,
              ]}
            >
              <Typography variant="caption" style={[
                styles.pastWeekLabel,
                selectedWeek === r.weekOffset && styles.pastWeekLabelActive,
              ]}>
                {formatWeekRange(r.weekStart, r.weekStart)}
              </Typography>
              <Typography variant="caption" style={[
                styles.pastWeekSessions,
                selectedWeek === r.weekOffset && styles.pastWeekLabelActive,
              ]}>
                {r.sessions} sessions
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trust Thermometer - Main Metric */}
        <GlassCard style={styles.trustCard} variant="elevated">
          <Typography variant="label" style={styles.trustCardTitle}>WEEKLY TRUST</Typography>
          <View style={styles.trustMain}>
            <TrustThermometer 
              level={report.newTrust / 100} 
              width={100} 
              height={280}
              weeklyChange={Math.round(report.trustChange)}
            />
          </View>
          <View style={styles.trustChangeRow}>
            <View style={styles.trustChangeItem}>
              <Typography variant="caption" color={COLORS.textSecondary}>Start of Week</Typography>
              <Typography variant="header" color={COLORS.textSecondary}>{Math.round(report.newTrust - report.trustChange)}%</Typography>
            </View>
            <View style={styles.trustChangeItem}>
              <Typography variant="caption" color={COLORS.textSecondary}>Change</Typography>
              <Typography variant="header" style={{ color: report.trustChange >= 0 ? COLORS.mintGreen : COLORS.vibrantPink }}>
                {report.trustChange >= 0 ? '+' : ''}{report.trustChange.toFixed(1)}%
              </Typography>
            </View>
            <View style={styles.trustChangeItem}>
              <Typography variant="caption" color={COLORS.textSecondary}>End of Week</Typography>
              <Typography variant="header" color={COLORS.textPrimary}>{Math.round(report.newTrust)}%</Typography>
            </View>
          </View>
        </GlassCard>

        {/* Sessions Summary */}
        <View style={styles.summaryGrid}>
          <SummaryCard 
            title="Sessions Played" 
            value={report.sessions} 
            subtitle="this week"
            icon="game-controller"
            color={COLORS.vibrantPink}
          />
          <SummaryCard 
            title="Minutes Together" 
            value={report.totalMinutes} 
            subtitle="quality time"
            icon="time"
            color={COLORS.aquaTeal}
          />
          <SummaryCard 
            title="Games Completed" 
            value={report.gamesPlayed.length} 
            subtitle="unique games"
            icon="checkmark-circle"
            color={COLORS.mintGreen}
          />
          <SummaryCard 
            title="Avg Score" 
            value={report.gamesPlayed.length > 0 
              ? Math.round(report.gamesPlayed.reduce((a: number, g: any) => a + g.score, 0) / report.gamesPlayed.length) 
              : 0} 
            subtitle="performance"
            icon="star"
            color={COLORS.brightYellow}
          />
        </View>

        {/* Games Played */}
        {report.gamesPlayed.length > 0 && (
          <GlassCard style={styles.sectionCard}>
            <Typography variant="label" style={styles.sectionTitle}>GAMES PLAYED</Typography>
            <View style={styles.gamesList}>
              {report.gamesPlayed.map((game: any, index: number) => (
                <TouchableOpacity key={index} style={styles.gameRow} onPress={() => {}}>
                  <LinearGradient colors={getCategoryGradient(game.category)} style={styles.gameRowIcon}>
                    <Ionicons name="game-controller" size={20} color={COLORS.textPrimary} />
                  </LinearGradient>
                  <View style={styles.gameRowInfo}>
                    <Typography variant="label" style={styles.gameRowName}>{game.name}</Typography>
                    <Typography variant="caption" style={styles.gameRowMeta}>
                      {game.category} • {game.date} • {game.score}% score
                    </Typography>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textHint} />
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Partner Highlights */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>PARTNER HIGHLIGHTS</Typography>
          <View style={styles.partnerHighlights}>
            <PartnerHighlight 
              label="You" 
              mvp={report.partnerHighlights.player1.mvp} 
              growth={report.partnerHighlights.player1.growth}
              color={COLORS.vibrantPink}
            />
            <PartnerHighlight 
              label="Partner" 
              mvp={report.partnerHighlights.player2.mvp} 
              growth={report.partnerHighlights.player2.growth}
              color={COLORS.aquaTeal}
            />
          </View>
        </GlassCard>

        {/* All Meters */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>ALL METERS</Typography>
          <View style={styles.allMeters}>
            <MeterRow label="Trust" value={Math.round(report.newTrust)} change={report.trustChange} color={COLORS.brightYellow} />
            <MeterRow label="Vulnerability" value={Math.max(0, Math.min(100, 42 + report.vulnerabilityChange))} change={report.vulnerabilityChange} color={COLORS.rosePink} />
            <MeterRow label="Romance" value={Math.max(0, Math.min(100, 58 + report.romanceChange))} change={report.romanceChange} color={COLORS.warmOrange} />
            <MeterRow label="Connection" value={Math.max(0, Math.min(100, 71 + report.connectionChange))} change={report.connectionChange} color={COLORS.aquaTeal} />
          </View>
        </GlassCard>

        {/* Dr. Marcie's Note */}
        <GlassCard style={[styles.sectionCard, styles.marcieCard]}>
          <View style={styles.marcieHeader}>
            <LinearGradient colors={GRADIENTS.primary.colors} style={styles.marcieAvatar}>
              <Ionicons name="person" size={28} color={COLORS.textPrimary} />
            </LinearGradient>
            <View>
              <Typography variant="label" style={styles.marcieTitle}>DR. MARCIE'S NOTE</Typography>
              <Typography variant="caption" style={styles.marcieSubtitle}>Weekly assessment</Typography>
            </View>
          </View>
          <Typography variant="body" style={styles.marcieText}>{report.drMarcieNote}</Typography>
        </GlassCard>

        {/* Next Week Suggestion */}
        <GlassCard style={[styles.sectionCard, styles.suggestionCard]}>
          <View style={styles.suggestionHeader}>
            <LinearGradient colors={[COLORS.mintGreen, COLORS.aquaTeal]} style={styles.suggestionIcon}>
              <Ionicons name="lightbulb" size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            <Typography variant="label" style={styles.suggestionTitle}>NEXT WEEK</Typography>
          </View>
          <Typography variant="body" style={styles.suggestionText}>{report.nextWeekSuggestion}</Typography>
          <SquishyButton 
            onPress={() => {}} // Navigate to game library
            style={styles.suggestionButton}
            variant="secondary"
          >
            <Typography variant="button">BROWSE GAMES</Typography>
          </SquishyButton>
        </GlassCard>

        {/* Insights */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>WEEKLY INSIGHTS</Typography>
          <View style={styles.insightsList}>
            {report.insights.map((insight: string, index: number) => (
              <InsightRow key={index} text={insight} />
            ))}
          </View>
        </GlassCard>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <SquishyButton 
            variant="secondary"
            onPress={() => {}}
            style={styles.actionButton}
          >
            <Ionicons name="share" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">SHARE REPORT</Typography>
          </SquishyButton>
          <SquishyButton 
            onPress={() => {}}
            style={styles.actionButtonPrimary}
          >
            <Ionicons name="download" size={18} color={COLORS.textPrimary} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">SAVE PDF</Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const SummaryCard = ({ title, value, subtitle, icon, color }: any) => (
  <GlassCard style={styles.summaryCard}>
    <LinearGradient colors={[color, color + '80']} style={styles.summaryIcon}>
      <Ionicons name={icon} size={24} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.summaryValue}>{value}</Typography>
    <Typography variant="label" style={styles.summaryTitle}>{title}</Typography>
    <Typography variant="caption" style={styles.summarySubtitle}>{subtitle}</Typography>
  </GlassCard>
);

const PartnerHighlight = ({ label, mvp, growth, color }: any) => (
  <View style={styles.partnerHighlight}>
    <Typography variant="label" style={[styles.partnerHighlightLabel, { color }]}>{label}</Typography>
    <View style={styles.highlightItem}>
      <Ionicons name="trophy" size={16} color={color} />
      <View style={styles.highlightText}>
        <Typography variant="caption" style={styles.highlightType}>MVP MOMENT</Typography>
        <Typography variant="body" style={styles.highlightValue}>{mvp}</Typography>
      </View>
    </View>
    <View style={styles.highlightItem}>
      <Ionicons name="trending-up" size={16} color={color} />
      <View style={styles.highlightText}>
        <Typography variant="caption" style={styles.highlightType}>GROWTH SPOTTED</Typography>
        <Typography variant="body" style={styles.highlightValue}>{growth}</Typography>
      </View>
    </View>
  </View>
);

const MeterRow = ({ label, value, change, color }: any) => (
  <View style={styles.meterRow}>
    <Typography variant="label" style={styles.meterLabel}>{label}</Typography>
    <View style={styles.meterBarContainer}>
      <View style={[
        styles.meterBarTrack,
        { backgroundColor: color + '20' }
      ]}>
        <View style={[
          styles.meterBarFill,
          { width: `${value}%`, backgroundColor: color }
        ]} />
      </View>
    </View>
    <View style={styles.meterValueContainer}>
      <Typography variant="header" style={{ color }}>{value}%</Typography>
      <Typography variant="caption" style={[
        styles.meterChange,
        { color: change >= 0 ? COLORS.mintGreen : COLORS.vibrantPink }
      ]}>
        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </Typography>
    </View>
  </View>
);

const InsightRow = ({ text }: any) => (
  <View style={styles.insightRow}>
    <View style={styles.insightBullet} />
    <Typography variant="body" style={styles.insightText}>{text}</Typography>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xlarge,
  },
  weekNavButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  weekNavButtonDisabled: {
    opacity: 0.3,
  },
  currentWeekButton: {
    flex: 1,
    paddingVertical: SPACING.regular,
    borderRadius: BORDER_RADIUS.xlarge,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
  },
  currentWeekActive: {
    backgroundColor: COLORS.vibrantPink + '20',
    borderWidth: 1,
    borderColor: COLORS.vibrantPink,
  },
  weekLabel: {
    color: COLORS.textSecondary,
  },
  weekLabelActive: {
    color: COLORS.vibrantPink,
    fontWeight: '700',
  },
  pastWeeksScroll: {
    gap: SPACING.small,
    marginBottom: SPACING.xlarge,
    paddingHorizontal: SPACING.tiny,
  },
  pastWeekChip: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundCard,
    gap: SPACING.tiny,
  },
  pastWeekChipActive: {
    backgroundColor: COLORS.vibrantPink + '20',
    borderColor: COLORS.vibrantPink,
  },
  pastWeekLabel: {
    color: COLORS.textSecondary,
  },
  pastWeekLabelActive: {
    color: COLORS.vibrantPink,
    fontWeight: '700',
  },
  pastWeekSessions: {
    color: COLORS.textHint,
    fontSize: 11,
  },
  trustCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  trustCardTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.brightYellow,
    textAlign: 'center',
  },
  trustMain: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  trustChangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trustChangeItem: {
    alignItems: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  summaryCard: {
    width: '48%',
    padding: SPACING.large,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  summaryValue: {
    marginBottom: SPACING.tiny,
  },
  summaryTitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.tiny,
  },
  summarySubtitle: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 10,
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
  gamesList: {
    gap: SPACING.regular,
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  gameRowIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  gameRowInfo: {
    flex: 1,
  },
  gameRowName: {
    marginBottom: SPACING.tiny,
  },
  gameRowMeta: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  partnerHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.regular,
  },
  partnerHighlight: {
    flex: 1,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  partnerHighlightLabel: {
    textAlign: 'center',
    marginBottom: SPACING.regular,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.small,
    marginBottom: SPACING.regular,
  },
  highlightText: {
    flex: 1,
  },
  highlightType: {
    color: COLORS.textHint,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.tiny,
  },
  highlightValue: {
    lineHeight: 20,
  },
  allMeters: {
    gap: SPACING.regular,
  },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  meterLabel: {
    width: 80,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  meterBarContainer: {
    flex: 1,
    height: 8,
  },
  meterBarTrack: {
    flex: 1,
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  meterBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  meterValueContainer: {
    width: 70,
    alignItems: 'flex-end',
  },
  meterChange: {
    fontWeight: '600',
    fontSize: 11,
  },
  marcieCard: {
    borderWidth: 2,
    borderColor: COLORS.vibrantPink + '40',
    backgroundColor: COLORS.vibrantPink + '08',
  },
  marcieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  marcieAvatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcieTitle: {
    color: COLORS.vibrantPink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  marcieSubtitle: {
    color: COLORS.textHint,
    fontSize: 11,
  },
  marcieText: {
    fontStyle: 'italic',
    lineHeight: 24,
    color: COLORS.textPrimary,
  },
  suggestionCard: {
    borderWidth: 2,
    borderColor: COLORS.mintGreen + '40',
    backgroundColor: COLORS.mintGreen + '08',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTitle: {
    color: COLORS.mintGreen,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  suggestionText: {
    marginBottom: SPACING.regular,
    lineHeight: 24,
  },
  suggestionButton: {
    marginTop: SPACING.small,
  },
  insightsList: {
    gap: SPACING.regular,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.regular,
  },
  insightBullet: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.vibrantPink,
    marginTop: 6,
    flexShrink: 0,
  },
  insightText: {
    flex: 1,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.regular,
    marginTop: SPACING.xlarge,
    paddingHorizontal: SPACING.regular,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  actionButtonPrimary: {
    flex: 1,
  },
});

function getCategoryGradient(category: string) {
  const colors: Record<string, string[]> = {
    'Emotional Connection': [COLORS.rosePink, COLORS.rosePink + '80'],
    'Conflict Resolution': [COLORS.vibrantPink, COLORS.vibrantPink + '80'],
    'Intimacy & Romance': [COLORS.warmOrange, COLORS.warmOrange + '80'],
    'Growth & Repair': [COLORS.mintGreen, COLORS.mintGreen + '80'],
    'Creative Chaos': [COLORS.lavenderPurple, COLORS.lavenderPurple + '80'],
    'Game Show': [COLORS.brightYellow, COLORS.brightYellow + '80'],
    'Love Arcade': [COLORS.aquaTeal, COLORS.aquaTeal + '80'],
  };
  return colors[category] || [COLORS.vibrantPink, COLORS.vibrantPink + '80'];
}