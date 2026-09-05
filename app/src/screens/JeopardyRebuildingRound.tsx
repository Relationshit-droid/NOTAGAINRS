import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../lib/game-store';
import { vertexAIService } from '../lib/vertex-ai-service';
import { JeopardyCategory, JeopardyClue, GameState } from '../lib/game-types';
import GameRunner from '../components/games/GameRunner';
import * as Haptics from 'expo-haptics';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../theme';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

interface JeopardyCellProps {
  clue: JeopardyClue;
  categoryIndex: number;
  clueIndex: number;
  onPress: (categoryIndex: number, clueIndex: number) => void;
  isActive: boolean;
}

const JeopardyCell: React.FC<JeopardyCellProps> = ({ 
  clue, 
  categoryIndex, 
  clueIndex, 
  onPress, 
  isActive 
}) => {
  const handlePress = () => {
    if (!clue.answered && isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(categoryIndex, clueIndex);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.cell, 
        clue.answered && styles.cellAnswered,
        !isActive && styles.cellDisabled
      ]} 
      onPress={handlePress}
      disabled={clue.answered || !isActive}
    >
      <LinearGradient
        colors={clue.answered ? [COLORS.textDisabled, COLORS.textHint] : [COLORS.vibrantPink, COLORS.lavenderPurple]}
        style={styles.cellGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Typography 
          variant="h2" 
          color={clue.answered ? COLORS.textDisabled : COLORS.textPrimary}
          center
        >
          ${clue.value}
        </Typography>
      </LinearGradient>
    </TouchableOpacity>
  );
};

interface ClueModalProps {
  visible: boolean;
  clue: JeopardyClue | null;
  category: string;
  onAnswer: (answer: string) => void;
  onClose: () => void;
  activePlayer: string | null;
  buzzerEnabled: boolean;
  onBuzz: () => void;
}

