import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseClient';
import { 
  AIContentRequest, 
  AIContentResponse, 
  JeopardyCategory,
  Couple 
} from './game-types';

const functions = getFunctions(app);

// Enhanced AI service with Vertex AI integration
export class VertexAIService {
  private static instance: VertexAIService;
  private generateContentCallable = httpsCallable(functions, 'generateGameContent');
  private analyzeInputCallable = httpsCallable(functions, 'analyzeUserInput');
  private synthesizeSpeechCallable = httpsCallable(functions, 'synthesizeSpeech');

  static getInstance(): VertexAIService {
    if (!VertexAIService.instance) {
      VertexAIService.instance = new VertexAIService();
    }
    return VertexAIService.instance;
  }

  /**
   * Generate personalized Jeopardy categories based on couple's relationship
   */
  async generateJeopardyCategories(coupleData: Couple): Promise<JeopardyCategory[]> {
    const prompt = `As Dr. Marcie Liss, create a personalized Jeopardy game for this couple.
    
Relationship Context:
- Meet Cute: ${coupleData.origin_story.meet_cute}
- First Impression: ${coupleData.origin_story.first_impression}
- Turning Point: ${coupleData.origin_story.turning_point}
- Current Status: ${coupleData.origin_story.current_status}
- Relationship Diagnosis: ${coupleData.relationship_diagnosis}

Generate 5 categories that are deeply personal to their relationship journey. Each category should have 5 clues with values 200-1000 points. The clues should be:

1. Forensic Truth - Questions about their relationship history and facts
2. Repair Tactics - Questions about how they've handled conflicts
3. Emotional Rebuild - Questions about their emotional connection
4. Healing Syntax - Questions about their communication patterns
5. Word-Wound Protocol - Questions about how they handle hurt feelings

Format as JSON with categories containing clues with question, answer, value, and Marcie's sassy commentary.`;

    try {
      const result = await this.generateContentCallable({
        gameType: 'jeopardy',
        coupleContext: {
          origin_story: coupleData.origin_story,
          relationship_diagnosis: coupleData.relationship_diagnosis,
        },
        prompt,
      });

      return (result.data as AIContentResponse).categories || [];
    } catch (error) {
      console.error('Failed to generate Jeopardy categories:', error);
      // Fallback to default categories if AI generation fails
      return this.getDefaultJeopardyCategories();
    }
  }

  /**
   * Generate personalized questions for any game type
   */
  async generateGameContent(
    gameType: string, 
    coupleData: Couple, 
    specificPrompt?: string
  ): Promise<AIContentResponse> {
    const basePrompt = specificPrompt || this.getDefaultPrompt(gameType, coupleData);
    
    try {
      const result = await this.generateContentCallable({
        gameType,
        coupleContext: {
          origin_story: coupleData.origin_story,
          relationship_diagnosis: coupleData.relationship_diagnosis,
        },
        prompt: basePrompt,
      });

      return result.data as AIContentResponse;
    } catch (error) {
      console.error(`Failed to generate ${gameType} content:`, error);
      throw new Error(`AI content generation failed for ${gameType}`);
    }
  }

