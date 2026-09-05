import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'emotional-connection', name: 'Emotional Connection', icon: 'heart', color: COLORS.emotionalConnection },
  { id: 'conflict-resolution', name: 'Conflict Resolution', icon: 'git-merge', color: COLORS.conflictResolution },
  { id: 'creative-chaos', name: 'Creative Chaos', icon: 'color-palette', color: COLORS.creativeChaos },
  { id: 'romance-hub', name: 'Romance Hub', icon: 'flame', color: COLORS.romanceHub },
  { id: 'healing-hospital', name: 'Healing Hospital', icon: 'medical', color: COLORS.healingHospital },
  { id: 'game-show', name: 'Game Show', icon: 'trophy', color: COLORS.gameShow },
  { id: 'love-arcade', name: 'Love Arcade', icon: 'game-controller', color: COLORS.loveArcade },
];

const CategorySelectionScreen = ({ navigation }: any) => {
  return (
    <ScreenLayout 
      showMarcie={true} 
      marcieQuote="Choose a category to explore games that will deepen your connection."
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            The Love Arcade
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            +100 Games to Deepen Connection
          </Typography>

          <View style={styles.categoriesContainer}>
            {CATEGORIES.map((category) => (
              <GlassCard 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => navigation?.navigate('GameLibrary', { category: category.id })}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
                  <Ionicons name={category.icon as any} size={32} color={category.color} />
                </View>
                <Typography variant="body" style={styles.categoryName}>
                  {category.name}
                </Typography>
              </GlassCard>
            ))}
          </View>

          <SquishyButton
            variant="primary"
            size="large"
            onPress={() => navigation?.navigate('LoveArcadeHub')}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              Explore All Games
            </Typography>
          </SquishyButton>
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
  categoriesContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  categoryCard: {
    width: '48%',
    marginBottom: SPACING.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  categoryName: {
    textAlign: 'center',
  },
});

export default CategorySelectionScreen;
