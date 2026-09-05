import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SquishyButton } from '../../components/ui';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Typography, GlassCard, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const { width } = Dimensions.get('window');

type CloudWord = { text: string; weight: number; left: number; top: number; size: number };

export default function GratitudeCloud({ route, navigation }: any) {
  const navigationHook = useNavigation();
  
  // Get game info from registry
  const gameInfo = getGameByScreen('GratitudeCloud');
  const GAME_ID = gameInfo?.id || 'gratitude-cloud';
  const CATEGORY_ID = gameInfo?.categoryId || 'emotional-connection';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  const [input, setInput] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [cloud, setCloud] = useState<CloudWord[]>([]);
  const [partnerWords, setPartnerWords] = useState<string[]>([]);

  async function updateWords(newWords: string[]) {
    const score = newWords.length * 10;
    await updateScore(score, [{
      words: newWords,
      wordCount: newWords.length,
      points: score
    }]);
  }

  function addWord(t: string) {
    const cleaned = t.trim().toLowerCase();
    if (!cleaned) return;

    if (!words.includes(cleaned)) {
        const newWords = [...words, cleaned];
        setWords(newWords);
        updateWords(newWords);
    }

    setInput('');
  }

  useEffect(() => {
    const items = words.map((w) => {
      const weight = Math.min(3, Math.max(1, w.length >= 8 ? 3 : w.length >= 5 ? 2 : 1));
      const size = TYPOGRAPHY.fontSize.bodyLarge + weight * 4;
      return {
        text: w,
        weight,
        left: Math.random() * (width - 100),
        top: Math.random() * 160,
        size
      };
    });
    setCloud(items);
  }, [words]);

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.05, { duration: ANIMATIONS.duration.slow * 2.4, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const cloudStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  const finishGame = async () => {
    const score = words.length * 10;
    await completeGame(score, [{
      completed: true,
      wordCount: words.length,
      partnerWordCount: partnerWords.length,
      totalWords: words.length + partnerWords.length
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
      <ScreenLayout showMarcie={true} marcieQuote="Loading gratitude cloud...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Float your gratitude into the cloud.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <GlassCard>
            <View style={styles.gradientContainer}>
              <Typography variant="body" style={styles.inputLabel}>
                Type positive adjectives about your partner
              </Typography>
              <TextInput
                placeholder="Loving, brave, hilarious..."
                style={styles.input}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => addWord(input)}
                placeholderTextColor={COLORS.textHint}
              />
            </View>
          </GlassCard>

          <View style={styles.cloudContainer}>
            <Animated.View style={[styles.cloud, cloudStyle]}>
              {cloud.map((c, i) => (
                <Typography
                  key={`me_${i}`}
                  variant="body"
                  style={[styles.word, styles.myWord, {
                    position: 'absolute',
                    left: c.left,
                    top: c.top,
                    fontSize: c.size,
                  }]}
                >
                  {c.text}
                </Typography>
              ))}
              {partnerWords.slice(0, 20).map((w, i) => (
                <Typography
                  key={`partner_${i}`}
                  variant="body"
                  style={[styles.word, styles.partnerWord, {
                    position: 'absolute',
                    left: Math.random() * (width - 100),
                    top: Math.random() * 160,
                    fontSize: TYPOGRAPHY.fontSize.bodyLarge + 2,
                  }]}
                >
                  {w}
                </Typography>
              ))}
            </Animated.View>
          </View>
        </ScrollView>
        
        <View style={styles.finishButtonContainer}>
          <SquishyButton onPress={finishGame} variant="primary">
            <Typography variant="button">Finish Cloud</Typography>
          </SquishyButton>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xlarge,
  },
  gradientContainer: {
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.card,
  },
  inputLabel: {
    marginBottom: SPACING.medium,
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.input,
    padding: SPACING.medium,
    color: COLORS.textPrimary,
    marginTop: SPACING.medium,
    minHeight: 48,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge
  },
  cloudContainer: {
    flex: 1,
    marginTop: SPACING.large,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.medium,
  },
  cloud: {
    height: 220,
    width: '100%',
  },
  word: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myWord: {
    color: COLORS.brightYellow,
    fontWeight: 'bold',
  },
  partnerWord: {
    color: COLORS.softViolet,
    fontWeight: '600',
  },
  finishButtonContainer: {
    padding: SPACING.medium,
  },
});
