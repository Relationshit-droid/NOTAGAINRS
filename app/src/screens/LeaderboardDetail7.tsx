import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import Typography from '../components/ui/Typography';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

interface PodiumItemProps {
  rank: number;
  name: string;
  score: string;
  color: string;
  size: number;
}

const PodiumItem = ({ rank, name, score, color, size }: PodiumItemProps) => (
  <View style={styles.podiumItem}>
    <View style={[styles.podiumRank, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
      <Typography variant="h4" color={COLORS.backgroundPrimary} center>{rank}</Typography>
    </View>
    <Typography variant="h4" color={COLORS.textPrimary} center>{name}</Typography>
    <Typography variant="body" color={color} center>{score} HP</Typography>
  </View>
);

interface LeaderboardRowProps {
  rank: number;
  name: string;
  level: number;
  trend: number;
  points: string;
}

const LeaderboardRow = ({ rank, name, level, trend, points }: LeaderboardRowProps) => (
  <View style={styles.row}>
    <Typography variant="body" color={COLORS.textSecondary} style={styles.rowRank}>#{rank}</Typography>
    <Typography variant="body" color={COLORS.textPrimary} style={styles.rowName}>{name}</Typography>
    <GlassCard variant="outlined" padding="tiny" style={styles.levelBadge}>
      <Typography variant="caption" color={COLORS.textPrimary}>LVL {level}</Typography>
    </GlassCard>
    <Typography 
      variant="caption" 
      color={trend > 0 ? COLORS.success : COLORS.error}
      style={styles.rowTrend}
    >
      {trend > 0 ? `+${trend}` : trend}
    </Typography>
    <Typography variant="body" color={COLORS.vibrantPink} style={styles.rowPoints}>{points}</Typography>
  </View>
);

const LeaderboardDetail7Screen = () => {
  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Typography variant="gameTitle" color={COLORS.textPrimary} center style={styles.title}>
          GALACTIC COUPLE RANKINGS
        </Typography>
        <Typography variant="body" color={COLORS.textSecondary} center style={styles.subtitle}>
          Celebrating the strongest bonds across the nebula
        </Typography>

        <View style={styles.podiumContainer}>
          <PodiumItem rank={2} name="LEO & MIA" score="12,450" color={COLORS.info} size={SPACING.xxlarge}/>
          <PodiumItem rank={1} name="SARAH & TOM" score="15,820" color={COLORS.brightYellow} size={SPACING.xxxlarge}/>
          <PodiumItem rank={3} name="CHLOE & SAM" score="11,200" color={COLORS.vibrantPink} size={SPACING.xxlarge}/>
        </View>

        <GlassCard variant="outlined" style={styles.leaderboardContainer} padding="none">
          <Typography variant="h4" color={COLORS.textPrimary} style={styles.leaderboardTitle}>
            RISING COUPLES
          </Typography>
          <LeaderboardRow rank={4} name="JADE & MARCUS" level={42} trend={120} points="10,890" />
          <LeaderboardRow rank={5} name="EMMA & RILEY" level={38} trend={85} points="9,420" />
          <LeaderboardRow rank={6} name="JORDAN & CASEY" level={40} trend={-12} points="9,110" />
          <LeaderboardRow rank={7} name="SOPHIE & DAN" level={35} trend={240} points="8,950" />
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  scrollContent: { 
    padding: SPACING.screenPadding 
  },
  title: { 
    marginTop: SPACING.xlarge,
    marginBottom: SPACING.small 
  },
  subtitle: { 
    marginBottom: SPACING.xlarge 
  },
  podiumContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'flex-end', 
    paddingHorizontal: SPACING.regular, 
    marginBottom: SPACING.xxlarge 
  },
  podiumItem: { 
    alignItems: 'center', 
    gap: SPACING.small 
  },
  podiumRank: { 
    justifyContent: 'center',
    alignItems: 'center'
  },
  leaderboardContainer: { 
    marginHorizontal: SPACING.none,
  },
  leaderboardTitle: { 
    padding: SPACING.regular, 
    borderBottomWidth: 1, 
    borderColor: COLORS.borderSubtle 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: SPACING.regular,
    borderBottomWidth: 1,
    borderColor: COLORS.divider
  },
  rowRank: { 
    fontWeight: 'bold',
    width: SPACING.xlarge
  },
  rowName: { 
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: SPACING.small
  },
  levelBadge: {
    marginHorizontal: SPACING.small
  },
  rowTrend: { 
    fontWeight: 'bold',
    width: SPACING.xxlarge,
    textAlign: 'center'
  },
  rowPoints: { 
    fontWeight: 'bold',
    width: SPACING.xxxlarge,
    textAlign: 'right'
  },
});

export default LeaderboardDetail7Screen;
