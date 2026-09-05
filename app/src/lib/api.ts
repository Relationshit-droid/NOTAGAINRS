/**
 * API Functions for RELATIONSHIT! - The Game
 * 
 * This module exports all API functions organized by domain:
 * - userApi: User management
 * - coupleApi: Couple linking and management
 * - gamesApi: Game sessions and categories
 * - sosApi: SOS fight resolution
 * - marcieApi: Dr. Marcie AI chat
 * - leaderboardApi: Leaderboard and rankings
 * - loveArcadeApi: Love Arcade specific endpoints
 * 
 * ALL data flows through the backend. No direct Firestore calls.
 */

import { get, post, put, del, ApiError } from './httpClient';

// ============================================================================
// Type Definitions (matching backend/server.py)
// ============================================================================

export interface User {
  id: string;
  email: string;
  display_name: string;
  partner_id: string | null;
  couple_code: string | null;
  couple_id?: string | null;
  sarcasm_level: number;
  trust_level: number;
  vulnerability_level: number;
  points: number;
  plan: string;
  created_at: string;
  updated_at?: string;
  // Onboarding origin-story answers, stored encrypted on the user document.
  origin_story?: string;
  first_red_flag?: string;
  relationship_score?: number;
}

export interface Couple {
  id: string;
  user1_id: string;
  user2_id: string;
  partners?: [string, string];
  created_at: string;
  trust_meter: number;
  vulnerability_meter: number;
  romance_meter: number;
  connection_meter: number;
  total_points: number;
  streak_days: number;
  invite_code?: string;
  last_interaction?: string;
  origin_story?: {
    meet_cute: string;
    first_impression: string;
    turning_point: string;
    current_status: string;
  };
  first_red_flag?: string;
}

export interface CouplePresence {
  couple_id: string;
  user1_online: boolean;
  user2_online: boolean;
  total_connections: number;
  timestamp?: string;
}

export interface GameCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  games: string[];
}

export interface GameDetails {
  id: string;
  name: string;
  max_score: number;
  min_players: number;
  estimated_time: number;
  category?: string;
  category_name?: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  couple_id?: string | null;
  game_id: string;
  category_id: string;
  started_at: string;
  completed: boolean;
  completed_at?: string;
  score: number;
  responses: any[];
  game_state?: Record<string, any>;
  partner_progress?: Record<string, any> | null;
  status: 'active' | 'completed' | 'expired' | 'abandoned';
  timeout_at?: string;
  achievements?: string[];
}

export interface GameAnswer {
  id: string;
  session_id: string;
  user_id: string;
  question_id: string;
  answer: any;
  is_correct?: boolean;
  points_earned: number;
  submitted_at: string;
  metadata?: Record<string, any>;
}

export interface SOSSession {
  id: string;
  initiator_id: string;
  couple_id: string;
  status: 'waiting_for_partner' | 'one_submitted' | 'analyzing' | 'completed' | 'expired';
  started_at: string;
  completed_at?: string;
  submissions: Record<string, SOSBoothSubmission>;
  verdict?: string;
  expires_at: string;
}

export interface SOSBoothSubmission {
  i_feel: string;
  when_partner: string;
  because_i_tell_myself: string;
  what_i_need: string;
  submitted_at?: string;
}

export interface MarcieResponse {
  response: string;
  animation: string;
  sarcasm_level: number;
}

export interface HealthCheck {
  status: string;
  app: string;
  version: string;
  firebase: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  couple_id: string;
  display_names: [string, string];
  total_score: number;
  streak_days: number;
  trust_meter: number;
}

export interface LoveArcadeGame {
  id: string;
  name: string;
  phase: string;
  format: string;
  description: string;
  max_score: number;
  lifelines?: string[];
  scoring?: Record<string, number>;
  sub_games?: string[];
  categories?: string[];
  has_daily_double?: boolean;
  has_final_jeopardy?: boolean;
}

// ============================================================================
// User API
// ============================================================================

export const userApi = {
  /**
   * Create a new user in the backend after Firebase Auth signup
   */
  create: async (
    data: { email: string; display_name: string },
    token: string
  ): Promise<User> => {
    return post<User>('users', data, { token });
  },

  /**
   * Get user by ID
   */
  get: async (userId: string, token: string): Promise<User> => {
    return get<User>(`users/${userId}`, { token });
  },

  /**
   * Update user profile
   */
  update: async (
    userId: string,
    updates: Partial<User>,
    token: string
  ): Promise<User> => {
    return put<User>(`users/${userId}`, updates, { token });
  },

  /**
   * Update user's sarcasm level (1-4)
   */
  updateSarcasm: async (
    userId: string,
    level: number,
    token: string
  ): Promise<{ success: boolean; sarcasm_level: number; name: string }> => {
    return put<{ success: boolean; sarcasm_level: number; name: string }>(
      `users/${userId}/sarcasm`,
      { level },
      { token }
    );
  },
};

