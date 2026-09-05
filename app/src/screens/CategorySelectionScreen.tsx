import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { title: 'Communication', icon: 'chatbubbles', color: COLORS.info, description: 'Express & listen' },
  { title: 'Intimacy', icon: 'heart', color: COLORS.vibrantPink, description: 'Deep connection' },
  { title: 'Trust', icon: 'shield-checkmark', color: COLORS.mintGreen, description: 'Build security' },
  { title: 'Growth', icon: 'trending-up', color: COLORS.lavenderPurple, description: 'Evolve together' },
  { title: 'Fun & Play', icon: 'happy', color: COLORS.brightYellow, description: 'Joy & laughter' },
  { title: 'Shared Values', icon: 'diamond', color: COLORS.textSecondary, description: 'Common ground' },
];

const CategoryButton = ({ 
  title, 
  icon, 
  color, 
  description 
}: { 
  title: string; 
  icon: any; 
  color: string;
  description: string;
}) => (
  <SquishyButton 
    variant="ghost" 
    style={styles.cardContainer}
    onPress={() => {}}
  >
    <GlassCard style={[styles.categoryCard, { borderColor: `${color}50` }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={TYPOGRAPHY.fontSize.displayMedium} color={color} />
      </View>
      <Typography variant="h4" style={styles.cardTitle}>{title}</Typography>
      <Typography variant="small" style={styles.cardDescription}>{description}</Typography>
    </GlassCard>
  </SquishyButton>
);

const CategorySelectionScreen = () => {
  return (
    <ScreenLayout showMarcie={true} marcieQuote="Choose your path to deeper connection.">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Typography variant="h1" style={styles.headerTitle} center>
            Choose Your Path
          </Typography>
          <Typography variant="body" style={styles.headerSubtitle} center>
            Select a cosmic pillar to begin your journey.
          </Typography>
        </View>

        <GlassCard style={styles.progressCard}>
          <Typography variant="label" style={styles.progressText} center>
            Journey Progress: 35%
          </Typography>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '35%' }]} />
          </View>
        </GlassCard>

        <View style={styles.grid}>
          {categories.map(cat => (
            <CategoryButton key={cat.title} {...cat} />
          ))}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  progressCard: {
    marginBottom: SPACING.lg,
  },
  progressText: {
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: SPACING.tiny * 2,
    backgroundColor: `${COLORS.textPrimary}10`,
    borderRadius: BORDER_RADIUS.xlarge,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.vibrantPink,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  cardContainer: {
    width: '47%',
    aspectRatio: 1,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    width: SPACING.xxlarge * 2,
    height: SPACING.xxlarge * 2,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default CategorySelectionScreen;
