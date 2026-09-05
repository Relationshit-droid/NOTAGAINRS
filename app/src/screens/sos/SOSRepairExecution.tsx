import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, ANIMATIONS } from '../../theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type SOSRepairExecutionProps = {
  navigation: any;
  route: any;
};

interface Repair {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  icon: string;
  color: string;
}

export default function SOSRepairExecution({ navigation, route }: SOSRepairExecutionProps) {
  const { sessionId, coupleId, repair } = route.params || {};
  const [timeRemaining, setTimeRemaining] = useState(repair?.duration * 60 || 300);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showMarcie, setShowMarcie] = useState(true);
  const [marcieQuote, setMarcieQuote] = useState("Do the work. No shortcuts. Timer starts when you're ready.");

  const progressAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Pulse animation for timer
    pulseAnim.value = withRepeat(
      withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const startTimer = () => {
    if (isRunning || isComplete) return;
    
    setIsRunning(true);
    setIsPaused(false);
    setMarcieQuote("Good. Now stay present. No phones. No escaping.");
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Animate progress
    const totalSeconds = repair?.duration * 60 || 300;
    progressAnim.value = withTiming(1, { duration: totalSeconds * 1000, easing: Easing.linear });
  };

  const pauseTimer = () => {
    if (!isRunning) return;
    setIsRunning(false);
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setMarcieQuote("Paused. But the tension's still there. Resume when ready.");
  };

  const resumeTimer = () => {
    if (!isPaused) return;
    setIsRunning(true);
    setIsPaused(false);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(repair?.duration * 60 || 300);
    setIsComplete(false);
    progressAnim.value = withTiming(0, { duration: 0 });
    setMarcieQuote("Do the work. No shortcuts. Timer starts when you're ready.");
  };

  const timerComplete = () => {
    setIsRunning(false);
    setIsComplete(true);
    Vibration.vibrate([200, 100, 200, 100, 200]);
    setMarcieQuote("Time's up. How do you feel? Different? Good. Report back.");
    
    // Auto-navigate to questionnaire after 3 seconds
    setTimeout(() => {
      navigation.navigate('SOSPostRepairQuestionnaire', { sessionId, coupleId, repairId: repair?.id });
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = repair?.duration 
    ? 1 - (timeRemaining / (repair.duration * 60))
    : 0;

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress * 100}%`,
  }));

  const animatedTimerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isRunning ? pulseAnim.value : 1 }],
  }));

  if (!repair) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <SafeAreaView style={styles.loadingContainer}>
          <Typography variant="body" color={COLORS.textSecondary}>Loading repair...</Typography>
        </SafeAreaView>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout 
      showHeader={false} 
      scrollable={false}
      showMarcie={showMarcie}
      marcieQuote={marcieQuote}
    >
      <SafeAreaView style={styles.container}>
        {/* Repair Header */}
        <View style={styles.header}>
          <View style={[styles.repairBadge, { backgroundColor: `${repair.color}20` }]}>
            <Ionicons name={repair.icon} size={24} color={repair.color} />
          </View>
          <Typography variant="h2" style={styles.repairTitle}>{repair.title}</Typography>
          <Typography variant="caption" style={styles.repairDescription}>{repair.description}</Typography>
        </View>

        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          <Animated.View style={[styles.timerCircle, animatedTimerStyle]}>
            <View style={styles.timerTrack} />
            <Animated.View style={[styles.timerProgress, animatedProgressStyle]} />
            <View style={styles.timerContent}>
              <Typography variant="h1" style={styles.timerText} fontFamily={TYPOGRAPHY.fontFamily.medium}>
                {formatTime(timeRemaining)}
              </Typography>
              <Typography variant="label" style={states.timerLabel}>
                {isComplete ? 'COMPLETE' : isRunning ? 'IN PROGRESS' : isPaused ? 'PAUSED' : 'READY'}
              </Typography>
            </View>
          </Animated.View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isRunning && !isComplete && !isPaused && (
            <SquishyButton 
              onPress={startTimer}
              variant="primary"
              size="large"
              style={styles.primaryControl}
            >
              <Typography variant="button">START REPAIR</Typography>
            </SquishyButton>
          )}

          {isRunning && (
            <View style={styles.controlRow}>
              <SquishyButton 
                onPress={pauseTimer}
                variant="secondary"
                size="large"
                style={styles.secondaryControl}
              >
                <Typography variant="button">PAUSE</Typography>
              </SquishyButton>
              <SquishyButton 
                onPress={resetTimer}
                variant="ghost"
                size="large"
                style={styles.ghostControl}
              >
                <Typography variant="button">RESET</Typography>
              </SquishyButton>
            </View>
          )}

          {isPaused && (
            <View style={styles.controlRow}>
              <SquishyButton 
                onPress={resumeTimer}
                variant="primary"
                size="large"
                style={styles.primaryControl}
              >
                <Typography variant="button">RESUME</Typography>
              </SquishyButton>
              <SquishyButton 
                onPress={resetTimer}
                variant="ghost"
                size="large"
                style={styles.ghostControl}
              >
                <Typography variant="button">RESET</Typography>
              </SquishyButton>
            </View>
          )}

          {isComplete && (
            <SquishyButton 
              onPress={() => navigation.navigate('SOSPostRepairQuestionnaire', { sessionId, coupleId, repairId: repair.id })}
              variant="primary"
              size="large"
              style={styles.primaryControl}
            >
              <Typography variant="button">CONTINUE TO CHECK-IN</Typography>
            </SquishyButton>
          )}
        </View>

        {/* Repair Guidance */}
        <GlassCard style={styles.guidanceCard} padding="large">
          <Typography variant="label" style={styles.guidanceTitle}>REPAIR GUIDANCE</Typography>
          <Typography variant="body" style={styles.guidanceText}>
            {repair.description}
          </Typography>
          
          <View style={styles.guidanceTips}>
            <View style={styles.tip}>
              <Ionicons name="checkmark" size={16} color={COLORS.success} />
              <Typography variant="caption">Stay present. No phones.</Typography>
            </View>
            <View style={styles.tip}>
              <Ionicons name="checkmark" size={16} color={COLORS.success} />
              <Typography variant="caption">Eye contact if possible.</Typography>
            </View>
            <View style={styles.tip}>
              <Ionicons name="checkmark" size={16} color={COLORS.success} />
              <Typography variant="caption">Speak from "I feel," not "You did."</Typography>
            </View>
            <View style={styles.tip}>
              <Ionicons name="checkmark" size={16} color={COLORS.success} />
              <Typography variant="caption">If it gets heated, breathe. Don't quit.</Typography>
            </View>
          </View>
        </GlassCard>

        {/* Emergency Exit */}
        {!isComplete && (
          <SquishyButton 
            onPress={() => Alert.alert(
              'Abandon Repair?',
              'Leaving now means the conflict stays unresolved. Are you sure?',
              [
                { text: 'Stay', style: 'cancel' },
                { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
              ]
            )}
            variant="ghost"
            size="small"
            style={styles.exitButton}
          >
            <Typography variant="button" style={styles.exitText}>ABANDON REPAIR</Typography>
          </SquishyButton>
        )}
      </SafeAreaView>
    </ScreenLayout>
  );
}

const states = {
  timerLabel: {
    fontSize: 12,
    letterSpacing: 1,
    opacity: 0.7,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xlarge,
    paddingBottom: SPACING.large,
    paddingHorizontal: SPACING.screenPadding,
  },
  repairBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  repairTitle: {
    textAlign: 'center',
    marginBottom: SPACING.tiny,
  },
  repairDescription: {
    textAlign: 'center',
    opacity: 0.6,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xxlarge,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    position: 'relative',
  },
  timerTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 140,
    borderWidth: 8,
    borderColor: COLORS.borderSubtle,
  },
  timerProgress: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 132,
    borderWidth: 8,
    borderColor: COLORS.vibrantPink,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  controlsContainer: {
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xlarge,
  },
  controlRow: {
    flexDirection: 'row',
    gap: SPACING.regular,
  },
  primaryControl: {
    flex: 1,
    minWidth: '100%',
  },
  secondaryControl: {
    flex: 1,
  },
  ghostControl: {
    flex: 1,
  },
  guidanceCard: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xlarge,
  },
  guidanceTitle: {
    textAlign: 'center',
    marginBottom: SPACING.regular,
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
  guidanceText: {
    textAlign: 'center',
    marginBottom: SPACING.large,
    lineHeight: 24,
  },
  guidanceTips: {
    gap: SPACING.small,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  exitButton: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xxlarge,
  },
  exitText: {
    color: COLORS.error,
  },
});