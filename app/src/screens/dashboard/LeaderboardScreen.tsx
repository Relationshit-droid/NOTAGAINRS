import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const mockLeaderboard = [
  { rank: 1, name: 'You', xp: 1247, avatar: 'Y', highlight: true, streak: 3 },
  { rank: 2, name: 'Partner', xp: 1156, avatar: 'P', highlight: true, streak: 2 },
  { rank: 3, name: 'CoupleName1', xp: 980, avatar: 'C1' },
  { rank: 4, name: 'CoupleName2', xp: 950, avatar: 'C2' },
  { rank: 5, name: 'CoupleName3', xp: 890, avatar: 'C3' },
  { rank: 6, name: 'CoupleName4', xp: 820, avatar: 'C4' },
  { rank: 7, name: 'CoupleName5', xp: 760, avatar: 'C5' },
];

const LeaderboardRow = ({ item }: { item: any }) => (
  <View style={[styles.row, item.highlight && styles.highlightedRow]}>
    <View style={styles.rankContainer}>
      <Typography variant="body" style={styles.rankText}>{item.rank}</Typography>
    </View>
    <View style={[styles.avatar, {borderColor: item.highlight ? COLORS.vibrantPink : COLORS.borderSubtle}]}>
      <Typography variant="body" style={styles.avatarText}>{item.avatar}</Typography>
    </View>
    <View style={styles.nameContainer}>
      <Typography variant="body" style={styles.nameText}>{item.name}</Typography>
      {item.streak > 0 && 
        <View style={styles.streakBadge}>
          <MaterialCommunityIcons name="fire" color={COLORS.warmOrange} size={14} />
          <Typography variant="caption" style={styles.streakText}>{item.streak} day streak</Typography>
        </View>
      }
    </View>
    <View style={styles.xpContainer}>
      <Typography variant="body" style={styles.xpText}>{item.xp} XP</Typography>
    </View>
  </View>
);

export default function LeaderboardScreen({ navigation }: any) {
  const [period, setPeriod] = useState('weekly');

  return (
    <ScreenLayout showHeader={true}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <Typography variant="header" style={styles.mainTitle}>Couple Leaderboard</Typography>
          <Typography variant="body" style={styles.subtitle}>See how your connection stacks up.</Typography>
        </View>

        <View style={styles.filterContainer}>
          <SquishyButton 
            onPress={() => setPeriod('weekly')} 
            variant={period === 'weekly' ? 'primary' : 'ghost'}
            size="small"
          >
            <Typography variant={period === 'weekly' ? 'button' : 'body'}>Weekly</Typography>
          </SquishyButton>
          <SquishyButton 
            onPress={() => setPeriod('monthly')} 
            variant={period === 'monthly' ? 'primary' : 'ghost'}
            size="small"
          >
            <Typography variant={period === 'monthly' ? 'button' : 'body'}>Monthly</Typography>
          </SquishyButton>
          <SquishyButton 
            onPress={() => setPeriod('allTime')} 
            variant={period === 'allTime' ? 'primary' : 'ghost'}
            size="small"
          >
            <Typography variant={period === 'allTime' ? 'button' : 'body'}>All-Time</Typography>
          </SquishyButton>
        </View>

        <GlassCard>
          <View style={styles.leaderboardHeader}>
            <Typography variant="label" style={[styles.headerCol, {flex: 0.5}]}>Rank</Typography>
            <Typography variant="label" style={[styles.headerCol, {flex: 2}]}>Couple</Typography>
            <Typography variant="label" style={[styles.headerCol, {flex: 1, textAlign: 'right'}]}>XP</Typography>
          </View>

          {mockLeaderboard.map((item) => (
            <LeaderboardRow key={item.rank} item={item} />
          ))}
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: { 
    padding: SPACING.screenPadding 
  },
  pageHeader: { 
    alignItems: 'center', 
    marginBottom: SPACING.xlarge 
  },
  mainTitle: { 
    marginBottom: SPACING.small,
  },
  subtitle: { 
    color: COLORS.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: SPACING.small, 
    marginBottom: SPACING.xlarge, 
    padding: SPACING.small, 
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundInput,
    alignSelf: 'center'
  },
  leaderboardHeader: {
    flexDirection: 'row',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerCol: { 
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  highlightedRow: {
    backgroundColor: COLORS.backgroundInput,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.vibrantPink,
  },
  rankContainer: { 
    flex: 0.5, 
    alignItems: 'flex-start' 
  },
  rankText: { 
    color: COLORS.textPrimary,
  },
  avatar: {
    width: 40, 
    height: 40, 
    borderRadius: BORDER_RADIUS.xxlarge, 
    borderWidth: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.backgroundInput,
    marginRight: SPACING.regular,
  },
  avatarText: { 
    color: COLORS.textPrimary,
  },
  nameContainer: { 
    flex: 2, 
    justifyContent: 'center' 
  },
  nameText: { 
    color: COLORS.textPrimary,
  },
  streakBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.tiny, 
    marginTop: SPACING.tiny 
  },
  streakText: { 
    color: COLORS.warmOrange,
  },
  xpContainer: { 
    flex: 1, 
    alignItems: 'flex-end' 
  },
  xpText: { 
    color: COLORS.mintGreen,
  },
});
