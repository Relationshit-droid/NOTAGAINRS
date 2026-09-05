
import type { FirebaseApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseClient';
import { vertexAIService } from './vertex-ai-service';
import { Couple } from './game-types';

async function getAiAnalysisCallable() {
  const functions = getFunctions(app as FirebaseApp);
  return httpsCallable(functions, 'getAiAnalysis');
}

/**
 * Gets AI analysis by calling the secure Firebase Function.
 * @param promptText The text prompt to be analyzed.
 * @returns A promise that resolves with an object containing the AI's analysis.
 * @throws Throws an error if the cloud function call fails.
 */
export const getSecureAiAnalysis = async (promptText: string): Promise<{ analysis: string }> => {
  try {
    console.log("Calling getAiAnalysis Cloud Function...");

    const getAiAnalysis = await getAiAnalysisCallable();
    const result = await getAiAnalysis({ promptText });
    
    // The result data is automatically typed from your cloud function's return type.
    const data = result.data as { analysis: string };

    console.log("Received analysis from Cloud Function.");
    return data;

  } catch (error) {
    console.error("Firebase function call failed", error);
    // The error object from Firebase is detailed. You can inspect it for specific codes.
    // For the user, we'll throw a generic message.
    throw new Error("Failed to get analysis. Please check your connection and try again.");
  }
};

interface AnalyzeFightInput {
  origin_story: string;
  first_red_flag: string;
  partner_a_input: string;
  partner_b_input: string;
  personality: string;
  sarcasm_level: number;
}

interface AnalyzeFightOutput {
  callout: string[];
  repairs_a: string[];
  repairs_b: string[];
  trust_delta: number;
  vulnerability_delta: number;
}

/**
 * Analyzes a fight using Dr. Marcie's AI via Vertex AI service
 */
export const analyzeFight = async (input: AnalyzeFightInput): Promise<AnalyzeFightOutput> => {
  try {
    // Create a mock couple object for the Vertex AI service
    const mockCouple: Couple = {
      id: 'temp',
      player1_id: 'temp',
      player2_id: 'temp',
      couple_code: 'temp',
      origin_story: {
        meet_cute: input.origin_story,
        first_impression: '',
        turning_point: '',
        current_status: '',
      },
      relationship_diagnosis: input.first_red_flag,
      trust_meter: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use the Vertex AI service to analyze the fight
    const analysis = await vertexAIService.analyzeUserInput(input.partner_a_input, {
      origin_story: input.origin_story,
      first_red_flag: input.first_red_flag,
      partner_b_input: input.partner_b_input,
      personality: input.personality,
      sarcasm_level: input.sarcasm_level,
    });

    // Transform the analysis into the expected format
    return {
      callout: [analysis.marcieResponse],
      repairs_a: [
        "Take a breath and name the feeling underneath the reaction",
        "Ask your partner: 'What did you hear me say?'",
        "Share one thing you need right now without blame",
      ],
      repairs_b: [
        "Reflect back what you heard before responding",
        "Validate their feeling even if you disagree with the facts",
        "Offer one concrete action you can take",
      ],
      trust_delta: analysis.sentiment === 'vulnerable' ? 5 : analysis.sentiment === 'positive' ? 2 : -3,
      vulnerability_delta: analysis.sentiment === 'vulnerable' ? 8 : 1,
    };
  } catch (error) {
    console.error('analyzeFight error:', error);
    // Fallback response
    return {
      callout: ["Dr. Marcie is busy saving another relationship. Try again in a moment."],
      repairs_a: ["Pause. Breathe. Try again."],
      repairs_b: ["Listen without defending. Just for 60 seconds."],
      trust_delta: 0,
      vulnerability_delta: 0,
    };
  }
};

/**
 * Generates clarifying questions for the Partner Translator
 */
export const generateQuestions = async (situation: string, coupleData?: { origin_story: any; first_red_flag: string } | null): Promise<string[]> => {
  try {
    const mockCouple: Couple = {
      id: 'temp',
      player1_id: 'temp',
      player2_id: 'temp',
      couple_code: 'temp',
      origin_story: coupleData?.origin_story || { meet_cute: '', first_impression: '', turning_point: '', current_status: '' },
      relationship_diagnosis: coupleData?.first_red_flag || '',
      trust_meter: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use Vertex AI to generate contextual questions
    const analysis = await vertexAIService.analyzeUserInput(situation, {
      type: 'generate_questions',
      couple_context: mockCouple,
    });

    // Generate questions based on the analysis
    const baseQuestions = [
      "Did this trigger a past wound or insecurity?",
      "Were you feeling unheard or misunderstood before this?",
      "Is there an unspoken expectation that wasn't met?",
      "Did you feel criticized, controlled, or dismissed?",
      "Are you protecting yourself from getting hurt again?",
    ];

    // Add contextual questions based on sentiment
    if (analysis.sentiment === 'vulnerable') {
      return [
        "Did you feel safe enough to be vulnerable in that moment?",
        "Was there a part of you that wanted to be comforted rather than heard?",
        "Did their response remind you of a past pattern?",
        ...baseQuestions.slice(0, 2),
      ];
    }

    if (analysis.sentiment === 'negative') {
      return [
        "Did you feel attacked or criticized?",
        "Was your intention misunderstood?",
        "Did you feel the need to defend yourself immediately?",
        ...baseQuestions.slice(0, 2),
      ];
    }

    return baseQuestions.slice(0, 5);
  } catch (error) {
    console.error('generateQuestions error:', error);
    // Fallback questions
    return [
      "Did this trigger a past wound or insecurity?",
      "Were you feeling unheard or misunderstood before this?",
      "Is there an unspoken expectation that wasn't met?",
      "Did you feel criticized, controlled, or dismissed?",
      "Are you protecting yourself from getting hurt again?",
    ];
  }
};

// Example of how to use it in your components:
/*
import { getSecureAiAnalysis } from './lib/ai-engine';

const MyComponent = () => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    try {
      const result = await getSecureAiAnalysis("My partner seems distant.");
      setAnalysis(result.analysis);
    } catch (error) {
      console.error(error);
      // Show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Button title="Get Analysis" onPress={handlePress} />
      {isLoading ? <ActivityIndicator /> : <Text>{analysis}</Text>}
    </View>
  );
};
*/
