import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface GameResultsRouteParams {
  gameId: string;
  score: number;
  sessionId: string;
}

export default function LoveArcadeGameResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute<GameResultsRouteParams>();
  const { gameId, score, sessionId } = route.params || {};

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      setLoading(true);
      // In real app, fetch from backend
      const mockResults = {
        score,
        maxScore: 500,
        percentage: Math.round((score / 500) * 100),
        questionsAnswered: 5,
        correctAnswers: 4,
        timeSpent: 420, // seconds
        lifelinesUsed: 1,
        achievements: ['Sharp Shooter', 'Speed Demon'],
        marcieCommentary: "Not bad, darling! You've got good instincts. But don't get cocky - there's always room to grow.",
        marcieAnimation: 'correct',
        breakdown: [
          { category: 'Romance', score: 95, max: 100 },
          { category: 'Adventure', score: 80, max: 100 },
          { category: 'Intimacy', score: 90, max: 100 },
          { category: 'Communication', score: 75, max: 100 },
        ],
      };
      setResults(mockResults);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

  const percentage = results?.percentage || 0;
  const badgeColor = percentage >= 80 ? COLORS.mintGreen : percentage >= 60 ? COLORS.brightYellow : COLORS.error;

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={GRADIENTS.romanceHub.colors} style={styles.loadingGlow}>
            <Ionicons name="trophy" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Calculating your score...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Score Header */}
        <View style={[styles.scoreHeader, { borderBottomColor: badgeColor }]}>
          <Typography variant="label" style={styles.scoreLabel}>FINAL SCORE</Typography>
          <Typography variant="gameTitle" style={{ color: badgeColor }}>{score} / {results?.maxScore || 500}</Typography>
          <Typography variant="header" style={{ color: badgeColor }}>{percentage}%</Typography>
          <View style={styles.badgeContainer}>
            <LinearGradient colors={[badgeColor, badgeColor + '80']} style={styles.badgeGradient}>
              <Typography variant="label" color={COLORS.backgroundPrimary} style={styles.badgeText}>
                {percentage >= 80 ? 'MASTER' : percentage >= 60 ? 'APPRENTICE' : 'NOVICE'}
              </Typography>
            </LinearGradient>
          </View>
        </View>

        {/* Dr. Marcie's Commentary */}
        <GlassCard style={styles.marcieCard} variant="elevated">
          <View style={styles.marcieHeader}>
            <LinearGradient colors={GRADIENTS.primary.colors} style={styles.marcieAvatar}>
              <Ionicons name="person" size={28} color={COLORS.textPrimary} />
            </LinearGradient>
            <View>
              <Typography variant="label" style={styles.marcieTitle}>DR. MARCIE'S VERDICT</Typography>
              <Typography variant="caption" style={styles.marcieSubtitle}>Post-game analysis</Typography>
            </View>
          </View>
          <Typography variant="body" style={styles.marcieText}>{results?.marcieCommentary}</Typography>
        </GlassCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Correct" value={`${results?.correctAnswers || 4} / ${results?.questionsAnswered || 5}`} icon="checkmark-circle" color={COLORS.mintGreen} />
          <StatCard label="Accuracy" value={`${Math.round((results?.correctAnswers || 4) / (results?.questionsAnswered || 5) * 100)}%`} icon="analytics" color={COLORS.aquaTeal} />
          <StatCard label="Time" value={`${Math.floor((results?.timeSpent || 420) / 60)}:${String((results?.timeSpent || 420) % 60).padStart(2, '0')}`} icon="time" color={COLORS.warmOrange} />
          <StatCard label="Lifelines" value={`${results?.lifelinesUsed || 1} used`} icon="heart" color={COLORS.rosePink} />
        </View>

        {/* Category Breakdown */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>CATEGORY BREAKDOWN</Typography>
          <View style={styles.breakdownList}>
            {results?.breakdown?.map((item: any, index: number) => (
              <View key={index} style={styles.breakdownItem}>
                <View style={styles.breakdownInfo}>
                  <Typography variant="label" style={styles.breakdownCategory}>{item.category}</Typography>
                  <View style={styles.breakdownBar}>
                    <View style={[
                      styles.breakdownBarTrack,
                      { backgroundColor: item.color + '20' }
                    ]}>
                      <View style={[
                        styles.breakdownBarFill,
                        { width: `${item.score}%`, backgroundColor: item.color }
                      ]} />
                    </View>
                  </View>
                </View>
                <View style={styles.breakdownScore}>
                  <Typography variant="header" style={{ color: item.color }}>{item.score}%</Typography>
                  <Typography variant="caption" style={styles.breakdownMax}>{item.max} pts max</Typography>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Achievements */}
        {results?.achievements && results.achievements.length > 0 && (
          <GlassCard style={styles.sectionCard}>
            <Typography variant="label" style={styles.sectionTitle}>ACHIEVEMENTS UNLOCKED</Typography>
            <View style={styles.achievementsList}>
              {results.achievements.map((achievement: string, index: number) => (
                <View key={index} style={styles.achievementItem}>
                  <LinearGradient colors={GRADIENTS.romanceHub.colors} style={styles.achievementIcon}>
                    <Ionicons name="trophy" size={20} color={COLORS.textPrimary} />
                  </LinearGradient>
                  <Typography variant="label" style={styles.achievementName}>{achievement}</Typography>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <SquishyButton 
            variant="secondary"
            onPress={() => navigation.navigate('LoveArcadeHub')}
            style={styles.actionButton}
          >
            <Typography variant="button">BACK TO ARCADE</Typography>
          </SquishyButton>
          <SquishyButton 
            onPress={() => navigation.navigate('LoveArcadeHub')}
            style={styles.actionButtonPrimary}
          >
            <Ionicons name="replay" size={18} color={COLORS.textPrimary} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">PLAY AGAIN</Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const StatCard = ({ label, value, icon, color }: any) => (
  <GlassCard style={styles.statCard}>
    <LinearGradient colors={[color, color + '80']} style={styles.statIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.statValue}>{value}</Typography>
    <Typography variant="caption" style={styles.statLabel}>{label}</Typography>
  </GlassCard>
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
  scoreHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
    paddingBottom: SPACING.xlarge,
    borderBottomWidth: 2,
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.regular,
  },
  badgeContainer: {
    marginTop: SPACING.regular,
  },
  badgeGradient: {
    paddingHorizontal: SPACING.xlarge,
    paddingVertical: SPACING.regular,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  badgeText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  marcieCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  statCard: {
    width: '48%',
    padding: SPACING.large,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  statValue: {
    marginBottom: SPACING.tiny,
  },
  statLabel: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 11,
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
  breakdownList: {
    gap: SPACING.regular,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownCategory: {
    marginBottom: SPACING.regular,
  },
  breakdownBar: {
    flex: 1,
    height: 8,
  },
  breakdownBarTrack: {
    flex: 1,
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  breakdownScore: {
    alignItems: 'flex-end',
    marginLeft: SPACING.regular,
  },
  breakdownMax: {
    color: COLORS.textHint,
    fontSize: 11,
  },
  achievementsList: {
    gap: SPACING.regular,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementName: {
    flex: 1,
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