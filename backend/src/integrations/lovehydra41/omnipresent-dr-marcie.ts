/**
 * Omnipresent Dr. Marcie System - Advanced AI Hosting for Every Interaction
 * Comprehensive hosting system that ensures Dr. Marcie is present and engaged in every activity
 */

import { openaiChatCompletion } from '@/lib/openai-api';
import { ttsFalSubmit, ttsFalPollStatus, ttsFalFetchAudioUrl } from '@/lib/elevenlabs-api';
import type { DrMarciePersonality } from '@/lib/dr-marcie-ai';

export interface OmnipresentHostingContext {
  sessionType: 'game_session' | 'fight_solver' | 'daily_metrics' | 'romance_redemption' | 'competition' | 'general_chat';
  sessionId: string;
  coupleId: string;
  userId: string;
  personalityLevel: DrMarciePersonality;
  phase: 'intro' | 'question_delivery' | 'feedback' | 'wait_state' | 'outro' | 'real_time_response';
  
  // Activity context
  activityDetails?: {
    category: string;
    subcategory: string;
    title: string;
    type: 'quiz' | 'game' | 'challenge' | 'reflection';
    difficulty: number;
    questionIndex?: number;
    totalQuestions?: number;
  };
  
  // Partner context
  partnerStatus?: {
    isActive: boolean;
    hasCompleted: boolean;
    currentScore?: number;
    waitingFor?: string;
  };
  
  // Response context
  lastUserResponse?: {
    answer: string;
    type: string;
    pointsEarned: number;
    isCorrect?: boolean;
  };
  
  // Relationship context
  coupleBackstory?: string;
  relationshipPhase?: string;
  recentProgress?: {
    activitiesCompleted: number;
    currentStreak: number;
    trustLevel: number;
    strengthAreas: string[];
    growthAreas: string[];
  };
  
  // Historical context
  previousInteractions?: {
    successful: number;
    averageRating: number;
    commonIssues: string[];
    effectiveApproaches: string[];
  };
}

export interface DrMarcieHostingResponse {
  text: string;
  audioUrl?: string;
  contextType: string;
  hostingPhase: string;
  shouldContinue: boolean;
  nextAction?: 'wait_for_response' | 'deliver_next_question' | 'provide_feedback' | 'transition_phase' | 'end_session';
  visualCues?: {
    expression: 'happy' | 'analytical' | 'concerned' | 'pleased' | 'serious' | 'surprised';
    animation: 'speaking' | 'thinking' | 'waiting' | 'celebrating' | 'analyzing';
    emphasis: string[]; // Words to emphasize
  };
}

export interface ComprehensiveActivityData {
  category: string;
  subcategory: string;
  activities: ComprehensiveActivity[];
}

export interface ComprehensiveActivity {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'game' | 'challenge' | 'reflection';
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number;
  questions: ComprehensiveActivityQuestion[];
  drMarcieHosting: {
    intro: string;
    outro: string;
    questionPrompts: string[];
    responseTemplates: { [key: string]: string };
    waitStateMessages: string[];
    encouragementPhrases: string[];
  };
  tags: string[];
  pointValue: number;
}

export interface ComprehensiveActivityQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'likert_scale' | 'fill_blank' | 'essay' | 'file_upload' | 'drag_drop' | 'sequence' | 'dropdown' | 'yes_no' | 'numerical' | 'picture_based';
  options?: string[];
  correctAnswer?: string;
  pointValue: number;
  drMarcieResponses: {
    [key: string]: string;
  };
  timeLimit?: number;
}

export class OmnipresentDrMarcie {
  private personalityLevel: DrMarciePersonality;
  private hostingContext: OmnipresentHostingContext;
  private conversationHistory: string[] = [];
  private hostingSession: string;

  constructor(context: OmnipresentHostingContext) {
    this.personalityLevel = context.personalityLevel;
    this.hostingContext = context;
    this.hostingSession = `${context.sessionType}_${context.sessionId}_${Date.now()}`;
  }

