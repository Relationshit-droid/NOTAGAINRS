import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../state/store';
import { loveArcadeApi, LoveArcadeGame } from '../lib/api';

export default function LoveArcadeHubScreen() {
  // useNavigation was imported but never called; `navigation` was undefined.
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [games, setGames] = useState<LoveArcadeGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState({
    currentPhase: 1,
    phasesCompleted: 0,
    totalScore: 0,
    trophies: 0,
  });

  const fetchData = async () => {
    if (!user || !userId) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const [gamesData, progressData] = await Promise.all([
        loveArcadeApi.getGames(),
        // In real app, fetch user progress from backend
        Promise.resolve({ currentPhase: 2, phasesCompleted: 1, totalScore: 2450, trophies: 3 }),
      ]);
      setGames(gamesData.games);
      setUserProgress(progressData);
    } catch (error) {
      console.error('Failed to fetch arcade data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, userId]);

  const phases = [
    { id: 'awakening', name: 'THE AWAKENING', subtitle: 'Face the truth of your relationship', color: COLORS.rosePink, icon: 'eye', gamesCount: 8 },
    { id: 'deconstruction', name: 'THE DECONSTRUCTION', subtitle: 'Break down walls, rebuild trust', color: COLORS.vibrantPink, icon: 'hammer', gamesCount: 8 },
    { id: 'bridge', name: 'THE BRIDGE', subtitle: 'Connect through vulnerability', color: COLORS.warmOrange, icon: 'link', gamesCount: 8 },
    { id: 'fortress', name: 'THE FORTRESS', subtitle: 'Build unshakeable foundations', color: COLORS.mintGreen, icon: 'shield', gamesCount: 8 },
    { id: 'ascension', name: 'THE ASCENSION', subtitle: 'Transcend to legendary love', color: COLORS.brightYellow, icon: 'trending-up', gamesCount: 10 },
  ];

  const filteredGames = selectedPhase 
    ? games.filter(g => g.phase === selectedPhase)
    : games;

  const renderPhase = ({ item }: { item: typeof phases[0] }) => (
    <TouchableOpacity 
      style={[
        styles.phaseCard,
        selectedPhase === item.id && styles.phaseCardSelected,
        { borderColor: item.color },
      ]}
      onPress={() => setSelectedPhase(selectedPhase === item.id ? null : item.id)}
    >
      <LinearGradient colors={[item.color, item.color + '80']} style={styles.phaseIcon}>
        <Ionicons name={item.icon} size={28} color={COLORS.textPrimary} />
      </LinearGradient>
      <View style={styles.phaseInfo}>
        <Typography variant="label" style={styles.phaseLabel}>{item.id.toUpperCase()}</Typography>
        <Typography variant="header" style={styles.phaseName}>{item.name}</Typography>
        <Typography variant="caption" style={styles.phaseSubtitle}>{item.subtitle}</Typography>
        <Typography variant="caption" style={styles.phaseGamesCount}>
          {item.gamesCount} Games • Phase {phases.indexOf(item) + 1} of 5
        </Typography>
      </View>
      <Ionicons 
        name={selectedPhase === item.id ? 'chevron-up' : 'chevron-down'} 
        size={24} 
        color={item.color} 
      />
    </TouchableOpacity>
  );

  const renderGame = ({ item }: { item: LoveArcadeGame }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate('LoveArcadeGameDetail', { gameId: item.id })}
    >
      <View style={styles.gameCardHeader}>
        <LinearGradient colors={getPhaseGradient(item.phase)} style={styles.gamePhaseBadge}>
          <Typography variant="caption" style={styles.phaseBadgeText}>{item.phase?.toUpperCase()}</Typography>
        </LinearGradient>
        <View style={styles.gameMeta}>
          <Typography variant="caption" style={styles.gameDuration}>
            <Ionicons name="time" size={12} color={COLORS.textHint} style={{ marginRight: 4 }} />
            {item.estimated_time}min
          </Typography>
          <Typography variant="caption" style={styles.gameMaxScore}>
            <Ionicons name="star" size={12} color={COLORS.brightYellow} style={{ marginRight: 4 }} />
            {item.max_score} pts
          </Typography>
        </View>
      </View>
      
      <Typography variant="header" style={styles.gameTitle} numberOfLines={1}>{item.name}</Typography>
      <Typography variant="body" style={styles.gameDescription} numberOfLines={2}>{item.description}</Typography>
      
      <View style={styles.gameFooter}>
        <Typography variant="caption" style={styles.gameFormat}>
          <Ionicons name="grid" size={12} color={COLORS.textHint} style={{ marginRight: 4 }} />
          {item.format}
        </Typography>
        {item.has_daily_double && (
          <View style={styles.dailyDoubleBadge}>
            <Ionicons name="flash" size={10} color={COLORS.brightYellow} />
            <Typography variant="caption" color={COLORS.brightYellow} style={{ marginLeft: 2 }}>DAILY DOUBLE</Typography>
          </View>
        )}
        {item.has_final_jeopardy && (
          <View style={styles.finalJeopardyBadge}>
            <Ionicons name="trophy" size={10} color={COLORS.brightYellow} />
            <Typography variant="caption" color={COLORS.brightYellow} style={{ marginLeft: 2 }}>FINAL JEOPARDY</Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={GRADIENTS.romanceHub.colors} style={styles.loadingGlow}>
            <Ionicons name="game-controller" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading Love Arcade...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress Header */}
        <GlassCard style={styles.progressCard} variant="elevated">
          <Typography variant="label" style={styles.progressTitle}>ARCADE PROGRESS</Typography>
          <View style={styles.progressStats}>
            <ProgressStat 
              label="Phase" 
              value={`${userProgress.currentPhase} / 5`} 
              icon="layers"
              color={COLORS.vibrantPink}
            />
            <ProgressStat 
              label="Completed" 
              value={userProgress.phasesCompleted.toString()} 
              icon="checkmark-circle"
              color={COLORS.mintGreen}
            />
            <ProgressStat 
              label="Total Score" 
              value={userProgress.totalScore.toLocaleString()} 
              icon="star"
              color={COLORS.brightYellow}
            />
            <ProgressStat 
              label="Trophies" 
              value={`${userProgress.trophies} / 25`} 
              icon="trophy"
              color={COLORS.warmOrange}
            />
          </View>
          <View style={styles.progressBarContainer}>
            <Typography variant="caption" style={styles.progressBarLabel}>
              Phase {userProgress.currentPhase} Progress
            </Typography>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressBarFill,
                { width: `${(userProgress.currentPhase - 1) * 20}%`, backgroundColor: COLORS.vibrantPink }
              ]} />
            </View>
          </View>
        </GlassCard>

        {/* Phase Selection */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>SELECT YOUR PHASE</Typography>
          <Typography variant="caption" style={styles.sectionSubtitle}>Each phase unlocks deeper intimacy</Typography>
          
          <FlatList
            data={phases}
            renderItem={renderPhase}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.phasesList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </GlassCard>

        {/* Games List */}
        {selectedPhase && (
          <GlassCard style={styles.sectionCard}>
            <View style={styles.gamesHeader}>
              <Typography variant="label" style={styles.gamesTitle}>
                {phases.find(p => p.id === selectedPhase)?.name} GAMES
              </Typography>
              <Typography variant="caption" style={styles.gamesCount}>
                {filteredGames.length} games available
              </Typography>
            </View>
            
            <FlatList
              data={filteredGames}
              renderItem={renderGame}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.gamesList}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </GlassCard>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <SquishyButton 
            variant="secondary"
            onPress={() => navigation.navigate('LoveArcadeProgressMap')}
            style={styles.quickActionButton}
          >
            <Ionicons name="map" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">PROGRESS MAP</Typography>
          </SquishyButton>
          <SquishyButton 
            variant="secondary"
            onPress={() => navigation.navigate('LoveArcadeTrophyRoom')}
            style={styles.quickActionButton}
          >
            <Ionicons name="trophy" size={18} color={COLORS.brightYellow} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">TROPHY ROOM</Typography>
          </SquishyButton>
          <SquishyButton 
            variant="secondary"
            onPress={() => navigation.navigate('LoveArcadeSettings')}
            style={styles.quickActionButton}
          >
            <Ionicons name="settings" size={18} color={COLORS.aquaTeal} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">SETTINGS</Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const ProgressStat = ({ label, value, icon, color }: any) => (
  <View style={styles.progressStat}>
    <LinearGradient colors={[color, color + '80']} style={styles.progressIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.progressValue}>{value}</Typography>
    <Typography variant="caption" style={styles.progressLabel}>{label}</Typography>
  </View>
);

const ProgressBar = ({ progress, color }: any) => (
  <View style={styles.progressBar}>
    <View style={[
      styles.progressBarFill,
      { width: `${progress}%`, backgroundColor: color }
    ]} />
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
  progressCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  progressTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xlarge,
  },
  progressStat: {
    flex: 1,
    alignItems: 'center',
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  progressValue: {
    marginBottom: SPACING.tiny,
  },
  progressLabel: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 11,
  },
  progressBarContainer: {
    marginTop: SPACING.regular,
  },
  progressBarLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.tiny,
    color: COLORS.vibrantPink,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xlarge,
  },
  phasesList: {
    gap: SPACING.regular,
  },
  separator: {
    height: SPACING.regular,
  },
  phaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  phaseCardSelected: {
    borderWidth: 2,
    backgroundColor: COLORS.vibrantPink + '10',
  },
  phaseIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseLabel: {
    color: COLORS.vibrantPink,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.tiny,
  },
  phaseName: {
    marginBottom: SPACING.tiny,
  },
  phaseSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.tiny,
  },
  phaseGamesCount: {
    color: COLORS.textHint,
    fontSize: 11,
  },
  gamesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  gamesTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.vibrantPink,
  },
  gamesCount: {
    color: COLORS.textHint,
  },
  gamesList: {
    gap: SPACING.regular,
  },
  gameCard: {
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.regular,
  },
  gamePhaseBadge: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
  },
  phaseBadgeText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 10,
  },
  gameMeta: {
    gap: SPACING.tiny,
  },
  gameDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameMaxScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameTitle: {
    marginBottom: SPACING.small,
  },
  gameDescription: {
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.regular,
  },
  gameFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  gameFormat: {
    flexDirection: 'row',
    alignItems: 'center',
    color: COLORS.textHint,
  },
  dailyDoubleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    backgroundColor: COLORS.brightYellow + '20',
    borderRadius: BORDER_RADIUS.round,
  },
  finalJeopardyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    backgroundColor: COLORS.brightYellow + '20',
    borderRadius: BORDER_RADIUS.round,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.regular,
    marginTop: SPACING.xlarge,
    paddingHorizontal: SPACING.regular,
  },
  quickActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
});

function getPhaseGradient(phase?: string) {
  const gradients: Record<string, string[]> = {
    awakening: [COLORS.rosePink, COLORS.rosePink + '80'],
    deconstruction: [COLORS.vibrantPink, COLORS.vibrantPink + '80'],
    bridge: [COLORS.warmOrange, COLORS.warmOrange + '80'],
    fortress: [COLORS.mintGreen, COLORS.mintGreen + '80'],
    ascension: [COLORS.brightYellow, COLORS.brightYellow + '80'],
  };
  return gradients[phase || ''] || [COLORS.vibrantPink, COLORS.vibrantPink + '80'];
}