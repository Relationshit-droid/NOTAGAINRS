import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { gamesApi, GameDetails, GameCategory } from '../../lib/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameSearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [allGames, setAllGames] = useState<GameDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cats, registry] = await Promise.all([
        gamesApi.getCategories(),
        gamesApi.getRegistry(),
      ]);
      setCategories(cats?.categories ?? []);
      setAllGames(Object.values(registry?.games ?? {}));
    } catch (error) {
      console.error('Failed to fetch search data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Load recent searches from storage
    // const stored = await AsyncStorage.getItem('recent_searches');
    // if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const filteredGames = useMemo(() => {
    let results = allGames;

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(game => 
        game.name.toLowerCase().includes(q) ||
        game.description?.toLowerCase().includes(q) ||
        game.category?.toLowerCase().includes(q)
      );
    }

    if (selectedFilters.length > 0) {
      results = results.filter(game => 
        game.category_id && selectedFilters.includes(game.category_id)
      );
    }

    return results;
  }, [query, selectedFilters, allGames]);

  const handleSearchSubmit = () => {
    if (query.trim() && !recentSearches.includes(query)) {
      const newSearches = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(newSearches);
      // await AsyncStorage.setItem('recent_searches', JSON.stringify(newSearches));
    }
  };

  const toggleFilter = (categoryId: string) => {
    setSelectedFilters(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const renderGame = ({ item }: { item: GameDetails }) => (
    <TouchableOpacity
      style={styles.gameItem}
      onPress={() => navigation.navigate('GameLobbyScreen', { gameId: item.id, categoryId: item.category_id })}
    >
      <LinearGradient 
        colors={getCategoryGradient(item.category_id)} 
        style={styles.gameIcon}
      >
        <Ionicons name="game-controller" size={20} color={COLORS.textPrimary} />
      </LinearGradient>
      <View style={styles.gameInfo}>
        <Typography variant="header" style={styles.gameName} numberOfLines={1}>{item.name}</Typography>
        <Typography variant="caption" style={styles.gameCategory} numberOfLines={1}>
          {getCategoryName(item.category_id)} • {item.estimated_time}min • {item.max_score}pts
        </Typography>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textHint} />
    </TouchableOpacity>
  );

  const renderFilterChip = ({ item }: { item: GameCategory }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilters.includes(item.id) && styles.filterChipSelected,
        { borderColor: getCategoryColor(item.id) },
      ]}
      onPress={() => toggleFilter(item.id)}
    >
      <Typography 
        variant="caption" 
        style={[
          styles.filterChipText,
          selectedFilters.includes(item.id) && { color: COLORS.textPrimary },
        ]}
      >
        {item.name}
      </Typography>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={GRADIENTS.primary.colors} style={styles.loadingGlow}>
            <Ionicons name="search" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading game library...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <GlassCard style={styles.searchCard} variant="elevated">
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={24} color={COLORS.textHint} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search games, categories, keywords..."
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearchSubmit}
              placeholderTextColor={COLORS.textHint}
            />
            {!!query && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={24} color={COLORS.textHint} />
              </TouchableOpacity>
            )}
          </View>
        </GlassCard>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.filtersHeader}>
            <Typography variant="label" style={styles.filtersTitle}>FILTERS</Typography>
            {selectedFilters.length > 0 && (
              <TouchableOpacity onPress={clearFilters}>
                <Typography variant="caption" style={styles.clearFiltersText}>Clear all</Typography>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.activeFilters}>
            {selectedFilters.map(id => {
              const cat = categories.find(c => c.id === id);
              return (
                <View key={id} style={[styles.activeFilter, { backgroundColor: getCategoryColor(id) + '20', borderColor: getCategoryColor(id) }]}>
                  <Typography variant="caption" style={[styles.activeFilterText, { color: getCategoryColor(id) }]}>{cat?.name || id}</Typography>
                  <TouchableOpacity onPress={() => toggleFilter(id)}>
                    <Ionicons name="close" size={14} color={getCategoryColor(id)} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <FlatList
            data={categories}
            renderItem={renderFilterChip}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsContainer}
          />
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !query && (
          <View style={styles.recentSection}>
            <Typography variant="label" style={styles.sectionTitle}>RECENT SEARCHES</Typography>
            <View style={styles.recentChips}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity key={index} style={styles.recentChip} onPress={() => { setQuery(search); handleSearchSubmit(); }}>
                  <Ionicons name="time" size={14} color={COLORS.textHint} style={styles.recentIcon} />
                  <Typography variant="caption" style={styles.recentText}>{search}</Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Typography variant="label" style={styles.resultsTitle}>
              {query || selectedFilters.length > 0 ? 'SEARCH RESULTS' : 'ALL GAMES'}
            </Typography>
            <Typography variant="caption" style={styles.resultsCount}>
              {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
            </Typography>
          </View>

          {filteredGames.length > 0 ? (
            <FlatList
              data={filteredGames}
              renderItem={renderGame}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.resultsList}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <GlassCard style={styles.noResults}>
              <Ionicons name="search" size={48} color={COLORS.textHint} />
              <Typography variant="header" style={styles.noResultsTitle}>No Games Found</Typography>
              <Typography variant="body" center style={styles.noResultsText}>
                {query 
                  ? `No games match "${query}". Try different keywords.`
                  : selectedFilters.length > 0
                    ? 'No games in selected categories. Clear filters to see all.'
                    : 'No games available yet.'
                }
              </Typography>
            </GlassCard>
          )}
        </View>
      </ScrollView>
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
  searchCard: {
    marginBottom: SPACING.xlarge,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  searchIcon: {
    marginLeft: SPACING.small,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  clearButton: {
    marginRight: SPACING.small,
  },
  filtersSection: {
    marginBottom: SPACING.xlarge,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  filtersTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clearFiltersText: {
    color: COLORS.vibrantPink,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.small,
    marginBottom: SPACING.regular,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.tiny,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
  },
  activeFilterText: {
    fontWeight: '600',
  },
  filterChipsContainer: {
    paddingVertical: SPACING.small,
    gap: SPACING.small,
  },
  filterChip: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    backgroundColor: COLORS.backgroundCard,
  },
  filterChipSelected: {
    backgroundColor: COLORS.vibrantPink + '20',
  },
  filterChipText: {
    color: COLORS.textSecondary,
  },
  recentSection: {
    marginBottom: SPACING.xlarge,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.regular,
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.small,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.tiny,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  recentIcon: {
    marginRight: SPACING.tiny,
  },
  recentText: {
    color: COLORS.textSecondary,
  },
  resultsSection: {
    marginTop: SPACING.large,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  resultsTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultsCount: {
    color: COLORS.textSecondary,
  },
  resultsList: {
    paddingVertical: SPACING.regular,
  },
  separator: {
    height: SPACING.regular,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    marginBottom: SPACING.tiny,
  },
  gameCategory: {
    color: COLORS.textHint,
  },
  noResults: {
    padding: SPACING.xxxlarge,
    alignItems: 'center',
  },
  noResultsTitle: {
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
  },
  noResultsText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

function getCategoryColor(categoryId?: string) {
  const colors: Record<string, string> = {
    'emotional-connection': COLORS.rosePink,
    'conflict-resolution': COLORS.vibrantPink,
    'creative-chaos': COLORS.lavenderPurple,
    'intimacy-romance': COLORS.warmOrange,
    'growth-repair': COLORS.mintGreen,
    'game-show': COLORS.brightYellow,
    'love-arcade': COLORS.aquaTeal,
  };
  return colors[categoryId || ''] || COLORS.vibrantPink;
}

function getCategoryGradient(categoryId?: string) {
  const color = getCategoryColor(categoryId);
  return [color, color + '80'];
}

function getCategoryName(categoryId?: string) {
  const names: Record<string, string> = {
    'emotional-connection': 'Emotional Connection',
    'conflict-resolution': 'Conflict Resolution',
    'creative-chaos': 'Creative Chaos',
    'intimacy-romance': 'Intimacy & Romance',
    'growth-repair': 'Growth & Repair',
    'game-show': 'Game Show',
    'love-arcade': 'Love Arcade',
  };
  return names[categoryId || ''] || 'General';
}