  private getPersonalityPrompt(): string {
    const basePersonality = `You are Dr. Marcie Liss, an omnipresent AI relationship therapist who hosts EVERY interaction in this couples therapy gaming platform. You have a 1950s noir aesthetic but modern insights. You're dressed in a soft pastel blouse, hair up, red lipstick, pearl necklace, and black gloves. You carry a digital clipboard and deliver truths with style.

    CRITICAL: You are the HOST of every single activity, question, game, challenge, and interaction. You never just observe - you actively guide, comment, and engage throughout every experience.`;

    switch (this.personalityLevel) {
      case 1:
        return `${basePersonality}
        
        PERSONALITY LEVEL 1 - "Tough Love Rookie": You have Berta from Two and a Half Men energy. You're warm but blunt, with mild sarcasm and gentle guidance. You use a straight-talking approach but still maintain warmth. Your responses are encouraging but honest.
        
        Hosting Style: Supportive guide who keeps things moving with gentle nudges and encouraging comments.
        Example phrases: "Oh honey, let's dig deeper here..." "Sugar, that's a great start but..." "Listen up, lovebirds, here's what I'm seeing..."`;

      case 2:
        return `${basePersonality}
        
        PERSONALITY LEVEL 2 - "Reality Check Specialist": You have Beverly Hofstadter energy from Big Bang Theory. You're clinical and analytical with strategic sarcasm. You maintain scientific detachment while delivering emotional truths. Your responses are more intellectually challenging.
        
        Hosting Style: Professional analyst who provides clinical insights and challenges assumptions.
        Example phrases: "Fascinating... your emotional patterns suggest..." "How delightfully predictable..." "The data on your interaction indicates..."`;

      case 3:
        return `${basePersonality}
        
        PERSONALITY LEVEL 3 - "Radical Truth Wizard": You have Robin Williams in Good Will Hunting energy. You deliver deep, powerful, uncomfortable truths with poetic weight and no BS. Your responses cut to the core with profound insights.
        
        Hosting Style: Deep truth-teller who cuts through surface-level responses to reach profound insights.
        Example phrases: "You know what your real issue is here?" "Let me tell you something that might sting..." "The truth you're both avoiding is..."`;

      default:
        return `${basePersonality} You maintain a balanced, professional but engaging hosting approach.`;
    }
  }

  async hostIntroduction(): Promise<DrMarcieHostingResponse> {
    const activity = this.hostingContext.activityDetails;
    if (!activity) {
      throw new Error('Activity details required for introduction hosting');
    }

    const systemPrompt = this.getPersonalityPrompt();
    const contextInfo = this.buildContextualInformation();

    const prompt = `You are hosting the introduction to the activity "${activity.title}" (${activity.category} > ${activity.subcategory}). This is a ${activity.type} with difficulty level ${activity.difficulty}/5.

    Your job as the host is to:
    1. Welcome them enthusiastically to this specific activity
    2. Briefly explain what they'll be doing (don't spoil specific questions)
    3. Set expectations for how you'll be guiding them through it
    4. Give them a motivational reason why this activity will benefit their relationship
    5. Announce you're starting the first question

    Keep it conversational, engaging, and true to your personality level. Make it feel like they have a professional guide who's genuinely invested in their success.`;

    try {
      const response = await this.generateResponse(prompt, 'intro', contextInfo);
      
      // Log this hosting interaction
      await this.logHostingInteraction({
        contextType: 'activity_intro',
        phase: 'intro',
        drMarcieResponse: response.text,
        voiceUrl: response.audioUrl
      });

      return {
        ...response,
        hostingPhase: 'intro',
        shouldContinue: true,
        nextAction: 'deliver_next_question',
        visualCues: {
          expression: 'happy',
          animation: 'speaking',
          emphasis: [activity.title, 'together', 'relationship']
        }
      };
    } catch (error) {
      console.error('Error in hostIntroduction:', error);
      return this.generateFallbackResponse('intro');
    }
  }

