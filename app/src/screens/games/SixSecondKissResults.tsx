import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const SixSecondKissResultsScreen = () => {
  const gameResults = {
    kissScore: 600,
    syncBonus: 250,
    totalScore: 850,
    syncPercentage: 88,
  };

  const { kissScore, syncBonus, totalScore, syncPercentage } = gameResults;

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={styles.content}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <Typography variant="h2" center style={styles.mainTitle}>The 6-Second Kiss</Typography>
        <Typography variant="body" center>Challenge Complete</Typography>

        <View style={styles.resultsContainer}>
          <GlassCard style={styles.scoreBox}>
            <Typography variant="caption">Kiss Score</Typography>
            <Typography variant="h1">{kissScore}</Typography>
          </GlassCard>
          <GlassCard style={styles.scoreBox}>
            <Typography variant="caption">Sync Bonus</Typography>
            <Typography variant="h1">+{syncBonus}</Typography>
          </GlassCard>
        </View>

        <GlassCard style={styles.totalScoreContainer}>
          <Typography variant="caption">Total Score</Typography>
          <Typography variant="h1" style={styles.totalScoreValue}>{totalScore}</Typography>
        </GlassCard>

        <View style={styles.syncDisplay}>
          <Typography variant="h1" color={COLORS.success}>{syncPercentage}%</Typography>
          <Typography variant="caption">Synchronization</Typography>
        </View>

        <View style={styles.buttonContainer}>
          <SquishyButton style={styles.actionButton}>
            <Typography variant="h2">Try Again</Typography>
          </SquishyButton>
          <SquishyButton style={styles.actionButton}>
            <Typography variant="h2">Next Challenge</Typography>
          </SquishyButton>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: { 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: SPACING.regular,
  },
  mainTitle: {
    marginTop: SPACING.xlarge,
    marginBottom: SPACING.tiny,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.xlarge,
    gap: SPACING.regular,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
  },
  totalScoreContainer: {
    alignItems: 'center',
    marginTop: SPACING.xlarge,
    width: '100%',
  },
  totalScoreValue: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge * 2,
    color: COLORS.textPrimary,
  },
  syncDisplay: {
    alignItems: 'center',
    marginTop: SPACING.xlarge,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xxlarge,
    gap: SPACING.regular,
  },
  actionButton: {
    flex: 1,
  },
});

export default SixSecondKissResultsScreen;
