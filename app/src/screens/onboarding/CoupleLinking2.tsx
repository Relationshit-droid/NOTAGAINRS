import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton, TrustThermometer, RadialGradientBackground } from '../../components/ui';
import { Header } from '../../components/ui/Header';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

const CoupleLinkingDashboardScreen = () => {
  return (
    <ScreenLayout>
      <RadialGradientBackground />
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <GlassCard style={styles.thermometerPanel}>
            <Typography variant="label" style={styles.panelTitle}>Trust Thermometer</Typography>
            <TrustThermometer width={40} height={160} level={0.78} showPercentage />
            <Typography variant="caption" style={styles.thermometerLabel}>Synchronized</Typography>
          </GlassCard>

          <GlassCard style={styles.questPanel} variant="elevated">
            <Typography variant="label" style={styles.questPill}>Active Quest</Typography>
            <Typography variant="header" style={styles.questTitle}>Daily Duel</Typography>
            <Typography variant="body" style={styles.questDescription}>"The Mirror Effect: Describe your partner's best quality..."</Typography>
            <SquishyButton>
              <Typography variant="button">Start Duel</Typography>
            </SquishyButton>
          </GlassCard>

          <GlassCard style={styles.partnerPanel}>
            <Typography variant="label" style={styles.panelTitle}>Partner Status</Typography>
            <View style={styles.avatar}>
              <Typography variant="header">J</Typography>
            </View>
            <Typography variant="body" style={styles.partnerName}>Jamie Smith</Typography>
            <Typography variant="caption" style={styles.partnerStatus}>Online & Thinking of You</Typography>
          </GlassCard>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { 
    padding: SPACING.screenPadding 
  },
  content: {
    gap: SPACING.regular,
  },
  thermometerPanel: { 
    alignItems: 'center',
    padding: SPACING.xlarge,
  },
  panelTitle: { 
    color: COLORS.textSecondary,
    marginBottom: SPACING.regular,
  },
  thermometerLabel: { 
    textTransform: 'uppercase',
    color: COLORS.textHint,
    marginTop: SPACING.small,
  },
  questPanel: { 
    alignItems: 'center',
    padding: SPACING.xlarge,
  },
  questPill: { 
    backgroundColor: COLORS.vibrantPink + '33', 
    color: COLORS.vibrantPink, 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.tiny, 
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.regular,
  },
  questTitle: { 
    marginBottom: SPACING.small 
  },
  questDescription: { 
    textAlign: 'center', 
    marginBottom: SPACING.large,
    color: COLORS.textSecondary,
  },
  partnerPanel: { 
    alignItems: 'center',
    padding: SPACING.xlarge,
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: BORDER_RADIUS.round / 2, 
    borderWidth: 2, 
    borderColor: COLORS.aquaTeal, 
    marginBottom: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerName: { 
    marginBottom: SPACING.small 
  },
  partnerStatus: { 
    color: COLORS.aquaTeal 
  },
});

export default CoupleLinkingDashboardScreen;
