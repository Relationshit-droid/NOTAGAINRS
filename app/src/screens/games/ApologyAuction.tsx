import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const { width } = Dimensions.get('window');

const APOLOGY_CARDS = [
  { id: '1', text: "I'm sorry you felt that way...", type: 'avoidance', value: 10 },
  { id: '2', text: "I shouldn't have raised my voice", type: 'ownership', value: 80 },
  { id: '3', text: "I was wrong and I take full responsibility", type: 'accountability', value: 100 },
  { id: '4', text: "Next time I'll pause before responding", type: 'repair', value: 70 },
  { id: '5', text: "I hurt you and I'm deeply sorry", type: 'empathy', value: 90 },
];

export default function ApologyAuction({ route, navigation }: any) {
  const navigationHook = useAppNavigation();
  const { gameId: routeGameId } = route.params || {};
  
  // Get game info from registry
  const gameInfo = getGameByScreen('ApologyAuction');
  const GAME_ID = gameInfo?.id || 'apology-auction';
  const CATEGORY_ID = gameInfo?.categoryId || 'conflict-resolution';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [round, setRound] = useState(1);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const selectCard = (cardId: string) => {
    setSelectedCard(cardId);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const submitBid = async () => {
    if (!selectedCard) return;

    const card = APOLOGY_CARDS.find(c => c.id === selectedCard);
    if (card) {
      const newScore = playerScore + card.value;
      const newRound = round + 1;
      
      setPlayerScore(newScore);
      setRound(newRound);
      
      // Save to backend
      await updateScore(newScore, [{
        round: round,
        selectedCard: card.id,
        cardText: card.text,
        cardType: card.type,
        points: card.value
      }]);
      
      // Check if game should end
      if (newRound > 5) {
        await completeGame(newScore, [{
          completed: true,
          totalRounds: 5,
          finalScore: newScore,
          averageScore: Math.round(newScore / 5)
        }]);
        
        navigationHook.navigate('GameResults', {
          score: newScore,
          gameId: GAME_ID,
          sessionId: session?.id
        });
        return;
      }
      
      setSelectedCard(null);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading apology auction...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Genuine apologies are the foundation of trust! Choose the most heartfelt option to win this auction.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Typography variant="h1" style={styles.title}>
          The Love Arcade
        </Typography>
        <Typography variant="h2" style={styles.subtitle}>
          +100 Games to Deepen Connection
        </Typography>

        <GlassCard>
          <LinearGradient
            colors={[COLORS.backgroundInput, COLORS.backgroundInput]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Typography variant="h3" style={styles.roundText}>
              Round {round} of 5
            </Typography>
            <Typography variant="body" style={styles.instructionText}>
              Select the most genuine apology for the situation
            </Typography>

            <View style={styles.cardsContainer}>
              {APOLOGY_CARDS.map((card) => (
                <Animated.View 
                  key={card.id}
                  style={[
                    { transform: [{ scale: selectedCard === card.id ? scaleAnim : 1 }] }
                  ]}
                >
                  <LinearGradient
                    colors={GRADIENTS.primary.colors}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={[
                      styles.card,
                      selectedCard === card.id && styles.selectedCard
                    ]}
                  >
                    <SquishyButton
                      style={styles.squishyButton}
                      onPress={() => selectCard(card.id)}
                    >
                      <Typography variant="body" style={[styles.cardText, selectedCard === card.id && styles.selectedCardText]}>
                        {card.text}
                      </Typography>
                      <View style={styles.cardFooter}>
                        <Typography variant="caption" style={[styles.cardValue, selectedCard === card.id && styles.selectedCardValue]}>
                          Value: {card.value} pts
                        </Typography>
                      </View>
                    </SquishyButton>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>

            <SquishyButton
              style={styles.submitButton}
              onPress={submitBid}
              disabled={!selectedCard}
            >
              <Typography variant="button" style={styles.buttonText}>
                Bid Apology
              </Typography>
            </SquishyButton>
          </LinearGradient>
        </GlassCard>

        <View style={styles.scoreContainer}>
          <Typography variant="caption" style={styles.scoreLabel}>Your Score</Typography>
          <Typography variant="h2" style={styles.scoreValue}>{playerScore}</Typography>
        </View>
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxlarge,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.lg,
  },
  gradientContainer: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  roundText: {
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  instructionText: {
    marginBottom: SPACING.lg,
    color: COLORS.textSecondary,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  card: {
    flex: 1,
    minWidth: (width - SPACING.lg * 4) / 2,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.large,
  },
  squishyButton: {
    flex: 1,
    padding: SPACING.md,
  },
  cardText: {
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  selectedCardText: {
    color: COLORS.backgroundPrimary,
  },
  selectedCard: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  cardFooter: {
    marginTop: SPACING.sm,
    alignItems: 'flex-end',
  },
  cardValue: {
    color: COLORS.mintGreen,
  },
  selectedCardValue: {
    color: COLORS.backgroundPrimary,
  },
  submitButton: {
    marginTop: SPACING.md,
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.textPrimary,
  },
  partnerCard: {
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  partnerLabel: {
    color: COLORS.mintGreen,
    marginBottom: SPACING.sm,
  },
  partnerText: {
    color: COLORS.textSecondary,
  },
  scoreContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  scoreLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    color: COLORS.vibrantPink,
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
