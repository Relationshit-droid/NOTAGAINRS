import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

interface StatBarProps {
  label: string;
  value: string;
  progress: number;
  color: string;
  icon: string;
}

const StatBar = ({ label, value, progress, color, icon }: StatBarProps) => (
  <GlassCard variant="outlined" style={styles.statContainer} padding="medium">
    <View style={styles.statHeader}>
      <View>
        <Typography variant="label" color={color}>{label}</Typography>
        <Typography variant="h2" color={COLORS.textPrimary} style={{ marginTop: SPACING.tiny }}>{value}</Typography>
      </View>
      <Typography variant="h2">{icon}</Typography>
    </View>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
    <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.tiny }}>
      {progress}% TO NEXT LEVEL
    </Typography>
  </GlassCard>
);

const MissionSuccessScreen = () => {
  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerContainer}>
          <GlassCard variant="outlined" padding="small" style={styles.missionStatusCard}>
            <Typography variant="label" color={COLORS.info} center>
              MISSION STATUS: SUCCESS
            </Typography>
          </GlassCard>
          <Typography variant="gameTitle" color={COLORS.textPrimary} center>
            MISSION ACCOMPLISHED
          </Typography>
          <Typography variant="body" color={COLORS.textSecondary} center style={{ marginTop: SPACING.small }}>
            You navigated the asteroid field of emotions together.
          </Typography>
        </View>

        <View style={styles.badgeContainer}>
          <LinearGradient 
            colors={[COLORS.backgroundInput, COLORS.backgroundInput]} 
            style={styles.badge}
          >
            <Typography variant="gameTitle" center>🏆</Typography>
            <Typography variant="h3" color={COLORS.textPrimary} center style={{ marginTop: SPACING.small }}>
              CONFLICT NEUTRALIZED
            </Typography>
            <Typography variant="label" color={COLORS.vibrantPink} center>
              CORE STABILIZED
            </Typography>
          </LinearGradient>
        </View>

        <View style={styles.statsGrid}>
          <StatBar label="TRUST XP EARNED" value="+850 XP" progress={75} color={COLORS.info} icon="🤝"/>
          <StatBar label="RELATIONSHIP LEVEL" value="LVL 42" progress={40} color={COLORS.brightYellow} icon="❤️"/>
        </View>

        <SquishyButton style={styles.dashboardButton}>
          <Typography variant="button" color={COLORS.textPrimary} center>
            RETURN TO DASHBOARD
          </Typography>
        </SquishyButton>

      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  scrollContent: { 
    padding: SPACING.screenPadding, 
    alignItems: 'center' 
  },
  headerContainer: { 
    alignItems: 'center', 
    marginBottom: SPACING.xxlarge 
  },
  missionStatusCard: {
    marginBottom: SPACING.regular,
  },
  badgeContainer: { 
    marginBottom: SPACING.xxlarge 
  },
  badge: { 
    width: SPACING.xxxlarge * 5, 
    height: SPACING.xxxlarge * 5, 
    borderRadius: BORDER_RADIUS.round, 
    borderWidth: 4, 
    borderColor: COLORS.vibrantPink, 
    justifyContent: 'center', 
    alignItems: 'center',
    ...SHADOWS.neon
  },
  statsGrid: { 
    width: '100%', 
    flexDirection: 'row', 
    gap: SPACING.regular, 
    marginBottom: SPACING.xxlarge 
  },
  statContainer: { 
    flex: 1,
  },
  statHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: SPACING.small 
  },
  progressBarContainer: { 
    height: SPACING.small, 
    backgroundColor: COLORS.backgroundPrimary, 
    borderRadius: BORDER_RADIUS.small, 
    marginBottom: SPACING.tiny 
  },
  progressBar: { 
    height: '100%', 
    borderRadius: BORDER_RADIUS.small 
  },
  dashboardButton: {
    width: '100%',
  },
});

export default MissionSuccessScreen;
