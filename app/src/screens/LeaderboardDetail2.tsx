import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

interface SOSButtonProps {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}

const SOSButton = ({ title, subtitle, color, icon }: SOSButtonProps) => (
  <TouchableOpacity style={[styles.sosButton, { borderColor: color }]}>
    <Typography variant="h1" center>{icon}</Typography>
    <View style={styles.buttonTextContainer}>
      <Typography variant="label" color={color} center>{subtitle}</Typography>
      <Typography variant="h4" color={COLORS.textPrimary} center style={{ marginTop: SPACING.tiny }}>
        {title}
      </Typography>
    </View>
  </TouchableOpacity>
);

const SOSConfirmationScreen = () => {
  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <LinearGradient
        colors={[COLORS.deepCosmic, COLORS.richPlum]}
        style={styles.background}
      />

      <View style={styles.mainContent}>
        <GlassCard style={styles.glassPanel} padding="large">
          <Typography variant="gameTitle" center>🚨</Typography>
          <Typography variant="h1" color={COLORS.textPrimary} center style={styles.mainHeader}>
            NEED SUPPORT?
          </Typography>
          <Typography variant="body" color={COLORS.textSecondary} center style={styles.description}>
            You have hit the SOS beacon. Please select the current frequency of your connection.
          </Typography>

          <View style={styles.buttonGrid}>
            <SOSButton
              title="I'M FRUSTRATED"
              subtitle="LOW INTENSITY"
              color={COLORS.brightYellow}
              icon="😒"
            />
            <SOSButton
              title="WE'RE FIGHTING"
              subtitle="HIGH INTENSITY"
              color={COLORS.vibrantPink}
              icon="😡"
            />
          </View>

          <SquishyButton variant="ghost">
            <Typography variant="label" color={COLORS.textSecondary} center>
              CANCEL - EVERYTHING IS OKAY
            </Typography>
          </SquishyButton>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  mainContent: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: SPACING.screenPadding 
  },
  glassPanel: {
    alignItems: 'center',
  },
  mainHeader: { 
    marginTop: SPACING.regular,
    marginBottom: SPACING.small 
  },
  description: { 
    marginBottom: SPACING.xlarge 
  },
  buttonGrid: { 
    flexDirection: 'row', 
    gap: SPACING.regular, 
    marginBottom: SPACING.xlarge,
    width: '100%'
  },
  sosButton: {
    flex: 1,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xlarge,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonTextContainer: { 
    alignItems: 'center', 
    marginTop: SPACING.small 
  },
});

export default SOSConfirmationScreen;
