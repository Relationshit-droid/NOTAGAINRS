import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, GRADIENTS, TYPOGRAPHY } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const DEFENSIVENESS_SCENARIOS = [
  {
    id: '1',
    scenario: "Your partner brings up a concern about your communication habits",
    responses: [
      { id: 'a', text: "That's not fair, you do that too!", defensive: true, points: -10 },
      { id: 'b', text: "I see your point. Can you tell me more?", defensive: false, points: 20 },
      { id: 'c', text: "You're probably right. Let me explain though...", defensive: true, points: 5 },
      { id: 'd', text: "I hear you. How can we work on this together?", defensive: false, points: 25 }
    ]
  },
  {
    id: '2',
    scenario: "Your partner shares that they feel unheard during arguments",
    responses: [
      { id: 'a', text: "That's ridiculous, I always listen to you!", defensive: true, points: -15 },
      { id: 'b', text: "I'm sorry you feel that way. What specifically happened?", defensive: false, points: 20 },
      { id: 'c', text: "Well maybe if you weren't so sensitive...", defensive: true, points: -10 },
      { id: 'd', text: "I want to do better. Can we talk about what I can change?", defensive: false, points: 25 }
    ]
  },
  {
    id: '3',
    scenario: "Your partner points out a pattern of canceling plans",
    responses: [
      { id: 'a', text: "I can't help it when work gets busy!", defensive: true, points: -5 },
      { id: 'b', text: "You're right, I need to do better with commitments", defensive: false, points: 20 },
      { id: 'c', text: "You cancel things too sometimes!", defensive: true, points: -10 },
      { id: 'd', text: "I understand your frustration. How can I rebuild trust?", defensive: false, points: 25 }
    ]
  }
];

