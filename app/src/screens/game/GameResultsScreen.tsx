import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const GameResultsScreen = ({ route, navigation }: any) => {
  const { gameId, score: initialScore } = route?.params || {};
  const [results, setResults] = useState<any>(null);
  const [score, setScore] = useState(initialScore || 85);

  useEffect(() => {
    // Simulate fetching results
    const fetchResults = async () => {
      setResults({
        score: score,
        totalQuestions: 3,
        correctAnswers: 2,
        badge: score >= 80 ? 'Connection Champion' : score >= 60 ? 'Growing Together' : 'Keep Practicing',
      });
    };

    fetchResults();
  }, [gameId, score]);

  return (
    <ScreenLayout 
      showMarcie={true} 
      marcieQuote={score >= 80 
        ? "Fantastic! You two are really connecting! 🎉" 
        : "Great effort! Keep practicing and you'll see improvement! 💪"}
      marcieAnimation={score >= 80 ? 'celebrate' : 'nod'}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            The Love Arcade
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            +100 Games to Deepen Connection
          </Typography>

          <View style={styles.iconContainer}>
            <Ionicons 
              name={score >= 80 ? "trophy" : score >= 60 ? "star" : "heart"} 
              size={64} 
              color={score >= 80 ? COLORS.brightYellow : score >= 60 ? COLORS.vibrantPink : COLORS.textSecondary} 
            />
          </View>
          
          <Typography variant="h2" style={styles.resultsTitle}>
            Game Results
          </Typography>
          
          {results && (
            <>
              <GlassCard style={styles.scoreCard}>
                <Typography variant="caption" style={styles.scoreLabel}>
                  Your Score
                </Typography>
                <Typography variant="gameTitle" style={styles.scoreValue}>
                  {results.score}%
                </Typography>
                <View style={styles.badgeContainer}>
                  <LinearGradient
                    colors={GRADIENTS.primary.colors}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={styles.badge}
                  >
                    <Typography variant="button" style={styles.badgeText}>
                      {results.badge}
                    </Typography>
                  </LinearGradient>
                </View>
              </GlassCard>

              <GlassCard style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Typography variant="body">Questions Answered</Typography>
                  <Typography variant="h2">{results.totalQuestions}</Typography>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statRow}>
                  <Typography variant="body">Correct Answers</Typography>
                  <Typography variant="h2" style={{ color: COLORS.success }}>
                    {results.correctAnswers}
                  </Typography>
                </View>
              </GlassCard>
            </>
          )}

          <View style={styles.buttonContainer}>
            <SquishyButton
              variant="primary"
              size="large"
              onPress={() => navigation?.navigate('GamePlay')}
            >
              <Typography variant="button" color={COLORS.textPrimary}>
                Play Again
              </Typography>
            </SquishyButton>

            <SquishyButton
              variant="ghost"
              size="large"
              onPress={() => navigation?.navigate('LoveArcadeHub')}
            >
              <Typography variant="button" color={COLORS.textPrimary}>
                Back to Arcade
              </Typography>
            </SquishyButton>
          </View>
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
  },
  resultsTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  scoreCard: {
    width: '100%',
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  scoreLabel: {
    opacity: 0.7,
    marginBottom: SPACING.sm,
  },
  scoreValue: {
    color: COLORS.vibrantPink,
    marginBottom: SPACING.md,
  },
  badgeContainer: {
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.md,
  },
  badgeText: {
    color: COLORS.textPrimary,
  },
  statsCard: {
    width: '100%',
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  statDivider: {
    height: 1,
    backgroundColor: `${COLORS.textPrimary}10`,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
});

export default GameResultsScreen;
