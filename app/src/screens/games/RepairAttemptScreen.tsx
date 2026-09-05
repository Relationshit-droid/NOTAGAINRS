import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ScreenLayout, GlassCard, Text, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

const repairOptions = [
  {
    id: '1',
    category: 'Physical Connection',
    title: '6-Second Hug',
    description: 'Release oxytocin and ground each other through physical presence.',
  },
  {
    id: '2',
    category: 'Vulnerability',
    title: 'Direct Apology',
    description: 'Take ownership of your part in the friction with zero justifications.',
  },
  {
    id: '3',
    category: 'Empathy',
    title: 'Active Listening',
    description: 'Hold space for their perspective without planning your response.',
  },
  {
    id: '4',
    category: 'Playfulness',
    title: 'Silly Humor',
    description: 'Crack the tension with an inside joke or a lighthearted observation.',
  },
];

const RepairAttemptScreen = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleSelectPath = (pathId: string) => {
    setSelectedPath(pathId);
  };

  return (
    <ScreenLayout showHeader={false}>
      <View style={styles.container}>
        <Typography variant="h1" center style={styles.title}>Choose Your Peace Offering</Typography>
        <Typography variant="body" center style={styles.subtitle}>
          Tension detected in the cosmic field. Select a repair attempt to realign your orbits and restore harmony to the connection.
        </Typography>
        
        <FlatList
          data={repairOptions}
          renderItem={({ item }) => (
            <TouchableOption
              item={item}
              onPress={() => handleSelectPath(item.id)}
              isSelected={selectedPath === item.id}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
        
        <SquishyButton 
          onPress={() => {}}
          variant="primary"
          size="large"
          style={styles.button}
          disabled={!selectedPath}
        >
          <Typography variant="button">Choose This Path</Typography>
        </SquishyButton>
      </View>
    </ScreenLayout>
  );
};

// Helper component for touchable option
function TouchableOption({ item, onPress, isSelected }: { item: any, onPress: () => void, isSelected: boolean }) {
  return (
    <SquishyButton
      onPress={onPress}
      variant={isSelected ? 'primary' : 'secondary'}
      size="large"
      style={styles.cardButton}
    >
      <View style={styles.cardContent}>
        <Typography variant="caption" style={styles.category}>{item.category}</Typography>
        <Typography variant="h3" style={styles.cardTitle}>{item.title}</Typography>
        <Typography variant="body" style={styles.cardDescription}>{item.description}</Typography>
      </View>
    </SquishyButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.screenPadding,
  },
  title: {
    marginBottom: SPACING.regular,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xlarge,
  },
  list: {
    paddingBottom: SPACING.xlarge,
    paddingHorizontal: SPACING.small,
  },
  cardButton: {
    width: 280,
    marginRight: SPACING.regular,
    padding: SPACING.regular,
  },
  cardContent: {
    alignItems: 'center',
    padding: SPACING.regular,
  },
  category: {
    color: COLORS.textHint,
    marginBottom: SPACING.small,
    textTransform: 'uppercase',
  },
  cardTitle: {
    marginBottom: SPACING.regular,
    textAlign: 'center',
  },
  cardDescription: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: SPACING.xlarge,
  },
});

export default RepairAttemptScreen;
