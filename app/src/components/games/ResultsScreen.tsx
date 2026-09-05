import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { Typography, SquishyButton } from '../ui';

interface ResultsScreenProps {
  scores: {
    player1: number;
    player2: number;
  };
  marcieCommentary: string;
  onContinue: () => void;
  duration: number;
  achievements?: string[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  scores,
  marcieCommentary,
  onContinue,
  duration,
  achievements = [],
}) => {
  const winner = scores.player1 > scores.player2 ? 'player1' : 
                scores.player2 > scores.player1 ? 'player2' : 'tie';
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onContinue();
  };

  const getWinnerMessage = () => {
    if (winner === 'tie') {
      return "It's a Perfect Tie!";
    }
    return winner === 'player1' ? 'Player One Wins!' : 'Player Two Wins!';
  };

  const getWinnerColor = () => {
    if (winner === 'tie') return COLORS.brightYellow;
    return winner === 'player1' ? COLORS.vibrantPink : COLORS.lavenderPurple;
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[COLORS.deepCosmic, COLORS.richPlum, COLORS.midPurple]} 
        style={styles.background} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Winner Announcement */}
        <View style={styles.winnerContainer}>
          <Typography 
            variant="gameTitle" 
            color={getWinnerColor()}
            center
            style={styles.winnerText}
          >
            {getWinnerMessage()}
          </Typography>
          
          <View style={styles.scoresContainer}>
            <View style={[styles.scoreCard, winner === 'player1' && styles.winnerCard]}>
              <Typography variant="label" color={COLORS.textPrimary} style={styles.scoreLabel}>
                Player 1
              </Typography>
              <Typography variant="h2" color={COLORS.textPrimary}>
                {scores.player1}
              </Typography>
            </View>
            
            <View style={styles.vsContainer}>
              <Typography variant="h3" color={COLORS.vibrantPink} style={styles.vsText}>
                VS
              </Typography>
            </View>
            
            <View style={[styles.scoreCard, winner === 'player2' && styles.winnerCard]}>
              <Typography variant="label" color={COLORS.textPrimary} style={styles.scoreLabel}>
                Player 2
              </Typography>
              <Typography variant="h2" color={COLORS.textPrimary}>
                {scores.player2}
              </Typography>
            </View>
          </View>
        </View>

        {/* Game Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={TYPOGRAPHY.fontSize.displaySmall} color={COLORS.vibrantPink} />
            <Typography variant="caption" color={COLORS.textPrimary} style={styles.statLabel}>
              Duration
            </Typography>
            <Typography variant="body" color={COLORS.textPrimary}>
              {formatTime(duration)}
            </Typography>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="trophy-outline" size={TYPOGRAPHY.fontSize.displaySmall} color={COLORS.brightYellow} />
            <Typography variant="caption" color={COLORS.textPrimary} style={styles.statLabel}>
              Total Points
            </Typography>
            <Typography variant="body" color={COLORS.textPrimary}>
              {scores.player1 + scores.player2}
            </Typography>
          </View>
        </View>

        {/* Marcie's Commentary */}
        <View style={styles.commentaryContainer}>
          <View style={styles.marcieHeader}>
            <Ionicons name="chatbubble-ellipses" size={TYPOGRAPHY.fontSize.displaySmall} color={COLORS.vibrantPink} />
            <Typography variant="h4" color={COLORS.vibrantPink}>
              Dr. Marcie Says
            </Typography>
          </View>
          <Typography variant="marcieDialogue" color={COLORS.textPrimary}>
            {marcieCommentary}
          </Typography>
        </View>

        {/* Achievements */}
        {achievements.length > 0 && (
          <View style={styles.achievementsContainer}>
            <Typography variant="h3" color={COLORS.brightYellow} center style={styles.achievementsTitle}>
              Achievements Unlocked
            </Typography>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Ionicons name="star" size={TYPOGRAPHY.fontSize.headerSmall} color={COLORS.brightYellow} />
                <Typography variant="body" color={COLORS.brightYellow} style={styles.achievementText}>
                  {achievement}
                </Typography>
              </View>
            ))}
          </View>
        )}

        {/* Continue Button */}
        <SquishyButton onPress={handleContinue} style={styles.continueButton}>
          <View style={styles.continueContent}>
            <Typography variant="button" color={COLORS.textPrimary}>
              Continue
            </Typography>
            <Ionicons name="arrow-forward" size={TYPOGRAPHY.fontSize.headerSmall} color={COLORS.textPrimary} style={styles.continueIcon} />
          </View>
        </SquishyButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepCosmic,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.sectionPadding,
  },
  winnerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxlarge,
  },
  winnerText: {
    marginBottom: SPACING.xlarge,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  scoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCard: {
    backgroundColor: COLORS.backgroundInput,
    paddingHorizontal: SPACING.xlarge,
    paddingVertical: SPACING.regular,
    borderRadius: BORDER_RADIUS.card,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    minWidth: 100,
  },
  winnerCard: {
    borderColor: COLORS.brightYellow,
    backgroundColor: 'rgba(255, 239, 31, 0.1)',
    shadowColor: COLORS.brightYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  scoreLabel: {
    marginBottom: SPACING.small,
    opacity: 0.8,
  },
  vsContainer: {
    marginHorizontal: SPACING.large,
  },
  vsText: {
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xxlarge,
    paddingVertical: SPACING.large,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BORDER_RADIUS.card,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    marginTop: SPACING.small,
    marginBottom: SPACING.tiny,
    opacity: 0.7,
  },
  commentaryContainer: {
    backgroundColor: 'rgba(252, 12, 132, 0.1)',
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(252, 12, 132, 0.3)',
    marginBottom: SPACING.xlarge,
  },
  marcieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  achievementsContainer: {
    marginBottom: SPACING.xxlarge,
  },
  achievementsTitle: {
    marginBottom: SPACING.regular,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 239, 31, 0.1)',
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.large,
    marginBottom: SPACING.small,
    borderWidth: 1,
    borderColor: 'rgba(255, 239, 31, 0.3)',
  },
  achievementText: {
    marginLeft: SPACING.medium,
    flex: 1,
  },
  continueButton: {
    marginTop: SPACING.small,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueIcon: {
    marginLeft: SPACING.small,
  },
});

export default ResultsScreen;
