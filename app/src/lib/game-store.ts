import { create } from 'zustand';
import * as Haptics from '../utils/haptics';
import { auth } from './firebaseClient';
import { gamesApi } from './api';
import { gameRegistry } from './gameRegistry';
import { 
  GameSession, 
  GameResults, 
  GameState, 
  MarcieAnimation,
} from './game-types';

interface GameStore {
  // Current game session
  currentSession: GameSession | null;
  gameState: GameState;
  loading: boolean;
  error: string | null;
  
  // Partner synchronization
  partnerOnline: boolean;
  lastPartnerUpdate: number | null;
  
  // Marcie AI integration
  currentMarcieAnimation: MarcieAnimation | null;
  marcieVisible: boolean;
  
  // Game lifecycle methods
  initializeGame: (coupleId: string, gameName: string) => Promise<void>;
  updateGameState: (updates: Partial<GameSession['game_state']>) => Promise<void>;
  submitAnswer: (playerId: string, answer: any) => Promise<void>;
  handleBuzz: (playerId: string, questionId: string) => Promise<void>;
  endGame: (finalScores: GameResults['scores']) => Promise<void>;
  
  // Real-time sync
  subscribeToPartner: (coupleId: string) => () => void;
  broadcastUpdate: (channel: string, data: any) => Promise<void>;
  
  // Marcie AI integration
  triggerMarcieAnimation: (animation: MarcieAnimation) => void;
  hideMarcie: () => void;
  showMarcie: () => void;
  
  // Per-game progress (0-100), keyed by game id
  gameProgress: Record<string, number>;
  updateGameProgress: (gameId: string, progress: number) => void;

  // Utility methods
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetGame: () => void;
}

