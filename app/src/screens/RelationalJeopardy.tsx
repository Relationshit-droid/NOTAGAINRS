import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Dimensions,
  TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import { useGameStore } from '../lib/game-store';
import { gamesApi, marcieApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const { width: screenWidth } = Dimensions.get('window');

interface GameState {
  jeopardyCategories: string[];
  pointValues: number[];
  answeredTiles: string[];
  activeChallenge: string;
  score: number;
  gamePhase: 'intro' | 'board' | 'challenge' | 'results';
  sessionId: string;
  isLoading: boolean;
  currentCategory: string;
  currentPoints: number;
  dailyDouble: boolean;
  finalJeopardy: boolean;
  marcieFeedback: string;
  marcieAnimation: string;
}

const jeopardyCategories = [
  'SHARED HISTORY', 
  'THE TRUTH HURTS', 
  'FUTURE ECHOES', 
  'RED FLAGS', 
  'EMOTIONAL DEBT'
];

const pointValues = [100, 200, 300, 400, 500];

const RelationalJeopardyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { updateGameProgress, currentGameSession } = useGameStore();
  
  const [gameState, setGameState] = useState<GameState>({
    jeopardyCategories,
    pointValues,
    answeredTiles: [],
    activeChallenge: 'Select a challenge from the board.',
    score: 2450,
    gamePhase: 'intro',
    sessionId: '',
    isLoading: false,
    currentCategory: '',
    currentPoints: 0,
    dailyDouble: false,
    finalJeopardy: false,
    marcieFeedback: '',
    marcieAnimation: 'marcie-idle'
  });

  // Jeopardy questions based on Design Bible specifications
  const jeopardyQuestions = {
    'SHARED HISTORY': {
      100: "What was the first thing you noticed about your partner that made you think 'this is different'?",
      200: "Describe the moment you realized this relationship was worth fighting for.",
      300: "What pattern from your family of origin have you successfully broken together?",
      400: "What story about your relationship do you tell differently now than you did a year ago?",
      500: "What truth about your shared history have you both agreed to stop editing?"
    },
    'THE TRUTH HURTS': {
      100: "What do you pretend not to notice to keep the peace?",
      200: "What complaint do you have that you've never said out loud?",
      300: "What part of your partner's story do you think they're still lying to themselves about?",
      400: "What truth about yourself have you been avoiding because it might hurt them?",
      500: "What are you both pretending is fine when it's actually breaking?"
    },
    'FUTURE ECHOES': {
      100: "What version of yourselves are you trying to grow into?",
      200: "What fear about your future together keeps you up at night?",
      300: "What dream have you given up on that you want them to know about?",
      400: "What would you sacrifice to ensure this relationship survives?",
      500: "What future are you both walking toward that you're afraid to name?"
    },
    'RED FLAGS': {
      100: "What warning sign did you ignore that you now understand?",
      200: "What pattern do you see repeating that scares you?",
      300: "What boundary have you let them cross that you shouldn't have?",
      400: "What part of this relationship feels like it's on life support?",
      500: "What are you both doing that's slowly killing the connection?"
    },
    'EMOTIONAL DEBT': {
      100: "What apology do you still owe that you've been avoiding?",
      200: "What forgiveness have you been withholding?",
      300: "What emotional labor are you tired of doing alone?",
      400: "What debt do you feel you can never repay?",
      500: "What would it take to balance the emotional ledger between you?"
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to play this game.');
      navigation.goBack();
      return;
    }

    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Create game session with backend
      const session = await gamesApi.createSession(
        user.uid,
        'relational-jeopardy',
        'game-show'
      );

      setGameState(prev => ({
        ...prev,
        sessionId: session.id,
        gamePhase: 'intro',
        isLoading: false
      }));

      // Update global game state
      updateGameProgress('relational-jeopardy', 0);

    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Game Error', 'Failed to start the game. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'board'
    }));
  };

  const handleTilePress = async (category: string, points: number) => {
    const tileKey = `${category}-${points}`;
    
    if (gameState.answeredTiles.includes(tileKey)) {
      return; // Already answered
    }

    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      const question = jeopardyQuestions[category][points];
      const isDailyDouble = Math.random() < 0.1; // 10% chance
      
      // Get Dr. Marcie's introduction for this challenge
      const context = `Relational Jeopardy - ${category} for $${points}`;
      const marcieResponse = await marcieApi.chat(
        user.uid,
        context,
        question,
        3 // Radical Truth Wizard level for deep insights
      );

      setGameState(prev => ({
        ...prev,
        currentCategory: category,
        currentPoints: points,
        activeChallenge: `For $${points} in ${category}: ${question}`,
        dailyDouble: isDailyDouble,
        marcieFeedback: marcieResponse.response,
        marcieAnimation: marcieResponse.animation,
        gamePhase: 'challenge',
        isLoading: false
      }));

      // Mark tile as answered
      setGameState(prev => ({
        ...prev,
        answeredTiles: [...prev.answeredTiles, tileKey]
      }));

    } catch (error) {
      console.error('Failed to load challenge:', error);
      Alert.alert('Challenge Error', 'Failed to load the challenge. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const submitAnswer = async (answer: string) => {
    try {
      setGameState(prev => ({ ...prev, isLoading: true }));

      // Get Dr. Marcie's feedback on the answer
      const context = `Relational Jeopardy answer evaluation - ${gameState.currentCategory} for $${gameState.currentPoints}`;
      const marcieResponse = await marcieApi.chat(
        user.uid,
        context,
        answer,
        2 // Reality Check Specialist level
      );

      // Calculate points (simplified - in real app, this would be more sophisticated)
      const points = gameState.dailyDouble ? gameState.currentPoints * 2 : gameState.currentPoints;
      const newScore = gameState.score + points;

      // Update game session
      await gamesApi.updateSession(
        gameState.sessionId,
        newScore,
        false,
        [
          {
            category: gameState.currentCategory,
            points: gameState.currentPoints,
            question: gameState.activeChallenge,
            answer: answer,
            daily_double: gameState.dailyDouble,
            timestamp: new Date().toISOString()
          }
        ]
      );

      setGameState(prev => ({
        ...prev,
        score: newScore,
        marcieFeedback: marcieResponse.response,
        marcieAnimation: marcieResponse.animation,
        isLoading: false
      }));

      // Update global game state
      const progress = (gameState.answeredTiles.length / 25) * 100; // 5x5 grid
      updateGameProgress('relational-jeopardy', progress);

      // Check if all tiles are answered
      if (gameState.answeredTiles.length >= 24) { // All tiles answered
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gamePhase: 'results' }));
        }, 3000);
      } else {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gamePhase: 'board' }));
        }, 3000);
      }

    } catch (error) {
      console.error('Failed to submit answer:', error);
      Alert.alert('Submission Error', 'Failed to submit your answer. Please try again.');
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const finishGame = () => {
    navigation.navigate('GameResultsScreen', {
      gameId: 'relational-jeopardy',
      score: gameState.score,
      sessionId: gameState.sessionId
    });
  };

  // Loading state
  if (gameState.isLoading) {
    return (
      <ScreenLayout scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
          <Typography variant="bodyMedium" style={styles.loadingText}>Loading challenge...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  // Intro phase
  if (gameState.gamePhase === 'intro') {
    return (
      <ScreenLayout scrollable={true}>
        <View style={styles.introContainer}>
          <Typography variant="displayMedium" style={styles.mainTitle}>
            ROUND 4: <Typography variant="displayMedium" style={styles.titleHighlight}>THE RECONSTRUCTION</Typography>
          </Typography>
          <Typography variant="bodyMedium" style={styles.subtitle}>
            Navigate the debris of deception to earn Truth Credits.
          </Typography>
          
          <GlassCard style={styles.introCard}>
            <Typography variant="bodyMedium" style={styles.introText}>
              Categories designed by couples who rebuilt their relationships 
              after betrayal. Each question reveals deeper truths about 
              your connection.
            </Typography>
            
            <Typography variant="bodySmall" style={styles.introWarning}>
              ⚠️ These questions are designed to surface difficult truths. 
              Ensure you're both ready for deep emotional work.
            </Typography>
          </GlassCard>

          <View style={styles.categoriesPreview}>
            {gameState.jeopardyCategories.map((category) => (
              <GlassCard key={category} style={styles.categoryPreviewItem}>
                <Typography variant="label" style={styles.categoryPreviewText}>{category}</Typography>
              </GlassCard>
            ))}
          </View>

          <SquishyButton 
            title="ENTER THE BOARD"
            onPress={startGame}
          />
        </View>
      </ScreenLayout>
    );
  }

  // Board phase
  if (gameState.gamePhase === 'board') {
    return (
      <ScreenLayout scrollable={true}>
        <View style={styles.gameContainer}>
          <GlassCard style={styles.scoreContainer}>
            <Typography variant="label" style={styles.scoreText}>TRUTH CREDITS</Typography>
            <Typography variant="displayMedium" style={styles.scoreValue}>${gameState.score}</Typography>
          </GlassCard>

          <View style={styles.gameBoard}>
            <View style={styles.headerRow}>
              {gameState.jeopardyCategories.map(cat => (
                <View key={cat} style={styles.headerCell}>
                  <Typography variant="label" style={styles.headerText} numberOfLines={2}>
                    {cat}
                  </Typography>
                </View>
              ))}
            </View>
            
            {gameState.pointValues.map(points => (
              <View key={points} style={styles.row}>
                {gameState.jeopardyCategories.map(cat => {
                  const tileKey = `${cat}-${points}`;
                  const isAnswered = gameState.answeredTiles.includes(tileKey);
                  const isDailyDoubleTile = Math.random() < 0.05; // 5% chance per tile
                  
                  return (
                    <JeopardyTile
                      key={`${cat}-${points}`}
                      points={points}
                      category={cat}
                      onPress={handleTilePress}
                      answered={isAnswered}
                      isDailyDouble={isDailyDoubleTile && !isAnswered}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          {gameState.answeredTiles.length >= 20 && (
            <SquishyButton 
              title="FINAL JEOPARDY"
              onPress={() => setGameState(prev => ({ 
                ...prev, 
                finalJeopardy: true,
                gamePhase: 'challenge' 
              }))}
              style={styles.finalJeopardyButton}
            />
          )}
        </View>
      </ScreenLayout>
    );
  }

  // Challenge phase
  return (
    <ScreenLayout scrollable={true}>
      <View style={styles.challengeContainer}>
        {gameState.dailyDouble && (
          <View style={styles.dailyDoubleBanner}>
            <Typography variant="bodyMedium" style={styles.dailyDoubleText}>🎯 DAILY DOUBLE 🎯</Typography>
          </View>
        )}
        
        {gameState.finalJeopardy && (
          <View style={styles.finalJeopardyBanner}>
            <Typography variant="bodyMedium" style={styles.finalJeopardyText}>🏆 FINAL JEOPARDY 🏆</Typography>
          </View>
        )}

        <View style={styles.challengeHeader}>
          <Typography variant="headerMedium" style={styles.challengeCategory}>
            {gameState.finalJeopardy ? 'FINAL JEOPARDY' : gameState.currentCategory}
          </Typography>
          <Typography variant="displaySmall" style={styles.challengePoints}>
            {gameState.finalJeopardy ? 'WAGER' : `$${gameState.currentPoints}`}
          </Typography>
        </View>

        <View style={styles.challengeContent}>
          <Typography variant="bodyMedium" style={styles.challengeText}>
            {gameState.activeChallenge}
          </Typography>

          {gameState.marcieFeedback && (
            <View style={styles.marcieContainer}>
              <Typography style={styles.marcieAvatar}>👩‍⚕️</Typography>
              <Typography variant="headerSmall" style={styles.marcieName}>DR. MARCIE LISS</Typography>
              <GlassCard style={styles.marcieFeedbackContainer}>
                <Typography variant="bodyMedium" style={styles.marcieFeedback}>
                  "{gameState.marcieFeedback}"
                </Typography>
              </GlassCard>
            </View>
          )}

          <View style={styles.answerSection}>
            <Typography variant="bodyMedium" style={styles.answerPrompt}>Your Answer:</Typography>
            <TextInput
              style={styles.answerInput}
              placeholder="Type your answer..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
              value={gameState.activeChallenge}
              onChangeText={(text) => setGameState(prev => ({ 
                ...prev, 
                activeChallenge: text 
              }))}
            />

            <SquishyButton 
              title={gameState.finalJeopardy ? 'SUBMIT FINAL ANSWER' : 'SUBMIT ANSWER'}
              onPress={() => submitAnswer(gameState.activeChallenge)}
            />
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

const JeopardyTile = ({ points, category, onPress, answered, isDailyDouble }: { points: number, category: string, onPress: (cat: string, pts: number) => void, answered: boolean, isDailyDouble: boolean }) => (
  <SquishyButton
    title={answered ? '✅' : `$${points}`}
    onPress={() => !answered && onPress(category, points)}
    disabled={answered}
    variant={answered ? 'ghost' : 'primary'}
    style={[
      styles.tile, 
      answered && styles.tileAnswered,
      isDailyDouble && styles.tileDailyDouble
    ]}
  />
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.medium,
  },
  
  // Intro styles
  introContainer: {
    paddingTop: SPACING.xlarge,
    alignItems: 'center',
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: SPACING.small,
    textTransform: 'uppercase',
  },
  titleHighlight: {
    color: COLORS.brightYellow,
  },
  subtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxlarge,
  },
  introCard: {
    marginBottom: SPACING.regular,
  },
  introText: {
    marginBottom: SPACING.medium,
  },
  introWarning: {
    color: COLORS.brightYellow,
    fontWeight: '600',
  },
  categoriesPreview: {
    marginBottom: SPACING.xxlarge,
    width: '100%',
  },
  categoryPreviewItem: {
    marginVertical: SPACING.tiny,
  },
  categoryPreviewText: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  
  // Board styles
  gameContainer: {
    paddingTop: SPACING.regular,
  },
  scoreContainer: {
    marginBottom: SPACING.regular,
    alignItems: 'center',
  },
  scoreText: {
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.tiny,
  },
  scoreValue: {
    color: COLORS.brightYellow,
  },
  gameBoard: {
    backgroundColor: COLORS.backgroundPrimary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.small,
    borderWidth: 2,
    borderColor: COLORS.brightYellow,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: SPACING.tiny,
  },
  headerCell: {
    flex: 1,
    padding: SPACING.small,
    margin: SPACING.micro,
    backgroundColor: COLORS.gameShow,
    borderRadius: BORDER_RADIUS.small,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  headerText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    margin: SPACING.micro,
    backgroundColor: COLORS.gameShow,
    borderRadius: BORDER_RADIUS.small,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  tileAnswered: {
    backgroundColor: COLORS.borderSubtle,
  },
  tileDailyDouble: {
    borderWidth: 2,
    borderColor: COLORS.brightYellow,
  },
  finalJeopardyButton: {
    marginTop: SPACING.regular,
  },
  
  // Challenge styles
  challengeContainer: {
    paddingTop: SPACING.regular,
  },
  dailyDoubleBanner: {
    backgroundColor: COLORS.brightYellow,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.regular,
    alignItems: 'center',
  },
  dailyDoubleText: {
    color: COLORS.backgroundPrimary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  finalJeopardyBanner: {
    backgroundColor: COLORS.warmOrange,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.regular,
    alignItems: 'center',
  },
  finalJeopardyText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  challengeCategory: {
    textTransform: 'uppercase',
  },
  challengePoints: {
    color: COLORS.brightYellow,
  },
  challengeContent: {
    marginBottom: SPACING.xxlarge,
  },
  challengeText: {
    marginBottom: SPACING.regular,
  },
  marcieContainer: {
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  marcieAvatar: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
    marginBottom: SPACING.small,
  },
  marcieName: {
    marginBottom: SPACING.small,
    textTransform: 'uppercase',
  },
  marcieFeedbackContainer: {
    width: '100%',
  },
  marcieFeedback: {
    color: COLORS.rosePink,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  answerSection: {
    marginBottom: SPACING.xxlarge,
  },
  answerPrompt: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  answerInput: {
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.regular,
    color: COLORS.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: SPACING.regular,
  },
});

export default RelationalJeopardyScreen;
