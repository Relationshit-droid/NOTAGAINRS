import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const achievements = [
  { id: '1', title: 'Communication King', description: 'Unlock 10 deep conversations without interruption', unlocked: true, date: '2d ago', icon: 'chatbubbles', category: 'Communication' },
  { id: '2', title: 'Conflict Crusher', description: 'Resolve a Tier 3 argument with perfect empathy', unlocked: true, date: '1w ago', icon: 'shield', category: 'Conflict' },
  { id: '3', title: 'Zen Master', description: 'Complete a 20-minute guided partner meditation', unlocked: true, date: 'Oct 12', icon: 'leaf', category: 'Intimacy' },
  { id: '4', title: 'First Date Redux', description: 'Recreate your very first date in the Metaverse', unlocked: false, progress: 40, icon: 'lock-closed', category: 'Milestones' },
  { id: '5', title: 'Golden Anniversary', description: 'Maintain a 365-day relationship streak', unlocked: false, progress: 12, icon: 'trophy', category: 'Milestones' },
  { id: '6', title: 'World Travelers', description: 'Unlock 5 destination-based quest lines', unlocked: false, progress: 60, icon: 'airplane', category: 'Milestones' },
  { id: '7', title: 'True Empath', description: 'Identify 5 unstated partner emotions correctly', unlocked: true, date: 'Yesterday', icon: 'heart', category: 'Communication' },
  { id: '8', title: 'Soul Resonance', description: 'Reach Level 50 Sync with your partner', unlocked: false, progress: 80, icon: 'infinite', category: 'Intimacy' },
];

const StatCard = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <GlassCard style={styles.statCard} variant="outlined">
    <View style={styles.statIconContainer}>
      <Ionicons name={icon as any} size={24} color={COLORS.vibrantPink} />
    </View>
    <View>
      <Typography variant="caption" style={styles.statLabel}>{label}</Typography>
      <Typography variant="body" style={styles.statValue}>{value}</Typography>
    </View>
  </GlassCard>
);

