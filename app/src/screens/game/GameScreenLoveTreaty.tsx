import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';
import { useRoute, useNavigation } from '@react-navigation/native';

const ARTICLES = [
  { title: "Article I: Communication Protocols", prompt: "When disagreements arise, we will..." },
  { title: "Article II: Shared Responsibilities", prompt: "To maintain a balanced home environment, we will..." },
  { title: "Article III: Quality Time", prompt: "We will dedicate time to each other by..." },
];

const GameScreenLoveTreaty = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { gameId, coupleId } = (route.params ?? {}) as { gameId?: string; coupleId?: string };
  
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [player1Stance, setPlayer1Stance] = useState('');
  const [player2Stance, setPlayer2Stance] = useState('');
  const [mergedStance, setMergedStance] = useState('');
  const [gameStatus, setGameStatus] = useState<'drafting' | 'negotiating' | 'completed'>('drafting');
  const currentArticle = ARTICLES[currentArticleIndex];

  const handleStanceUpdate = (stance: string, player: 1 | 2) => {
    if (player === 1) {
      setPlayer1Stance(stance);
    } else {
      setPlayer2Stance(stance);
    }
  };

  const handleMergeUpdate = (stance: string) => {
    setMergedStance(stance);
  };

  const ratifyArticle = () => {
    const nextArticleIndex = currentArticleIndex + 1;

    if (nextArticleIndex < ARTICLES.length) {
      setCurrentArticleIndex(nextArticleIndex);
      setPlayer1Stance('');
      setPlayer2Stance('');
      setMergedStance('');
      setGameStatus('drafting');
    } else {
      setGameStatus('completed');
      Alert.alert("Congratulations!", "You have successfully ratified your Love Treaty.");
      navigation.goBack();
    }
  };

  return (
    <ScreenLayout 
      showMarcie={true} 
      marcieQuote="Craft your Love Treaty together. Each article is a promise to each other."
      marcieAnimation="listening"
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            The Love Arcade
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            +100 Games to Deepen Connection
          </Typography>

          <Typography variant="h2" style={styles.articleTitle}>
            Love Treaty
          </Typography>
          
          <Typography variant="caption" style={styles.articleCounter}>
            Article {currentArticleIndex + 1} of {ARTICLES.length}
          </Typography>

          <GlassCard style={styles.articleCard}>
            <Typography variant="h3" style={styles.articleName}>
              {currentArticle.title}
            </Typography>
            <Typography variant="body" style={styles.articlePrompt}>
              {currentArticle.prompt}
            </Typography>
          </GlassCard>

          <View style={styles.inputContainer}>
            <Typography variant="label" style={styles.inputLabel}>
              Your Stance
            </Typography>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Write your personal clause..."
              placeholderTextColor={COLORS.textHint}
              value={player1Stance}
              onChangeText={(text) => handleStanceUpdate(text, 1)}
              editable={gameStatus === 'drafting'}
            />
          </View>

          {gameStatus === 'negotiating' && (
            <View style={styles.inputContainer}>
              <Typography variant="label" style={styles.inputLabel}>
                Partner's Stance
              </Typography>
              <View style={styles.partnerStance}>
                <Typography variant="body" style={{ opacity: 0.7 }}>
                  {player2Stance || "Waiting for partner's input..."}
                </Typography>
              </View>
              <Typography variant="label" style={styles.inputLabel}>
                Merged Stance
              </Typography>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Negotiate and merge your clauses..."
                placeholderTextColor={COLORS.textHint}
                value={mergedStance}
                onChangeText={handleMergeUpdate}
              />
            </View>
          )}

          <SquishyButton
            variant="primary"
            size="large"
            onPress={ratifyArticle}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              {currentArticleIndex < ARTICLES.length - 1 ? 'Ratify & Continue' : 'Complete Treaty'}
            </Typography>
          </SquishyButton>

          {gameStatus === 'drafting' && (
            <SquishyButton
              variant="ghost"
              size="medium"
              onPress={() => setGameStatus('negotiating')}
              style={styles.switchButton}
            >
              <Typography variant="button" color={COLORS.textPrimary}>
                Switch to Negotiation Mode
              </Typography>
            </SquishyButton>
          )}
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
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
  articleTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  articleCounter: {
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: SPACING.lg,
  },
  articleCard: {
    marginBottom: SPACING.lg,
  },
  articleName: {
    marginBottom: SPACING.sm,
  },
  articlePrompt: {
    color: COLORS.vibrantPink,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    color: COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  partnerStance: {
    backgroundColor: `${COLORS.backgroundPrimary}80`,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    minHeight: 100,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  switchButton: {
    marginTop: SPACING.md,
  },
});

export default GameScreenLoveTreaty;
