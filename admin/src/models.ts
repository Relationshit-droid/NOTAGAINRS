
export interface User {
  uid: string;
  email: string;
  coupleId: string | null;
  onboarding_data: Record<string, any>; // JSON for the 72-question Master Inventory
  settings: {
    marcieSarcasmLevel: number; // 0-10
    notifications: {
      push: boolean;
      email: boolean;
    }
  };
}

export interface Couple {
  partners: [string, string];
  linking_code: string;
  trust_thermometer: number; // 0-100
}

export interface GameSession {
  coupleId: string;
  game_type: string;
  current_turn: string; // uid of the current player
  scores: {
    [uid: string]: number;
  };
  status: 'in_progress' | 'completed' | 'abandoned';
  history: any[];
}

export interface SOSFight {
  coupleId: string;
  user1_input: string;
  user2_input: string;
  verdict: string;
  timestamp: FirebaseFirestore.FieldValue;
}
