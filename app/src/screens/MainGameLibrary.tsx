import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import { gamesApi } from '../lib/api';
import { ENV } from '../lib/env';
import { DEMO_CATEGORIES } from '../lib/demoData';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  games: string[];
}

export default function MainGameLibrary({ navigation }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        if (ENV.DEMO_MODE) {
          setCategories(DEMO_CATEGORIES);
          setLoading(false);
          return;
        }

        const categoriesData = await gamesApi.getCategories();
        setCategories(categoriesData.categories);
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => {
    const isFeatured = item.id === 'love-arcade';
    return (
      <SquishyButton
        variant="ghost"
        size="large"
        onPress={() => navigation.navigate('CategorySelectionScreen', { categoryId: item.id, categoryName: item.name })}
        style={[styles.categoryCard, isFeatured && styles.featuredCategory]}
      >
        <LinearGradient
          colors={[`${item.color}30`, `${item.color}10`, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <View style={styles.glassCardContent}>
            <View style={styles.categoryHeader}>
              <Typography variant="h3" style={styles.categoryTitle}>
                {item.icon} {item.name}
              </Typography>
              {isFeatured && (
                <View style={[styles.featuredBadge, { backgroundColor: COLORS.brightYellow }]}>
                  <Typography variant="caption" style={styles.featuredBadgeText}>FEATURED</Typography>
                </View>
              )}
            </View>
            <Typography variant="body" style={styles.categoryDescription}>
              {item.description}
            </Typography>
            <View style={styles.gameCountContainer}>
              <Typography variant="label" style={[styles.gameCountText, { color: COLORS.aquaTeal }]}>
                {item.games.length} GAMES
              </Typography>
            </View>
          </View>
        </LinearGradient>
      </SquishyButton>
    );
  };

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.container}>
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={COLORS.vibrantPink} />
            <Typography variant="body" color={COLORS.textPrimary} style={{ marginTop: SPACING.large }}>
              Loading your arcade...
            </Typography>
          </View>
        </LinearGradient>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.container}>
          <View style={styles.centerContent}>
            <Typography variant="h3" color={COLORS.error} center style={{ marginBottom: SPACING.large }}>
              Failed to Load Games
            </Typography>
            <Typography variant="body" color={COLORS.textSecondary} center style={{ marginBottom: SPACING.xlarge }}>
              {error}
            </Typography>
            <SquishyButton onPress={() => navigation.navigate('MainGameLibrary')}>
              <Typography variant="button" color={COLORS.textPrimary}>Retry</Typography>
            </SquishyButton>
          </View>
        </LinearGradient>
      </ScreenLayout>
    );
  }

  if (categories.length === 0) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.container}>
          <View style={styles.centerContent}>
            <Typography variant="h3" color={COLORS.textPrimary} center style={{ marginBottom: SPACING.medium }}>
              No Games Available
            </Typography>
            <Typography variant="body" color={COLORS.textSecondary} center style={{ marginBottom: SPACING.xlarge }}>
              Check back soon for new content!
            </Typography>
          </View>
        </LinearGradient>
      </ScreenLayout>
    );
  }

  const Header = () => (
    <View style={styles.header}>
      <Typography variant="gameTitle" style={styles.title}>THE LOVE ARCADE</Typography>
      <Typography variant="label" style={styles.subtitle}>COUPLES THERAPY DISGUISED AS A GAME</Typography>
    </View>
  );

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.container}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          ListHeaderComponent={Header}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
  },
  header: {
    padding: SPACING.screenPadding,
    paddingTop: SPACING.xxxlarge,
    alignItems: 'center',
  },
  title: {
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.small,
    textShadowColor: COLORS.vibrantPink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xlarge,
    paddingHorizontal: SPACING.regular,
  },
  categoryCard: {
    marginBottom: SPACING.regular,
    borderRadius: BORDER_RADIUS.xxlarge,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: 0,
  },
  featuredCategory: {
    transform: [{ scale: 1.03 }],
    ...SHADOWS.neonSoft,
  },
  categoryGradient: {
    borderRadius: BORDER_RADIUS.xxlarge,
  },
  glassCardContent: {
    padding: SPACING.screenPadding,
    backgroundColor: COLORS.backgroundInput,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  categoryTitle: {
    flex: 1,
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
  },
  featuredBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.medium,
    marginLeft: SPACING.small,
  },
  featuredBadgeText: {
    color: COLORS.backgroundPrimary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  categoryDescription: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  gameCountContainer: {
    alignSelf: 'flex-start',
    marginTop: SPACING.small,
  },
  gameCountText: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});