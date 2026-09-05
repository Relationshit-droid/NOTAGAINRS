
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const categoriesData = [
  {
    id: "emotional-connection",
    name: "EMOTIONAL CONNECTION",
    description: "SEEN Method focused games",
    icon: "❤️",
    color: COLORS.vibrantPink,
    games: ["truth-or-trust", "gratitude-cloud", "eye-contact-challenge", "memory-lane-map", "vibe-check"]
  },
  {
    id: "love-arcade",
    name: "THE LOVE ARCADE",
    description: "Championship matches of honesty, wit, and emotional parkour",
    icon: "🎮",
    color: COLORS.brightYellow,
    games: ["truth-teller-tower", "echo-chamber-escape", "intimacy-feud", "relational-jeopardy", "family-forge", "harbor-storm"]
  }
];

export default function MainGameLibrary({ navigation }: any) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setCategories(categoriesData);
  }, []);

  const renderCategory = ({ item }: { item: any }) => {
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

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.container}>
        <View style={styles.header}>
          <Typography variant="gameTitle" style={styles.title}>THE LOVE ARCADE</Typography>
          <Typography variant="label" style={styles.subtitle}>COUPLES THERAPY DISGUISED AS A GAME</Typography>
        </View>

        <ScrollView style={styles.content}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </ScrollView>
      </LinearGradient>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.regular,
  },
  listContent: {
    paddingBottom: SPACING.xlarge,
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