// ============================================================================
// Couple API
// ============================================================================

export const coupleApi = {
  /**
   * Create a new couple and generate invite code
   */
  createCouple: async (
    userId: string,
    token: string
  ): Promise<{
    id: string;
    invite_code: string;
    user1_id: string;
    status: string;
  }> => {
    return post<{
      id: string;
      invite_code: string;
      user1_id: string;
      status: string;
    }>('couples/create', { user_id: userId }, { token });
  },

  /**
   * Get current user's couple info
   */
  getCoupleForUser: async (
    userId: string,
    token: string
  ): Promise<Couple | null> => {
    return get<Couple>(`couples/me?user_id=${userId}`, { token });
  },

  /**
   * Link a user with their partner using a couple code
   */
  joinCouple: async (
    userId: string,
    partnerCode: string,
    token: string
  ): Promise<{
    success: boolean;
    couple_id: string;
    partner: { id: string; display_name: string };
  }> => {
    return post<{
      success: boolean;
      couple_id: string;
      partner: { id: string; display_name: string };
    }>('couples/join', { user_id: userId, invite_code: partnerCode }, { token });
  },

  /**
   * Get couple data by ID
   */
  get: async (coupleId: string, token: string): Promise<Couple> => {
    return get<Couple>(`couples/${coupleId}`, { token });
  },

  /**
   * Get couple presence (online status)
   */
  getPresence: async (coupleId: string, token: string): Promise<CouplePresence> => {
    return get<CouplePresence>(`couples/${coupleId}/presence`, { token });
  },

  /**
   * Update couple relationship meters
   */
  updateMeters: async (
    coupleId: string,
    meters: {
      trust_meter?: number;
      vulnerability_meter?: number;
      romance_meter?: number;
      connection_meter?: number;
    },
    token: string
  ): Promise<Couple> => {
    return put<Couple>(`couples/${coupleId}/meters`, meters, { token });
  },

  /**
   * Update couple's origin story (onboarding data)
   */
  updateOriginStory: async (
    coupleId: string,
    userId: string,
    originStory: {
      meet_cute: string;
      first_impression: string;
      turning_point: string;
      current_status: string;
    },
    firstRedFlag: string | undefined,
    token: string
  ): Promise<Couple> => {
    return put<Couple>(
      `couples/${coupleId}/origin-story`,
      { user_id: userId, origin_story: originStory, first_red_flag: firstRedFlag },
      { token }
    );
  },
};

// ============================================================================
// Games API
// ============================================================================

export const gamesApi = {
  /**
   * Get all game categories
   */
  getCategories: async (): Promise<{ categories: GameCategory[] }> => {
    return get<{ categories: GameCategory[] }>('games/categories');
  },

  /**
   * Get a specific category with its games
   */
  getCategory: async (categoryId: string): Promise<GameCategory & { games_detail: GameDetails[] }> => {
    return get<GameCategory & { games_detail: GameDetails[] }>(`games/categories/${categoryId}`);
  },

  /**
   * Get complete game registry
   */
  getRegistry: async (): Promise<{ games: Record<string, GameDetails>; total_games: number; categories: number }> => {
    return get<{ games: Record<string, GameDetails>; total_games: number; categories: number }>('games/registry');
  },

  /**
   * Get specific game details
   */
  getGame: async (gameId: string): Promise<GameDetails> => {
    return get<GameDetails>(`games/${gameId}`);
  },

  /**
   * Create a new game session
   */
  createSession: async (
    userId: string,
    gameId: string,
    categoryId: string,
    token: string,
    coupleId?: string
  ): Promise<GameSession> => {
    return post<GameSession>(
      'games/sessions',
      { user_id: userId, game_id: gameId, category_id: categoryId, couple_id: coupleId },
      { token }
    );
  },

  /**
   * Get game session by ID
   */
  getSession: async (sessionId: string, token: string): Promise<GameSession> => {
    return get<GameSession>(`games/sessions/${sessionId}`, { token });
  },

  /**
   * Update a game session (score, completion status, responses)
   */
  updateSession: async (
    sessionId: string,
    data: {
      score?: number;
      completed?: boolean;
      responses?: any[];
      game_state?: Record<string, any>;
      partner_progress?: Record<string, any>;
    },
    token: string
  ): Promise<GameSession> => {
    return put<GameSession>(`games/sessions/${sessionId}`, data, { token });
  },

  /**
   * Submit an answer for a game session
   */
  submitAnswer: async (
    sessionId: string,
    data: {
      user_id: string;
      question_id: string;
      answer: any;
      timestamp?: string;
      metadata?: Record<string, any>;
    },
    token: string
  ): Promise<GameAnswer> => {
    return post<GameAnswer>(`games/sessions/${sessionId}/answers`, data, { token });
  },

  /**
   * Complete a game session with final results
   */
  completeSession: async (
    sessionId: string,
    data: {
      final_score: number;
      responses?: any[];
      game_state?: Record<string, any>;
      achievements?: string[];
    },
    token: string
  ): Promise<GameSession> => {
    return post<GameSession>(`games/sessions/${sessionId}/complete`, data, { token });
  },

  /**
   * Get user's game sessions
   */
  getUserSessions: async (
    userId: string,
    token: string,
    limit?: number
  ): Promise<{ sessions: GameSession[]; count: number }> => {
    const query = limit ? `?limit=${limit}` : '';
    return get<{ sessions: GameSession[]; count: number }>(`users/${userId}/sessions${query}`, { token });
  },

  /**
   * Get couple's game sessions
   */
  getCoupleSessions: async (
    coupleId: string,
    token: string,
    limit?: number
  ): Promise<{ sessions: GameSession[]; count: number }> => {
    const query = limit ? `?limit=${limit}` : '';
    return get<{ sessions: GameSession[]; count: number }>(`couples/${coupleId}/sessions${query}`, { token });
  },
};