  /**
   * Analyze user input for emotional content and vulnerability
   */
  async analyzeUserInput(input: string, context?: any): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral' | 'vulnerable';
    confidence: number;
    marcieResponse: string;
    triggers: string[];
  }> {
    try {
      const result = await this.analyzeInputCallable({
        input,
        context: context || {},
      });

      return result.data as any;
    } catch (error) {
      console.error('Failed to analyze user input:', error);
      // Fallback analysis
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        marcieResponse: "Tell me more about that, darling...",
        triggers: [],
      };
    }
  }

  /**
   * Synthesize speech for Marcie's responses
   */
  async synthesizeSpeech(
    text: string, 
    voiceSettings: {
      voiceId: string;
      speed: number;
      pitch?: number;
      emotion?: 'sassy' | 'serious' | 'playful' | 'concerned';
    }
  ): Promise<{
    audioUrl: string;
    duration: number;
    text: string;
  }> {
    try {
      const result = await this.synthesizeSpeechCallable({
        text,
        voiceSettings,
      });

      return result.data as any;
    } catch (error) {
      console.error('Failed to synthesize speech:', error);
      throw new Error('Speech synthesis failed');
    }
  }

  /**
   * Generate Marcie's commentary for game events
   */
  async generateMarcieCommentary(
    event: 'correct_answer' | 'wrong_answer' | 'vulnerable_moment' | 'game_win' | 'game_loss',
    context: any
  ): Promise<string> {
    const prompts = {
      correct_answer: `Generate a sassy but encouraging comment from Dr. Marcie Liss when a player gets an answer correct. Make it personal to their relationship: ${JSON.stringify(context)}`,
      wrong_answer: `Generate a witty but supportive comment from Dr. Marcie Liss when a player gets an answer wrong. Include a gentle tease: ${JSON.stringify(context)}`,
      vulnerable_moment: `Generate an empathetic and supportive comment from Dr. Marcie Liss when a player shares something vulnerable. Be nurturing but maintain her personality: ${JSON.stringify(context)}`,
      game_win: `Generate an enthusiastic victory comment from Dr. Marcie Liss. Celebrate the winner but also acknowledge the loser: ${JSON.stringify(context)}`,
      game_loss: `Generate a comforting but motivating comment from Dr. Marcie Liss for the loser. Encourage them to keep trying: ${JSON.stringify(context)}`,
    };

    try {
      const result = await this.generateContentCallable({
        gameType: 'marcie_commentary',
        prompt: prompts[event],
        context,
      });

      return (result.data as any).commentary || "Well, that was... interesting, darling.";
    } catch (error) {
      console.error('Failed to generate Marcie commentary:', error);
      return this.getFallbackCommentary(event);
    }
  }

  private getDefaultPrompt(gameType: string, coupleData: Couple): string {
    const baseContext = `Couple with diagnosis: ${coupleData.relationship_diagnosis}. Meet cute: ${coupleData.origin_story.meet_cute}`;
    
    const prompts = {
      millionaire: `Generate 15 escalating relationship knowledge questions. Start easy (favorites, habits) and progress to deep vulnerability (fears, dreams). ${baseContext}`,
      newlywed: `Generate "Newlywed Game" style questions that test how well they know each other's preferences, habits, and feelings. ${baseContext}`,
      family_feud: `Generate survey-style questions about relationships with top 5 answers. Make it relevant to their relationship stage. ${baseContext}`,
      truth_or_trust: `Generate deep, vulnerable questions that encourage emotional intimacy. Consider their relationship diagnosis. ${baseContext}`,
      gratitude: `Generate gratitude prompts specific to their relationship history and current challenges. ${baseContext}`,
    };

    return prompts[gameType] || `Generate personalized content for ${gameType} game. ${baseContext}`;
  }

  private getDefaultJeopardyCategories(): JeopardyCategory[] {
    return [
      {
        id: 'default-1',
        name: 'First Encounters',
        clues: [
          { id: 'c1-1', value: 200, clue: 'The place where you first met', answer: 'Where we first met', answered: false, buzz_times: {} },
          { id: 'c1-2', value: 400, clue: 'Your first impression of each other', answer: 'What we first thought', answered: false, buzz_times: {} },
          { id: 'c1-3', value: 600, clue: 'The moment you knew it was special', answer: 'What made it real', answered: false, buzz_times: {} },
          { id: 'c1-4', value: 800, clue: 'Your first big adventure together', answer: 'What we conquered first', answered: false, buzz_times: {} },
          { id: 'c1-5', value: 1000, clue: 'The thing that almost ended it', answer: 'What we survived', answered: false, buzz_times: {} },
        ],
      },
      {
        id: 'default-2',
        name: 'Love Languages',
        clues: [
          { id: 'c2-1', value: 200, clue: 'How they show love daily', answer: 'Their love language', answered: false, buzz_times: {} },
          { id: 'c2-2', value: 400, clue: 'What makes them feel most loved', answer: 'What fills their cup', answered: false, buzz_times: {} },
          { id: 'c2-3', value: 600, clue: 'Their favorite way to receive affection', answer: 'How they like it', answered: false, buzz_times: {} },
          { id: 'c2-4', value: 800, clue: 'The gesture that means the most', answer: 'What touches their heart', answered: false, buzz_times: {} },
          { id: 'c2-5', value: 1000, clue: 'How they say "I love you" without words', answer: 'Their silent love', answered: false, buzz_times: {} },
        ],
      },
    ];
  }

  private getFallbackCommentary(event: string): string {
    const fallbacks = {
      correct_answer: "Well done, darling! You're paying attention after all.",
      wrong_answer: "Oh sweetie, that's... not quite right. But I admire the confidence!",
      vulnerable_moment: "Thank you for sharing that. It takes courage to be vulnerable.",
      game_win: "Congratulations! You've conquered this round of relationship trivia!",
      game_loss: "Don't worry, darling. Every loss is just preparation for future victories.",
    };

    return fallbacks[event] || "Well, that was... interesting, darling.";
  }
}

export const vertexAIService = VertexAIService.getInstance();