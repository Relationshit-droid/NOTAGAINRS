import { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAccess } from '../../lib/gating';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, BORDER_RADIUS, SPACING, SHADOWS } from '../../theme';
import GlassCard from './GlassCard';
import Text from './Typography';

type PremiumGateProps = {
  children: ReactNode;
  fallback?: ReactNode;
  override?: boolean;
  lockMessage?: string;
  onUnlock?: () => void;
};

export default function PremiumGate({ 
  children, 
  fallback, 
  override = false, 
  lockMessage = "Unlock with Premium",
  onUnlock 
}: PremiumGateProps) {
  const { isPremium } = useAccess();

  if (isPremium || override) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={[styles.overlay, StyleSheet.absoluteFill]}>
        <GlassCard style={styles.lockCard} variant="elevated">
          <Text variant="header" style={styles.lockIcon}>🔒</Text>
          <Text variant="header" style={styles.lockTitle}>{lockMessage}</Text>
          <Text variant="body" style={styles.lockDescription}>
            Get full access to all games, detailed insights, and Dr. Marcie's unfiltered wisdom.
          </Text>
          <TouchableOpacity onPress={onUnlock} style={styles.buttonContainer}>
            <LinearGradient
              colors={GRADIENTS.primary.colors}
              start={GRADIENTS.primary.start}
              end={GRADIENTS.primary.end}
              style={styles.button}
            >
              <Text variant="button" style={styles.buttonText}>Upgrade Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    opacity: 0.3,
    pointerEvents: 'none',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundPrimary,
    padding: SPACING.xlarge,
  },
  lockCard: {
    alignItems: 'center',
    padding: SPACING.xxlarge,
    maxWidth: 320,
    width: '100%',
  },
  lockIcon: {
    fontSize: 32,
    marginBottom: SPACING.regular,
  },
  lockTitle: {
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  lockDescription: {
    textAlign: 'center',
    marginVertical: SPACING.regular,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.regular,
  },
  button: {
    paddingHorizontal: SPACING.xlarge,
    paddingVertical: SPACING.regular,
    borderRadius: BORDER_RADIUS.button,
    alignItems: 'center',
    ...SHADOWS.buttonGlow,
  },
  buttonText: {
    color: COLORS.textPrimary,
  },
});