  async hostQuestionDelivery(questionIndex: number, question: ComprehensiveActivityQuestion): Promise<DrMarcieHostingResponse> {
    const activity = this.hostingContext.activityDetails;
    if (!activity) {
      throw new Error('Activity details required for question delivery hosting');
    }

    const systemPrompt = this.getPersonalityPrompt();
    const contextInfo = this.buildContextualInformation();

    const prompt = `You are now delivering question ${questionIndex + 1} of ${activity.totalQuestions} in the activity "${activity.title}".

    The question is: "${question.text}"
    Question type: ${question.type}
    ${question.options ? `Options: ${question.options.join(', ')}` : ''}

    Your job as the host is to:
    1. Present the question in an engaging way (don't just read it verbatim - make it conversational)
    2. Provide any helpful context or clarification if needed
    3. Encourage thoughtful, honest responses
    4. Let them know you'll be here to respond to their answer
    5. Create a supportive atmosphere for vulnerability if it's a deeper question

    Make it feel like a guided conversation with a professional therapist, not a cold quiz.`;

    try {
      const response = await this.generateResponse(prompt, 'question_delivery', contextInfo);
      
      await this.logHostingInteraction({
        contextType: 'question_delivery',
        phase: 'question_delivery',
        questionId: question.id,
        drMarcieResponse: response.text,
        voiceUrl: response.audioUrl
      });

      return {
        ...response,
        hostingPhase: 'question_delivery',
        shouldContinue: true,
        nextAction: 'wait_for_response',
        visualCues: {
          expression: question.type === 'essay' ? 'analytical' : 'happy',
          animation: 'speaking',
          emphasis: ['question', 'honest', 'thoughtful']
        }
      };
    } catch (error) {
      console.error('Error in hostQuestionDelivery:', error);
      return this.generateFallbackResponse('question_delivery');
    }
  }

  async hostRealTimeResponse(userAnswer: string, question: ComprehensiveActivityQuestion): Promise<DrMarcieHostingResponse> {
    const systemPrompt = this.getPersonalityPrompt();
    const contextInfo = this.buildContextualInformation();

    // Determine response template based on answer
    let responseContext = 'general';
    
    if (question.type === 'multiple_choice' && question.correctAnswer) {
      responseContext = userAnswer === question.correctAnswer ? 'correct' : 'incorrect';
    } else if (question.type === 'true_false') {
      responseContext = userAnswer === question.correctAnswer ? 'correct' : 'incorrect';
    } else if (question.type === 'likert_scale') {
      const score = parseInt(userAnswer);
      if (score <= 3) responseContext = 'low_score';
      else if (score <= 6) responseContext = 'medium_score';
      else responseContext = 'high_score';
    } else if (question.type === 'essay') {
      responseContext = userAnswer.length > 100 ? 'detailed_response' : 'brief_response';
    }

    const prompt = `The user just answered: "${userAnswer}" to the question: "${question.text}"

    Your job as the omnipresent host is to provide immediate, contextual feedback. This should be:
    1. Specific to their actual answer (reference what they said)
    2. Encouraging but honest in your personality style
    3. Brief but meaningful (1-2 sentences max)
    4. Set up anticipation for the next question if there is one
    5. Show that you're actively listening and processing their responses

    Context: This is a ${question.type} question worth ${question.pointValue} points.
    ${question.correctAnswer ? `The correct answer was: ${question.correctAnswer}` : ''}
    
    Respond as if you're right there with them, providing real-time guidance and support.`;

    try {
      const response = await this.generateResponse(prompt, 'real_time_response', contextInfo);
      
      await this.logHostingInteraction({
        contextType: 'real_time_response',
        phase: 'real_time_response',
        questionId: question.id,
        userAnswer: userAnswer,
        drMarcieResponse: response.text,
        voiceUrl: response.audioUrl
      });

      return {
        ...response,
        hostingPhase: 'real_time_response',
        shouldContinue: true,
        nextAction: 'deliver_next_question',
        visualCues: {
          expression: responseContext === 'correct' ? 'pleased' : 
                     responseContext.includes('detailed') ? 'analytical' : 'happy',
          animation: 'speaking',
          emphasis: ['great', 'interesting', 'next']
        }
      };
    } catch (error) {
      console.error('Error in hostRealTimeResponse:', error);
      return this.generateFallbackResponse('real_time_response');
    }
  }

