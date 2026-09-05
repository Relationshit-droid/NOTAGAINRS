import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { gamesApi, GameCategory, GameDetails } from '../../lib/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryDetailRouteParams {
  categoryId: string;
  category?: GameCategory;
}

export default function CategoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<CategoryDetailRouteParams>();
  const { categoryId, category: passedCategory } = route.params || {};

  const [category, setCategory] = useState<GameCategory | null>(passedCategory || null);
  const [games, setGames] = useState<GameDetails[]>([]);
  const [loading, setLoading] = useState(!passedCategory);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategory = async () => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const data = await gamesApi.getCategory(categoryId);
      setCategory(data);
      setGames(data.games_detail || []);
    } catch (error) {
      console.error('Failed to fetch category:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategory();
  };

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const getCategoryColor = (id: string) => {
    const colors: Record<string, string> = {
      'emotional-connection': COLORS.rosePink,
      'conflict-resolution': COLORS.vibrantPink,
      'creative-chaos': COLORS.lavenderPurple,
      'intimacy-romance': COLORS.warmOrange,
      'growth-repair': COLORS.mintGreen,
      'game-show': COLORS.brightYellow,
      'love-arcade': COLORS.aquaTeal,
    };
    return colors[id] || COLORS.vibrantPink;
  };

  const getCategoryIcon = (id: string) => {
    const icons: Record<string, string> = {
      'emotional-connection': 'heart',
      'conflict-resolution': 'shield-checkmark',
      'creative-chaos': 'sparkles',
      'intimacy-romance': 'flame',
      'growth-repair': 'leaf',
      'game-show': 'trophy',
      'love-arcade': 'game-controller',
    };
    return icons[id] || 'heart';
  };

  const categoryColor = category ? getCategoryColor(category.id) : COLORS.vibrantPink;
  const categoryIcon = category ? getCategoryIcon(category.id) : 'heart';

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={GRADIENTS.primary.colors} style={styles.loadingGlow}>
            <Ionicons name={categoryIcon} size={64} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading category...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  if (!category) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="header" center>Category Not Found</Typography>
          <SquishyButton onPress={() => navigation.goBack()} style={{ marginTop: SPACING.large }}>
            <Typography variant="button">Go Back</Typography>
          </SquishyButton>
        </View>
      </ScreenLayout>
    );
  }

  const renderGameItem = ({ item }: { item: GameDetails }) => (
    <TouchableOpacity 
      style={styles.gameCard}
      onPress={() => navigation.navigate('GameLobbyScreen', { gameId: item.id, categoryId: category.id })}
    >
      <View style={styles.gameCardHeader}>
        <LinearGradient colors={[categoryColor, categoryColor + '80']} style={styles.gameIconBg}>
          <Ionicons name="game-controller" size={24} color={COLORS.textPrimary} />
        </LinearGradient>
        <View style={styles.gameMeta}>
          <Typography variant="caption" style={styles.gameDuration}>
            <Ionicons name="time" size={12} color={COLORS.textHint} style={{ marginRight: 4 }} />
            {item.estimated_time}min
          </Typography>
          <Typography variant="caption" style={styles.gameMaxScore}>
            <Ionicons name="star" size={12} color={COLORS.brightYellow} style={{ marginRight: 4 }} />
            {item.max_score} pts
          </Typography>
        </View>
      </View>
      
      <Typography variant="header" style={styles.gameTitle} numberOfLines={1}>{item.name}</Typography>
      <Typography variant="body" style={styles.gameDescription} numberOfLines={2}>{item.description || 'No description available'}</Typography>
      
      <View style={styles.gameFooter}>
        <Typography variant="caption" style={styles.gamePlayers}>
          <Ionicons name="people" size={12} color={COLORS.textHint} style={{ marginRight: 4 }} />
          {item.min_players}+ players
        </Typography>
        <SquishyButton variant="ghost" size="small" onPress={() => navigation.navigate('GameLobbyScreen', { gameId: item.id, categoryId: category.id })}>
          <Typography variant="button" style={{ fontSize: 12 }}>PLAY</Typography>
        </SquishyButton>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={[styles.background, { backgroundColor: categoryColor + '10' }]}>
        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={categoryColor} />
          }
        >
          {/* Category Header */}
          <View style={[styles.categoryHeader, { borderBottomColor: categoryColor }]}>
            <LinearGradient colors={[categoryColor, categoryColor + '80']} style={styles.categoryIconBg}>
              <Ionicons name={categoryIcon} size={40} color={COLORS.textPrimary} />
            </LinearGradient>
            <View style={styles.categoryInfo}>
              <Typography variant="label" style={[styles.categoryLabel, { color: categoryColor }]}>{category.id.toUpperCase()}</Typography>
              <Typography variant="gameTitle" style={styles.categoryTitle}>{category.name}</Typography>
              <Typography variant="body" style={styles.categoryDescription}>{category.description}</Typography>
            </View>
            <View style={styles.categoryStats}>
              <Typography variant="header" style={styles.statValue}>{category.games.length}</Typography>
              <Typography variant="caption" style={styles.statLabel}>Games</Typography>
            </View>
          </View>

          {/* Games List */}
          {games.length > 0 ? (
            <FlatList
              data={games}
              renderItem={renderGameItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.gamesList}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <GlassCard style={styles.emptyState}>
              <Ionicons name="game-controller" size={48} color={COLORS.textHint} />
              <Typography variant="header" style={styles.emptyTitle}>No Games Yet</Typography>
              <Typography variant="body" center style={styles.emptyText}>Games for this category are being prepared.</Typography>
            </GlassCard>
          )}
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
  },
  loadingGlow: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.large,
    ...require('../../theme').SHADOWS.neonStrong,
  },
  background: {
    flex: 1,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.large,
    marginBottom: SPACING.xlarge,
    paddingBottom: SPACING.xlarge,
    borderBottomWidth: 2,
  },
  categoryIconBg: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.tiny,
  },
  categoryTitle: {
    marginBottom: SPACING.small,
  },
  categoryDescription: {
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  statValue: {
    color: COLORS.textPrimary,
  },
  statLabel: {
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gamesList: {
    paddingVertical: SPACING.regular,
  },
  separator: {
    height: SPACING.regular,
  },
  gameCard: {
    width: '100%',
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.regular,
  },
  gameIconBg: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameMeta: {
    gap: SPACING.tiny,
  },
  gameDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameMaxScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameTitle: {
    marginBottom: SPACING.small,
  },
  gameDescription: {
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.regular,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gamePlayers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    padding: SPACING.xxxlarge,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
