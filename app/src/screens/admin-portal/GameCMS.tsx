
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenLayout from '../../layout/ScreenLayout';
import { Typography, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING } from '../../theme';

const GameCMS = () => {
  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <View style={styles.container}>
        <Typography variant="h1" style={styles.title}>Game CMS</Typography>
        <GlassCard variant="elevated" padding="large">
          <Typography variant="body" color={COLORS.textSecondary}>
            {/* TODO: Implement UI based on GameCmsListView.html and GameEditorScreen.html */}
            Game CMS features coming soon...
          </Typography>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: SPACING.regular,
  },
});

export default GameCMS;