const AchievementCard = ({ item }: { item: any }) => {
  if (item.unlocked) {
    return (
      <GlassCard style={styles.card} variant="elevated">
        <View style={[styles.badgeIconContainer, styles.unlockedBadge]}>
          <Ionicons name={item.icon} size={32} color={COLORS.vibrantPink} />
        </View>
        <Typography variant="body" style={styles.cardTitle}>{item.title}</Typography>
        <Typography variant="caption" style={styles.cardDescription}>{item.description}</Typography>
        <Typography variant="label" style={styles.cardDate}>{item.date}</Typography>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={[styles.card, styles.lockedCard]} variant="outlined">
      <View style={[styles.badgeIconContainer, styles.lockedBadge]}>
        <Ionicons name={item.icon} size={32} color={COLORS.textHint} />
      </View>
      <Typography variant="body" style={[styles.cardTitle, styles.lockedText]}>{item.title}</Typography>
      <Typography variant="caption" style={[styles.cardDescription, styles.lockedText]}>{item.description}</Typography>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
      </View>
      <Typography variant="caption" style={styles.progressText}>{item.progress}% COMPLETE</Typography>
    </GlassCard>
  );
};

const AchievementsScreen = () => {
  return (
    <ScreenLayout showHeader={true}>
      <ScrollView>
        <View style={styles.header}>
          <Typography variant="header" style={styles.headerTitle}>Achievements & Badges</Typography>
          <Typography variant="body" style={styles.headerSubtitle}>Track your relationship evolution across the cosmos.</Typography>
          <View style={styles.headerProgress}>
            <Typography variant="caption" style={styles.progressTextLabel}>12 / 40 Relics Collected</Typography>
            <View style={styles.headerProgressBarContainer}>
              <View style={[styles.headerProgressBar, { width: '30%' }]} />
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard icon="trophy" label="Total Points" value="2,450 XP"/>
          <StatCard icon="podium" label="Global Rank" value="Top 15%"/>
          <StatCard icon="flame" label="Current Streak" value="14 Days"/>
        </View>

        <View style={styles.filterContainer}>
          <Typography variant="label" style={styles.activeFilter}>All Badges</Typography>
          <Typography variant="caption" style={styles.filterText}>Communication</Typography>
          <Typography variant="caption" style={styles.filterText}>Intimacy</Typography>
          <Typography variant="caption" style={styles.filterText}>Conflict</Typography>
        </View>

        <View style={styles.grid}>
          {achievements.map((item) => (
            <AchievementCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: SPACING.screenPadding,
    paddingTop: SPACING.xlarge,
    alignItems: 'center',
  },
  headerTitle: { 
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  headerSubtitle: { 
    textAlign: 'center', 
    marginTop: SPACING.small,
    color: COLORS.textSecondary,
  },
  headerProgress: { 
    width: '100%', 
    marginTop: SPACING.large 
  },
  progressTextLabel: { 
    color: COLORS.vibrantPink, 
    textAlign: 'right', 
    marginBottom: SPACING.small 
  },
  headerProgressBarContainer: { 
    height: BORDER_RADIUS.small, 
    backgroundColor: COLORS.divider, 
    borderRadius: BORDER_RADIUS.small 
  },
  headerProgressBar: { 
    height: '100%', 
    backgroundColor: COLORS.aquaTeal, 
    borderRadius: BORDER_RADIUS.small,
  },
  statsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingHorizontal: SPACING.screenPadding, 
    marginBottom: SPACING.large,
    gap: SPACING.small,
  },
  statCard: { 
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: SPACING.regular,
  },
  statIconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: BORDER_RADIUS.medium, 
    backgroundColor: COLORS.backgroundInput, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: SPACING.small 
  },
  statLabel: { 
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  statValue: { 
    color: COLORS.textPrimary,
  },
  filterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.divider, 
    paddingHorizontal: SPACING.screenPadding, 
    marginBottom: SPACING.large,
    paddingBottom: SPACING.regular,
  },
  filterText: { 
    color: COLORS.textSecondary,
  },
  activeFilter: { 
    color: COLORS.vibrantPink, 
    borderBottomWidth: 2, 
    borderBottomColor: COLORS.vibrantPink,
  },
  grid: { 
    paddingHorizontal: SPACING.screenPadding,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
  },
  card: { 
    borderRadius: BORDER_RADIUS.large, 
    padding: SPACING.large, 
    alignItems: 'center', 
    width: '48%',
    minHeight: 200,
    justifyContent: 'space-between',
  },
  unlockedBadge: { 
    backgroundColor: COLORS.backgroundInput, 
    borderWidth: 2, 
    borderColor: COLORS.vibrantPink 
  },
  lockedBadge: { 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: COLORS.borderSubtle 
  },
  badgeIconContainer: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    marginBottom: SPACING.regular, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardTitle: { 
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  cardDescription: { 
    textAlign: 'center', 
    marginTop: SPACING.small,
    color: COLORS.textSecondary,
  },
  cardDate: { 
    textTransform: 'uppercase',
    color: COLORS.vibrantPink, 
    backgroundColor: COLORS.backgroundInput, 
    paddingVertical: SPACING.tiny, 
    paddingHorizontal: SPACING.small, 
    borderRadius: BORDER_RADIUS.round, 
    marginTop: SPACING.regular,
  },
  lockedCard: {
    opacity: 0.7,
  },
  lockedText: { 
    color: COLORS.textHint 
  },
  progressBarContainer: { 
    height: BORDER_RADIUS.small, 
    width: '80%', 
    backgroundColor: COLORS.divider, 
    borderRadius: BORDER_RADIUS.small, 
    marginTop: SPACING.regular 
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: COLORS.lavenderPurple, 
    borderRadius: BORDER_RADIUS.small 
  },
  progressText: { 
    color: COLORS.textHint, 
    marginTop: SPACING.small,
  },
});

export default AchievementsScreen;