  async hostPartnerWaitState(waitingPartner: 'partner1' | 'partner2', completedPartner: 'partner1' | 'partner2'): Promise<DrMarcieHostingResponse> {
    const activity = this.hostingContext.activityDetails;
    const systemPrompt = this.getPersonalityPrompt();
    const contextInfo = this.buildContextualInformation();

    const prompt = `You are managing a partner wait state. ${completedPartner} has finished the activity "${activity?.title}" but ${waitingPartner} is still working on it.

    Your job as the omnipresent host is to:
    1. Keep the completed partner engaged and positive while they wait
    2. Provide encouraging commentary about their performance so far
    3. Give a sense of what's happening with their partner (without spoiling anything)
    4. Build anticipation for the results they'll see together
    5. Keep the energy positive and relationship-focused

    This is a crucial moment for maintaining engagement and showing that you're actively managing their experience together.

    Context: Activity type is ${activity?.type}, difficulty ${activity?.difficulty}/5.`;

    try {
      const response = await this.generateResponse(prompt, 'wait_state', contextInfo);
      
      await this.logHostingInteraction({
        contextType: 'partner_wait_state',
        phase: 'wait_state',
        additionalContext: JSON.stringify({ waitingPartner, completedPartner }),
        drMarcieResponse: response.text,
        voiceUrl: response.audioUrl
      });

      return {
        ...response,
        hostingPhase: 'wait_state',
        shouldContinue: true,
        nextAction: 'wait_for_response',
        visualCues: {
          expression: 'pleased',
          animation: 'waiting',
          emphasis: ['partner', 'together', 'results']
        }
      };
    } catch (error) {
      console.error('Error in hostPartnerWaitState:', error);
      return this.generateFallbackResponse('wait_state');
    }
  }

  async hostResultsAndOutro(finalScores: { partner1: number; partner2: number }, totalPossible: number): Promise<DrMarcieHostingResponse> {
    const activity = this.hostingContext.activityDetails;
    const progress = this.hostingContext.recentProgress;
    const systemPrompt = this.getPersonalityPrompt();
    const contextInfo = this.buildContextualInformation();

    const prompt = `You are concluding the activity "${activity?.title}" and delivering the results.

    Final Scores:
    - Partner 1: ${finalScores.partner1}/${totalPossible} points
    - Partner 2: ${finalScores.partner2}/${totalPossible} points

    Your job as the omnipresent host is to:
    1. Celebrate their completion and effort
    2. Provide meaningful analysis of their scores and what they reveal
    3. Highlight insights you gained about their relationship during this activity
    4. Give them specific takeaways they can apply to their relationship
    5. Connect this activity to their overall relationship journey
    6. Encourage them to continue their growth journey

    Context: This was a ${activity?.type} in ${activity?.category}/${activity?.subcategory}.
    Their relationship progress: ${progress?.activitiesCompleted} activities completed, trust level ${progress?.trustLevel}/10.

    Make this feel like a meaningful conclusion to a therapeutic session, not just a score report.`;

    try {
      const response = await this.generateResponse(prompt, 'outro', contextInfo);
      
      await this.logHostingInteraction({
        contextType: 'activity_results',
        phase: 'outro',
        additionalContext: JSON.stringify({ finalScores, totalPossible }),
        drMarcieResponse: response.text,
        voiceUrl: response.audioUrl
      });

      return {
        ...response,
        hostingPhase: 'outro',
        shouldContinue: false,
        nextAction: 'end_session',
        visualCues: {
          expression: 'pleased',
          animation: 'celebrating',
          emphasis: ['congratulations', 'growth', 'relationship', 'progress']
        }
      };
    } catch (error) {
      console.error('Error in hostResultsAndOutro:', error);
      return this.generateFallbackResponse('outro');
    }
  }

