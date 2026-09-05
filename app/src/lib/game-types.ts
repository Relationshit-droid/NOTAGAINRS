// Universal game types and interfaces based on Technical Implementation 2.0

export interface Couple {
  id: string;
  player1_id: string;
  player2_id: string;
  couple_code: string;
  origin_story: {
    meet_cute: string;
    first_impression: string;
    turning_point: string;
    current_status: string;
  };
  relationship_diagnosis: string;
  trust_meter: number;
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  couple_id: string;
  game_name: string;
  game_state: Record<string, any>;
  player1_data: Record<string, any>;
  player2_data: Record<string, any>;
  scores: {
    player1: number;
    player2: number;
  };
  completed: boolean;
  started_at: string;
  completed_at?: string;
  session_data: Record<string, any>;
}

export interface RealtimeSync {
  id: string;
  couple_id: string;
  channel: string;
  data: Record<string, any>;
  sender_id: string;
  created_at: string;
}

export interface MarcieConfig {
  user_id: string;
  personality_level: number;
  voice_settings: {
    voice_id: string;
    speed: number;
  };
  sarcasm_level: number;
  created_at: string;
  updated_at: string;
}

export type GameState = 
  | 'waiting_for_partner'
  | 'loading_content'
  | 'ready_to_start'
  | 'question_active'
  | 'waiting_for_answer'
  | 'answer_submitted'
  | 'correct_answer'
  | 'wrong_answer'
  | 'vulnerable_input_detected'
  | 'game_loss'
  | 'game_win'
  | 'game_complete';

export interface GameTemplateProps {
  gameId: string;
  coupleId: string;
  onComplete: (results: GameResults) => void;
  onExit: () => void;
}

export interface GameResults {
  scores: {
    player1: number;
    player2: number;
  };
  winner: 'player1' | 'player2' | 'tie';
  duration: number;
  marcieCommentary: string;
  achievements: string[];
}

export interface MarcieAnimation {
  type: 'idle' | 'impatient' | 'correct' | 'listening' | 'wrong' | 'shocked' | 'thinking' | 'warning';
  speech?: string;
  duration?: number;
}

export interface BuzzerData {
  playerId: string;
  timestamp: number;
  questionId: string;
}

export interface JeopardyCategory {
  id: string;
  name: string;
  clues: JeopardyClue[];
}

export interface JeopardyClue {
  id: string;
  value: number;
  clue: string;
  answer: string;
  answered: boolean;
  answered_by?: string;
  buzz_times: Record<string, number>;
}

export interface AIContentRequest {
  gameType: string;
  coupleContext: {
    origin_story: Couple['origin_story'];
    relationship_diagnosis: string;
  };
  prompt: string;
}

export interface AIContentResponse {
  content: any;
  categories?: JeopardyCategory[];
  questions?: any[];
  scenarios?: any[];
  marcieCommentary?: string;
}