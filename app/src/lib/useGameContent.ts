
import { useState, useEffect } from 'react';
import { db as firestore } from '../lib/firebaseClient';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

type GameContent = {
  id: string;
  marcie_tips?: string[];
  [key: string]: unknown;
};

export const useGameContent = (coupleId?: string, gameSessionId?: string) => {
  // useState(null) infers the literal type `null`, so every later setState
  // with real data was a type error and the values were unusable.
  const [gameContent, setGameContent] = useState<GameContent | null>(null);
  const [sessionState, setSessionState] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coupleId) return;

    // Listener for the couple's active game
    const coupleRef = doc(firestore, 'couples', coupleId);
    const unsubscribeCouple = onSnapshot(coupleRef, async (coupleDoc) => {
      if (coupleDoc.exists()) {
        const { active_game_id } = coupleDoc.data();
        if (active_game_id) {
          // Fetch the game content from the library
          const gameRef = doc(firestore, 'game_library', active_game_id);
          const gameDoc = await getDoc(gameRef); // Changed to getDoc for one-time fetch

          if (gameDoc.exists()) {
            setGameContent({ id: gameDoc.id, ...gameDoc.data() });
          } else {
            setError('Game content not found.');
          }
        }
      }
      setIsLoading(false);
    }, err => {
      setError(err.message);
      setIsLoading(false);
    });

    return () => unsubscribeCouple();

  }, [coupleId]);

  useEffect(() => {
    if (!gameSessionId) return;

    // Listener for the real-time game session state
    const sessionRef = doc(firestore, 'game_sessions', gameSessionId);
    const unsubscribeSession = onSnapshot(sessionRef, (sessionDoc) => {
      if (sessionDoc.exists()) {
        setSessionState(sessionDoc.data());
      }
    }, err => {
      setError(err.message);
    });

    return () => unsubscribeSession();

  }, [gameSessionId]);

  const getMarcieCommentary = () => {
    if (!gameContent || !gameContent.marcie_tips || gameContent.marcie_tips.length === 0) {
      return "Let's get on with it, shall we?"; // Default fallback
    }
    const tips = gameContent.marcie_tips;
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  };

  return { gameContent, sessionState, isLoading, error, getMarcieCommentary };
};