const ClueModal: React.FC<ClueModalProps> = ({
  visible,
  clue,
  category,
  onAnswer,
  onClose,
  activePlayer,
  buzzerEnabled,
  onBuzz,
}) => {
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = () => {
    if (answer.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onAnswer(answer.trim());
      setAnswer('');
      setShowAnswer(false);
    }
  };

  const handleBuzz = () => {
    if (buzzerEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onBuzz();
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  if (!clue) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient 
          colors={[COLORS.deepCosmic, COLORS.richPlum]} 
          style={styles.modalBackground}
        />
        
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Typography variant="label" color={COLORS.vibrantPink}>
              {category.toUpperCase()}
            </Typography>
            <Typography variant="h2" color={COLORS.brightYellow}>
              ${clue.value}
            </Typography>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Typography variant="h2" color={COLORS.textPrimary}>✕</Typography>
            </TouchableOpacity>
          </View>

          {/* Clue */}
          <View style={styles.clueContainer}>
            <Typography variant="h3" color={COLORS.textPrimary} center>
              {clue.clue}
            </Typography>
          </View>

          {/* Buzzer or Answer Section */}
          {!activePlayer ? (
            <View style={styles.buzzerContainer}>
              <TouchableOpacity 
                style={[
                  styles.buzzerButton,
                  !buzzerEnabled && styles.buzzerDisabled
                ]} 
                onPress={handleBuzz}
                disabled={!buzzerEnabled}
              >
                <LinearGradient
                  colors={buzzerEnabled ? [COLORS.vibrantPink, COLORS.rosePink] : [COLORS.textHint, COLORS.textSecondary]}
                  style={styles.buzzerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Typography variant="button" color={COLORS.textPrimary}>
                    BUZZ IN!
                  </Typography>
                </LinearGradient>
              </TouchableOpacity>
              {!buzzerEnabled && (
                <Typography variant="caption" color={COLORS.textSecondary} center>
                  Wait for the clue to finish...
                </Typography>
              )}
            </View>
          ) : (
            <View style={styles.answerContainer}>
              <Typography variant="body" color={COLORS.textPrimary} center>
                Your answer:
              </Typography>
              <TextInput
                style={styles.answerInput}
                value={answer}
                onChangeText={setAnswer}
                placeholder="What is..."
                placeholderTextColor={COLORS.textHint}
                autoFocus
              />
              
              <View style={styles.answerButtons}>
                <SquishyButton 
                  onPress={handleSubmit}
                  disabled={!answer.trim()}
                  variant="primary"
                  style={styles.answerButton}
                >
                  <Typography variant="button" color={COLORS.textPrimary}>
                    Submit Answer
                  </Typography>
                </SquishyButton>
                
                <SquishyButton 
                  onPress={handleShowAnswer}
                  variant="secondary"
                  style={styles.answerButton}
                >
                  <Typography variant="button" color={COLORS.textPrimary}>
                    Show Answer
                  </Typography>
                </SquishyButton>
              </View>

              {showAnswer && (
                <GlassCard variant="outlined" style={styles.answerReveal}>
                  <Typography variant="label" color={COLORS.textSecondary}>
                    Correct Answer:
                  </Typography>
                  <Typography variant="h3" color={COLORS.brightYellow}>
                    {clue.answer}
                  </Typography>
                </GlassCard>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

interface JeopardyRebuildingRoundProps {
  gameContent?: JeopardyCategory[];
  gameState: GameState;
  currentSession: any;
  onGameComplete: (results: any) => void;
  triggerMarcieAnimation: (animation: any) => void;
}

const JeopardyRebuildingRound: React.FC<JeopardyRebuildingRoundProps> = ({
  gameContent,
  gameState,
  currentSession,
  onGameComplete,
  triggerMarcieAnimation,
}) => {
  const [categories, setCategories] = useState<JeopardyCategory[]>([]);
  const [selectedCell, setSelectedCell] = useState<{categoryIndex: number, clueIndex: number} | null>(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [buzzerEnabled, setBuzzerEnabled] = useState(false);
  const [answeredClues, setAnsweredClues] = useState<Set<string>>(new Set());
  const [gameComplete, setGameComplete] = useState(false);

  const { updateGameState, handleBuzz, submitAnswer } = useGameStore();

  // Initialize categories when game content loads
  useEffect(() => {
    if (gameContent && gameContent.length > 0) {
      setCategories(gameContent);
      setBuzzerEnabled(false);
      
      // Enable buzzer after 2 seconds for first question
      setTimeout(() => setBuzzerEnabled(true), 2000);
    }
  }, [gameContent]);

  // Check if game is complete
  useEffect(() => {
    if (categories.length > 0) {
      const totalClues = categories.reduce((total, cat) => total + cat.clues.length, 0);
      const answeredCount = Array.from(answeredClues).length;
      
      if (answeredCount === totalClues && !gameComplete) {
        setGameComplete(true);
        handleGameComplete();
      }
    }
  }, [answeredClues, categories, gameComplete]);

  const handleCellPress = useCallback((categoryIndex: number, clueIndex: number) => {
    const cellKey = `${categoryIndex}-${clueIndex}`;
    if (answeredClues.has(cellKey)) return;

    setSelectedCell({ categoryIndex, clueIndex });
    setActivePlayer(null);
    setBuzzerEnabled(false);
    
    // Enable buzzer after 2 seconds
    setTimeout(() => setBuzzerEnabled(true), 2000);

    // Update game state
    updateGameState({
      currentQuestion: cellKey,
      buzzerEnabled: true,
    });

    triggerMarcieAnimation({
      type: 'thinking',
      speech: "Here's your clue, darlings. First buzz gets to answer!",
    });
  }, [answeredClues, updateGameState, triggerMarcieAnimation]);

  const handleBuzzCallback = useCallback(async () => {
    if (!selectedCell || !buzzerEnabled || activePlayer) return;

    const timestamp = Date.now();
    const cellKey = `${selectedCell.categoryIndex}-${selectedCell.clueIndex}`;
    
    // Record buzz with millisecond precision
    await handleBuzz('current_player', cellKey);
    
    setActivePlayer('current_player');
    setBuzzerEnabled(false);

    triggerMarcieAnimation({
      type: 'listening',
      speech: "First buzz! Go ahead, darling...",
    });
  }, [selectedCell, buzzerEnabled, activePlayer, handleBuzz, triggerMarcieAnimation]);

  const handleAnswer = useCallback(async (answer: string) => {
    if (!selectedCell) return;

    const category = categories[selectedCell.categoryIndex];
    const clue = category.clues[selectedCell.clueIndex];
    const cellKey = `${selectedCell.categoryIndex}-${selectedCell.clueIndex}`;
    
    // Simple answer validation (in real implementation, this would use AI)
    const isCorrect = answer.toLowerCase().includes(clue.answer.toLowerCase()) || 
                     clue.answer.toLowerCase().includes(answer.toLowerCase());
    
    // Update scores
    const newScores = { ...scores };
    if (isCorrect) {
      newScores.player1 += clue.value; // Assuming current player is player1
      
      triggerMarcieAnimation({
        type: 'correct',
        speech: `Excellent! ${clue.value} points for you, darling!`,
      });
    } else {
      newScores.player1 -= clue.value;
      
      triggerMarcieAnimation({
        type: 'wrong',
        speech: `Oh darling, that's not quite right. Minus ${clue.value} points.`,
      });
    }
    
    setScores(newScores);

    // Mark clue as answered
    const newAnsweredClues = new Set(answeredClues);
    newAnsweredClues.add(cellKey);
    setAnsweredClues(newAnsweredClues);

    // Update clue in categories
    const newCategories = [...categories];
    newCategories[selectedCell.categoryIndex].clues[selectedCell.clueIndex].answered = true;
    newCategories[selectedCell.categoryIndex].clues[selectedCell.clueIndex].answered_by = 'current_player';
    setCategories(newCategories);

    // Close modal and reset
    setSelectedCell(null);
    setActivePlayer(null);

    // Update game state
    await updateGameState({
      scores: newScores,
      currentQuestion: null,
      buzzerEnabled: false,
    });

    await submitAnswer('current_player', {
      answer,
      isCorrect,
      value: clue.value,
      category: category.name,
      clue: clue.clue,
    });
  }, [selectedCell, categories, scores, answeredClues, updateGameState, submitAnswer, triggerMarcieAnimation]);

  const handleGameComplete = useCallback(async () => {
    const results = {
      scores,
      winner: scores.player1 > scores.player2 ? 'player1' : 
              scores.player2 > scores.player1 ? 'player2' : 'tie',
      duration: 0, // This would be calculated
      marcieCommentary: await vertexAIService.generateMarcieCommentary(
        scores.player1 > scores.player2 ? 'game_win' : 'game_loss',
        { scores, categories: categories.length }
      ),
      achievements: [],
    };

    onGameComplete(results);
  }, [scores, categories, onGameComplete]);

  const renderCategory = ({ item: category, index }: { item: JeopardyCategory, index: number }) => (
    <View style={styles.categoryColumn} key={category.id}>
      <GlassCard variant="outlined" style={styles.categoryHeader} padding="small">
        <Typography variant="label" color={COLORS.textPrimary} center>
          {category.name.toUpperCase()}
        </Typography>
      </GlassCard>
      {category.clues.map((clue, clueIndex) => (
        <JeopardyCell
          key={clue.id}
          clue={clue}
          categoryIndex={index}
          clueIndex={clueIndex}
          onPress={handleCellPress}
          isActive={gameState === 'ready_to_start' || gameState === 'question_active'}
        />
      ))}
    </View>
  );

  if (categories.length === 0) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" color={COLORS.textPrimary} center>
            Loading personalized categories...
          </Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <View style={styles.container}>
        {/* Game Board */}
        <View style={styles.gameBoard}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.boardContent}
          />
        </View>

        {/* Scores */}
        <View style={styles.scoresContainer}>
          <GlassCard style={styles.scoreCard} padding="medium">
            <Typography variant="label" color={COLORS.textSecondary}>
              Player 1
            </Typography>
            <Typography variant="h2" color={COLORS.textPrimary}>
              ${scores.player1}
            </Typography>
          </GlassCard>
          <GlassCard style={styles.scoreCard} padding="medium">
            <Typography variant="label" color={COLORS.textSecondary}>
              Player 2
            </Typography>
            <Typography variant="h2" color={COLORS.textPrimary}>
              ${scores.player2}
            </Typography>
          </GlassCard>
        </View>

        {/* Clue Modal */}
        <ClueModal
          visible={!!selectedCell}
          clue={selectedCell ? categories[selectedCell.categoryIndex].clues[selectedCell.clueIndex] : null}
          category={selectedCell ? categories[selectedCell.categoryIndex].name : ''}
          onAnswer={handleAnswer}
          onClose={() => setSelectedCell(null)}
          activePlayer={activePlayer}
          buzzerEnabled={buzzerEnabled}
          onBuzz={handleBuzzCallback}
        />
      </View>
    </ScreenLayout>
  );
};

// Main component that wraps with GameRunner
const JeopardyRebuildingRoundScreen = () => {
  const [gameId] = useState('jeopardy');
  const [coupleId] = useState('test-couple-123'); // This would come from auth context

  const handleGameComplete = (results: any) => {
    console.log('Game completed:', results);
    // Navigate to next screen or show final results
  };

  const handleExit = () => {
    console.log('Exit game');
    // Navigate back to game library
  };

  return (
    <GameRunner
      gameId={gameId}
      coupleId={coupleId}
      onComplete={handleGameComplete}
      onExit={handleExit}
      gameTitle="Jeopardy: Rebuilding Round"
      gameIcon="🎯"
      showTimer={true}
      showMarcie={true}
    >
      <JeopardyRebuildingRound />
    </GameRunner>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameBoard: {
    flex: 1,
    paddingHorizontal: SPACING.small,
    paddingTop: SPACING.large,
  },
  boardContent: {
    paddingHorizontal: SPACING.small,
  },
  categoryColumn: {
    width: SPACING.xxxlarge * 3,
    marginHorizontal: SPACING.tiny,
  },
  categoryHeader: {
    marginBottom: SPACING.small,
  },
  cell: {
    height: SPACING.xxxlarge * 1.5,
    marginVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  cellGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellAnswered: {
    opacity: 0.3,
  },
  cellDisabled: {
    opacity: 0.5,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.large,
    paddingHorizontal: SPACING.large,
  },
  scoreCard: {
    alignItems: 'center',
    minWidth: SPACING.xxxlarge * 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.xlarge,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxlarge,
  },
  closeButton: {
    padding: SPACING.small,
  },
  clueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxlarge,
  },
  buzzerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxlarge,
  },
  buzzerButton: {
    width: SPACING.xxxlarge * 4,
    height: SPACING.xxxlarge * 4,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.regular,
  },
  buzzerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.neonStrong,
  },
  buzzerDisabled: {
    opacity: 0.5,
  },
  answerContainer: {
    marginBottom: SPACING.xxxlarge,
  },
  answerInput: {
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.input,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    marginBottom: SPACING.large,
    marginTop: SPACING.regular,
  },
  answerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.regular,
  },
  answerButton: {
    flex: 1,
  },
  answerReveal: {
    marginTop: SPACING.large,
  },
});

export default JeopardyRebuildingRoundScreen;
