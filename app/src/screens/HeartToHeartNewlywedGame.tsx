import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../lib/game-store';
import { gamesApi, marcieApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const { width: screenWidth } = Dimensions.get('window');

interface GameState {
  currentQuestion: string;
  partnerAAnswer: string;
  partnerBAnswer: string;
  revealedAnswers: { A: boolean; B: boolean };
  gamePhase: 'intro' | 'question' | 'answer' | 'reveal' | 'results';
  sessionId: string;
  isLoading: boolean;
  score: number;
  step: number;
  totalSteps: number;
  marcieFeedback: string;
  marcieAnimation: string;
}

const newlywedQuestions = [
  "What is our top family value?",
  "What moment made you feel most connected to me this week?",
  "What is your biggest fear about our future together?",
  "What do you need more of from me emotionally?",
  "What memory do you revisit when you need to feel safe?",
  "What part of yourself do you hide to protect me?",
  "What truth about us have you been afraid to say out loud?",
  "What do you want our legacy to be?"
];

const HeartToHeartNewlywedGameScreen = () => {
  const { user } = useAuth();
  const { updateGameProgress } = useGameStore();
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: '',
    partnerAAnswer: '',
    partnerBAnswer: '',
    revealedAnswers: { A: false, B: false },
    gamePhase: 'intro',
    sessionId: '',
    isLoading: false,
    score: 2450,
    step: 6,
    totalSteps: 8,
    marcieFeedback: '',
    marcieAnimation: 'marcie-idle'
  });

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to play this game.');
      return;
    }

    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Create game session with backend
      const token = await user.getIdToken();
      const session = await gamesApi.createSession(
        user.uid,
        'heart-to-heart-newlywed',
        'emotional-connection',
        token
      );

      setGameState(prev => ({
        ...prev,
        sessionId: session.id,
        gamePhase: 'intro',
        isLoading: false
      }));

      // Update global game state
      updateGameProgress('heart-to-heart-newlywed', 0);

    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Game Error', 'Failed to start the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startGame = () => {
    const randomQuestion = newlywedQuestions[Math.floor(Math.random() * newlywedQuestions.length)];
    setGameState(prev => ({
      ...prev,
      currentQuestion: randomQuestion,
      gamePhase: 'question'
    }));
  };

  const handleAnswerSubmit = async (partner: 'A' | 'B', answer: string) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to play this game.');
      return;
    }
    try {
      setGameState(prev => ({
        ...prev,
        isLoading: true,
        [`partner${partner}Answer`]: answer
      }));

      // Get Dr. Marcie's feedback
      const context = `Heart to Heart Newlywed game - Partner ${partner} answer`;
      const chatToken = await user.getIdToken();
      const marcieResponse = await marcieApi.chat(
        user.uid,
        context,
        answer,
        1, // Tough Love Rookie level for gentle feedback
        chatToken
      );

      setGameState(prev => ({
        ...prev,
        marcieFeedback: marcieResponse.response,
        marcieAnimation: marcieResponse.animation,
        gamePhase: 'reveal',
        isLoading: false
      }));

      // Update game progress
      const progress = (gameState.step / gameState.totalSteps) * 100;
      updateGameProgress('heart-to-heart-newlywed', progress);

    } catch (error) {
      console.error('Failed to process answer:', error);
      Alert.alert('Processing Error', 'Failed to process your answer. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const revealAnswer = (partner: 'A' | 'B') => {
    setGameState(prev => ({
      ...prev,
      revealedAnswers: {
        ...prev.revealedAnswers,
        [partner]: true
      }
    }));

    // Calculate score based on answer similarity
    if (gameState.revealedAnswers.A && gameState.revealedAnswers.B) {
      calculateScore();
    }
  };

  const calculateScore = () => {
    // Simple semantic similarity calculation
    const answerA = gameState.partnerAAnswer.toLowerCase();
    const answerB = gameState.partnerBAnswer.toLowerCase();
    
    // Check for semantic similarity (in real app, this would use AI)
    const semanticKeywords: Record<string, string[]> = {
      'integrity': ['honesty', 'truth', 'authenticity', 'genuine'],
      'family': ['children', 'home', 'together', 'unity'],
      'love': ['care', 'affection', 'connection', 'bond'],
      'communication': ['talk', 'listen', 'understand', 'share'],
      'trust': ['faith', 'confidence', 'reliance', 'belief']
    };

    let similarityScore = 0;
    Object.entries(semanticKeywords).forEach(([keyword, synonyms]) => {
      const aHasKeyword = answerA.includes(keyword) || synonyms.some(syn => answerA.includes(syn));
      const bHasKeyword = answerB.includes(keyword) || synonyms.some(syn => answerB.includes(syn));
      
      if (aHasKeyword && bHasKeyword) {
        similarityScore += 100;
      }
    });

    // Update score based on similarity
    const points = Math.min(500, similarityScore);
    setGameState(prev => ({
      ...prev,
      score: prev.score + points
    }));
  };

  const nextQuestion = () => {
    if (gameState.step < gameState.totalSteps) {
      setGameState(prev => ({
        ...prev,
        step: prev.step + 1,
        partnerAAnswer: '',
        partnerBAnswer: '',
        revealedAnswers: { A: false, B: false },
        gamePhase: 'question'
      }));
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to play this game.');
      return;
    }
    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Update game session with final results
      // updateSession takes (sessionId, data, token).
      const updateToken = await user.getIdToken();
      await gamesApi.updateSession(
        gameState.sessionId,
        {
          score: gameState.score,
          completed: true,
          responses: [
            {
              question: gameState.currentQuestion,
              partnerA_answer: gameState.partnerAAnswer,
              partnerB_answer: gameState.partnerBAnswer,
              timestamp: new Date().toISOString()
            }
          ]
        },
        updateToken
      );

      // Update global game state
      updateGameProgress('heart-to-heart-newlywed', 100);

      // navigation.navigate('GameResultsScreen', {
      //   gameId: 'heart-to-heart-newlywed',
      //   score: gameState.score,
      //   sessionId: gameState.sessionId
      // });

    } catch (error) {
      console.error('Failed to finish game:', error);
      Alert.alert('Game Error', 'Failed to complete the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Loading state
  if (gameState.isLoading) {
    return (
      <ScreenLayout showHeader={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryGradientStart} />
          <Typography variant="body" style={styles.loadingText}>
            Processing your answer...
          </Typography>
        </View>
      </ScreenLayout>
    );
  }

  // Intro phase
  if (gameState.gamePhase === 'intro') {
    return (
      <ScreenLayout showHeader={false}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.introContainer}>
            <Typography variant="h1" style={styles.gameTitle} center>
              HEART TO HEART
            </Typography>
            <Typography variant="title" style={styles.gameSubtitle} center>
              Newlywed Game - Deep Connection Edition
            </Typography>
            
            <GlassCard style={styles.introCard}>
              <Typography variant="body" style={styles.introText}>
                This isn't your typical newlywed game. We're diving deep into the 
                emotional core of your relationship. Be prepared for vulnerability, 
                honesty, and profound connection.
              </Typography>
              
              <Typography variant="caption" style={styles.introWarning}>
                💡 Tip: The goal isn't perfect alignment, but authentic understanding.
              </Typography>
            </GlassCard>

            <SquishyButton onPress={startGame}>
              <Typography variant="button">START CONNECTION</Typography>
            </SquishyButton>
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  // Question phase
  if (gameState.gamePhase === 'question') {
    return (
      <ScreenLayout showHeader={false}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.progressContainer}>
            <Typography variant="caption" style={styles.progressText}>
              STEP {gameState.step}/{gameState.totalSteps} - ALIGNMENT CHECK
            </Typography>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[COLORS.innerLineStart, COLORS.innerLineEnd]}
                style={[
                  styles.progressBarFill, 
                  { width: `${(gameState.step / gameState.totalSteps) * 100}%` }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          <Typography variant="h1" style={styles.mainQuestion} center>
            {gameState.currentQuestion}
          </Typography>

          <Typography variant="body" style={styles.instructionText} center>
            Both partners should answer this question independently. 
            Honesty creates the deepest connection.
          </Typography>

          <View style={styles.answerButtonsContainer}>
            <SquishyButton 
              onPress={() => setGameState(prev => ({ ...prev, gamePhase: 'answer' }))}
            >
              <Typography variant="button">ANSWER NOW</Typography>
            </SquishyButton>
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  // Answer phase
  if (gameState.gamePhase === 'answer') {
    return (
      <ScreenLayout showHeader={false}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.answerContainer}>
            <Typography variant="h1" style={styles.answerTitle} center>
              YOUR ANSWER
            </Typography>
            <Typography variant="title" style={styles.answerQuestion} center>
              {gameState.currentQuestion}
            </Typography>
            
            <View style={styles.answerInputContainer}>
              <TextInput
                style={styles.answerInput}
                placeholder="Type your honest answer..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={4}
                value={gameState.partnerAAnswer}
                onChangeText={(text) => setGameState(prev => ({ 
                  ...prev, 
                  partnerAAnswer: text 
                }))}
              />
            </View>

            <SquishyButton 
              onPress={() => handleAnswerSubmit('A', gameState.partnerAAnswer)}
              disabled={!gameState.partnerAAnswer.trim()}
            >
              <Typography variant="button">SUBMIT ANSWER</Typography>
            </SquishyButton>
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  // Reveal phase
  return (
    <ScreenLayout showHeader={false}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.revealContainer}>
          <Typography variant="h1" style={styles.revealTitle} center>
            ANSWER REVEAL
          </Typography>
          <Typography variant="title" style={styles.revealQuestion} center>
            {gameState.currentQuestion}
          </Typography>

          <View style={styles.gameBoard}>
            <PartnerAnswerCard 
              partnerName="PARTNER A" 
              answer={gameState.partnerAAnswer} 
              status={gameState.revealedAnswers.A ? 'revealed' : 'hidden'}
              onReveal={() => revealAnswer('A')}
            />
            
            <View style={styles.matchIndicator}>
              <Typography variant="h1">💖</Typography>
              <View style={styles.matchTextBox}>
                <Typography variant="caption" style={styles.matchText}>
                  SEMANTIC MATCH
                </Typography>
                <Typography variant="small" style={styles.matchComment}>
                  "{gameState.marcieFeedback}"
                </Typography>
              </View>
            </View>

            <PartnerAnswerCard 
              partnerName="PARTNER B" 
              answer={gameState.partnerBAnswer} 
              status={gameState.revealedAnswers.B ? 'revealed' : 'hidden'}
              onReveal={() => revealAnswer('B')}
            />
          </View>

          <GlassCard style={styles.scoreContainer}>
            <Typography variant="caption" style={styles.scoreText}>
              CURRENT SCORE
            </Typography>
            <Typography variant="h1" style={styles.scoreValue}>
              ${gameState.score}
            </Typography>
          </GlassCard>

          <SquishyButton onPress={nextQuestion}>
            <Typography variant="button">
              {gameState.step < gameState.totalSteps ? 'NEXT QUESTION' : 'FINISH GAME'}
            </Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

const PartnerAnswerCard = ({ 
  partnerName, 
  answer, 
  status, 
  onReveal 
}: { 
  partnerName: string; 
  answer: string; 
  status: 'hidden' | 'revealed'; 
  onReveal: () => void;
}) => (
  <View style={styles.cardContainer}>
    <SquishyButton
      variant="ghost"
      style={[
        styles.card, 
        status === 'hidden' && styles.cardHidden
      ]}
      onPress={onReveal}
      disabled={status === 'revealed'}
    >
      {status === 'hidden' ? (
        <Typography variant="h1" style={styles.cardHiddenText}>?</Typography>
      ) : (
        <Typography variant="body" style={styles.cardAnswer}>{answer}</Typography>
      )}
    </SquishyButton>
    <Typography variant="caption" style={styles.partnerName}>{partnerName}</Typography>
  </View>
);

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  
  // Intro styles
  introContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    alignItems: 'center',
  },
  gameTitle: {
    marginBottom: SPACING.xs,
  },
  gameSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  introCard: {
    marginBottom: SPACING.lg,
  },
  introText: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
  },
  introWarning: {
    color: COLORS.accentYellow,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  
  // Progress styles
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  progressText: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SPACING.xs,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  
  // Question styles
  mainQuestion: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  instructionText: {
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
  },
  answerButtonsContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  
  // Answer styles
  answerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  answerTitle: {
    marginBottom: SPACING.sm,
  },
  answerQuestion: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  answerInputContainer: {
    marginBottom: SPACING.xl,
  },
  answerInput: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.lg,
    color: COLORS.textPrimary,
    minHeight: SPACING.xxxlarge * 2.5,
    textAlignVertical: 'top',
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  
  // Reveal styles
  revealContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  revealTitle: {
    marginBottom: SPACING.sm,
  },
  revealQuestion: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  gameBoard: {
    marginBottom: SPACING.xl,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  matchTextBox: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  matchText: {
    color: COLORS.accentPink,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  matchComment: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.xs / 2,
  },
  scoreContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  scoreText: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    color: COLORS.accentYellow,
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
  },
  
  // Partner card styles
  cardContainer: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  card: {
    width: '80%',
    minHeight: SPACING.xxxlarge * 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHidden: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cardHiddenText: {
    color: COLORS.textSecondary,
  },
  cardAnswer: {
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  partnerName: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
});

export default HeartToHeartNewlywedGameScreen;