export default function DefensivenessDetox({ route, navigation }: any) {
  const { gameId: routeGameId } = route.params || {};
  
  // Get game info from registry
  const gameInfo = getGameByScreen('DefensivenessDetox');
  const GAME_ID = gameInfo?.id || 'defensiveness-detox';
  const CATEGORY_ID = gameInfo?.categoryId || 'conflict-resolution';
  
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
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [partnerResponse, setPartnerResponse] = useState<string | null>(null);

  const selectResponse = async (responseId: string) => {
    const currentScenario = DEFENSIVENESS_SCENARIOS[currentScenarioIndex];
    const response = currentScenario.responses.find(r => r.id === responseId);
    
    if (response) {
      setSelectedResponse(responseId);
      const newScore = score + response.points;
      setScore(newScore);
      
      // Provide feedback based on response
      if (response.defensive) {
        setFeedback("This response is defensive. It deflects responsibility or counters with criticism.");
      } else {
        setFeedback("This response is constructive. It takes ownership and invites further discussion.");
      }
      
      // Record response
      const newResponses = { ...responses, [currentScenario.id]: responseId };
      setResponses(newResponses);
      
      // Update in backend
      await updateScore(newScore, [{
        scenarioId: currentScenario.id,
        responseId: response.id,
        response: response.text,
        defensive: response.defensive,
        points: response.points
      }]);
    }
  };

  const nextScenario = async () => {
    if (currentScenarioIndex < DEFENSIVENESS_SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedResponse(null);
      setFeedback(null);
      setPartnerResponse(null);
    } else {
      await finishGame();
    }
  };
  
  const finishGame = async () => {
    setGameCompleted(true);
    
    // Calculate achievements
    const achievements: string[] = [];
    if (score > 50) achievements.push('Defensiveness Detox Master');
    if (score > 30) achievements.push('Constructive Communicator');
    
    await completeGame(score, Object.entries(responses).map(([id, responseId]) => ({
      scenarioId: id,
      responseId
    })), achievements);
    
    Alert.alert(
      'Defensiveness Detox Complete! 🛡️',
      `Final Score: ${score}\nAchievements: ${achievements.join(', ') || 'None'}`,
      [
        {
          text: 'View Results',
          onPress: () => navigation.navigate('GameResults', {
            score: score,
            gameId: GAME_ID,
            sessionId: session?.id
          })
        },
        { text: 'Exit', onPress: () => navigation.goBack() }
      ]
    );
  };

  const currentScenario = DEFENSIVENESS_SCENARIOS[currentScenarioIndex];

  // Loading state
  if (sessionLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading your detox session...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting Defensiveness Detox...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const inputArea = (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {!gameCompleted ? (
        <GlassCard padding="large">
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.headerContainer}>
              <Typography variant="h2" style={styles.title}>
                Defensiveness Detox
              </Typography>
              <Typography variant="caption" style={styles.progress}>
                {currentScenarioIndex + 1}/{DEFENSIVENESS_SCENARIOS.length}
              </Typography>
            </View>
            
            <Typography variant="body" style={styles.scenarioText}>
              {currentScenario.scenario}
            </Typography>

            <View style={styles.responsesContainer}>
              {currentScenario.responses.map((response) => (
                <SquishyButton
                  key={response.id}
                  style={[
                    styles.responseOption,
                    selectedResponse === response.id && styles.selectedResponse
                  ]}
                  onPress={() => selectResponse(response.id)}
                  disabled={selectedResponse !== null}
                >
                  <LinearGradient
                    colors={
                      selectedResponse === response.id
                        ? GRADIENTS.primary.colors
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.responseGradient}
                  >
                    <Typography
                      variant="body"
                      style={[
                        styles.responseText,
                        selectedResponse === response.id && styles.responseTextSelected
                      ]}
                    >
                      {response.text}
                    </Typography>
                  </LinearGradient>
                </SquishyButton>
              ))}
            </View>

            {feedback && (
              <View style={styles.feedbackContainer}>
                <Typography 
                  variant="sass" 
                  style={[
                  styles.feedbackText,
                  selectedResponse && 
                    currentScenario.responses.find(r => r.id === selectedResponse)?.defensive 
                      ? styles.feedbackTextWarning 
                      : styles.feedbackTextSuccess
                ]}
                >
                  {feedback}
                </Typography>
              </View>
            )}

            <SquishyButton 
              style={styles.nextButton} 
              onPress={nextScenario}
              disabled={selectedResponse === null}
            >
              <LinearGradient
                colors={[
                  selectedResponse ? GRADIENTS.primary.colors[0] : COLORS.textHint,
                  selectedResponse ? GRADIENTS.primary.colors[1] : COLORS.textHint
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextGradient}
              >
                <Typography 
                  variant="h3" 
                  style={[
                    styles.nextButtonText,
                    selectedResponse ? styles.nextButtonTextActive : styles.nextButtonTextDisabled
                  ]}
                >
                  {currentScenarioIndex === DEFENSIVENESS_SCENARIOS.length - 1 ? 'Finish Game' : 'Next Scenario'}
                </Typography>
              </LinearGradient>
            </SquishyButton>
          </LinearGradient>
        </GlassCard>
      ) : (
        <GlassCard padding="large">
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Typography variant="h1" center style={styles.completeTitle}>
              Game Complete!
            </Typography>
            <Typography variant="body" center style={styles.completeScore}>
              Your final score: {score}
            </Typography>
            <Typography variant="body" center style={styles.completeScore}>
              {score > 50 
                ? "Great job recognizing defensive patterns and choosing constructive responses!" 
                : "Remember, recognizing defensiveness is the first step to changing the pattern."}
            </Typography>
            <SquishyButton 
              style={styles.finishButton} 
              onPress={() => navigation.goBack()}
            >
              <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={styles.nextGradient}
              >
                <Typography 
                  variant="h3" 
                  center
                  style={styles.returnButtonText}
                >
                  Return to Menu
                </Typography>
              </LinearGradient>
            </SquishyButton>
          </LinearGradient>
        </GlassCard>
      )}

      {partnerResponse && (
        <GlassCard style={styles.partnerCard} padding="medium">
          <Typography 
            variant="sass" 
            style={styles.partnerChoiceLabel}
          >
            Partner's Choice:
          </Typography>
          <Typography 
            variant="body" 
            style={styles.partnerChoiceText}
          >
            {partnerResponse}
          </Typography>
        </GlassCard>
      )}
    </ScrollView>
  );

  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Defense is the first act of war. Let's make peace.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        {inputArea}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xlarge,
  },
  responseText: {
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  responseTextSelected: {
    color: COLORS.backgroundPrimary,
  },
  feedbackText: {
    lineHeight: 20,
  },
  feedbackTextWarning: {
    color: COLORS.warning,
  },
  feedbackTextSuccess: {
    color: COLORS.success,
  },
  nextButtonText: {
    textAlign: 'center',
  },
  nextButtonTextActive: {
    color: COLORS.backgroundPrimary,
  },
  nextButtonTextDisabled: {
    color: COLORS.textHint,
  },
  completeTitle: {
    color: COLORS.success,
    marginBottom: SPACING.regular,
  },
  completeScore: {
    marginBottom: SPACING.xlarge,
  },
  partnerChoiceLabel: {
    color: COLORS.aquaTeal,
    marginBottom: SPACING.small,
  },
  partnerChoiceText: {
    color: COLORS.textSecondary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  gradientContainer: {
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.regular,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.headerLarge
  },
  progress: {
    color: COLORS.textHint
  },
  scenarioText: {
    marginBottom: SPACING.xlarge,
    color: COLORS.textPrimary,
    lineHeight: 24
  },
  responsesContainer: {
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  responseOption: {
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
  },
  selectedResponse: {
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  responseGradient: {
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
  },
  feedbackContainer: {
    padding: SPACING.regular,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BORDER_RADIUS.large,
    marginBottom: SPACING.xlarge,
  },
  nextButton: {
    borderRadius: BORDER_RADIUS.button,
    overflow: 'hidden',
  },
  nextGradient: {
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.button,
  },
  finishButton: {
    borderRadius: BORDER_RADIUS.button,
    overflow: 'hidden',
  },
  partnerCard: {
    marginTop: SPACING.regular,
  },
  returnButtonText: {
    color: COLORS.backgroundPrimary,
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
});
