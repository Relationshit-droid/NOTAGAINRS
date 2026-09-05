import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../state/store';
import TrustThermometer from '../components/ui/TrustThermometer';

export default function LoveLanguageDashboardScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [data, setData] = useState({
    yourLanguages: [
      { language: 'Words of Affirmation', score: 85, rank: 1, color: COLORS.rosePink },
      { language: 'Quality Time', score: 72, rank: 2, color: COLORS.aquaTeal },
      { language: 'Acts of Service', score: 45, rank: 3, color: COLORS.warmOrange },
      { language: 'Physical Touch', score: 38, rank: 4, color: COLORS.vibrantPink },
      { language: 'Receiving Gifts', score: 12, rank: 5, color: COLORS.brightYellow },
    ],
    partnerLanguages: [
      { language: 'Quality Time', score: 90, rank: 1, color: COLORS.aquaTeal },
      { language: 'Physical Touch', score: 65, rank: 2, color: COLORS.vibrantPink },
      { language: 'Acts of Service', score: 55, rank: 3, color: COLORS.warmOrange },
      { language: 'Words of Affirmation', score: 40, rank: 4, color: COLORS.rosePink },
      { language: 'Receiving Gifts', score: 20, rank: 5, color: COLORS.brightYellow },
    ],
    compatibility: {
      overall: 78,
      strongestMatch: 'Quality Time',
      weakestMatch: 'Receiving Gifts',
      gapAnalysis: [
        { language: 'Words of Affirmation', you: 85, partner: 40, gap: 45, insight: 'You crave verbal affirmation; partner shows love differently' },
        { language: 'Quality Time', you: 72, partner: 90, gap: 18, insight: 'Strong alignment! Both value shared experiences' },
        { language: 'Acts of Service', you: 45, partner: 55, gap: 10, insight: 'Moderate alignment - room for growth' },
        { language: 'Physical Touch', you: 38, partner: 65, gap: 27, insight: 'Partner needs more touch; you prefer other expressions' },
        { language: 'Receiving Gifts', you: 12, partner: 20, gap: 8, insight: 'Low priority for both - not a focus area' },
      ],
    },
    weeklyFocus: 'Quality Time - Plan a device-free evening together',
    dailyChallenge: 'Tell your partner 3 specific things you appreciate about them',
  });
  const [loading, setLoading] = useState(true);
  const [showPartnerView, setShowPartnerView] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // In real app, fetch from backend
    } catch (error) {
      console.error('Failed to fetch love languages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={[COLORS.rosePink, COLORS.brightYellow]} style={styles.loadingGlow}>
            <Ionicons name="heart" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading love languages...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const toggleView = () => setShowPartnerView(!showPartnerView);

  const currentView = showPartnerView ? data.partnerLanguages : data.yourLanguages;
  const viewTitle = showPartnerView ? "PARTNER'S LOVE LANGUAGES" : 'YOUR LOVE LANGUAGES';
  const viewSubtitle = showPartnerView ? 'How your partner receives love' : 'How you give & receive love';

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with Toggle */}
        <GlassCard style={styles.headerCard} variant="elevated">
          <View style={styles.headerTop}>
            <Typography variant="label" style={styles.headerTitle}>LOVE LANGUAGE DASHBOARD</Typography>
            <TouchableOpacity onPress={toggleView} style={styles.viewToggle}>
              <Typography variant="caption" style={styles.toggleText}>
                {showPartnerView ? 'VIEW YOURS' : "VIEW PARTNER'S"}
              </Typography>
              <Ionicons name="swap-horizontal" size={16} color={COLORS.vibrantPink} style={{ marginLeft: SPACING.small }} />
            </TouchableOpacity>
          </View>
          <Typography variant="caption" style={styles.headerSubtitle}>{viewSubtitle}</Typography>
        </GlassCard>

        {/* Compatibility Score */}
        <GlassCard style={styles.compatCard} variant="elevated">
          <Typography variant="label" style={styles.compatTitle}>COMPATIBILITY SCORE</Typography>
          <View style={styles.compatMain}>
            <TrustThermometer 
              level={data.compatibility.overall / 100} 
              width={100} 
              height={240}
              weeklyChange={5}
            />
          </View>
          <View style={styles.compatDetails}>
            <View style={styles.compatDetail}>
              <Typography variant="label" style={styles.compatDetailLabel}>OVERALL MATCH</Typography>
              <Typography variant="header" style={styles.compatDetailValue}>{data.compatibility.overall}%</Typography>
            </View>
            <View style={styles.compatDetail}>
              <Typography variant="label" style={styles.compatDetailLabel}>STRONGEST</Typography>
              <Typography variant="header" style={styles.compatDetailValue}>{data.compatibility.strongestMatch}</Typography>
            </View>
            <View style={styles.compatDetail}>
              <Typography variant="label" style={styles.compatDetailLabel}>GROWTH AREA</Typography>
              <Typography variant="header" style={styles.compatDetailValue}>{data.compatibility.weakestMatch}</Typography>
            </View>
          </View>
        </GlassCard>

        {/* Language Bars */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>{viewTitle}</Typography>
          
          <View style={styles.languagesList}>
            {currentView.map((lang, index) => (
              <LanguageBar key={lang.language} lang={lang} rank={index + 1} />
            ))}
          </View>
        </GlassCard>

        {/* Gap Analysis */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>GAP ANALYSIS</Typography>
          <Typography variant="caption" style={styles.sectionSubtitle}>Where your love languages align and diverge</Typography>
          
          <View style={styles.gapList}>
            {data.compatibility.gapAnalysis.map((gap, index) => (
              <GapItem key={index} gap={gap} />
            ))}
          </View>
        </GlassCard>

        {/* Weekly Focus */}
        <GlassCard style={[styles.sectionCard, styles.focusCard]}>
          <View style={styles.focusHeader}>
            <LinearGradient colors={GRADIENTS.romanceHub.colors} style={styles.focusIcon}>
              <Ionicons name="target" size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            <View>
              <Typography variant="label" style={styles.focusTitle}>THIS WEEK'S FOCUS</Typography>
              <Typography variant="caption" style={styles.focusSubtitle}>Based on your compatibility analysis</Typography>
            </View>
          </View>
          <Typography variant="body" style={styles.focusText}>{data.weeklyFocus}</Typography>
          
          <SquishyButton 
            onPress={() => { /* Navigate to game */ }}
            style={styles.focusButton}
            variant="secondary"
          >
            <Typography variant="button">FIND GAMES FOR THIS</Typography>
          </SquishyButton>
        </GlassCard>

        {/* Daily Challenge */}
        <GlassCard style={[styles.sectionCard, styles.challengeCard]}>
          <View style={styles.challengeHeader}>
            <LinearGradient colors={[COLORS.brightYellow, COLORS.warmOrange]} style={styles.challengeIcon}>
              <Ionicons name="flash" size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            <View>
              <Typography variant="label" style={styles.challengeTitle}>DAILY CHALLENGE</Typography>
              <Typography variant="caption" style={styles.challengeSubtitle}>New challenge every morning</Typography>
            </View>
          </View>
          <Typography variant="body" style={styles.challengeText}>{data.dailyChallenge}</Typography>
          
          <View style={styles.challengeActions}>
            <SquishyButton variant="secondary" onPress={() => { /* Complete */ }} style={styles.challengeButton}>
              <Typography variant="button">MARK COMPLETE</Typography>
            </SquishyButton>
            <SquishyButton variant="ghost" onPress={() => { /* Share */ }} style={styles.challengeButton}>
              <Typography variant="button">SHARE</Typography>
            </SquishyButton>
          </View>
        </GlassCard>

        {/* Insights */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>KEY INSIGHTS</Typography>
          
          <View style={styles.insightsList}>
            <InsightItem icon="heart" color={COLORS.rosePink} text="You express love through words; partner through time. Bridge by writing love notes during quality time." />
            <InsightItem icon="shield-checkmark" color={COLORS.mintGreen} text="Quality Time is your strongest overlap (72/90). Protect this sacred space!" />
            <InsightItem icon="alert-circle" color={COLORS.warmOrange} text="Physical Touch gap (27 pts). Schedule intentional touch: morning hug, evening cuddle." />
            <InsightItem icon="gift" color={COLORS.brightYellow} text="Gifts are low priority for both. Don't stress about presents - focus on presence." />
          </View>
        </GlassCard>

        {/* Take Assessment */}
        <SquishyButton 
          onPress={() => { /* Navigate to assessment */ }}
          style={styles.assessmentButton}
        >
          <Ionicons name="create" size={18} color={COLORS.textPrimary} style={{ marginRight: SPACING.small }} />
          <Typography variant="button">RETAKE ASSESSMENT</Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
}

const LanguageBar = ({ lang, rank }: any) => (
  <View style={styles.languageBar}>
    <View style={styles.langRank}>
      <Typography variant="header" style={{ color: lang.color }}>{rank}</Typography>
      <Typography variant="caption" style={styles.rankLabel}>#{rank}</Typography>
    </View>
    <View style={styles.langInfo}>
      <Typography variant="label" style={styles.langName}>{lang.language}</Typography>
      <View style={styles.langBarTrack}>
        <View style={[
          styles.langBarFill,
          { width: `${lang.score}%`, backgroundColor: lang.color }
        ]} />
      </View>
    </View>
    <View style={styles.langScore}>
      <Typography variant="header" style={{ color: lang.color }}>{lang.score}%</Typography>
    </View>
  </View>
);

const GapItem = ({ gap }: any) => (
  <View style={styles.gapItem}>
    <View style={styles.gapHeader}>
      <Typography variant="label" style={styles.gapLanguage}>{gap.language}</Typography>
      <View style={[
        styles.gapBadge,
        { backgroundColor: gap.gap > 30 ? COLORS.error + '20' : gap.gap > 15 ? COLORS.warmOrange + '20' : COLORS.mintGreen + '20', borderColor: gap.gap > 30 ? COLORS.error : gap.gap > 15 ? COLORS.warmOrange : COLORS.mintGreen }
      ]}>
        <Typography variant="caption" style={{ color: gap.gap > 30 ? COLORS.error : gap.gap > 15 ? COLORS.warmOrange : COLORS.mintGreen }}>
          {gap.gap > 30 ? 'HIGH' : gap.gap > 15 ? 'MEDIUM' : 'LOW'} GAP
        </Typography>
      </View>
    </View>
    <View style={styles.gapBars}>
      <View style={styles.gapBarTrack}>
        <View style={[
          styles.gapBarFill,
          { width: `${gap.you}%`, backgroundColor: COLORS.vibrantPink }
        ]} />
      </View>
      <Typography variant="caption" style={styles.gapYouLabel}>YOU: {gap.you}%</Typography>
      <View style={styles.gapBarTrack}>
        <View style={[
          styles.gapBarFill,
          { width: `${gap.partner}%`, backgroundColor: COLORS.aquaTeal }
        ]} />
      </View>
      <Typography variant="caption" style={styles.gapPartnerLabel}>PARTNER: {gap.partner}%</Typography>
    </View>
    <Typography variant="caption" style={styles.gapInsight}>{gap.insight}</Typography>
  </View>
);

const InsightItem = ({ icon, color, text }: any) => (
  <View style={styles.insightItem}>
    <View style={[styles.insightIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Typography variant="body" style={styles.insightText}>{text}</Typography>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  headerTitle: {
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.vibrantPink + '15',
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.vibrantPink + '40',
  },
  toggleText: {
    color: COLORS.vibrantPink,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  compatCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  compatTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
  compatMain: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  compatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compatDetail: {
    alignItems: 'center',
    flex: 1,
  },
  compatDetailLabel: {
    color: COLORS.textHint,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.tiny,
  },
  compatDetailValue: {
    fontWeight: '700',
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.tiny,
    color: COLORS.vibrantPink,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xlarge,
  },
  languagesList: {
    gap: SPACING.regular,
  },
  languageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  langRank: {
    alignItems: 'center',
    width: 40,
  },
  rankLabel: {
    color: COLORS.textHint,
    fontSize: 10,
  },
  langInfo: {
    flex: 1,
  },
  langName: {
    marginBottom: SPACING.regular,
  },
  langBarTrack: {
    height: 8,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  langBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  langScore: {
    width: 50,
    alignItems: 'flex-end',
  },
  gapList: {
    gap: SPACING.regular,
  },
  gapItem: {
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  gapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  gapLanguage: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gapBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
  },
  gapBars: {
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  gapBarTrack: {
    height: 8,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    flex: 1,
  },
  gapBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  gapYouLabel: {
    color: COLORS.vibrantPink,
    fontWeight: '600',
    marginTop: SPACING.tiny,
    textAlign: 'center',
  },
  gapPartnerLabel: {
    color: COLORS.aquaTeal,
    fontWeight: '600',
    marginTop: SPACING.tiny,
    textAlign: 'center',
  },
  gapInsight: {
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  focusCard: {
    borderWidth: 2,
    borderColor: COLORS.rosePink + '40',
    backgroundColor: COLORS.rosePink + '08',
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  focusIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusTitle: {
    color: COLORS.rosePink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  focusSubtitle: {
    color: COLORS.textHint,
    fontSize: 11,
  },
  focusText: {
    marginBottom: SPACING.regular,
    lineHeight: 24,
  },
  focusButton: {
    marginTop: SPACING.small,
  },
  challengeCard: {
    borderWidth: 2,
    borderColor: COLORS.brightYellow + '40',
    backgroundColor: COLORS.brightYellow + '08',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTitle: {
    color: COLORS.brightYellow,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  challengeSubtitle: {
    color: COLORS.textHint,
    fontSize: 11,
  },
  challengeText: {
    marginBottom: SPACING.regular,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  challengeActions: {
    flexDirection: 'row',
    gap: SPACING.regular,
    marginTop: SPACING.regular,
  },
  challengeButton: {
    flex: 1,
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
  assessmentButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
  },
});