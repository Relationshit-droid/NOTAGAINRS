/**
 * Dr. Marcie AI Service - The sassy AI therapist with voice synthesis
 * Integrates OpenAI for personality and ElevenLabs for voice
 */

import { openaiChatCompletion } from '@/lib/openai-api';
import { ttsFalSubmit, ttsFalPollStatus, ttsFalFetchAudioUrl, listVoicesFal } from '@/lib/murf-api';

export type DrMarciePersonality = 1 | 2 | 3;

export interface DrMarcieResponse {
  text: string;
  audioUrl?: string;
  contextType: 'game_intro' | 'feedback' | 'fight_solver' | 'general' | 'challenge_grading' | 'daily_metrics' | 'romance_redemption' | 'competition';
}

export interface GameContext {
  gameType: string;
  gameTitle: string;
  player1Score?: number;
  player2Score?: number;
  challengeDescription?: string;
}

export interface FightContext {
  conflictTopic: string;
  partner1Perspective: string;
  partner2Perspective: string;
  urgencyLevel: number;
}

export interface DailyMetricsContext {
  trustLevel: number;
  loveLevel: number;
  connectionLevel: number;
  trends: {
    trust: string;
    love: string;
    connection: string;
  };
  streaks: {
    current: number;
    longest: number;
  };
  userName: string;
}

export interface RomanceRedemptionContext {
  gameType: string;
  gameTitle: string;
  category: string;
  difficulty: number;
  completed: boolean;
  scores?: {
    creativity: number;
    effort: number;
    followThrough: number;
    overall: number;
  };
  coupleBackstory?: string;
}

export interface CompetitionContext {
  rank: number;
  totalParticipants: number;
  percentile: number;
  achievements: number;
  pointsEarned: number;
  userName: string;
}

export class DrMarcieAI {
  private personalityLevel: DrMarciePersonality;
  private coupleBackstory: string;
  private conversationHistory: string[] = [];

  constructor(personalityLevel: DrMarciePersonality = 1, coupleBackstory: string = '') {
    this.personalityLevel = personalityLevel;
    this.coupleBackstory = coupleBackstory;
  }

  private getPersonalityPrompt(): string {
    const basePersonality = `You are Dr. Marcie Liss, a relationship therapist with a unique approach. You have a 1950s noir aesthetic but modern insights. You're dressed in a soft pastel blouse, hair up, red lipstick, pearl necklace, and black gloves. You carry a digital clipboard and deliver truths with style.`;

    switch (this.personalityLevel) {
      case 1:
        return `${basePersonality} 
        
        PERSONALITY LEVEL 1 - "Tough Love Rookie": You have Berta from Two and a Half Men energy. You're warm but blunt, with mild sarcasm and gentle guidance. You use a straight-talking approach but still maintain warmth. Your responses are encouraging but honest.
        
        Example phrases: "Oh honey, let's be real here..." "Sugar, that's not quite how it works..." "Listen up, lovebirds..."`;

      case 2:
        return `${basePersonality}
        
        PERSONALITY LEVEL 2 - "Reality Check Specialist": You have Beverly Hofstadter energy from Big Bang Theory. You're clinical and analytical with sarcasm. You maintain scientific detachment while delivering emotional truths. Your responses are more intellectually challenging.
        
        Example phrases: "Fascinating... your emotional patterns suggest..." "How delightfully predictable..." "The data on your relationship indicates..."`;

      case 3:
        return `${basePersonality}
        
        PERSONALITY LEVEL 3 - "Radical Truth Wizard": You have Robin Williams in Good Will Hunting energy. You deliver deep, powerful, uncomfortable truths with poetic weight and no BS. Your responses cut to the core with profound insights.
        
        Example phrases: "You know what your real problem is?" "Let me tell you something that might hurt..." "The truth you're avoiding is..."`;

      default:
        return `${basePersonality} You maintain a balanced, professional but engaging approach.`;
    }
  }

