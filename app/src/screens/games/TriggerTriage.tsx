import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { ScreenLayout } from '../../components/ui';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import Slider from '@react-native-community/slider';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

export default function TriggerTriage({ route, navigation }: any) {
  const navigationHook = useAppNavigation();
  
  // Get game info from registry
  const gameInfo = getGameByScreen('TriggerTriage');
  const GAME_ID = gameInfo?.id || 'trigger-triage';
  const CATEGORY_ID = gameInfo?.categoryId || 'healing-hospital';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  const [painLevel, setPainLevel] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [script, setScript] = useState('');

  useEffect(() => {
    if (painLevel >= 8 && script.length < 10) {
      // Marcie comment would go here
    }
  }, [painLevel, script]);

  const handleComplete = async () => {
    const bonus = Math.min(35, script.length > 50 ? 35 : script.length * 0.5);
    const score = Math.round((painLevel * 5) + (trigger.length * 2) + (script.length * 0.5) + bonus);
    
    await completeGame(score, [{
      painLevel,
      trigger,
      script,
      bonus,
      completed: true
    }]);
    
    navigationHook.navigate('GameResults', {
      score,
      gameId: GAME_ID,
      sessionId: session?.id
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading trigger triage...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting assessment...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Name the trigger. Rate the pain. Write the script.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        <GlassCard>
          <Typography variant="h1" center style={styles.gameTitle}>
            The Love Arcade
          </Typography>
          <Typography variant="h2" center style={styles.subtitle}>
            +100 Games to Deepen Connection
          </Typography>

          <Typography variant="body">Rate your current pain/trigger level (1-10)</Typography>
          <View style={styles.sliderContainer}>
            <Typography
              variant="h3"
              style={[styles.painLevelText, { color: painLevel > 7 ? COLORS.error : COLORS.success }]}
            >
              {painLevel}
            </Typography>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={painLevel}
              onValueChange={setPainLevel}
              minimumTrackTintColor={painLevel > 7 ? COLORS.error : COLORS.success}
              maximumTrackTintColor={COLORS.textPrimary}
            />
          </View>
          <TextInput
            placeholder="What triggered this?"
            placeholderTextColor={COLORS.textHint}
            style={styles.input}
            value={trigger}
            onChangeText={setTrigger}
          />
          <Typography variant="body" style={styles.deescalationLabel}>
            De-escalation Script / Coping Strategy:
          </Typography>
          <TextInput
            placeholder="I feel triggered because... I need..."
            placeholderTextColor={COLORS.textHint}
            style={[styles.input, styles.multilineInput]}
            multiline
            value={script}
            onChangeText={setScript}
          />
          {painLevel > 6 && (
            <View style={styles.suggestionContainer}>
              <Typography variant="keyword">
                Suggested: "I am feeling a level {painLevel} trigger. Can we pause for 20 mins?"
              </Typography>
            </View>
          )}
          
          <View style={styles.completeButtonContainer}>
            <SquishyButton onPress={handleComplete} variant="primary">
              <Typography variant="button">Complete Assessment</Typography>
            </SquishyButton>
          </View>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.medium,
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
  gameTitle: {
    marginBottom: SPACING.small
  },
  subtitle: {
    marginBottom: SPACING.xlarge
  },
  sliderContainer: {
    alignItems: 'center',
    marginVertical: SPACING.regular
  },
  painLevelText: {
    // color is dynamic based on painLevel
  },
  slider: {
    width: '100%',
    height: 40,
  },
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.input,
    padding: SPACING.regular,
    color: COLORS.textPrimary,
    marginTop: SPACING.small
  },
  deescalationLabel: {
    marginTop: SPACING.regular,
  },
  multilineInput: {
    height: 80,
  },
  suggestionContainer: {
    marginTop: SPACING.regular,
  },
  completeButtonContainer: {
    marginTop: SPACING.xlarge,
  },
});
