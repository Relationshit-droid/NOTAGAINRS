/**
 * Layout Primitives Demo
 * 
 * This file demonstrates how the layout components make
 * screen building faster and more consistent.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { ScreenLayout, Typography, SquishyButton } from '../';
import { VStack, HStack, Spacer, Section } from './';
import { SPACING, COLORS, BORDER_RADIUS } from '../../../theme';

export const LayoutDemo: React.FC = () => {
  return (
    <ScreenLayout showHeader={false}>
      <VStack gap={SPACING.large} style={styles.container}>
        
        {/* Header Section */}
        <HStack justifyContent="space-between" alignItems="center">
          <Typography variant="h1">Couples Jeopardy</Typography>
          <Typography variant="caption" style={styles.roundBadge}>
            Round 3
          </Typography>
        </HStack>
        
        {/* Score Section */}
        <Section title="Current Score" padding="large">
          <HStack justifyContent="space-between" alignItems="center">
            <VStack gap={SPACING.tiny}>
              <Typography variant="caption">Your Score</Typography>
              <Typography variant="h2" style={styles.scoreHighlight}>800</Typography>
            </VStack>
            <VStack gap={SPACING.tiny} alignItems="flex-end">
              <Typography variant="caption">Partner</Typography>
              <Typography variant="h2">650</Typography>
            </VStack>
          </HStack>
        </Section>
        
        {/* Category Selection */}
        <Section title="Select Category">
          <VStack gap={SPACING.small}>
            {['History', 'Science', 'Movies', 'Music'].map((category) => (
              <HStack 
                key={category} 
                justifyContent="space-between" 
                alignItems="center"
                style={styles.categoryRow}
              >
                <Typography variant="body">{category}</Typography>
                <Typography variant="caption" style={styles.pointValue}>
                  200 pts
                </Typography>
              </HStack>
            ))}
          </VStack>
        </Section>
        
        {/* Stats */}
        <HStack gap={SPACING.regular}>
          <Section title="Correct" padding="small" style={styles.statCard}>
            <Typography variant="h3" style={styles.successText}>12</Typography>
          </Section>
          <Section title="Streak" padding="small" style={styles.statCard}>
            <Typography variant="h3" style={styles.streakText}>🔥 5</Typography>
          </Section>
          <Section title="Time" padding="small" style={styles.statCard}>
            <Typography variant="h3">2:30</Typography>
          </Section>
        </HStack>
        
        <Spacer />
        
        {/* Action Buttons */}
        <VStack gap={SPACING.regular}>
          <SquishyButton size="large">
            <Typography variant="button">Next Question</Typography>
          </SquishyButton>
          
          <HStack gap={SPACING.regular}>
            <SquishyButton variant="ghost" style={styles.flexButton}>
              <Typography variant="button">Pause</Typography>
            </SquishyButton>
            <SquishyButton variant="secondary" style={styles.flexButton}>
              <Typography variant="button">Settings</Typography>
            </SquishyButton>
          </HStack>
        </VStack>
        
      </VStack>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.screenPadding,
  },
  roundBadge: {
    backgroundColor: COLORS.backgroundInput,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.medium,
  },
  scoreHighlight: {
    color: COLORS.success,
  },
  categoryRow: {
    paddingVertical: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  pointValue: {
    color: COLORS.brightYellow,
  },
  statCard: {
    flex: 1,
  },
  successText: {
    color: COLORS.success,
    textAlign: 'center',
  },
  streakText: {
    textAlign: 'center',
  },
  flexButton: {
    flex: 1,
  },
});

export default LayoutDemo;
