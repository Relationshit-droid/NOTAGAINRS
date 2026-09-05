import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';

interface SOSScreenProps {
  navigation: any;
}

const SOSScreen: React.FC<SOSScreenProps> = ({ navigation }) => {
  const handleStartSOS = () => {
    // Navigate to the new 10-screen SOS flow
    navigation.navigate('SOSConfirmation');
  };

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <LinearGradient
        colors={[COLORS.backgroundPrimary, COLORS.midPurple]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="infinite" size={80} color={COLORS.textPrimary} />
            <View style={styles.heartPulse}>
              <Ionicons name="heart" size={32} color={COLORS.error} />
            </View>
          </View>

          <Typography variant="h1" style={styles.title}>SOS FIGHT SOLVER</Typography>
          <Typography variant="body" style={styles.subtitle}>Emergency conflict resolution</Typography>

          <GlassCard style={styles.infoCard} padding="large">
            <Typography variant="label" style={styles.infoTitle}>How it works:</Typography>
            <Typography variant="caption" style={styles.infoText}>1. Enter soundproof booths for private venting</Typography>
            <Typography variant="caption" style={styles.infoText}>2. Complete structured reflection (Mad-Libs format)</Typography>
            <Typography variant="caption" style={styles.infoText}>3. Receive AI verdict from Dr. Marcie</Typography>
            <Typography variant="caption" style={styles.infoText}>4. Choose a repair attempt together</Typography>
            <Typography variant="caption" style={styles.infoText}>5. Execute repair & check in</Typography>
          </GlassCard>

          <SquishyButton 
            onPress={handleStartSOS}
            variant="primary"
            size="large"
            style={styles.sosButton}
          >
            <Typography variant="button">START EMERGENCY SESSION</Typography>
          </SquishyButton>

          <Typography variant="caption" style={styles.disclaimer}>
            Dr. Marcie will guide you through structured resolution. No weapons allowed.
          </Typography>
        </View>
      </LinearGradient>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  heartPulse: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 32,
  },
  infoCard: {
    width: '100%',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  infoTitle: {
    marginBottom: 12,
    color: COLORS.error,
    letterSpacing: 0.5,
  },
  infoText: {
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 6,
  },
  sosButton: {
    width: '100%',
    marginBottom: 24,
  },
  disclaimer: {
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default SOSScreen;
