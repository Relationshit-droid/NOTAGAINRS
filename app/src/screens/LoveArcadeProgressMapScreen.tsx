import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../state/store';

export default function LoveArcadeProgressMapScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);

  const phases = [
    { id: 'awakening', name: 'THE AWAKENING', color: COLORS.rosePink, icon: 'eye', completed: true, current: false, progress: 100 },
    { id: 'deconstruction', name: 'THE DECONSTRUCTION', color: COLORS.vibrantPink, icon: 'hammer', completed: true, current: false, progress: 100 },
    { id: 'bridge', name: 'THE BRIDGE', color: COLORS.warmOrange, icon: 'link', completed: false, current: true, progress: 60 },
    { id: 'fortress', name: 'THE FORTRESS', color: COLORS.mintGreen, icon: 'shield', completed: false, current: false, progress: 0, locked: true },
    { id: 'ascension', name: 'THE ASCENSION', color: COLORS.brightYellow, icon: 'trending-up', completed: false, current: false, progress: 0, locked: true },
  ];

  const renderPhaseNode = (phase: any, index: number) => {
    const isCompleted = phase.completed;
    const isCurrent = phase.current;
    const isLocked = phase.locked;
    const showPath = index < phases.length - 1;

    return (
      <View key={phase.id} style={styles.phaseContainer}>
        <TouchableOpacity
          style={[
            styles.phaseNode,
            isCompleted && styles.nodeCompleted,
            isCurrent && styles.nodeCurrent,
            isLocked && styles.nodeLocked,
          ]}
          onPress={() => !isLocked && null} // Navigate to phase
          disabled={isLocked}
        >
          <View style={[
            styles.nodeInner,
            isCompleted && styles.nodeInnerCompleted,
            isCurrent && styles.nodeInnerCurrent,
            isLocked && styles.nodeInnerLocked,
          ]}>
            <LinearGradient colors={[phase.color, phase.color + '80']} style={styles.nodeIcon}>
              <Ionicons name={phase.icon} size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            {isCompleted && (
              <Ionicons name="checkmark" size={20} color={COLORS.textPrimary} style={styles.checkIcon} />
            )}
            {isCurrent && (
              <View style={styles.pulseRing} />
            )}
          </View>
        </TouchableOpacity>

        {showPath && (
          <View style={[
            styles.pathLine,
            phases[index].completed && styles.pathCompleted,
          ]} />
        )}

        <View style={styles.phaseInfo}>
          <Typography variant="caption" style={[
            styles.phaseNumber,
            index === 0 ? styles.phaseNumberFirst : {},
          ]}>
            PHASE {index + 1}
          </Typography>
          <Typography variant="caption" style={styles.phaseName}>{phase.name}</Typography>
          <Typography variant="caption" style={[
            styles.phaseProgress,
            phase.completed && styles.progressComplete,
          ]}>
            {phase.progress === 100 ? 'COMPLETE' : phase.locked ? 'LOCKED' : `${phase.progress}%`}
          </Typography>
        </View>
      </View>
    );
  };

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <GlassCard style={styles.headerCard} variant="elevated">
          <Typography variant="label" style={styles.mapTitle}>PROGRESS MAP</Typography>
          <Typography variant="caption" style={styles.mapSubtitle}>Your journey through the 5 phases of love</Typography>
          
          <View style={styles.mapStats}>
            <MapStat label="Phases Complete" value="2 / 5" color={COLORS.mintGreen} icon="checkmark-circle" />
            <MapStat label="Total Score" value="2,450" color={COLORS.brightYellow} icon="star" />
            <MapStat label="Trophies" value="3 / 25" color={COLORS.warmOrange} icon="trophy" />
            <MapStat label="Current Phase" value="THE BRIDGE" color={COLORS.warmOrange} icon="link" />
          </View>
        </GlassCard>

        {/* Legend */}
        <GlassCard style={styles.legendCard}>
          <Typography variant="label" style={styles.legendTitle}>MAP LEGEND</Typography>
          <View style={styles.legendItems}>
            <LegendItem color={COLORS.mintGreen} label="Completed" icon="checkmark-circle" />
            <LegendItem color={COLORS.vibrantPink} label="Current" icon="radio-button-on" />
            <LegendItem color={COLORS.textHint} label="Locked" icon="lock-closed" />
            <LegendItem color={COLORS.brightYellow} label="Milestone" icon="star" />
          </View>
        </GlassCard>

        {/* Map Path */}
        <View style={styles.mapContainer}>
          {phases.map((phase, index) => renderPhaseNode(phase, index))}
        </View>

        {/* Phase Details */}
        {phases.map((phase, index) => (
          <PhaseDetailCard key={phase.id} phase={phase} index={index} />
        ))}
      </ScrollView>
    </ScreenLayout>
  );
}

const MapStat = ({ label, value, color, icon }: any) => (
  <View style={styles.mapStat}>
    <LinearGradient colors={[color, color + '80']} style={styles.mapStatIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.mapStatValue}>{value}</Typography>
    <Typography variant="caption" style={styles.mapStatLabel}>{label}</Typography>
  </View>
);

const LegendItem = ({ color, label, icon }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]}>
      <Ionicons name={icon} size={14} color={COLORS.textPrimary} />
    </View>
    <Typography variant="caption" style={styles.legendLabel}>{label}</Typography>
  </View>
);

