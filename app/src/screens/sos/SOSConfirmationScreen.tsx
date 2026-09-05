import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

type SOSConfirmationScreenProps = {
  navigation: any;
  route: any;
};

export default function SOSConfirmationScreen({ navigation, route }: SOSConfirmationScreenProps) {
  const { coupleId, partnerName } = route.params || {};
  const [showMarcie, setShowMarcie] = useState(true);
  const [marcieQuote, setMarcieQuote] = useState("Put down the weapons. To the booths. Now.");

  return (
    <ScreenLayout 
      showHeader={false} 
      scrollable={false}
      showMarcie={showMarcie}
      marcieQuote={marcieQuote}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient 
          colors={[COLORS.error, '#EA031F']} 
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="infinite" size={80} color={COLORS.textPrimary} />
            <View style={styles.heartPulse}>
              <Ionicons name="heart" size={32} color={COLORS.error} />
            </View>
          </View>

          <Typography variant="h1" style={styles.title}>EMERGENCY SESSION</Typography>
          <Typography variant="body" style={styles.subtitle}>
            {partnerName ? `You and ${partnerName}` : 'You and your partner'} are in conflict.
          </Typography>

          <GlassCard style={styles.warningCard} padding="large">
            <View style={styles.warningRow}>
              <Ionicons name="alert-circle" size={28} color={COLORS.error} />
              <Typography variant="label" style={styles.warningText}>
                This pauses everything. Both partners enter private booths.
              </Typography>
            </View>
          </GlassCard>

          <View style={styles.buttonStack}>
            <SquishyButton 
              onPress={() => navigation.navigate('SOSEmergencyBooths', { coupleId })}
              variant="primary"
              size="large"
              style={styles.primaryButton}
            >
              <Typography variant="button">ENTER BOOTHS</Typography>
            </SquishyButton>

            <SquishyButton 
              onPress={() => navigation.goBack()}
              variant="ghost"
              size="medium"
              style={styles.secondaryButton}
            >
              <Typography variant="button">NOT NOW</Typography>
            </SquishyButton>
          </View>

          <Typography variant="caption" style={styles.disclaimer}>
            Dr. Marcie will guide you through structured resolution. No weapons allowed.
          </Typography>
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: SPACING.xxlarge,
  },
  heartPulse: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.small,
    letterSpacing: 2,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: SPACING.xxlarge,
  },
  warningCard: {
    width: '100%',
    marginBottom: SPACING.xlarge,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  warningText: {
    flex: 1,
  },
  buttonStack: {
    width: '100%',
    gap: SPACING.regular,
    marginBottom: SPACING.xxlarge,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  disclaimer: {
    textAlign: 'center',
    opacity: 0.6,
  },
});