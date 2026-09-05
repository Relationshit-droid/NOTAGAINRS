import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Dimensions,
  TextInput,
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
  partnerARevelation: string;
  partnerBRevelation: string;
  alignmentPercentage: number;
  gamePhase: 'intro' | 'question' | 'revelation' | 'analysis' | 'results';
  sessionId: string;
  isLoading: boolean;
  marcieFeedback: string;
  marcieAnimation: string;
}

const HeartOfTheMatterGameScreen = () => {
  const { user } = useAuth();
  const { updateGameProgress } = useGameStore();
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: '',
    partnerARevelation: '',
    partnerBRevelation: '',
    alignmentPercentage: 0,
    gamePhase: 'intro',
    sessionId: '',
    isLoading: false,
    marcieFeedback: '',
    marcieAnimation: 'marcie-idle'
  });

  // Game questions based on Design Bible specifications
  const gameQuestions = [
    "What was the deepest word-wound you've never fully confessed?",
    "What truth about yourself are you most afraid your partner already suspects?",
    "What part of your story have you been editing out to stay lovable?",
    "What do you secretly believe this fight is really about?",
    "What vulnerability feels too dangerous to speak aloud?"
  ];

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
      const session = await gamesApi.createSession(
        user.uid,
        'heart-of-the-matter',
        'emotional-connection'
      );

      setGameState(prev => ({
        ...prev,
        sessionId: session.id,
        gamePhase: 'intro',
        isLoading: false
      }));

      // Update global game state
      updateGameProgress('heart-of-the-matter', 0);

    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Game Error', 'Failed to start the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startGame = () => {
    const randomQuestion = gameQuestions[Math.floor(Math.random() * gameQuestions.length)];
    setGameState(prev => ({
      ...prev,
      currentQuestion: randomQuestion,
      gamePhase: 'question'
    }));
  };

  const handleRevelationSubmit = async (partner: 'A' | 'B', revelation: string) => {
    try {
      setGameState(prev => ({
        ...prev,
        isLoading: true,
        [`partner${partner}Revelation`]: revelation
      }));

      // Get Dr. Marcie's feedback
      const context = `Heart of the Matter game - Partner ${partner} revelation`;
      const marcieResponse = await marcieApi.chat(
        user.uid,
        context,
        revelation,
        2 // Reality Check Specialist level
      );

      setGameState(prev => ({
        ...prev,
        marcieFeedback: marcieResponse.response,
        marcieAnimation: marcieResponse.animation,
        gamePhase: 'analysis',
        isLoading: false
      }));

      // Update game progress
      updateGameProgress('heart-of-the-matter', 50);

    } catch (error) {
      console.error('Failed to process revelation:', error);
      Alert.alert('Processing Error', 'Failed to process your revelation. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const calculateAlignment = async () => {
    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Simple semantic analysis (in real app, this would use AI)
      const revelationA = gameState.partnerARevelation.toLowerCase();
      const revelationB = gameState.partnerBRevelation.toLowerCase();
      
      // Calculate alignment based on semantic similarity
      let alignment = 0;
      const commonWords = ['trust', 'honesty', 'communication', 'respect', 'love'];
      
      commonWords.forEach(word => {
        if (revelationA.includes(word) || revelationB.includes(word)) {
          alignment += 20;
        }
      });

      // Ensure alignment is between 0-100
      alignment = Math.min(100, Math.max(0, alignment));

      setGameState(prev => ({
        ...prev,
        alignmentPercentage: alignment,
        gamePhase: 'results',
        isLoading: false
      }));

      // Update game session with results
      await gamesApi.updateSession(
        gameState.sessionId,
        alignment,
        true,
        [
          {
            partner: 'A',
            revelation: gameState.partnerARevelation,
            timestamp: new Date().toISOString()
          },
          {
            partner: 'B',
            revelation: gameState.partnerBRevelation,
            timestamp: new Date().toISOString()
          }
        ]
      );

      // Update global game state
      updateGameProgress('heart-of-the-matter', 100);

    } catch (error) {
      console.error('Failed to calculate alignment:', error);
      Alert.alert('Calculation Error', 'Failed to calculate alignment. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const finishGame = () => {
    // navigation.navigate('GameResultsScreen', {
    //   gameId: 'heart-of-the-matter',
    //   score: gameState.alignmentPercentage,
    //   sessionId: gameState.sessionId
    // });
  };

  // Loading state
  if (gameState.isLoading) {
    return (
      <ScreenLayout showHeader={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryGradientStart} />
          <Typography variant="body" style={styles.loadingText}>
            Processing your revelation...
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
              HEART OF THE MATTER
            </Typography>
            <Typography variant="title" style={styles.gameSubtitle} center>
              The Deepest Word-Wound Revelation
            </Typography>
            
            <GlassCard style={styles.introCard}>
              <Typography variant="body" style={styles.introText}>
                In this game, you and your partner will reveal the deepest emotional wounds 
                you've never fully confessed. Dr. Marcie will guide you through this vulnerable 
                process with her signature therapeutic insight.
              </Typography>
              
              <Typography variant="caption" style={styles.introWarning}>
                ⚠️ This game requires emotional safety and trust. Ensure you're both ready 
                for deep vulnerability before proceeding.
              </Typography>
            </GlassCard>

            <SquishyButton onPress={startGame}>
              <Typography variant="button">BEGIN REVELATION</Typography>
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
          <View style={styles.questionContainer}>
            <Typography variant="h1" style={styles.questionTitle} center>
              THE INQUIRY
            </Typography>
            <Typography variant="h1" style={styles.mainQuestion} center>
              WHAT WAS THE DEEPEST{' '}
              <Typography variant="h1" style={styles.italicPrimary}>WORD-WOUND</Typography>?
            </Typography>
            
            <GlassCard style={styles.questionCard}>
              <Typography variant="body" style={styles.questionText} center>
                {gameState.currentQuestion}
              </Typography>
            </GlassCard>

            <Typography variant="body" style={styles.instructionText} center>
              Take a moment to reflect on this question. When you're ready, 
              share your revelation with your partner.
            </Typography>

            <SquishyButton 
              onPress={() => setGameState(prev => ({ ...prev, gamePhase: 'revelation' }))}
            >
              <Typography variant="button">I'M READY TO SHARE</Typography>
            </SquishyButton>
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  // Revelation phase
  if (gameState.gamePhase === 'revelation') {
    return (
      <ScreenLayout showHeader={false}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.revelationContainer}>
            <Typography variant="h1" style={styles.revelationTitle} center>
              YOUR REVELATION
            </Typography>
            <Typography variant="body" style={styles.revelationPrompt} center>
              Share your deepest word-wound below:
            </Typography>
            
            <View style={styles.revelationInputContainer}>
              <TextInput
                style={styles.revelationInput}
                placeholder="Type your revelation here..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={4}
                value={gameState.partnerARevelation}
                onChangeText={(text) => setGameState(prev => ({ 
                  ...prev, 
                  partnerARevelation: text 
                }))}
              />
            </View>

            <SquishyButton 
              onPress={() => handleRevelationSubmit('A', gameState.partnerARevelation)}
              disabled={!gameState.partnerARevelation.trim()}
            >
              <Typography variant="button">SUBMIT REVELATION</Typography>
            </SquishyButton>
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  // Analysis phase
  if (gameState.gamePhase === 'analysis') {
    return (
      <ScreenLayout showHeader={false}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.analysisContainer}>
            <Typography variant="h1" style={styles.analysisTitle} center>
              DR. MARCIE'S ANALYSIS
            </Typography>
            
            <View style={styles.marcieContainer}>
              <Typography variant="h1" style={styles.marcieAvatar}>👩‍⚕️</Typography>
              <Typography variant="title" style={styles.marcieName} center>
                DR. MARCIE LISS
              </Typography>
              <GlassCard style={styles.marcieFeedbackContainer}>
                <Typography variant="body" style={styles.marcieFeedback} center>
                  "{gameState.marcieFeedback}"
                </Typography>
              </GlassCard>
            </View>

            <View style={styles.revelationsContainer}>
              <GlassCard style={styles.revelationCard}>
                <Typography variant="caption" style={styles.revelationPartner}>
                  PARTNER A
                </Typography>
                <Typography variant="body" style={styles.revelationText}>
                  "{gameState.partnerARevelation}"
                </Typography>
              </GlassCard>
              
              <GlassCard style={styles.revelationCard}>
                <Typography variant="caption" style={styles.revelationPartner}>
                  PARTNER B
                </Typography>
                <Typography variant="body" style={styles.revelationText}>
                  "{gameState.partnerBRevelation}"
                </Typography>
              </GlassCard>
            </View>

            <SquishyButton onPress={calculateAlignment}>
              <Typography variant="button">CALCULATE ALIGNMENT</Typography>
            </SquishyButton>
          </View>
        </ScrollView>
      </ScreenLayout>
    );
  }

  // Results phase
  return (
    <ScreenLayout showHeader={false}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultsContainer}>
          <Typography variant="h1" style={styles.resultsTitle} center>
            ALIGNMENT RESULTS
          </Typography>
          
          <GlassCard style={styles.alignmentMeterContainer}>
            <Typography variant="title" style={styles.meterTitle} center>
              SEMANTIC ALIGNMENT METER
            </Typography>
            <View style={styles.meterTrack}>
              <LinearGradient
                colors={[COLORS.innerLineStart, COLORS.innerLineEnd]}
                style={[styles.meterFill, { width: `${gameState.alignmentPercentage}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Typography variant="h1" style={styles.alignmentPercentage} center>
              {gameState.alignmentPercentage}%
            </Typography>
            <View style={styles.meterLabels}>
              <Typography variant="small" style={styles.meterLabelText}>
                DISSONANCE
              </Typography>
              <Typography variant="small" style={styles.meterLabelText}>
                NEUTRAL
              </Typography>
              <Typography variant="small" style={[styles.meterLabelText, { color: COLORS.accentPink }]}>
                TRANSCENDENCE
              </Typography>
            </View>
          </GlassCard>

          <GlassCard style={styles.resultsCard}>
            <Typography variant="body" style={styles.resultsText} center>
              {gameState.alignmentPercentage >= 80 
                ? "Remarkable alignment! Your revelations show deep emotional resonance."
                : gameState.alignmentPercentage >= 60
                ? "Good alignment detected. There's meaningful connection in your truths."
                : "Alignment challenges identified. This reveals important growth opportunities."
              }
            </Typography>
          </GlassCard>

          <SquishyButton onPress={finishGame}>
            <Typography variant="button">COMPLETE GAME</Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

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
  
  // Question styles
  questionContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    alignItems: 'center',
  },
  questionTitle: {
    marginBottom: SPACING.sm,
  },
  mainQuestion: {
    marginBottom: SPACING.xl,
  },
  italicPrimary: {
    fontStyle: 'italic',
    color: COLORS.primaryGradientStart,
  },
  questionCard: {
    marginBottom: SPACING.lg,
  },
  questionText: {
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
  },
  instructionText: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
  },
  
  // Revelation styles
  revelationContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  revelationTitle: {
    marginBottom: SPACING.sm,
  },
  revelationPrompt: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  revelationInputContainer: {
    marginBottom: SPACING.xl,
  },
  revelationInput: {
    ...TYPOGRAPHY.fontFamily.regular,
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
  
  // Analysis styles
  analysisContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  analysisTitle: {
    marginBottom: SPACING.lg,
  },
  marcieContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  marcieAvatar: {
    marginBottom: SPACING.sm,
  },
  marcieName: {
    marginBottom: SPACING.sm,
  },
  marcieFeedbackContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  marcieFeedback: {
    color: COLORS.accentRose,
    fontStyle: 'italic',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
  },
  revelationsContainer: {
    marginBottom: SPACING.xl,
  },
  revelationCard: {
    marginBottom: SPACING.md,
  },
  revelationPartner: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  revelationText: {
    color: COLORS.textPrimary,
    fontStyle: 'italic',
  },
  
  // Results styles
  resultsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  resultsTitle: {
    marginBottom: SPACING.lg,
  },
  alignmentMeterContainer: {
    marginBottom: SPACING.lg,
  },
  meterTitle: {
    marginBottom: SPACING.md,
  },
  meterTrack: {
    height: SPACING.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: BORDER_RADIUS.xlarge,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  meterFill: {
    height: '100%',
  },
  alignmentPercentage: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
    marginBottom: SPACING.sm,
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterLabelText: {
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  resultsCard: {
    marginBottom: SPACING.xl,
  },
  resultsText: {
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyLarge,
  },
});

export default HeartOfTheMatterGameScreen;
