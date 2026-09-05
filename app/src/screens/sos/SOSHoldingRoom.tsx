import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, ANIMATIONS } from '../../theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { sosApi } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';
import { Ionicons } from '@expo/vector-icons';

type SOSHoldingRoomProps = {
  navigation: any;
  route: any;
};

export default function SOSHoldingRoom({ navigation, route }: SOSHoldingRoomProps) {
  const { sessionId, coupleId } = route.params || {};
  const [sessionData, setSessionData] = useState<any>(null);
  const [partnerReady, setPartnerReady] = useState(false);
  const [showMarcie, setShowMarcie] = useState(true);
  const [marcieQuote, setMarcieQuote] = useState("Breathe. They're almost done.");
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [activeMiniGame, setActiveMiniGame] = useState<string | null>(null);

  const breathAnim = useSharedValue(0);
  const floatAnim = useSharedValue(0);

  // Reanimated styles must be declared inside the component so they can close
  // over the shared values and follow the rules of hooks.
  const animatedOrbOuterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathAnim.value * 0.3 }],
    opacity: 0.15 + breathAnim.value * 0.15,
  }));

  const animatedOrbMiddleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathAnim.value * 0.2 }],
    opacity: 0.3 + breathAnim.value * 0.2,
  }));

  useEffect(() => {
    // Breathing animation
    breathAnim.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    floatAnim.value = withRepeat(
      withTiming(-15, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Timeout - escalate to professional resources
          Alert.alert(
            'Session Timed Out',
            'The 2-hour cooling period has ended. Dr. Marcie recommends professional support.',
            [{ text: 'View Resources', onPress: () => navigation.navigate('CrisisResources') }]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Poll for session updates (in production, use real-time listener)
    const pollSession = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !sessionId) return;
        
        const token = await user.getIdToken();
        const session = await sosApi.getSession(sessionId, token);
        setSessionData(session);
        
        // Check if partner has submitted
        if (session.submissions && Object.keys(session.submissions).length >= 2) {
          setPartnerReady(true);
          setMarcieQuote("They're ready. Let's see what the oracle says.");
        }
        
        // Check if analysis is complete
        if (session.status === 'completed' || session.verdict) {
          navigation.navigate('SOSVerdict', { sessionId, coupleId });
        }
      } catch (error) {
        console.error('Failed to poll session:', error);
      }
    };

    const pollInterval = setInterval(pollSession, 5000);
    pollSession(); // Initial check

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [sessionId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const miniGames = [
    { id: 'breathing', name: 'Guided Breathing', icon: 'leaf', color: COLORS.mintGreen, description: 'Sync your breath with the circle' },
    { id: 'gratitude', name: 'Gratitude Prompt', icon: 'heart', color: COLORS.vibrantPink, description: 'Name 3 things you appreciate' },
    { id: 'memory', name: 'Happy Memory', icon: 'image', color: COLORS.brightYellow, description: 'Recall a good moment together' },
  ];

  const startMiniGame = (gameId: string) => {
    setActiveMiniGame(gameId);
    // In production, navigate to mini-game screen
    Alert.alert(gameId === 'breathing' ? 'Guided Breathing' : 
              gameId === 'gratitude' ? 'Gratitude Practice' : 'Happy Memory',
      'This would launch a calming mini-game while you wait.',
      [{ text: 'OK' }]
    );
    setActiveMiniGame(null);
  };

  const skipToVerdict = async () => {
    if (!sessionId) return;
    
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const token = await user.getIdToken();
      await sosApi.analyzeSession(sessionId, token);
      navigation.navigate('SOSVerdict', { sessionId, coupleId });
    } catch (error) {
      console.error('Failed to analyze session:', error);
      Alert.alert('Error', 'Could not generate verdict yet');
    }
  };

  return (
    <ScreenLayout 
      showHeader={false} 
      scrollable={false}
      showMarcie={showMarcie}
      marcieQuote={marcieQuote}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>Holding Room</Typography>
          <Typography variant="caption" style={styles.timer}>
            {formatTime(timeRemaining)} remaining
          </Typography>
        </View>

        {/* Breathing orb */}
        <View style={styles.orbContainer}>
          <Animated.View style={[styles.orbOuter, animatedOrbOuterStyle]} />
          <Animated.View style={[styles.orbMiddle, animatedOrbMiddleStyle]} />
          <View style={styles.orbCore} />
        </View>

        <Typography variant="body" style={styles.breathInstruction}>
          Breathe with the circle. In... and out...
        </Typography>

        {/* Partner status */}
        <GlassCard style={styles.statusCard} padding="medium">
          <View style={styles.statusRow}>
            <View style={[
              styles.statusIndicator,
              partnerReady && styles.statusIndicatorReady,
            ]} />
            <View style={styles.statusTextContainer}>
              <Typography variant="label" style={styles.statusLabel}>
                {partnerReady ? 'Partner Ready' : 'Partner Still Venting'}
              </Typography>
              <Typography variant="caption" style={styles.statusSubtext}>
                {partnerReady ? 'Both booths complete. Verdict incoming.' : 'Give them space to finish their reflection.'}
              </Typography>
            </View>
          </View>
        </GlassCard>

        {/* Mini-games */}
        <Typography variant="label" style={styles.sectionTitle}>WHILE YOU WAIT</Typography>
        <View style={styles.miniGamesContainer}>
          {miniGames.map((game) => (
            <TouchableOpacity
              key={game.id}
              onPress={() => startMiniGame(game.id)}
              style={styles.miniGameCard}
              activeOpacity={0.8}
            >
              <View style={[styles.miniGameIcon, { backgroundColor: `${game.color}20` }]}>
                <Ionicons name={game.icon} size={24} color={game.color} />
              </View>
              <View style={styles.miniGameInfo}>
                <Typography variant="body" style={styles.miniGameName}>{game.name}</Typography>
                <Typography variant="caption" style={styles.miniGameDesc}>{game.description}</Typography>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textHint} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Skip button */}
        {partnerReady && (
          <SquishyButton 
            onPress={skipToVerdict}
            variant="primary"
            size="large"
            style={styles.skipButton}
          >
            <Typography variant="button">GET VERDICT NOW</Typography>
          </SquishyButton>
        )}

        <Typography variant="caption" style={styles.disclaimer}>
          Session auto-escalates to professional resources after 2 hours
        </Typography>
      </SafeAreaView>
    </ScreenLayout>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xlarge,
    paddingBottom: SPACING.large,
    paddingHorizontal: SPACING.screenPadding,
  },
  title: {
    color: COLORS.mintGreen,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  timer: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 16,
  },
  orbContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xlarge,
  },
  orbOuter: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.mintGreen,
  },
  orbMiddle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.mintGreen,
  },
  orbCore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.mintGreen,
    ...{
      shadowColor: COLORS.mintGreen,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
  },
  breathInstruction: {
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: SPACING.xxlarge,
    paddingHorizontal: SPACING.large,
  },
  statusCard: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xlarge,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.warning,
  },
  statusIndicatorReady: {
    backgroundColor: COLORS.success,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.tiny,
  },
  statusSubtext: {
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: SPACING.regular,
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
  miniGamesContainer: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  miniGameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  miniGameIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniGameInfo: {
    flex: 1,
  },
  miniGameName: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.tiny,
  },
  miniGameDesc: {
    color: COLORS.textSecondary,
  },
  skipButton: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xlarge,
  },
  disclaimer: {
    textAlign: 'center',
    opacity: 0.4,
    paddingHorizontal: SPACING.large,
  },
});