const PhaseDetailCard = ({ phase, index }: any) => {
  const games = ['Truth Mirror', 'Echo Chamber', 'Family Feud', 'Emotional Excavation', 'Phantom Funeral', 'Love-Script Rewrite', 'Trust Gauntlet', 'Transparency Toss'];
  const isCompleted = phase.completed;
  const isCurrent = phase.current;
  const isLocked = phase.locked;

  return (
    <GlassCard key={phase.id} style={[
      styles.phaseDetailCard,
      isCurrent && styles.phaseDetailCurrent,
      isLocked && styles.phaseDetailLocked,
    ]}>
      <View style={styles.phaseDetailHeader}>
        <View style={[
          styles.phaseDetailBadge,
          { backgroundColor: phase.color },
        ]}>
          <Typography variant="caption" style={styles.phaseDetailPhase}>PHASE {index + 1}</Typography>
        </View>
        <View style={styles.phaseDetailTitle}>
          <Typography variant="label" style={styles.phaseDetailName}>{phase.name}</Typography>
          <Typography variant="caption" style={styles.phaseDetailSubtitle}>
            {isCompleted ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : isLocked ? 'LOCKED' : 'AVAILABLE'}
          </Typography>
        </View>
        {isCurrent && (
          <View style={styles.phaseDetailProgress}>
            <Typography variant="caption" style={styles.phaseDetailProgressLabel}>{phase.progress}% Complete</Typography>
            <View style={styles.phaseDetailProgressBar}>
              <View style={[
                styles.phaseDetailProgressFill,
                { width: `${phase.progress}%`, backgroundColor: phase.color }
              ]} />
            </View>
          </View>
        )}
      </View>

      {!isLocked && (
        <View style={styles.phaseDetailGames}>
          <Typography variant="caption" style={styles.phaseDetailGamesLabel}>GAMES IN THIS PHASE</Typography>
          <View style={styles.phaseDetailGamesList}>
            {games.map((game, i) => (
              <View key={i} style={styles.phaseDetailGameItem}>
                <View style={[
                  styles.phaseDetailGameStatus,
                  i < (isCompleted ? 8 : phase.progress * 0.08) ? styles.gameCompleted : styles.gameLocked,
                ]}>
                  {i < (isCompleted ? 8 : phase.progress * 0.08) ? (
                    <Ionicons name="checkmark" size={12} color={COLORS.mintGreen} />
                  ) : (
                    <Ionicons name="lock-closed" size={12} color={COLORS.textHint} />
                  )}
                </View>
                <Typography variant="caption" style={[
                  styles.phaseDetailGameName,
                  i >= (isCompleted ? 8 : phase.progress * 0.08) && styles.gameNameLocked,
                ]}>
                  {game}
                </Typography>
              </View>
            ))}
          </View>
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  phaseContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  phaseNode: {
    marginBottom: SPACING.regular,
  },
  nodeInner: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nodeInnerCompleted: {
    borderColor: COLORS.mintGreen,
    backgroundColor: COLORS.mintGreen + '10',
  },
  nodeInnerCurrent: {
    borderColor: COLORS.vibrantPink,
    backgroundColor: COLORS.vibrantPink + '10',
    borderWidth: 3,
  },
  nodeInnerLocked: {
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundSecondary,
    opacity: 0.5,
  },
  nodeIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.mintGreen,
    borderRadius: BORDER_RADIUS.round,
    padding: 2,
  },
  pulseRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
  },
  pathLine: {
    width: 2,
    height: 80,
    backgroundColor: COLORS.borderSubtle,
    marginHorizontal: 29,
  },
  pathCompleted: {
    backgroundColor: COLORS.mintGreen,
  },
  phaseInfo: {
    alignItems: 'center',
    marginTop: SPACING.regular,
    width: 100,
  },
  phaseNumber: {
    color: COLORS.textHint,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  phaseNumberFirst: {
    marginTop: 0,
  },
  phaseName: {
    marginTop: SPACING.tiny,
    textAlign: 'center',
    fontWeight: '600',
  },
  phaseProgress: {
    marginTop: SPACING.tiny,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressComplete: {
    color: COLORS.mintGreen,
    fontWeight: '700',
  },
  headerCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  mapTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.tiny,
  },
  mapSubtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xlarge,
  },
  mapStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xlarge,
  },
  mapStat: {
    flex: 1,
    alignItems: 'center',
  },
  mapStatIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  mapStatValue: {
    marginBottom: SPACING.tiny,
  },
  mapStatLabel: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 11,
  },
  legendCard: {
    marginBottom: SPACING.xlarge,
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
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  legendDot: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  mapContainer: {
    marginBottom: SPACING.xlarge,
  },
  phaseDetailCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  phaseDetailCurrent: {
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
    backgroundColor: COLORS.vibrantPink + '08',
  },
  phaseDetailLocked: {
    opacity: 0.5,
    backgroundColor: COLORS.backgroundSecondary,
  },
  phaseDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  phaseDetailBadge: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
  },
  phaseDetailPhase: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  phaseDetailTitle: {
    flex: 1,
  },
  phaseDetailName: {
    marginBottom: SPACING.tiny,
  },
  phaseDetailSubtitle: {
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  phaseDetailProgress: {
    marginTop: SPACING.regular,
  },
  phaseDetailProgressLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  phaseDetailProgressBar: {
    height: 6,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  phaseDetailProgressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  phaseDetailGames: {
    marginTop: SPACING.xlarge,
  },
  phaseDetailGamesLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.textSecondary,
    marginBottom: SPACING.regular,
  },
  phaseDetailGamesList: {
    gap: SPACING.small,
  },
  phaseDetailGameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.small,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.medium,
  },
  phaseDetailGameStatus: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameCompleted: {
    backgroundColor: COLORS.mintGreen + '20',
    borderColor: COLORS.mintGreen,
  },
  gameLocked: {
    backgroundColor: COLORS.backgroundCard,
    borderColor: COLORS.borderSubtle,
  },
  gameNameLocked: {
    color: COLORS.textHint,
  },
  phaseDetailGameName: {
    flex: 1,
    color: COLORS.textPrimary,
  },
});