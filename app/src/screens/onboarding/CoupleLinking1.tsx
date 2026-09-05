import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, TrustThermometer, RadialGradientBackground } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

const CoupleLinkingTrustThermometerScreen = () => {
  return (
    <ScreenLayout>
      <RadialGradientBackground />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Typography variant="header" style={styles.pageTitle}>Trust Thermometer</Typography>
        <Typography variant="body" style={styles.pageSubtitle}>Visualizing the foundation of your connection.</Typography>

        <View style={styles.content}>
          <GlassCard style={styles.mainDisplay}>
            <TrustThermometer width={60} height={200} level={0.8} showPercentage />
          </GlassCard>
          
          <View style={styles.sidePanels}>
            <GlassCard style={styles.panel} variant="outlined">
              <Typography variant="label" style={styles.panelTitle}>Historical Data</Typography>
              <Typography variant="body">Partner A: 82%</Typography>
              <Typography variant="body">Partner B: 78%</Typography>
            </GlassCard>
            <GlassCard style={styles.panel} variant="outlined">
              <Typography variant="label" style={styles.panelTitle}>Growth Streak</Typography>
              <Typography variant="header">14 Days</Typography>
            </GlassCard>
            <GlassCard style={styles.panel} variant="outlined">
              <Typography variant="label" style={styles.panelTitle}>Analytics</Typography>
              <Typography variant="body">Stability Boost</Typography>
              <Typography variant="body">Synchronization</Typography>
            </GlassCard>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { 
    padding: SPACING.screenPadding, 
    alignItems: 'center' 
  },
  pageTitle: { 
    textAlign: 'center', 
    marginBottom: SPACING.small 
  },
  pageSubtitle: { 
    textAlign: 'center', 
    marginBottom: SPACING.xxlarge,
    color: COLORS.textSecondary,
  },
  content: {
    width: '100%',
    gap: SPACING.large,
  },
  mainDisplay: { 
    alignItems: 'center',
    padding: SPACING.xlarge,
  },
  sidePanels: { 
    gap: SPACING.regular,
  },
  panel: {
    padding: SPACING.large,
  },
  panelTitle: { 
    color: COLORS.aquaTeal, 
    marginBottom: SPACING.small,
  },
});

export default CoupleLinkingTrustThermometerScreen;
