import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const GameLobbyScreen = ({ navigation }: any) => {
  return (
    <ScreenLayout 
      showMarcie={true} 
      marcieQuote="Waiting for your partner to join the game."
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            The Love Arcade
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            +100 Games to Deepen Connection
          </Typography>

          <View style={styles.iconContainer}>
            <Ionicons name="game-controller" size={64} color={COLORS.vibrantPink} />
          </View>
          
          <Typography variant="h2" style={styles.lobbyTitle}>
            Game Lobby
          </Typography>
          
          <Typography variant="body" style={styles.lobbySubtitle}>
            Get ready to play! Waiting for all players to join.
          </Typography>

          <GlassCard style={styles.statusCard}>
            <View style={styles.playerRow}>
              <View style={styles.playerInfo}>
                <View style={[styles.avatar, styles.avatarConnected]}>
                  <Ionicons name="person" size={24} color={COLORS.textPrimary} />
                </View>
                <Typography variant="body">You</Typography>
                <View style={styles.statusBadge}>
                  <Typography variant="caption" style={styles.statusText}>Ready</Typography>
                </View>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.playerRow}>
              <View style={styles.playerInfo}>
                <View style={[styles.avatar, styles.avatarWaiting]}>
                  <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
                </View>
                <Typography variant="body" style={{ opacity: 0.6 }}>Partner</Typography>
                <View style={[styles.statusBadge, styles.statusBadgeWaiting]}>
                  <Typography variant="caption" style={styles.statusTextWaiting}>Waiting...</Typography>
                </View>
              </View>
            </View>
          </GlassCard>

          <SquishyButton
            variant="primary"
            size="large"
            onPress={() => navigation?.navigate('GamePlay')}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              Start Game
            </Typography>
          </SquishyButton>
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
  },
  lobbyTitle: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  lobbySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.xl,
  },
  statusCard: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  playerRow: {
    paddingVertical: SPACING.md,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarConnected: {
    backgroundColor: `${COLORS.success}30`,
  },
  avatarWaiting: {
    backgroundColor: `${COLORS.textSecondary}20`,
  },
  statusBadge: {
    backgroundColor: `${COLORS.success}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  statusBadgeWaiting: {
    backgroundColor: `${COLORS.warning}20`,
  },
  statusText: {
    color: COLORS.success,
    fontWeight: '600',
  },
  statusTextWaiting: {
    color: COLORS.warning,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: `${COLORS.textPrimary}10`,
    marginVertical: SPACING.sm,
  },
});

export default GameLobbyScreen;
