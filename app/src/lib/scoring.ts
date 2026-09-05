
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseClient';

const functions = getFunctions(app);
const calculateGameResultsCallable = httpsCallable(functions, 'calculateGameResults');

/**
 * Submits a player's answers to the backend for final scoring.
 *
 * @param gameSessionId The ID of the current game session.
 * @param partnerAnswers An object containing the player's answers (e.g., { vibe: 85 }).
 * @returns The result from the cloud function, indicating if the game is complete or pending.
 */
export async function submitAnswersAndCalculate(gameSessionId: string, partnerAnswers: any) {
  try {
    const result = await calculateGameResultsCallable({ 
        gameSessionId,
        answers: partnerAnswers
    });
    return result.data as { status: 'completed' | 'pending', score?: number };
  } catch (error) {
    console.error("Error submitting game results:", error);
    throw new Error('Failed to submit answers.');
  }
}
