import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { gamesApi, GameDetails, GameCategory } from '../../lib/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { useAppStore } from '../../state/store';

interface RecommendedGame extends GameDetails {
  matchReason: string;
  matchScore: number;
}

export default function RecommendedGamesScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [recommendations, setRecommendations] = useState<RecommendedGame[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');

  const fetchRecommendations = async () => {
    if (!user || !userId) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      
      // Get couple data for personalization
      const couple = await coupleApi.getCoupleForUser(userId, token);
      const [cats, registry] = await Promise.all([
        gamesApi.getCategories(),
        gamesApi.getRegistry(),
      ]);
      
      setCategories(cats.categories);
      
      // Generate recommendations based on couple context
      const allGames = Object.values(registry.games);
      const personalized = generateRecommendations(allGames, couple);
      setRecommendations(personalized);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user, userId]);

  const generateRecommendations = (games: GameDetails[], couple: any): RecommendedGame[] => {
    const diagnosis = couple?.relationship_diagnosis || '';
    const trustMeter = couple?.trust_meter || 0.5;
    const playedGameIds = new Set<string>(); // In real app, fetch from backend

    return games
      .filter(g => !playedGameIds.has(g.id))
      .map(game => {
        let score = 50;
        let reason = 'Great for your relationship stage';

        // Boost based on diagnosis
        if (diagnosis.includes('trust') && game.category_id === 'growth-repair') score += 30;
        if (diagnosis.includes('communication') && game.category_id === 'emotional-connection') score += 30;
        if (diagnosis.includes('intimacy') && game.category_id === 'intimacy-romance') score += 30;
        if (diagnosis.includes('conflict') && game.category_id === 'conflict-resolution') score += 30;

        // Boost based on trust level
        if (trustMeter < 0.4 && game.category_id === 'growth-repair') score += 20;
        if (trustMeter > 0.7 && game.category_id === 'intimacy-romance') score += 15;

        // Boost newer games
        if (game.id.includes('new') || game.id.includes('arcade')) score += 10;

        return {
          ...game,
          matchScore: Math.min(100, score),
          matchReason: reason,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  };

  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(g => g.category_id === selectedCategory);

  const renderRecommendation = ({ item, index }: { item: RecommendedGame; index: number }) => (
    <View style={styles.recommendationCard}>
      <View style={styles.recHeader}>
        <View style={styles.recRank}>
          <Typography variant="header" style={{ color: getMatchColor(item.matchScore) }}>#{index + 1}</Typography>
          <Typography variant="caption" style={{ color: getMatchColor(item.matchScore) }}>{item.matchScore}% Match</Typography>
        </View>
        <LinearGradient colors={getCategoryGradient(item.category_id)} style={styles.recIcon}>
          <Ionicons name="sparkles" size={24} color={COLORS.textPrimary} />
        </LinearGradient>
      </View>

      <Typography variant="header" style={styles.recTitle} numberOfLines={1}>{item.name}</Typography>
      <Typography variant="body" style={styles.recDescription} numberOfLines={2}>{item.description}</Typography>

      <View style={styles.recMeta}>
        <View style={styles.recMetaItem}>
          <Ionicons name="time" size={14} color={COLORS.textHint} />
          <Typography variant="caption" style={{ marginLeft: 4 }}>{item.estimated_time} min</Typography>
        </View>
        <View style={styles.recMetaItem}>
          <Ionicons name="people" size={14} color={COLORS.textHint} />
          <Typography variant="caption" style={{ marginLeft: 4 }}>{item.min_players}+ players</Typography>
        </View>
        <View style={styles.recMetaItem}>
          <Ionicons name="star" size={14} color={COLORS.brightYellow} />
          <Typography variant="caption" style={{ marginLeft: 4 }}>{item.max_score} pts</Typography>
        </View>
      </View>

      <View style={styles.recReason}>
        <Ionicons name="lightbulb" size={14} color={COLORS.vibrantPink} />
        <Typography variant="caption" style={{ flex: 1, color: COLORS.textSecondary }}>{item.matchReason}</Typography>
      </View>

      <SquishyButton 
        onPress={() => navigation.navigate('GameLobbyScreen', { gameId: item.id, categoryId: item.category_id })}
        style={styles.recPlayButton}
      >
        <Typography variant="button">PLAY NOW</Typography>
      </SquishyButton>
    </View>
  );

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={GRADIENTS.primary.colors} style={styles.loadingGlow}>
            <Ionicons name="sparkles" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Finding your perfect matches...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Personalization Banner */}
        <GlassCard style={styles.personalizationCard} variant="elevated">
          <LinearGradient colors={GRADIENTS.romanceHub.colors} style={styles.persIcon}>
            <Ionicons name="sparkles" size={28} color={COLORS.textPrimary} />
          </LinearGradient>
          <View style={styles.persContent}>
            <Typography variant="label" style={styles.persTitle}>PERSONALIZED FOR YOU</Typography>
            <Typography variant="body" style={styles.persText}>
              Based on your relationship diagnosis and trust level, Dr. Marcie has curated these games.
            </Typography>
          </View>
        </GlassCard>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <FilterChip label="All" selected={selectedCategory === 'all'} onPress={() => setSelectedCategory('all')} color={COLORS.vibrantPink} />
            {categories.map(cat => (
              <FilterChip 
                key={cat.id} 
                label={cat.name} 
                selected={selectedCategory === cat.id} 
                onPress={() => setSelectedCategory(cat.id)} 
                color={getCategoryColor(cat.id)} 
              />
            ))}
          </ScrollView>
        </View>

        {/* Recommendations List */}
        {filteredRecommendations.length > 0 ? (
          <FlatList
            data={filteredRecommendations}
            renderItem={renderRecommendation}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.recommendationsList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <GlassCard style={styles.emptyState}>
            <Ionicons name="sparkles" size={48} color={COLORS.textHint} />
            <Typography variant="header" style={styles.emptyTitle}>No Recommendations</Typography>
            <Typography variant="body" center style={styles.emptyText}>
              {selectedCategory !== 'all' 
                ? 'No games in this category match your profile. Try "All".'
                : 'You\'ve played all recommended games! Check back after new games are added.'
              }
            </Typography>
          </GlassCard>
        )}

        {/* Refresh Button */}
        <SquishyButton 
          onPress={fetchRecommendations}
          variant="secondary"
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
          <Typography variant="button">REFRESH RECOMMENDATIONS</Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
}

const FilterChip = ({ label, selected, onPress, color }: { label: string; selected: boolean; onPress: () => void; color: string }) => (
  <TouchableOpacity
    style={[
      styles.filterChip,
      selected && styles.filterChipSelected,
      { borderColor: color, backgroundColor: selected ? color + '20' : COLORS.backgroundCard },
    ]}
    onPress={onPress}
  >
    <Typography 
      variant="caption" 
      style={[
        styles.filterChipText,
        selected && { color: color, fontWeight: '700' },
      ]}
    >
      {label}
    </Typography>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
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
  personalizationCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  persIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  persContent: {
    flex: 1,
  },
  persTitle: {
    color: COLORS.vibrantPink,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.small,
  },
  persText: {
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  categoryFilter: {
    marginBottom: SPACING.xlarge,
  },
  filterScroll: {
    gap: SPACING.small,
    paddingHorizontal: SPACING.tiny,
  },
  filterChip: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
  },
  filterChipSelected: {
    borderWidth: 2,
  },
  filterChipText: {
    color: COLORS.textSecondary,
  },
  recommendationsList: {
    paddingVertical: SPACING.regular,
  },
  separator: {
    height: SPACING.regular,
  },
  recommendationCard: {
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  recRank: {
    alignItems: 'flex-end',
  },
  recIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitle: {
    marginBottom: SPACING.small,
  },
  recDescription: {
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.regular,
  },
  recMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.regular,
    paddingVertical: SPACING.regular,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  recMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.small,
    marginBottom: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.vibrantPink + '10',
    borderRadius: BORDER_RADIUS.large,
  },
  recPlayButton: {
    marginTop: SPACING.small,
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
  refreshButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
  },
});

function getCategoryColor(categoryId: string) {
  const colors: Record<string, string> = {
    'emotional-connection': COLORS.rosePink,
    'conflict-resolution': COLORS.vibrantPink,
    'creative-chaos': COLORS.lavenderPurple,
    'intimacy-romance': COLORS.warmOrange,
    'growth-repair': COLORS.mintGreen,
    'game-show': COLORS.brightYellow,
    'love-arcade': COLORS.aquaTeal,
  };
  return colors[categoryId] || COLORS.vibrantPink;
}

function getCategoryGradient(categoryId?: string) {
  const color = getCategoryColor(categoryId || '');
  return [color, color + '80'];
}

function getMatchColor(score: number) {
  if (score >= 80) return COLORS.mintGreen;
  if (score >= 60) return COLORS.brightYellow;
  return COLORS.vibrantPink;
}