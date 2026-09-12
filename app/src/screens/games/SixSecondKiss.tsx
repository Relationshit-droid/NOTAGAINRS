import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Alert } from 'react-native';
import { ScreenLayout, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const SIX_SECONDS = 6000;

const SixSecondKissScreen = () => {
  // Get game info from registry
  const gameInfo = getGameByScreen('SixSecondKiss');
  const GAME_ID = gameInfo?.id || 'six-second-kiss';
  const CATEGORY_ID = gameInfo?.categoryId || 'romance-hub';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading: sessionLoading,
    isSyncing,
    partnerProgress
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  // Game state
  const [player1Active, setPlayer1Active] = useState(false);
  const [player2Active, setPlayer2Active] = useState(false);
  const [timer, setTimer] = useState(SIX_SECONDS);
  const [isKissing, setIsKissing] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const timerAnimation = useRef(new Animated.Value(0)).current;
  // Animated.Value has no stop(); the running animation does. Keep a handle.
  const timerAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const bothPlayersActive = player1Active && player2Active;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (bothPlayersActive && !challengeCompleted) {
      setIsKissing(true);
      timerAnimationRef.current = Animated.timing(timerAnimation, {
        toValue: 1,
        duration: SIX_SECONDS,
        useNativeDriver: false,
      });
      timerAnimationRef.current.start();

      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 10) {
            clearInterval(interval!);
            // Challenge completed successfully
            handleChallengeComplete();
            return 0;
          }
          return prev - 10;
        });
      }, 10);
    } else {
      setIsKissing(false);
      timerAnimationRef.current?.stop();
      if(interval) clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      timerAnimationRef.current?.stop();
    };
  }, [bothPlayersActive, challengeCompleted]);

  const handleChallengeComplete = async () => {
    if (challengeCompleted) return;
    
    setChallengeCompleted(true);
    const score = 100; // Full score for completing the challenge
    setFinalScore(score);
    
    // Update score in backend
    await updateScore(score, [{
      challengeType: 'six-second-kiss',
      completed: true,
      duration: SIX_SECONDS
    }]);
    
    // Complete the game
    await completeGame(score, [{
      challengeType: 'six-second-kiss',
      completed: true,
      duration: SIX_SECONDS
    }], ['Six Second Master']);
    
    Alert.alert(
      'Challenge Complete! 💋',
      'You and your partner held the 6-second kiss! This simple act releases oxytocin and strengthens your bond.',
      [{ text: 'Amazing!', onPress: () => {} }]
    );
  };

  const handleReset = async () => {
    setChallengeCompleted(false);
    setTimer(SIX_SECONDS);
    setPlayer1Active(false);
    setPlayer2Active(false);
    setIsKissing(false);
    setFinalScore(0);
    timerAnimation.setValue(0);
    
    // Reset score in backend
    await updateScore(0, [{
      challengeType: 'six-second-kiss',
      completed: false,
      duration: 0
    }]);
  };

  const timerDisplay = (timer / 1000).toFixed(2);

  const syncProgress = timerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const TouchZone = ({ player, onStateChange, isActive }: { player: string, onStateChange: (active: boolean) => void, isActive: boolean }) => (
    <SquishyButton
      onPress={() => {}}
      onPressIn={() => !challengeCompleted && onStateChange(true)}
      onPressOut={() => onStateChange(false)}
      variant={isActive ? 'primary' : 'ghost'}
      style={[
        styles.touchZone,
        challengeCompleted && styles.touchZoneDisabled
      ]}
      disabled={challengeCompleted}
    >
      <Typography variant="body" center>{player}</Typography>
      {isActive && <Typography variant="caption" color={COLORS.vibrantPink} center>Connected</Typography>}
    </SquishyButton>
  );

  // Loading state
  if (sessionLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Preparing your kiss challenge...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting 6-Second Kiss Challenge...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={false} showMarcie={true} marcieQuote="6 seconds of kissing releases oxytocin. Science is sexy.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        <View style={styles.content}>
          <Typography variant="h1" center>6-Second Kiss Challenge</Typography>
          <Typography variant="body" center style={styles.subtitle}>
            Both partners hold to start the timer
          </Typography>

          <View style={styles.gameArea}>
            <TouchZone player="Partner 1" onStateChange={setPlayer1Active} isActive={player1Active} />

            <View style={styles.timerContainer}>
              <Typography variant="h1" style={[
                styles.timerText,
                challengeCompleted && styles.timerTextComplete
              ]}>
                {timerDisplay}
              </Typography>
              <Typography variant="caption" center>Seconds</Typography>
              
              {challengeCompleted && (
                <Typography variant="caption" center style={styles.completeText}>
                  Challenge Complete! 🎉
                </Typography>
              )}
            </View>

            <TouchZone player="Partner 2" onStateChange={setPlayer2Active} isActive={player2Active} />
          </View>

          <View style={styles.syncBarContainer}>
            <Typography variant="caption" center>Synchronization</Typography>
            <View style={styles.syncBar}>
              <Animated.View style={[
                styles.syncBarProgress,
                { width: syncProgress },
                challengeCompleted && styles.syncBarProgressComplete
              ]} />
            </View>
          </View>
          
          {challengeCompleted && (
            <View style={styles.resetContainer}>
              <SquishyButton onPress={handleReset} size="medium">
                <Typography variant="button">Try Again</Typography>
              </SquishyButton>
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  subtitle: {
    marginTop: SPACING.small,
    marginBottom: SPACING.xlarge,
    color: COLORS.textSecondary,
  },
  gameArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.xxlarge,
  },
  touchZone: {
    width: 120,
    height: 200,
  },
  touchZoneDisabled: {
    opacity: 0.5,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.regular,
  },
  timerText: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge * 2,
    color: COLORS.textPrimary,
  },
  timerTextComplete: {
    color: COLORS.success,
  },
  completeText: {
    marginTop: SPACING.small,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  syncBarContainer: {
    marginTop: SPACING.xxlarge,
    width: '60%',
  },
  syncBar: {
    height: 6,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.small,
    marginTop: SPACING.tiny,
  },
  syncBarProgress: {
    height: '100%',
    backgroundColor: COLORS.vibrantPink,
    borderRadius: BORDER_RADIUS.small,
  },
  syncBarProgressComplete: {
    backgroundColor: COLORS.success,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncIndicator: {
    position: 'absolute',
    top: SPACING.small,
    right: SPACING.small,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 1000,
  },
  resetContainer: {
    marginTop: SPACING.xxlarge,
  },
});

export default SixSecondKissScreen;
