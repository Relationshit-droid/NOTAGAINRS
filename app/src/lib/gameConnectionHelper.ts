/**
 * Game Connection Helper
 * 
 * Utility functions to help connect games to the backend API.
 * 
 * Usage in any game:
 * 
 * import { connectGameToSession } from '../../lib/gameConnectionHelper';
 * 
 * // In your component:
 * const { session, updateScore, completeGame, isLoading } = connectGameToSession('game-id', 'category-id');
 */

import { useGameSession } from '../hooks/useGameSession';
import { getGameByScreen } from '../lib/gameRegistry';

/**
 * Connect a game to backend session using screen name
 * 
 * @param screenName - The name of the screen component (e.g., 'TruthOrTrust')
 * @param coupleId - Optional couple ID for multiplayer
 * @returns Game session hook return value
 */
export function useGameConnection(screenName: string, coupleId?: string) {
  // Look up game info from registry
  const gameInfo = getGameByScreen(screenName);
  
  if (!gameInfo) {
    console.warn(`[GameConnection] No game found for screen: ${screenName}. Using defaults.`);
  }
  
  const gameId = gameInfo?.id || screenName.toLowerCase();
  const categoryId = gameInfo?.categoryId || 'romance-hub';
  
  // Use the game session hook
  return useGameSession(gameId, categoryId, coupleId);
}

/**
 * Connect a game to backend session using game ID directly
 * 
 * @param gameId - The game ID (e.g., 'truth-or-trust')
 * @param categoryId - The category ID (e.g., 'emotional-connection')
 * @param coupleId - Optional couple ID for multiplayer
 * @returns Game session hook return value
 */
export function useDirectGameConnection(
  gameId: string,
  categoryId: string,
  coupleId?: string
) {
  return useGameSession(gameId, categoryId, coupleId);
}

/**
 * Helper to format game completion results
 */
export interface GameCompletionResult {
  score: number;
  responses?: any[];
  achievements?: string[];
  metadata?: Record<string, any>;
}

export function createCompletionResult(
  score: number,
  responses?: any[],
  achievements?: string[],
  metadata?: Record<string, any>
): GameCompletionResult {
  return {
    score,
    responses,
    achievements,
    metadata
  };
}

/**
 * Helper to track score updates
 */
export class ScoreTracker {
  private score: number = 0;
  private updateFn: ((score: number) => Promise<void>) | null = null;
  
  constructor(updateScoreFn?: (score: number) => Promise<void>) {
    this.updateFn = updateScoreFn;
  }
  
  setUpdateFunction(updateFn: (score: number) => Promise<void>) {
    this.updateFn = updateFn;
  }
  
  add(points: number) {
    this.score += points;
    if (this.updateFn) {
      this.updateFn(this.score);
    }
    return this.score;
  }
  
  set(points: number) {
    this.score = points;
    if (this.updateFn) {
      this.updateFn(this.score);
    }
    return this.score;
  }
  
  get() {
    return this.score;
  }
  
  reset() {
    this.score = 0;
  }
}

export default {
  useGameConnection,
  useDirectGameConnection,
  createCompletionResult,
  ScoreTracker
};
