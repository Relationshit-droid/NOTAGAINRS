import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

const LeaderboardDetail5Screen = () => {
  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.background} />
      
      <View style={styles.header}>
        <TouchableOpacity>
          <Typography variant="label" color={COLORS.textSecondary}>
            ABORT REPAIR
          </Typography>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Typography variant="label" color={COLORS.textPrimary} center>
            PHASE 04: EMOTIONAL RE-ENTRY
          </Typography>
        </View>
        <Typography variant="body" color={COLORS.info}>98.4%</Typography>
      </View>

      <View style={styles.mainContent}>
        <Typography variant="h1" color={COLORS.textPrimary} center>
          REFLECTIVE LISTENING
        </Typography>
        <Typography variant="body" color={COLORS.textSecondary} center style={styles.subtitle}>
          Take turns repeating what you heard your partner say before responding.
        </Typography>

        <View style={styles.timerContainer}>
          <View style={styles.timerRing} />
          <Typography variant="gameTitle" color={COLORS.textPrimary}>04:42</Typography>
          <Typography variant="label" color={COLORS.info}>
            CONNECTION IN PROGRESS...
          </Typography>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.speakerListenerContainer}>
          {/* Speaker and Listener cards would go here */}
        </View>
        <SquishyButton style={styles.nextButton}>
          <Typography variant="button" color={COLORS.textPrimary}>
            NEXT STEP
          </Typography>
        </SquishyButton>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: SPACING.regular, 
    borderBottomWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    backgroundColor: COLORS.backgroundInput 
  },
  headerTitleContainer: { 
    alignItems: 'center' 
  },
  mainContent: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: SPACING.screenPadding 
  },
  subtitle: { 
    maxWidth: 300,
    marginTop: SPACING.small 
  },
  timerContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: SPACING.xxxlarge 
  },
  timerRing: {
    width: SPACING.xxxlarge * 6,
    height: SPACING.xxxlarge * 6,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: SPACING.medium,
    borderColor: COLORS.info,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    position: 'absolute',
    opacity: 0.8
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: SPACING.regular, 
    borderTopWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    backgroundColor: COLORS.backgroundInput 
  },
  speakerListenerContainer: { 
    flexDirection: 'row', 
    gap: SPACING.regular 
  },
  nextButton: {
    minWidth: SPACING.xxxlarge * 3,
  },
});

export default LeaderboardDetail5Screen;
