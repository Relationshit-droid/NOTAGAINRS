
import { doc, onSnapshot, updateDoc, DocumentData, Unsubscribe } from 'firebase/firestore';
import { db as firestore } from './firebaseClient';
import { useGameStore } from './game-store';
import type { GameSession } from './game-types';

let unsubscribe: Unsubscribe | null = null;

/**
 * Subscribes to a real-time stream of a game session from Firestore.
 * Updates the Zustand store whenever the game state changes.
 *
 * @param gameSessionId The unique identifier for the game session.
 * @returns A function to unsubscribe from the listener.
 */
export function subscribeToGameSession(gameSessionId: string) {
  const { setSession, setLoading, setError } = useGameStore.getState();
  setLoading(true);

  const docRef = doc(firestore, 'game_sessions', gameSessionId);

  unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as GameSession;
        setSession({ ...data, id: snapshot.id });
      } else {
        setError(`Game session not found: ${gameSessionId}`);
      }
    },
    (err) => {
      console.error("Firestore subscription error:", err);
      setError("Failed to connect to the game session.");
    }
  );

  return unsubscribe;
}

/**
 * Unsubscribes from the current game session listener.
 */
export function unsubscribeFromGame() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}

/**
 * Updates the state of a game session in Firestore.
 * Frontend validation ensures only the current player can make a move.
 *
 * @param gameSessionId The ID of the game session to update.
 * @param newState A partial object of the new state to merge with the existing one.
 * @param currentUserId The UID of the user attempting the update.
 */
export async function updateGameState(gameSessionId: string, newState: Partial<GameSession>, currentUserId: string) {
  const session = useGameStore.getState().currentSession;

  // Frontend validation: Only the player whose turn it is can update the state.
  if (!session || session.current_turn !== currentUserId) {
    throw new Error("It's not your turn!");
  }

  const docRef = doc(firestore, 'game_sessions', gameSessionId);
  await updateDoc(docRef, newState);
}

