export type GameCategory = 'emotional' | 'conflict' | 'creative' | 'romance' | 'healing' | 'arcade';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GamePhase = 'setup' | 'active' | 'results';
export type InputType = 'text' | 'voice' | 'camera' | 'slider' | 'custom';

export interface GameState {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  xpReward: number;
  currentStep: number;
  totalTime: number;
  playerData: {
    vulnerabilityScore: number;
    honestyScore: number;
    completionTime: number;
    partnerSync: number;
  };
}

export type GameResult = {
  score: number;
  xpEarned: number;
  details?: any;
};

export type GameContext = {
  phase: GamePhase;
  inputType: InputType;
};