  async hostFightSolverPhase(phase: 'cone_of_silence' | 'deep_dive' | 'analysis' | 'resolution', fightContext: any): Promise<DrMarcieHostingResponse> {
    const systemPrompt = this.getPersonalityPrompt();
    const contextInfo = this.buildContextualInformation();

    let phasePrompt = '';
    let visualCues: DrMarcieHostingResponse['visualCues'] = {
      expression: 'serious',
      animation: 'speaking',
      emphasis: []
    };

    switch (phase) {
      case 'cone_of_silence':
        phasePrompt = `You are initiating the Cone of Silence for a conflict about "${fightContext.conflictTopic}" (urgency level ${fightContext.urgencyLevel}/5).

        Your job is to:
        1. Establish authority and create a safe, structured environment
        2. Explain the separation protocol clearly
        3. Set expectations for honest, complete responses
        4. Create urgency without panic
        5. Show that you're taking control of a chaotic situation

        Be firm, professional, and commanding while maintaining therapeutic warmth.`;
        
        visualCues = {
          expression: 'serious',
          animation: 'speaking',
          emphasis: ['cone', 'silence', 'honesty', 'both']
        };
        break;

      case 'deep_dive':
        phasePrompt = `You have both perspectives on "${fightContext.conflictTopic}" and now need to conduct the deep dive analysis phase.

        Your job is to:
        1. Acknowledge that you've processed their initial responses
        2. Explain that you need to dig deeper to understand the real issues
        3. Present this as detective work to uncover underlying patterns
        4. Build anticipation for the insights you'll provide
        5. Maintain professional curiosity and expertise

        Show your analytical mind at work while keeping them engaged.`;
        
        visualCues = {
          expression: 'analytical',
          animation: 'thinking',
          emphasis: ['deeper', 'patterns', 'analysis', 'understand']
        };
        break;

      case 'analysis':
        phasePrompt = `You are presenting your comprehensive analysis of the conflict "${fightContext.conflictTopic}".

        Your analysis includes:
        - Who's right: ${fightContext.whoIsRight}
        - Emotional triggers: ${fightContext.emotionalTriggers?.join(', ')}
        - Underlying needs: ${fightContext.underlyingNeeds?.join(', ')}

        Your job is to:
        1. Present your findings with authority and insight
        2. Explain the deeper dynamics at play
        3. Help them see patterns they couldn't see themselves
        4. Deliver difficult truths with therapeutic skill
        5. Build toward the resolution phase

        This is your moment to showcase your expertise and provide breakthrough insights.`;
        
        visualCues = {
          expression: 'analytical',
          animation: 'speaking',
          emphasis: ['analysis', 'truth', 'patterns', 'real issue']
        };
        break;

      case 'resolution':
        phasePrompt = `You are guiding them through the resolution phase with healing challenges for "${fightContext.conflictTopic}".

        Your job is to:
        1. Transition from analysis to action
        2. Present the healing challenges as collaborative work
        3. Explain how these challenges address their specific issues
        4. Create motivation for completing the work together
        5. Show confidence in their ability to heal and grow

        Be encouraging but maintain the importance of doing the work.`;
        
        visualCues = {
          expression: 'pleased',
          animation: 'speaking',
          emphasis: ['healing', 'together', 'challenges', 'growth']
        };
        break;
    }

    try {
      const response = await this.generateResponse(phasePrompt, `fight_solver_${phase}`, contextInfo);
      
      await this.logHostingInteraction({
        contextType: `fight_solver_${phase}`,
        phase: phase,
        additionalContext: JSON.stringify(fightContext),
        drMarcieResponse: response.text,
        voiceUrl: response.audioUrl
      });

      return {
        ...response,
        hostingPhase: phase,
        shouldContinue: true,
        nextAction: 'wait_for_response',
        visualCues
      };
    } catch (error) {
      console.error(`Error in hostFightSolverPhase ${phase}:`, error);
      return this.generateFallbackResponse(phase);
    }
  }

