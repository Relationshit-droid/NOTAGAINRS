import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const PersonalityCard = ({ 
  title, 
  description, 
  selected, 
  onSelect 
}: { 
  title: string, 
  description: string, 
  selected?: boolean, 
  onSelect: () => void 
}) => (
  <SquishyButton
    onPress={onSelect}
    variant={selected ? 'primary' : 'ghost'}
    style={[styles.personalityCard, selected && styles.selectedCard]}
  >
    <Typography variant="h4" style={styles.personalityTitle}>{title}</Typography>
    <Typography variant="body" style={styles.personalityDescription}>{description}</Typography>
  </SquishyButton>
);

const AppSettingsAndPersonalityScreen = () => {
  const [sassLevel, setSassLevel] = useState(75);
  const [gameMode, setGameMode] = useState('Spicy/Savage');

  const handleSassChange = (value: number) => {
    setSassLevel(value);
    // Here you would call an API to update the system_config
    // Example: updateSystemConfig({ sassLevel: value })
  };

  return (
    <ScreenLayout showMarcie={true} marcieQuote="Customize my personality to match your vibe.">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.pageTitle}>Personality Level</Typography>
            <Typography variant="body" style={styles.pageDescription}>
              Fine-tune the AI's temperament. This dictates how the game facilitates your sessions, 
              adjusts the "bite" of the questions, and reacts to your answers.
            </Typography>
          </View>

          <View style={styles.section}>
            <Typography variant="h2" style={styles.sectionTitle}>Select Game Mode</Typography>
            <View style={styles.modeSelectionContainer}>
              <PersonalityCard 
                title="Sweet Marcie" 
                description="Gentle, nurturing, and focuses on positive reinforcement."
                selected={gameMode === 'Sweet'}
                onSelect={() => setGameMode('Sweet')}
              />
              <PersonalityCard 
                title="Neutral" 
                description="Objective, direct, and balanced. Provides clinical yet warm insights."
                selected={gameMode === 'Neutral'}
                onSelect={() => setGameMode('Neutral')}
              />
              <PersonalityCard 
                title="Spicy/Savage" 
                description="Provocative, brutally honest, and high energy. Challenges assumptions with intensity."
                selected={gameMode === 'Spicy/Savage'}
                onSelect={() => setGameMode('Spicy/Savage')}
              />
            </View>
          </View>

          <GlassCard style={styles.sassSliderContainer}>
            <Typography variant="h3" style={styles.sliderTitle}>Sass Level</Typography>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={sassLevel}
              onSlidingComplete={handleSassChange}
              minimumTrackTintColor={COLORS.vibrantPink}
              maximumTrackTintColor={COLORS.textHint}
              thumbTintColor={COLORS.textPrimary}
            />
            <Typography variant="h2" style={styles.sassLevelText}>{sassLevel}%</Typography>
          </GlassCard>

          <SquishyButton 
            onPress={() => {}}
            variant="primary"
            size="large"
            style={styles.confirmButton}
          >
            Confirm Selection
          </SquishyButton>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  pageTitle: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  pageDescription: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyMedium,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  modeSelectionContainer: {
    gap: SPACING.md,
  },
  personalityCard: {
    alignItems: 'flex-start',
    padding: SPACING.lg,
  },
  selectedCard: {
    borderColor: COLORS.vibrantPink,
    borderWidth: 2,
  },
  personalityTitle: {
    marginBottom: SPACING.xs,
  },
  personalityDescription: {
    opacity: 0.7,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodySmall,
  },
  sassSliderContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
    padding: SPACING.lg,
  },
  sliderTitle: {
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  slider: {
    width: '100%',
    height: TYPOGRAPHY.fontSize.displayLarge,
  },
  sassLevelText: {
    color: COLORS.vibrantPink,
    marginTop: SPACING.sm,
  },
  confirmButton: {
    marginBottom: SPACING.xl,
  },
});

export default AppSettingsAndPersonalityScreen;
