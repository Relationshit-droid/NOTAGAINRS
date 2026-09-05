import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { gamesApi } from '../../lib/api';

export default function GameResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  const { gameId, score, sessionId } = route.params || {};
  
  const [sessionData, setSessionData] = useState<any>(null);
  const [coupleData, setCoupleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user || !sessionId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const token = await user.getIdToken();
        
        // Get session data from backend
        const session = await gamesApi.getSession(sessionId, token);
        setSessionData(session);
        
        // If there's a couple, get couple data for meter updates display
        if (session.couple_id) {
          // We could fetch couple data here if needed
        }
      } catch (error) {
        console.error('Error fetching game results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user, sessionId]);

  const displayScore = sessionData?.score ?? score ?? 0;
  const maxScore = 100;
  const percentage = Math.round((displayScore / maxScore) * 100);
  const badgeColor = percentage >= 80 ? COLORS.success : percentage >= 60 ? COLORS.warning : COLORS.error;
  
  const achievements = sessionData?.achievements || [];
  const responses = sessionData?.responses || [];
  const completed = sessionData?.completed ?? true;

  const renderAchievement = (achievement: any, index: number) => (
    <GlassCard key={index} style={styles.achievementCard}>
      <LinearGradient
        colors={[COLORS.vibrantPink + '33', COLORS.rosePink + '33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.achievementGradient}
      >
        <View style={styles.achievementContent}>
          <Typography variant="h2" color={COLORS.textPrimary}>
            {typeof achievement === 'string' ? achievement : achievement.title || achievement}
          </Typography>
          {typeof achievement === 'object' && achievement.description && (
            <Typography variant="caption" color={COLORS.textSecondary}>
              {achievement.description}
            </Typography>
          )}
        </View>
      </LinearGradient>
    </GlassCard>
  );

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading results...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient
        colors={[COLORS.backgroundPrimary, COLORS.backgroundCard, COLORS.backgroundPrimary]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.title}>Game Results</Typography>
            <Typography variant="body" color={COLORS.textSecondary}>{gameId || 'Truth or Trust'}</Typography>
          </View>

          <GlassCard style={styles.resultsCard}>
            <LinearGradient
              colors={[COLORS.vibrantPink + '33', COLORS.rosePink + '33']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <View style={styles.scoreContainer}>
                <Typography variant="h1" color={badgeColor}>
                  {percentage}%
                </Typography>
                <Typography variant="body" color={COLORS.textSecondary} style={styles.scoreLabel}>
                  {displayScore}/{maxScore} points
                </Typography>
              </View>

              <View style={styles.badgeContainer}>
                <LinearGradient
                  colors={[badgeColor, badgeColor + '80']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.badgeGradient}
                >
                  <Typography variant="h2" color={COLORS.backgroundPrimary} center>
                    {percentage >= 80 ? 'EXCELLENT' : percentage >= 60 ? 'GOOD' : 'KEEP GOING'}
                  </Typography>
                </LinearGradient>
              </View>
            </LinearGradient>
          </GlassCard>

          {achievements && achievements.length > 0 && (
            <View>
              <Typography variant="h2" style={styles.sectionTitle}>Achievements</Typography>
              {achievements.map(renderAchievement)}
            </View>
          )}

          <View style={styles.statsContainer}>
            <GlassCard style={styles.statCard}>
              <LinearGradient
                colors={[COLORS.vibrantPink + '33', COLORS.rosePink + '33']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
              >
                <Typography variant="body" color={COLORS.textSecondary} style={styles.statLabel}>
                  Responses
                </Typography>
                <Typography variant="h2" color={COLORS.textPrimary}>
                  {responses.length}
                </Typography>
              </LinearGradient>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <LinearGradient
                colors={[COLORS.vibrantPink + '33', COLORS.rosePink + '33']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
              >
                <Typography variant="body" color={COLORS.textSecondary} style={styles.statLabel}>
                  Completion
                </Typography>
                <Typography variant="h2" color={COLORS.textPrimary}>
                  {completed ? 'Yes' : 'No'}
                </Typography>
              </LinearGradient>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <LinearGradient
                colors={[COLORS.vibrantPink + '33', COLORS.rosePink + '33']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
              >
                <Typography variant="body" color={COLORS.textSecondary} style={styles.statLabel}>
                  Time
                </Typography>
                <Typography variant="h2" color={COLORS.textPrimary}>
                  {sessionData ? new Date(sessionData.completed_at || sessionData.started_at).toLocaleTimeString() : '5:42'}
                </Typography>
              </LinearGradient>
            </GlassCard>
          </View>

          {sessionData?.couple_id && (
            <GlassCard style={styles.meterUpdateCard}>
              <Typography variant="h2" style={styles.sectionTitle}>Relationship Meters Updated! 📊</Typography>
              <Typography variant="body" color={COLORS.textSecondary} style={styles.meterUpdateText}>
                Your game completion has increased your couple's connection metrics.
              </Typography>
            </GlassCard>
          )}

          <View style={styles.buttonContainer}>
            <SquishyButton 
              onPress={() => navigation.navigate('MainGameLibrary')}
              style={styles.button}
            >
              <Typography variant="body">Play Another Game</Typography>
            </SquishyButton>

            <SquishyButton 
              onPress={() => navigation.navigate('DashboardHome')}
              variant="ghost"
              style={styles.secondaryButton}
            >
              <Typography variant="body">Return to Dashboard</Typography>
            </SquishyButton>
          </View>
        </ScrollView>
      </LinearGradient>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxlarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  title: {
    marginBottom: SPACING.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsCard: {
    marginBottom: SPACING.xlarge,
  },
  gradientContainer: {
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  scoreLabel: {
    marginTop: SPACING.small,
  },
  badgeContainer: {
    alignSelf: 'center',
    marginTop: SPACING.regular,
  },
  badgeGradient: {
    paddingHorizontal: SPACING.xlarge,
    paddingVertical: SPACING.regular,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.regular,
  },
  achievementCard: {
    marginBottom: SPACING.regular,
  },
  achievementGradient: {
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  achievementContent: {
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xlarge,
  },
  statCard: {
    flex: 1,
    marginHorizontal: SPACING.tiny,
  },
  statLabel: {
    marginBottom: SPACING.small,
  },
  meterUpdateCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.large,
  },
  meterUpdateText: {
    marginTop: SPACING.small,
  },
  buttonContainer: {
    marginTop: SPACING.xlarge,
  },
  button: {
    marginBottom: SPACING.regular,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
});