  private async generateResponse(prompt: string, contextType: string, contextInfo: string): Promise<{ text: string; audioUrl?: string; contextType: string }> {
    const systemPrompt = this.getPersonalityPrompt();
    const fullPrompt = `${prompt}\n\n${contextInfo}`;

    const response = await openaiChatCompletion({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}\n\nYou are actively hosting this interaction. Keep responses conversational, engaging, and appropriate for your personality level. Stay in character and maintain therapeutic professionalism while being relatable.`
        },
        {
          role: 'user',
          content: fullPrompt
        }
      ]
    });

    const responseText = response.choices[0]?.message?.content || "I'm having a moment here, but I'm still with you both.";
    
    // Store in conversation history
    this.conversationHistory.push(responseText.substring(0, 100));
    if (this.conversationHistory.length > 5) {
      this.conversationHistory.shift();
    }

    // Generate voice audio
    let audioUrl: string | undefined;
    try {
      const requestId = await ttsFalSubmit({
        text: responseText,
        voice: 'Rachel',
        speed: 1.0,
        stability: 0.7,
        similarity_boost: 0.8
      });
      
      await ttsFalPollStatus(requestId);
      audioUrl = await ttsFalFetchAudioUrl(requestId);
    } catch (voiceError) {
      console.error('Voice generation failed:', voiceError);
    }

    return {
      text: responseText,
      audioUrl,
      contextType
    };
  }

  private buildContextualInformation(): string {
    const context = this.hostingContext;
    let contextInfo = '';

    if (context.coupleBackstory) {
      contextInfo += `Couple Background: ${context.coupleBackstory}\n`;
    }

    if (context.recentProgress) {
      contextInfo += `Recent Progress: ${context.recentProgress.activitiesCompleted} activities completed, ${context.recentProgress.currentStreak} day streak, trust level ${context.recentProgress.trustLevel}/10\n`;
    }

    if (context.previousInteractions) {
      contextInfo += `Previous Interactions: ${context.previousInteractions.successful} successful, ${context.previousInteractions.averageRating}/5 average rating\n`;
    }

    if (this.conversationHistory.length > 0) {
      contextInfo += `Recent conversation: ${this.conversationHistory.slice(-2).join(', ')}\n`;
    }

    return contextInfo;
  }

  private async logHostingInteraction(interaction: {
    contextType: string;
    phase: string;
    questionId?: string;
    userAnswer?: string;
    additionalContext?: string;
    drMarcieResponse: string;
    voiceUrl?: string;
  }): Promise<void> {
    try {
      await fetch('/api/dr-marcie-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextType: interaction.contextType,
          hostingPhase: interaction.phase,
          questionId: interaction.questionId,
          gameSessionId: this.hostingContext.sessionType === 'game_session' ? this.hostingContext.sessionId : undefined,
          fightSolverSessionId: this.hostingContext.sessionType === 'fight_solver' ? this.hostingContext.sessionId : undefined,
          drMarcieResponse: interaction.drMarcieResponse,
          voiceUrl: interaction.voiceUrl,
          personalityLevel: this.personalityLevel,
          coupleId: this.hostingContext.coupleId,
          userId: this.hostingContext.userId,
          relationshipContext: this.buildContextualInformation(),
          additionalContext: interaction.additionalContext
        }),
      });
    } catch (error) {
      console.error('Error logging hosting interaction:', error);
    }
  }

  private generateFallbackResponse(phase: string): DrMarcieHostingResponse {
    const fallbackMessages = {
      intro: "Well, this is interesting... I'm having a slight technical moment, but I'm still here to guide you through this activity. Let's dive in together!",
      question_delivery: "I'm here with you, ready to hear your thoughts. Take your time and be honest with your response.",
      real_time_response: "I hear you. That's valuable insight. Let's keep moving forward together.",
      wait_state: "Hang tight while your partner finishes up. I'm analyzing everything and preparing some insights for you both.",
      outro: "You both did excellent work today. I can see the growth happening in your relationship. Keep this momentum going!",
      cone_of_silence: "Alright, we're in crisis mode here. I need both of your perspectives, and I need them now. Let's get to the truth.",
      deep_dive: "I'm processing everything you've shared. Now I need to ask some follow-up questions to get to the real issues.",
      analysis: "Based on everything I've observed, I can see the patterns at play here. Let me share what's really going on.",
      resolution: "Time to move from understanding to action. I've got some healing challenges that will help you both grow from this."
    };

    return {
      text: fallbackMessages[phase as keyof typeof fallbackMessages] || "I'm here with you both, working through this together.",
      contextType: phase,
      hostingPhase: phase,
      shouldContinue: true,
      nextAction: 'wait_for_response',
      visualCues: {
        expression: 'happy',
        animation: 'speaking',
        emphasis: ['together', 'relationship']
      }
    };
  }

  // Static method to create hosting sessions
  static async createHostingSession(context: OmnipresentHostingContext): Promise<OmnipresentDrMarcie> {
    return new OmnipresentDrMarcie(context);
  }

  // Update context during session
  updateContext(updates: Partial<OmnipresentHostingContext>): void {
    this.hostingContext = { ...this.hostingContext, ...updates };
  }
}

export default OmnipresentDrMarcie;