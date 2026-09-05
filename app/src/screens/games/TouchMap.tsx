import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Game Constants
const GAME_ID = 'touch-map';
const CATEGORY_ID = 'romance-hub';
const MAX_SCORE = 100;

type Zone = 'Head' | 'Chest' | 'Hands' | 'Legs' | 'Back';
const ZONES: Zone[] = ['Head', 'Chest', 'Hands', 'Legs', 'Back'];

const ZONE_COLORS = {
  white: COLORS.textPrimary,
  green: COLORS.success,
  yellow: COLORS.warning,
  red: COLORS.error,
};

const COMFORT_SCORES: Record<string, number> = {
  [ZONE_COLORS.green]: 3,
  [ZONE_COLORS.yellow]: 1,
  [ZONE_COLORS.red]: 0,
  [ZONE_COLORS.white]: 0,
};

export default function TouchMap({ navigation }: any) {
  const [colors, setColors] = useState<Record<Zone, string>>({
    Head: ZONE_COLORS.white, 
    Chest: ZONE_COLORS.white, 
    Hands: ZONE_COLORS.white, 
    Legs: ZONE_COLORS.white, 
    Back: ZONE_COLORS.white
  });
  const [gameCompleted, setGameCompleted] = useState(false);

  // Backend session
  const { 
    session, 
    updateScore, 
    completeGame, 
    isLoading, 
    isSyncing 
  } = useGameSession(GAME_ID, CATEGORY_ID);

  function cycleColor(z: Zone) {
    const current = colors[z];
    let next = ZONE_COLORS.white;
    if (current === ZONE_COLORS.white) next = ZONE_COLORS.green;
    else if (current === ZONE_COLORS.green) next = ZONE_COLORS.yellow;
    else if (current === ZONE_COLORS.yellow) next = ZONE_COLORS.red;
    else next = ZONE_COLORS.white;

    const newColors = { ...colors, [z]: next };
    setColors(newColors);
    
    // Calculate and update score
    const score = calculateScore(newColors);
    updateScore(score);
  }

  function calculateScore(currentColors: Record<Zone, string>): number {
    const totalScore = Object.values(currentColors).reduce((sum, color) => {
      return sum + (COMFORT_SCORES[color] || 0);
    }, 0);
    // Max possible score is 15 (5 zones * 3 points each), normalize to 100
    return Math.floor((totalScore / 15) * MAX_SCORE);
  }

  async function syncWithPartner() {
    if (gameCompleted) return;
    setGameCompleted(true);
    
    const finalScore = calculateScore(colors);
    await completeGame(finalScore, [{
      completed: true,
      zones: colors,
      greenZones: Object.entries(colors).filter(([_, c]) => c === ZONE_COLORS.green).map(([z]) => z),
      yellowZones: Object.entries(colors).filter(([_, c]) => c === ZONE_COLORS.yellow).map(([z]) => z),
      redZones: Object.entries(colors).filter(([_, c]) => c === ZONE_COLORS.red).map(([z]) => z),
    }]);
  }

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showHeader={false} scrollable={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
          <Typography variant="h2" style={styles.loadingText}>Loading Touch Map...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Sync Indicator */}
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption">💾 Saving...</Typography>
          </View>
        )}

        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h1">The Touch Map: Lite</Typography>
        </View>

        <GlassCard style={styles.card}>
          <Typography variant="body" center style={styles.instructionText}>
            Tap zones to set comfort level.
          </Typography>
          <View style={styles.legend}>
            <Typography variant="caption" color={ZONE_COLORS.green}>Green: Yes</Typography>
            <Typography variant="caption" color={ZONE_COLORS.yellow}>Yellow: Ask</Typography>
            <Typography variant="caption" color={ZONE_COLORS.red}>Red: No</Typography>
          </View>

          <View style={styles.bodyMap}>
            {ZONES.map((z) => (
              <Pressable key={z} onPress={() => cycleColor(z)} style={[styles.zone, { backgroundColor: colors[z] }]}>
                <Typography variant="button" style={styles.zoneText}>{z}</Typography>
              </Pressable>
            ))}
          </View>

          <SquishyButton 
            style={[styles.btn, styles.syncButton]}
            onPress={syncWithPartner}
            disabled={gameCompleted}
          >
             <Typography variant="h2" color={COLORS.textPrimary}>
               {gameCompleted ? 'Synced!' : 'Sync with Partner'}
             </Typography>
          </SquishyButton>

          <Typography variant="sass" center style={styles.hintText}>
             "They marked 'Chest' yellow... you green. Wanna unpack that?"
          </Typography>
        </GlassCard>

        {session && (
          <Typography variant="caption" style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: { 
    padding: SPACING.screenPadding, 
    gap: SPACING.regular 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.small 
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.large 
  },
  card: { 
    padding: SPACING.cardPadding, 
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  instructionText: {
    marginBottom: SPACING.xlarge,
  },
  legend: { 
    flexDirection: 'row', 
    gap: SPACING.xlarge, 
    marginBottom: SPACING.xxlarge 
  },
  bodyMap: { 
    width: '100%', 
    alignItems: 'center', 
    gap: SPACING.regular 
  },
  zone: { 
    width: 100, 
    height: 60, 
    borderRadius: BORDER_RADIUS.round, 
    justifyContent: 'center', 
    alignItems: 'center', 
    opacity: 0.8 
  },
  zoneText: { 
    color: COLORS.backgroundPrimary,
  },
  btn: { 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center', 
    width: '100%',
  },
  syncButton: {
    marginTop: SPACING.xxlarge,
  },
  hintText: {
    marginTop: SPACING.xxlarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: SPACING.regular,
  },
  syncIndicator: {
    position: 'absolute',
    top: SPACING.regular,
    right: SPACING.regular,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 1,
  },
  sessionInfo: {
    textAlign: 'center',
    marginTop: SPACING.xlarge,
    opacity: 0.3,
  },
});