// Get an auth token for backend calls, if a user is signed in.
async function getToken(): Promise<string | undefined> {
  const user = auth.currentUser;
  return user ? user.getIdToken() : undefined;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameProgress: {},
  currentSession: null,
  gameState: 'waiting_for_partner',
  loading: false,
  error: null,
  partnerOnline: false,
  lastPartnerUpdate: null,
  currentMarcieAnimation: null,
  marcieVisible: true,

  initializeGame: async (coupleId: string, gameName: string) => {
    set({ loading: true, error: null });

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        set({ error: 'User not authenticated', loading: false });
        return;
      }

      const token = await currentUser.getIdToken();
      const categoryId = gameRegistry[gameName]?.categoryId || 'emotional-connection';

      // Persist through the backend (single source of truth).
      const backendSession = await gamesApi.createSession(
        currentUser.uid,
        gameName,
        categoryId,
        token,
        coupleId
      );

      // Internal (in-memory) session shape used by the game UI.
      const newSession: GameSession = {
        id: backendSession.id,
        couple_id: coupleId,
        game_name: gameName,
        game_state: {
          currentRound: 1,
          currentQuestion: null,
          activePlayer: null,
          buzzerEnabled: false,
          gameStarted: false,
        },
        player1_data: {},
        player2_data: {},
        scores: { player1: 0, player2: 0 },
        completed: false,
        started_at: backendSession.started_at || new Date().toISOString(),
        session_data: {},
      };

      set({
        currentSession: newSession,
        gameState: 'loading_content',
        loading: false,
      });
    } catch (error) {
      console.error('Failed to initialize game:', error);
      set({
        error: 'Failed to start game. Please try again.',
        loading: false,
      });
    }
  },

  updateGameState: async (updates: Partial<GameSession['game_state']>) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const newGameState = { ...currentSession.game_state, ...updates };
    set({
      currentSession: { ...currentSession, game_state: newGameState },
    });

    // Trigger haptic feedback for game state changes
    if (updates.buzzerEnabled !== undefined) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      const token = await getToken();
      await gamesApi.updateSession(currentSession.id, { game_state: newGameState }, token);
    } catch (error) {
      console.error('Failed to sync game state to backend:', error);
    }
  },

  submitAnswer: async (playerId: string, answer: any) => {
    const { currentSession, updateGameState } = get();
    if (!currentSession) return;

    try {
      const token = await getToken();
      await gamesApi.submitAnswer(
        currentSession.id,
        {
          user_id: playerId,
          question_id: 'generic',
          answer,
          timestamp: new Date().toISOString(),
        },
        token
      );

      // Update game state (optimistic local + backend sync)
      await updateGameState({
        answerSubmitted: true,
        answeringPlayer: playerId,
      });

      // Trigger Marcie animation for answer submitted
      get().triggerMarcieAnimation({
        type: 'listening',
        speech: "Interesting answer, darling...",
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
      set({ error: 'Failed to submit answer' });
    }
  },

  handleBuzz: async (playerId: string, questionId: string) => {
    const { currentSession, gameState } = get();
    if (!currentSession || gameState !== 'question_active') return;

    const buzzTimes = currentSession.session_data.buzzTimes || {};
    buzzTimes[questionId] = {
      ...buzzTimes[questionId],
      [playerId]: Date.now(),
    };

    // Haptic feedback for buzz
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Update game state to show who buzzed first (local + backend sync)
    await get().updateGameState({
      activePlayer: playerId,
      buzzerEnabled: false,
    });

    // Trigger Marcie animation
    get().triggerMarcieAnimation({
      type: 'thinking',
      speech: "First buzz! Go ahead, darling...",
    });
  },

  endGame: async (finalScores: GameResults['scores']) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const winner = finalScores.player1 > finalScores.player2 ? 'player1' :
                  finalScores.player2 > finalScores.player1 ? 'player2' : 'tie';

    set({
      gameState: 'game_complete',
      currentSession: {
        ...currentSession,
        scores: finalScores,
        completed: true,
      },
    });

    try {
      const token = await getToken();
      const finalScore = Math.max(finalScores.player1 || 0, finalScores.player2 || 0);
      await gamesApi.completeSession(
        currentSession.id,
        {
          final_score: finalScore,
          responses: [{ scores: finalScores }],
          game_state: get().currentSession?.game_state,
        },
        token
      );
    } catch (error) {
      console.error('Failed to complete game on backend:', error);
    }

    // Trigger victory/defeat animation
    get().triggerMarcieAnimation({
      type: winner === 'tie' ? 'thinking' : 'correct',
      speech: winner === 'player1' ? "Player One takes the crown!" :
              winner === 'player2' ? "Player Two reigns supreme!" :
              "A perfect tie! How romantic!",
    });
  },

  subscribeToPartner: (coupleId: string) => {
    // Real-time partner sync is deferred (not part of MVP). Kept as a no-op
    // so existing callers keep working without direct Firestore access.
    console.log('[game-store] realtime sync deferred for couple:', coupleId);
    return () => {};
  },

  broadcastUpdate: async (channel: string, data: any) => {
    // Realtime broadcast is deferred (not part of MVP).
    console.log('[game-store] broadcast deferred:', channel, data);
  },

  triggerMarcieAnimation: (animation: MarcieAnimation) => {
    set({
      currentMarcieAnimation: animation,
      marcieVisible: true,
    });

    // Auto-hide after duration
    if (animation.duration) {
      setTimeout(() => {
        set({ currentMarcieAnimation: null });
      }, animation.duration);
    }
  },

  hideMarcie: () => {
    set({ marcieVisible: false });
  },

  showMarcie: () => {
    set({ marcieVisible: true });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  // Several game screens call this on start/midpoint/completion. It was
  // referenced but never defined on the store, so those calls threw.
  updateGameProgress: (gameId: string, progress: number) => {
    set(state => ({
      gameProgress: {
        ...state.gameProgress,
        [gameId]: Math.max(0, Math.min(100, progress)),
      },
    }));
  },

  resetGame: () => {
    set({
      gameProgress: {},
      currentSession: null,
      gameState: 'waiting_for_partner',
      loading: false,
      error: null,
      partnerOnline: false,
      lastPartnerUpdate: null,
      currentMarcieAnimation: null,
      marcieVisible: true,
    });
  },
}));