// ============================================================================
// SOS API
// ============================================================================

export const sosApi = {
  /**
   * Create a new SOS fight resolution session
   */
  createSession: async (
    initiatorId: string,
    coupleId: string,
    token: string
  ): Promise<SOSSession> => {
    return post<SOSSession>(
      'sos/sessions',
      { initiator_id: initiatorId, couple_id: coupleId },
      { token }
    );
  },

  /**
   * Submit a booth response in an SOS session
   */
  submitBooth: async (
    sessionId: string,
    userId: string,
    responses: SOSBoothSubmission,
    token: string
  ): Promise<SOSSession> => {
    return post<SOSSession>(
      `sos/sessions/${sessionId}/submit`,
      {
        session_id: sessionId,
        user_id: userId,
        i_feel: responses.i_feel,
        when_partner: responses.when_partner,
        because_i_tell_myself: responses.because_i_tell_myself,
        what_i_need: responses.what_i_need,
      },
      { token }
    );
  },

  /**
   * Get SOS session by ID
   */
  getSession: async (sessionId: string, token: string): Promise<SOSSession> => {
    return get<SOSSession>(`sos/sessions/${sessionId}`, { token });
  },

  /**
   * Trigger AI analysis of SOS session
   */
  analyzeSession: async (sessionId: string, token: string): Promise<SOSSession> => {
    return post<SOSSession>(`sos/sessions/${sessionId}/analyze`, {}, { token });
  },
};

// ============================================================================
// Dr. Marcie AI API
// ============================================================================

export const marcieApi = {
  /**
   * Chat with Dr. Marcie AI
   */
  chat: async (
    userId: string,
    context: string,
    message: string,
    sarcasmLevel: number,
    token: string,
    gameContext?: string
  ): Promise<MarcieResponse> => {
    return post<MarcieResponse>(
      'marcie/chat',
      {
        user_id: userId,
        context,
        message,
        sarcasm_level: sarcasmLevel,
        game_context: gameContext,
      },
      { token }
    );
  },
};

// ============================================================================
// Leaderboard API
// ============================================================================

export const leaderboardApi = {
  /**
   * Get global leaderboard
   */
  getGlobal: async (limit?: number): Promise<{ leaderboard: LeaderboardEntry[] }> => {
    const query = limit ? `?limit=${limit}` : '';
    return get<{ leaderboard: LeaderboardEntry[] }>(`leaderboard/global${query}`);
  },

  /**
   * Get category-specific leaderboard
   */
  getCategory: async (
    categoryId: string,
    limit?: number
  ): Promise<{ category: string; entries: any[] }> => {
    const query = limit ? `?limit=${limit}` : '';
    return get<{ category: string; entries: any[] }>(`leaderboard/categories/${categoryId}${query}`);
  },
};

// ============================================================================
// Love Arcade API
// ============================================================================

export const loveArcadeApi = {
  /**
   * Get all Love Arcade games
   */
  getGames: async (): Promise<{ games: LoveArcadeGame[] }> => {
    return get<{ games: LoveArcadeGame[] }>('love-arcade/games');
  },

  /**
   * Get questions for a specific Love Arcade game
   */
  getQuestions: async (gameId: string): Promise<{ game_id: string; questions: any[]; total_questions: number }> => {
    return get<{ game_id: string; questions: any[]; total_questions: number }>(`love-arcade/games/${gameId}/questions`);
  },
};

// ============================================================================
// Health Check
// ============================================================================

export const healthApi = {
  /**
   * Check backend API health
   */
  check: async (): Promise<HealthCheck> => {
    return get<HealthCheck>('health');
  },
};

// Compatibility helper for tests that reference gamesApi.healthApi
;(gamesApi as any).healthApi = healthApi;

// ============================================================================
// Export all APIs as default
// ============================================================================

export default {
  userApi,
  coupleApi,
  gamesApi,
  sosApi,
  marcieApi,
  leaderboardApi,
  loveArcadeApi,
  healthApi,
  ApiError,
};