  async generateResponse(
    prompt: string,
    contextType: DrMarcieResponse['contextType'],
    additionalContext?: GameContext | FightContext | DailyMetricsContext | RomanceRedemptionContext | CompetitionContext
  ): Promise<DrMarcieResponse> {
    try {
      const systemPrompt = this.getPersonalityPrompt();
      const contextInfo = this.coupleBackstory ? `\n\nCouple Background: ${this.coupleBackstory}` : '';
      const historyInfo = this.conversationHistory.length > 0 
        ? `\n\nRecent conversation history: ${this.conversationHistory.slice(-3).join(', ')}` 
        : '';
      
      let contextualPrompt = '';
      
      if (contextType === 'game_intro' && additionalContext) {
        const gameCtx = additionalContext as GameContext;
        contextualPrompt = `You're introducing a relationship game called "${gameCtx.gameTitle}" of type "${gameCtx.gameType}". Be enthusiastic but maintain your personality. Give them a brief, engaging intro and explain what they'll be doing.`;
      } else if (contextType === 'feedback' && additionalContext) {
        const gameCtx = additionalContext as GameContext;
        contextualPrompt = `You're giving feedback on their game performance. Player 1 scored ${gameCtx.player1Score}, Player 2 scored ${gameCtx.player2Score}. Provide constructive feedback with your signature style.`;
      } else if (contextType === 'fight_solver' && additionalContext) {
        const fightCtx = additionalContext as FightContext;
        contextualPrompt = `You're helping resolve a conflict about "${fightCtx.conflictTopic}". Partner 1 says: "${fightCtx.partner1Perspective}". Partner 2 says: "${fightCtx.partner2Perspective}". Urgency level: ${fightCtx.urgencyLevel}/5. Analyze both perspectives and provide guidance.`;
      } else if (contextType === 'challenge_grading') {
        contextualPrompt = `You're grading their performance on a relationship challenge. Provide a letter grade (A+ to F) and explain your reasoning with your signature style.`;
      } else if (contextType === 'daily_metrics' && additionalContext) {
        const metricsCtx = additionalContext as DailyMetricsContext;
        contextualPrompt = `You're responding to ${metricsCtx.userName}'s daily relationship metrics. Trust: ${metricsCtx.trustLevel}/10, Love: ${metricsCtx.loveLevel}/10, Connection: ${metricsCtx.connectionLevel}/10. Current streak: ${metricsCtx.streaks.current} days. Provide personalized feedback with your signature style.`;
      } else if (contextType === 'romance_redemption' && additionalContext) {
        const romanceCtx = additionalContext as RomanceRedemptionContext;
        if (romanceCtx.completed && romanceCtx.scores) {
          contextualPrompt = `You're providing feedback on the completed romance game "${romanceCtx.gameTitle}". Creativity: ${romanceCtx.scores.creativity}/100, Effort: ${romanceCtx.scores.effort}/100, Follow-through: ${romanceCtx.scores.followThrough}/100. Overall: ${romanceCtx.scores.overall}/100. Give them your signature feedback!`;
        } else {
          contextualPrompt = `You're introducing the romance redemption game "${romanceCtx.gameTitle}" (${romanceCtx.category}, difficulty ${romanceCtx.difficulty}). Get them excited and explain what they need to do with your signature style!`;
        }
      } else if (contextType === 'competition' && additionalContext) {
        const compCtx = additionalContext as CompetitionContext;
        contextualPrompt = `You're celebrating ${compCtx.userName}'s competition results. They're ranked #${compCtx.rank} out of ${compCtx.totalParticipants} (${compCtx.percentile}th percentile) with ${compCtx.pointsEarned} points and ${compCtx.achievements} achievements. Give them motivational feedback with your signature style!`;
      }

      const fullPrompt = `${contextualPrompt}\n\nUser message: ${prompt}`;

      const response = await openaiChatCompletion({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}${contextInfo}${historyInfo}
            
            Keep responses concise (100-200 words), conversational, and true to your personality level. Always maintain the character's voice and perspective. Include specific advice when appropriate.`
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ]
      });

      const responseText = response.choices[0]?.message?.content || "I'm having trouble connecting right now, but I'm here for you both.";
      
      // Store in conversation history
      this.conversationHistory.push(responseText.substring(0, 100));
      if (this.conversationHistory.length > 5) {
        this.conversationHistory.shift();
      }

      // Generate voice audio
      let audioUrl: string | undefined;
      try {
        const voices = await listVoicesFal();
        const selectedVoice = voices[0]?.voice_id || 'Rachel'; // Fallback to Rachel
        
        const requestId = await ttsFalSubmit({
          text: responseText,
          voice: selectedVoice,
          speed: 1.0,
          pitch: 1.0,
          format: 'mp3'
        });
        
        await ttsFalPollStatus(requestId);
        audioUrl = await ttsFalFetchAudioUrl(requestId);
      } catch (voiceError) {
        console.error('Voice generation failed:', voiceError);
        // Continue without voice - the text response is still valuable
      }

      return {
        text: responseText,
        audioUrl,
        contextType
      };
    } catch (error) {
      console.error('Dr. Marcie AI error:', error);
      return {
        text: "Well, this is awkward... I'm having some technical difficulties. But hey, that's what makes relationships interesting, right? Technical difficulties and all. Give me a moment to get my act together.",
        contextType
      };
    }
  }

  updatePersonality(level: DrMarciePersonality): void {
    this.personalityLevel = level;
  }

  updateCoupleBackstory(backstory: string): void {
    this.coupleBackstory = backstory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}

export default DrMarcieAI;
