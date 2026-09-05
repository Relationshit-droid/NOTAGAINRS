import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../state/store';
import { loveArcadeApi, LoveArcadeGame } from '../../lib/api';
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

interface GameDetailRouteParams {
  gameId: string;
}

export default function LoveArcadeGameDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<GameDetailRouteParams>();
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const { gameId } = route.params || {};
  
  const [game, setGame] = useState<LoveArcadeGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const fetchGameDetail = async () => {
    if (!gameId) return;
    try {
      setLoading(true);
      const token = user ? await user.getIdToken() : undefined;
      // In real app, fetch from backend
      const mockGame: LoveArcadeGame = {
        id: gameId,
        name: 'Date Night Roulette',
        phase: 'ascension',
        format: 'Wheel Spin',
        description: 'Spin the wheel of fate for your next date night adventure. From romantic picnics to spontaneous adventures, let chance decide your destiny together.',
        max_score: 500,
        lifelines: ['Re-spin', 'Partner\'s Choice', 'Double or Nothing'],
        scoring: { base: 100, bonus: 50 },
        sub_games: ['Romantic Picnic', 'Stargazing', 'Cooking Together', 'Adventure Walk'],
        categories: ['Romance', 'Adventure', 'Intimacy'],
        has_daily_double: true,
        has_final_jeopardy: false,
      };
      setGame(mockGame);
    } catch (error) {
      console.error('Failed to fetch game detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    if (!gameId) return;
    try {
      setQuestionsLoading(true);
      const data = await loveArcadeApi.getQuestions(gameId);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  useEffect(() => {
    fetchGameDetail();
    fetchQuestions();
  }, [gameId]);

  const handlePlay = async () => {
    if (!game) return;
    
    // Get game info from registry
    const gameInfo = getGameByScreen(game.name.replace(/\s+/g, ''));
    const GAME_ID = gameInfo?.id || game.id;
    const CATEGORY_ID = gameInfo?.categoryId || 'love-arcade';
    
    // Use the game session hook for backend integration
    const coupleId = undefined; // In real app, fetch from couple API
    
    // For now, just navigate to game play
    navigation.navigate('LoveArcadeGamePlay', { 
      gameId: game.id, 
      gameName: game.name,
      game,
    });
  };

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={GRADIENTS.romanceHub.colors} style={styles.loadingGlow}>
            <Ionicons name="game-controller" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  if (!game) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="header" center>Game Not Found</Typography>
          <SquishyButton onPress={() => navigation.goBack()} style={{ marginTop: SPACING.large }}>
            <Typography variant="button">Go Back</Typography>
          </SquishyButton>
        </View>
      </ScreenLayout>
    );
  }

  const getPhaseGradient = (phase?: string) => {
    const gradients: Record<string, string[]> = {
      awakening: [COLORS.rosePink, COLORS.rosePink + '80'],
      deconstruction: [COLORS.vibrantPink, COLORS.vibrantPink + '80'],
      bridge: [COLORS.warmOrange, COLORS.warmOrange + '80'],
      fortress: [COLORS.mintGreen, COLORS.mintGreen + '80'],
      ascension: [COLORS.brightYellow, COLORS.brightYellow + '80'],
    };
    return gradients[game.phase || ''] || [COLORS.vibrantPink, COLORS.vibrantPink + '80'];
  };

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Game Header */}
        <View style={[styles.gameHeader, { borderBottomColor: getPhaseGradient(game.phase)[0] }]}>
          <LinearGradient colors={getPhaseGradient(game.phase)} style={styles.phaseBadge}>
            <Typography variant="caption" style={styles.phaseBadgeText}>{game.phase?.toUpperCase()}</Typography>
          </LinearGradient>
          <Typography variant="gameTitle" style={styles.gameTitle}>{game.name}</Typography>
          <Typography variant="body" style={styles.gameDescription}>{game.description}</Typography>
          
          <View style={styles.gameMeta}>
            <GameMetaItem icon="grid" label="FORMAT" value={game.format} />
            <GameMetaItem icon="time" label="TIME" value={`${game.estimated_time} min`} />
            <GameMetaItem icon="star" label="MAX SCORE" value={`${game.max_score} pts`} color={COLORS.brightYellow} />
            <GameMetaItem icon="people" label="PLAYERS" value={`${game.min_players}+`} />
          </View>

          {game.lifelines && game.lifelines.length > 0 && (
            <View style={styles.lifelines}>
              <Typography variant="caption" style={styles.lifelinesLabel}>LIFELINES</Typography>
              <View style={styles.lifelinesList}>
                {game.lifelines.map((lifeline, index) => (
                  <View key={index} style={styles.lifelineItem}>
                    <Ionicons name="heart" size={12} color={COLORS.rosePink} style={{ marginRight: 4 }} />
                    <Typography variant="caption">{lifeline}</Typography>
                  </View>
                ))}
              </View>
            </View>
          )}

          {game.has_daily_double && (
            <View style={styles.specialFeature}>
              <Ionicons name="flash" size={16} color={COLORS.brightYellow} style={styles.specialIcon} />
              <Typography variant="caption" style={styles.specialText}>DAILY DOUBLE AVAILABLE</Typography>
            </View>
          )}

          {game.has_final_jeopardy && (
            <View style={[styles.specialFeature, { backgroundColor: COLORS.brightYellow + '15', borderColor: COLORS.brightYellow }]}>
              <Ionicons name="trophy" size={16} color={COLORS.brightYellow} style={styles.specialIcon} />
              <Typography variant="caption" style={styles.specialText}>FINAL JEOPARDY ROUND</Typography>
            </View>
          )}

          {game.sub_games && game.sub_games.length > 0 && (
            <View style={styles.subGames}>
              <Typography variant="caption" style={styles.subGamesLabel}>MINI-GAMES</Typography>
              <View style={styles.subGamesList}>
                {game.sub_games.map((sub, index) => (
                  <View key={index} style={styles.subGameItem}>
                    <Ionicons name="game-controller" size={12} color={COLORS.textHint} style={{ marginRight: 6 }} />
                    <Typography variant="caption" style={styles.subGameText}>{sub}</Typography>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Play Button */}
        <SquishyButton 
          onPress={handlePlay}
          style={styles.playButton}
        >
          <Ionicons name="play" size={24} color={COLORS.textPrimary} style={{ marginRight: SPACING.small }} />
          <Typography variant="button">START GAME</Typography>
        </SquishyButton>

        {/* Questions Preview */}
        {questions.length > 0 && (
          <GlassCard style={styles.sectionCard}>
            <Typography variant="label" style={styles.sectionTitle}>QUESTIONS PREVIEW</Typography>
            <Typography variant="caption" style={styles.sectionSubtitle}>
              {questions.length} questions ready • Tap to preview
            </Typography>
            
            <View style={styles.questionsPreview}>
              {questions.slice(0, 3).map((q, index) => (
                <View key={index} style={styles.questionPreviewItem}>
                  <Typography variant="caption" style={styles.questionNumber}>{index + 1}.</Typography>
                  <Typography variant="body" style={styles.questionPreviewText} numberOfLines={2}>{q.question || q.text}</Typography>
                </View>
              ))}
              {questions.length > 3 && (
                <View style={styles.moreQuestions}>
                  <Typography variant="caption" style={styles.moreText}>
                    +{questions.length - 3} more questions...
                  </Typography>
                </View>
              )}
            </View>
          </GlassCard>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const GameMetaItem = ({ icon, label, value, color }: any) => (
  <View style={styles.metaItem}>
    <Ionicons name={icon} size={16} color={color || COLORS.textHint} style={styles.metaIcon} />
    <View>
      <Typography variant="caption" style={styles.metaLabel}>{label}</Typography>
      <Typography variant="caption" style={styles.metaValue}>{value}</Typography>
    </View>
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
  gameHeader: {
    marginBottom: SPACING.xlarge,
  },
  phaseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.regular,
  },
  phaseBadgeText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 10,
  },
  gameTitle: {
    marginBottom: SPACING.small,
  },
  gameDescription: {
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.xlarge,
  },
  gameMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
  },
  metaIcon: {
    marginRight: SPACING.tiny,
  },
  metaLabel: {
    color: COLORS.textHint,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
  lifelines: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.regular,
    backgroundColor: COLORS.rosePink + '10',
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    borderColor: COLORS.rosePink + '40',
  },
  lifelinesLabel: {
    color: COLORS.rosePink,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.regular,
  },
  lifelinesList: {
    gap: SPACING.small,
  },
  lifelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.brightYellow + '10',
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    borderColor: COLORS.brightYellow + '40',
    marginBottom: SPACING.regular,
  },
  specialIcon: {
    flexShrink: 0,
  },
  specialText: {
    color: COLORS.brightYellow,
    fontWeight: '700',
  },
  subGames: {
    marginBottom: SPACING.xlarge,
  },
  subGamesLabel: {
    color: COLORS.vibrantPink,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.regular,
  },
  subGamesList: {
    gap: SPACING.small,
  },
  subGameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
  },
  subGameText: {
    color: COLORS.textSecondary,
  },
  playButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
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
  questionsPreview: {
    gap: SPACING.regular,
  },
  questionPreviewItem: {
    flexDirection: 'row',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  questionNumber: {
    color: COLORS.vibrantPink,
    fontWeight: '700',
    flexShrink: 0,
  },
  questionPreviewText: {
    flex: 1,
    lineHeight: 22,
  },
  moreQuestions: {
    paddingTop: SPACING.regular,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  moreText: {
    color: COLORS.textHint,
    textAlign: 'center',
  },
});