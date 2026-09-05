import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

type Question = { text: string; risk: 'high' | 'medium' | 'low' };

const QUESTIONS: Question[] = [
    { text: 'Do they know your phone passcode?', risk: 'high' },
    { text: 'Do they know your email password?', risk: 'medium' },
    { text: 'Have you deleted messages in the last week?', risk: 'high' },
    { text: 'Do you have a secret bank account?', risk: 'high' },
    { text: 'Is your location sharing always on?', risk: 'medium' },
    { text: 'Do you have hidden apps?', risk: 'high' },
    { text: 'Do you clear your browser history?', risk: 'medium' },
];

export default function SecrecyAudit({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'secrecy-audit' };
  
  // Get game info from registry
  const gameInfo = getGameByScreen('SecrecyAudit');
  const GAME_ID = gameInfo?.id || 'secrecy-audit';
  const CATEGORY_ID = gameInfo?.categoryId || 'healing-hospital';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ q: string; a: boolean }[]>([]);

  async function answer(val: boolean) {
    HapticFeedbackSystem.selection();
    const newAnswers = [...answers, { q: QUESTIONS[index].text, a: val }];
    setAnswers(newAnswers);
    
    const secretCount = newAnswers.filter(x => !x.a).length;
    
    // Calculate intermediate transparency score
    let tempScore = 0;
    newAnswers.forEach((ans, i) => {
        const isPositiveQ = [0, 1, 4].includes(i);
        if (isPositiveQ && ans.a) tempScore += 1;
        if (!isPositiveQ && !ans.a) tempScore += 1;
    });
    
    // Save progress
    await updateScore(tempScore * 10, [{
      answers: newAnswers,
      currentQuestion: index,
      lastAnswer: val
    }]);
    
    if (index === 6 && secretCount > 3) {
        speakMarcie("You have multiple passwords your partner doesn't know. What are you hiding, a secret life or just bad habits?");
    }

    if (index < QUESTIONS.length - 1) {
        setIndex(index + 1);
    }
  }

  const transparencyScore = useMemo(() => {
      let score = 0;
      answers.forEach((ans, i) => {
          const isPositiveQ = [0, 1, 4].includes(i);
          if (isPositiveQ && ans.a) score += 1;
          if (!isPositiveQ && !ans.a) score += 1;
      });
      return Math.round((score / QUESTIONS.length) * 100);
  }, [answers]);

  const baseState = useMemo(() => ({
    id: GAME_ID,
    title: 'Secrecy Audit',
    description: 'Rapid-fire questions on transparency',
    category: 'healing' as const,
    difficulty: 'medium' as const,
    xpReward: 50,
    currentStep: index,
    totalTime: 45,
    playerData: { vulnerabilityScore: transparencyScore, honestyScore: transparencyScore, completionTime: index * 2, partnerSync: 0 },
  }), [GAME_ID, index, transparencyScore]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const bonus = Math.min(30, Math.round(transparencyScore * 0.3));
    const finalScore = Math.min(100, transparencyScore);
    
    await completeGame(finalScore, [{
      answers,
      transparencyScore,
      completed: true,
      xp: Math.min(80, 50 + bonus)
    }]);
    
    navigation.goBack();
  }

  const inputArea = (
    <View>
      <GlassCard>
        {isSyncing && (
          <View style={{backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 8, marginVertical: SPACING.small, alignSelf: 'center'}}>
            <Typography variant="caption" style={{color: COLORS.success}}>💾 Saving...</Typography>
          </View>
        )}

        {index < QUESTIONS.length ? (
            <>
                <Typography variant="h2" center style={styles.questionText}>{QUESTIONS[index].text}</Typography>
                <View style={styles.buttonRow}>
                    <SquishyButton onPress={() => answer(true)} style={styles.yesBtn}>
                        <Typography variant="h2">YES</Typography>
                    </SquishyButton>
                    <SquishyButton onPress={() => answer(false)} style={styles.noBtn}>
                        <Typography variant="h2">NO</Typography>
                    </SquishyButton>
                </View>
                <Typography variant="caption" center style={styles.progressText}>Question {index + 1} / {QUESTIONS.length}</Typography>
            </>
        ) : (
            <View style={styles.completeContainer}>
                <Typography variant="h2">Audit Complete</Typography>
                <Typography variant="body" style={styles.scoreText}>Transparency Score: {transparencyScore}%</Typography>
            </View>
        )}
      </GlassCard>
    </View>
  );
  
  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="body">Loading audit...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} sessionId={session?.id} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  btn: { 
    paddingHorizontal: SPACING.xlarge, 
    paddingVertical: SPACING.large, 
    borderRadius: BORDER_RADIUS.xlarge, 
    minWidth: 100, 
    alignItems: 'center' 
  },
  questionText: {
    marginBottom: SPACING.xlarge
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.large,
    justifyContent: 'center'
  },
  yesBtn: {
    paddingHorizontal: SPACING.xlarge,
    paddingVertical: SPACING.large,
    borderRadius: BORDER_RADIUS.xlarge,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: COLORS.success
  },
  noBtn: {
    paddingHorizontal: SPACING.xlarge,
    paddingVertical: SPACING.large,
    borderRadius: BORDER_RADIUS.xlarge,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: COLORS.error
  },
  progressText: {
    marginTop: SPACING.regular
  },
  completeContainer: {
    alignItems: 'center'
  },
  scoreText: {
    marginTop: SPACING.regular
  }
});
