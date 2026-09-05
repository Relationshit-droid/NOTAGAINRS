import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../state/store';

export default function LoveArcadeTrophyRoomScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [trophies, setTrophies] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [loading, setLoading] = useState(true);

  const fetchTrophies = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // In real app, fetch from backend
      const mockTrophies = [
        { id: '1', name: 'First Steps', description: 'Complete your first game', icon: 'footsteps', rarity: 'common', earned: true, date: '2025-01-15', points: 10 },
        { id: '2', name: 'Truth Seeker', description: 'Complete 5 Emotional Connection games', icon: 'search', rarity: 'uncommon', earned: true, date: '2025-02-20', points: 25 },
        { id: '3', name: 'Conflict Resolver', description: 'Win 3 Conflict Resolution games', icon: 'shield-checkmark', rarity: 'uncommon', earned: true, date: '2025-03-10', points: 25 },
        { id: '4', name: 'Romance Master', description: 'Complete all Intimacy & Romance games', icon: 'heart', rarity: 'rare', earned: false, points: 50 },
        { id: '5', name: 'Streak Warrior', description: 'Maintain a 7-day streak', icon: 'flame', rarity: 'uncommon', earned: true, date: '2025-03-01', points: 20 },
        { id: '6', name: 'Perfect Score', description: 'Get 100% on any game', icon: 'star', rarity: 'rare', earned: false, points: 50 },
        { id: '6', name: 'Repair Expert', description: 'Complete 5 SOS repair sessions', icon: 'construct', rarity: 'rare', earned: false, points: 50 },
        { id: '7', name: 'Legendary Love', description: 'Complete all 5 phases', icon: 'crown', rarity: 'legendary', earned: false, points: 100 },
        { id: '8', name: 'Week Warrior', description: 'Complete 4 games in one week', icon: 'calendar', rarity: 'uncommon', earned: true, date: '2025-02-28', points: 30 },
        { id: '9', name: 'Date Night Pro', description: 'Complete 10 Date Night Roulette spins', icon: 'wine', rarity: 'uncommon', earned: false, points: 25 },
        { id: '10', name: 'SOS Survivor', description: 'Complete 3 SOS Fight Solver sessions', icon: 'alert-circle', rarity: 'rare', earned: false, points: 40 },
      ];
      setTrophies(mockTrophies);
    } catch (error) {
      console.error('Failed to fetch trophies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrophies();
  }, []);

  const filteredTrophies = trophies.filter(t => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'earned') return t.earned;
    if (selectedFilter === 'locked') return !t.earned;
    return true;
  });

  const stats = {
    total: trophies.length,
    earned: trophies.filter(t => t.earned).length,
    points: trophies.filter(t => t.earned).reduce((sum, t) => sum + t.points, 0),
  };

  const rarityColors = {
    common: COLORS.textHint,
    uncommon: COLORS.aquaTeal,
    rare: COLORS.vibrantPink,
    legendary: COLORS.brightYellow,
  };

  const rarityGradients = {
    common: [COLORS.textHint, COLORS.textHint + '80'],
    uncommon: [COLORS.aquaTeal, COLORS.aquaTeal + '80'],
    rare: [COLORS.vibrantPink, COLORS.vibrantPink + '80'],
    legendary: [COLORS.brightYellow, COLORS.brightYellow + '80'],
  };

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={[COLORS.brightYellow, COLORS.warmOrange]} style={styles.loadingGlow}>
            <Ionicons name="trophy" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading trophies...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const filteredCount = filteredTrophies.length;

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Stats */}
        <GlassCard style={styles.statsCard} variant="elevated">
          <Typography variant="label" style={styles.statsTitle}>TROPHY COLLECTION</Typography>
          
          <View style={styles.statsGrid}>
            <StatItem label="EARNED" value={`${stats.earned} / ${stats.total}`} color={COLORS.mintGreen} icon="checkmark-circle" />
            <StatItem label="TOTAL POINTS" value={stats.points.toString()} color={COLORS.brightYellow} icon="star" />
            <StatItem label="COMPLETION" value={`${Math.round((stats.earned / stats.total) * 100)}%`} color={COLORS.vibrantPink} icon="pie-chart" />
            <StatItem label="RANK" value={`#${Math.max(1, 100 - stats.earned * 5)}`} color={COLORS.aquaTeal} icon="trophy" />
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            {['all', 'earned', 'locked'].map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                <Typography variant="caption" style={[
                  styles.filterTabText,
                  selectedFilter === filter && styles.filterTabTextActive,
                ]}>
                  {filter.toUpperCase()}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Trophies Grid */}
        <FlatList
          data={filteredTrophies}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.trophyCard}>
              <View style={[
                styles.trophyFrame,
                item.earned ? { borderColor: rarityColors[item.rarity] } : { borderColor: COLORS.borderSubtle, opacity: 0.5 },
              ]}>
                <LinearGradient colors={rarityGradients[item.rarity]} style={styles.trophyIcon}>
                  <Ionicons name={item.icon} size={32} color={COLORS.textPrimary} />
                </LinearGradient>
                {!item.earned && (
                  <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={24} color={COLORS.textPrimary} />
                  </View>
                )}
              </View>
              <View style={styles.trophyInfo}>
                <View style={styles.trophyHeader}>
                  <Typography variant="label" style={[
                    styles.trophyName,
                    item.earned ? {} : { color: COLORS.textHint },
                  ]}>
                    {item.name}
                  </Typography>
                  <View style={[
                    styles.rarityBadge,
                    { backgroundColor: rarityColors[item.rarity] + '20', borderColor: rarityColors[item.rarity] },
                  ]}>
                    <Typography variant="caption" style={{ color: rarityColors[item.rarity], textTransform: 'uppercase' }}>
                      {item.rarity}
                    </Typography>
                  </View>
                </View>
                <Typography variant="caption" style={[
                  styles.trophyDescription,
                  item.earned ? {} : { color: COLORS.textHint },
                ]}>
                  {item.earned ? item.description : '???'}
                </Typography>
                {item.earned && (
                  <View style={styles.trophyMeta}>
                    <Typography variant="caption" style={styles.trophyDate}>Earned: {item.date}</Typography>
                    <Typography variant="caption" style={styles.trophyPoints}>
                      <Ionicons name="star" size={12} color={COLORS.brightYellow} style={{ marginRight: 2 }} />
                      +{item.points} pts
                    </Typography>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}>
        </FlatList>

        {filteredTrophies.length === 0 && (
          <GlassCard style={styles.emptyState}>
            <Ionicons name={selectedFilter === 'earned' ? 'trophy' : 'lock-closed'} size={48} color={COLORS.textHint} />
            <Typography variant="label" style={styles.emptyTitle}>
              {selectedFilter === 'earned' ? 'NO TROPHIES EARNED YET' : 'ALL TROPHIES UNLOCKED!'}
            </Typography>
            <Typography variant="caption" style={styles.emptySubtitle} center>
              {selectedFilter === 'earned' ? 'Play games to unlock your first trophy!' : 'Congratulations! You\'ve collected them all!'}
            </Typography>
          </GlassCard>
        )}

        {/* Rarity Guide */}
        <GlassCard style={styles.legendCard}>
          <Typography variant="label" style={styles.legendTitle}>RARITY GUIDE</Typography>
          <View style={styles.legendItems}>
            {Object.entries(rarityColors).map(([rarity, color]) => (
              <LegendItem key={rarity} color={color} label={rarity.charAt(0).toUpperCase() + rarity.slice(1)} />
            ))}
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const StatItem = ({ label, value, color, icon }: any) => (
  <View style={styles.statItem}>
    <LinearGradient colors={[color, color + '80']} style={styles.statIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.statValue}>{value}</Typography>
    <Typography variant="caption" style={styles.statLabel}>{label}</Typography>
  </View>
);

const LegendItem = ({ color, label }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]}>
      <Ionicons name="trophy" size={14} color={COLORS.textPrimary} />
    </View>
    <Typography variant="caption" style={styles.legendLabel}>{label}</Typography>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGlow: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.large,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  statsCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  statsTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.xlarge,
    color: COLORS.brightYellow,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  statValue: {
    marginBottom: SPACING.tiny,
  },
  statLabel: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.regular,
  },
  filterTab: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundCard,
  },
  filterTabActive: {
    borderWidth: 2,
    borderColor: COLORS.brightYellow,
    backgroundColor: COLORS.brightYellow + '20',
  },
  filterTabText: {
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterTabTextActive: {
    color: COLORS.brightYellow,
    fontWeight: '700',
  },
  trophyCard: {
    width: 150,
    marginRight: SPACING.regular,
  },
  trophyFrame: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: SPACING.regular,
  },
  trophyIcon: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS.xlarge,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyInfo: {
    width: 150,
    marginTop: SPACING.regular,
    alignItems: 'center',
  },
  trophyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: SPACING.tiny,
  },
  trophyName: {
    textAlign: 'center',
    flex: 1,
  },
  rarityBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
  },
  trophyDescription: {
    textAlign: 'center',
    marginBottom: SPACING.regular,
    lineHeight: 18,
  },
  trophyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.small,
  },
  trophyDate: {
    color: COLORS.textHint,
    fontSize: 10,
  },
  trophyPoints: {
    color: COLORS.brightYellow,
    fontWeight: '700',
  },
  emptyState: {
    padding: SPACING.xxxlarge,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
    color: COLORS.textHint,
  },
  emptySubtitle: {
    color: COLORS.textHint,
    textAlign: 'center',
  },
  legendCard: {
    marginTop: SPACING.xlarge,
    padding: SPACING.large,
  },
  legendTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.large,
    color: COLORS.vibrantPink,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

const rarityColors = {
  common: COLORS.textHint,
  uncommon: COLORS.aquaTeal,
  rare: COLORS.vibrantPink,
  legendary: COLORS.brightYellow,
};

const rarityGradients = {
  common: [COLORS.textHint, COLORS.textHint + '80'],
  uncommon: [COLORS.aquaTeal, COLORS.aquaTeal + '80'],
  rare: [COLORS.vibrantPink, COLORS.vibrantPink + '80'],
  legendary: [COLORS.brightYellow, COLORS.brightYellow + '80'],
};