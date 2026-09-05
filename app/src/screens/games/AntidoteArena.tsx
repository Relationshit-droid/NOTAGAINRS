import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppNavigation } from "../../hooks/useAppNavigation";

import { ScreenLayout, Typography, SquishyButton } from "../../components/ui";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, ANIMATIONS, GRADIENTS } from "../../theme";

// Uses the modular `firebase` web SDK (works on web + native via Expo);
// @react-native-firebase is native-only and crashed the web bundle with
// "No Firebase App '[DEFAULT]' has been created".
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";

const AntidoteArena = ({ route }: { route: any }) => {
  const { gameId } = route.params ?? {};
  const navigation = useAppNavigation();

  const [gameState, setGameState] = useState<any>(null);
  const [selectedAntidote, setSelectedAntidote] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!gameId) return;
    const unsub = onSnapshot(
      doc(db, "active_games", gameId),
      (snap) => {
        const data = snap.data();
        if (data) {
          setGameState(data);
        }
      },
      (err) => console.warn("[AntidoteArena] snapshot unavailable:", err?.message),
    );

    return () => unsub();
  }, [gameId]);

  const handleAntidoteSelection = (antidote: string) => {
    setSelectedAntidote(antidote);
    const isCorrect = antidote === gameState.correctAntidote;

    updateDoc(doc(db, "active_games", gameId), {
      score: increment(isCorrect ? 100 : -50),
    }).catch((err) => console.warn("[AntidoteArena] score update failed:", err?.message));

    // Navigate to next round or results
    setTimeout(() => {
      navigation.navigate("AntidoteArena", { gameId });
    }, ANIMATIONS.duration.slow);
  };

  if (!gameState) {
    return (
      <ScreenLayout showHeader={false} scrollable={true} showMarcie={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body">Loading...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Fight the four horsemen of relationship apocalypse! Each antidote represents a positive communication strategy.">
      <View style={styles.content}>
        <Typography variant="h1" style={styles.title}>
          The Love Arcade
        </Typography>
        <Typography variant="h2" style={styles.subtitle}>
          +100 Games to Deepen Connection
        </Typography>

        <View style={styles.gameContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="sword-cross" size={64} color={COLORS.vibrantPink} />
          </View>
          
          <Typography variant="h3" style={styles.horsemanText}>
            The Horseman of {gameState.horseman} is attacking!
          </Typography>

          <View style={styles.antidoteGrid}>
            {gameState.antidotes?.map((antidote: any) => (
              <SquishyButton
                key={antidote.name}
                onPress={() => handleAntidoteSelection(antidote.name)}
                style={styles.antidoteButton}
              >
                <MaterialCommunityIcons name={antidote.icon} size={32} color={COLORS.textPrimary} />
                <Typography variant="caption" style={styles.antidoteText}>
                  {antidote.name}
                </Typography>
              </SquishyButton>
            ))}
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.lg,
  },
  horsemanText: {
    color: COLORS.vibrantPink,
    textAlign: 'center',
    marginBottom: SPACING.xlarge,
    backgroundColor: COLORS.backgroundInput,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.xxlarge,
  },
  antidoteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.regular,
  },
  antidoteButton: {
    width: '45%',
    marginBottom: SPACING.regular,
  },
  antidoteText: {
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default AntidoteArena;
