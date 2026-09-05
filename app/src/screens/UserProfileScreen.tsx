import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const user = {
  name: 'Alex Rivera',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtyoVbyt5ofdhPIRZiC2i8t-16kzID9Ttah4b-aAvPuT4tBvM7P-2InkGls2gyh3VTlxZfHGxp_0XLUgkdxGpqbaJa7Vc_nETGZk6vutPRZ2gG_nUFKd32doZoROO2BkDZ_2D1u3r15-PAmYGduurtUJI_UFiQJt5Gy64hSQgRQsc9y5YjTssMH5RlsJXHgnhqMisgFKuokXXPeZmf31Ynxbv9fxWYPFs9p-6e6upmBAxHG_2PPj6rjlPC32La0Z91P3OOz-C0JiBD',
  quest: 'Deepening Connection',
  badges: [
    { icon: 'heart', text: 'Words of Affirmation', color: COLORS.rosePink },
    { icon: 'shield-checkmark', text: 'Secure Attachment', color: COLORS.info },
    { icon: 'trophy', text: 'Vulnerability Veteran', color: COLORS.lavenderPurple }
  ]
};

const stats = [
  { label: 'Games Played', value: '128', trend: '+12%', icon: 'game-controller' },
  { label: 'Daily Streak', value: '15 Days', trend: 'New Record', icon: 'flame' },
  { label: 'Milestones', value: '24', trend: 'Gold Tier', icon: 'star' },
];

const Badge = ({ badge }: { badge: typeof user.badges[0] }) => (
  <View style={[styles.badge, { backgroundColor: `${badge.color}20`, borderColor: `${badge.color}50` }]}>
    <Ionicons name={badge.icon as any} size={16} color={badge.color} />
    <Typography variant="small" style={[styles.badgeText, { color: badge.color }]}>
      {badge.text}
    </Typography>
  </View>
);

const StatBox = ({ stat }: { stat: typeof stats[0] }) => (
  <GlassCard style={styles.statBox}>
    <Ionicons name={stat.icon as any} size={24} color={COLORS.vibrantPink} style={styles.statIcon} />
    <Typography variant="label" style={styles.statLabel}>{stat.label}</Typography>
    <Typography variant="h3" style={styles.statValue}>{stat.value}</Typography>
    <Typography variant="small" style={styles.statTrend}>{stat.trend}</Typography>
  </GlassCard>
);

const UserProfileScreen = () => {
  return (
    <ScreenLayout showMarcie={true} marcieQuote="Your journey is unique and worth celebrating.">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Header */}
          <GlassCard style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Typography variant="h1" style={styles.name}>{user.name}</Typography>
            <Typography variant="body" style={styles.quest}>{user.quest}</Typography>
            <View style={styles.badgeContainer}>
              {user.badges.map((badge, i) => <Badge key={i} badge={badge} />)}
            </View>
          </GlassCard>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat, i) => <StatBox key={i} stat={stat} />)}
          </View>

          {/* Journey Summary */}
          <GlassCard style={styles.summaryCard}>
            <Typography variant="h3" style={styles.sectionTitle}>Journey Summary</Typography>
            <Typography variant="body" style={styles.summaryText}>
              Alex and Sarah have been playing since February 2024. Together, they have unlocked 
              over 40 deep-conversation cards and completed 5 adventure quests. Their current 
              focus is on "Deepening Connection" through daily gratitude exercises.
            </Typography>
          </GlassCard>
          
          {/* Edit Button */}
          <SquishyButton
            variant="primary"
            size="large"
            onPress={() => {}}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.textPrimary} />
            <Typography variant="body" style={styles.editButtonText}>Edit Profile</Typography>
          </SquishyButton>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 3,
    borderColor: COLORS.vibrantPink,
    marginBottom: SPACING.md,
  },
  name: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  quest: {
    color: COLORS.vibrantPink,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  badgeText: {
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
  },
  statIcon: {
    marginBottom: SPACING.xs,
  },
  statLabel: {
    marginBottom: SPACING.xs,
    opacity: 0.7,
  },
  statValue: {
    marginBottom: SPACING.xs,
  },
  statTrend: {
    color: COLORS.success,
  },
  summaryCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  summaryText: {
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyMedium,
    opacity: 0.8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  editButtonText: {
    color: COLORS.textPrimary,
  },
});

export default UserProfileScreen;
