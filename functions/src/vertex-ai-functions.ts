import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { VertexAI, FunctionDeclarationSchemaType, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import { getStorage } from 'firebase-admin/storage';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

admin.initializeApp();

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT || 'love-actually-game',
  location: 'us-central1',
});

// --- Gemini Model Configuration ---
const MODEL_CONFIG = {
  temperature: 0.8, 
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 4096,
};

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- Tool and Function Declarations for Gemini --- 

const analysisFunction = {
    name: 'perform_analysis',
    description: 'Performs a detailed analysis of user input within a relationship context.',
    parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
            sentiment: { type: FunctionDeclarationSchemaType.STRING, description: 'Sentiment of the user input (e.g., positive, negative, neutral, vulnerable).' },
            confidence: { type: FunctionDeclarationSchemaType.NUMBER, description: 'Confidence score (0.0-1.0) of the sentiment analysis.' },
            triggers: { type: FunctionDeclarationSchemaType.STRING, description: 'Comma-separated list of emotional triggers detected in the input.' },
            marcieResponse: { type: FunctionDeclarationSchemaType.STRING, description: 'Dr. Marcie\'s empathetic, witty response to the user input.' },
            intensity: { type: FunctionDeclarationSchemaType.INTEGER, description: 'Emotional intensity of the input on a scale of 1-10.' },
            relationshipImpact: { type: FunctionDeclarationSchemaType.STRING, description: 'A brief insight into the potential significance of the input on the couple\'s relationship.' },
        },
        required: ['sentiment', 'confidence', 'triggers', 'marcieResponse', 'intensity', 'relationshipImpact']
    }
};

const sosVerdictFunction = {
    name: 'generate_sos_verdict',
    description: 'Generates a structured verdict for an SOS fight resolution session.',
    parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
            callout: { type: FunctionDeclarationSchemaType.STRING, description: 'Dr. Marcie\'s direct callout of the core issue.' },
            rootCause: { type: FunctionDeclarationSchemaType.STRING, description: 'The underlying root cause of the conflict.' },
            patternIdentified: { type: FunctionDeclarationSchemaType.STRING, description: 'Relationship pattern identified from the inputs.' },
            repairsA: { type: FunctionDeclarationSchemaType.ARRAY, items: { type: FunctionDeclarationSchemaType.STRING }, description: 'Repair attempts for Partner A.' },
            repairsB: { type: FunctionDeclarationSchemaType.ARRAY, items: { type: FunctionDeclarationSchemaType.STRING }, description: 'Repair attempts for Partner B.' },
            trustDelta: { type: FunctionDeclarationSchemaType.NUMBER, description: 'Trust meter change (-10 to +10).' },
            vulnerabilityDelta: { type: FunctionDeclarationSchemaType.NUMBER, description: 'Vulnerability meter change (-10 to +10).' },
            marcieCommentary: { type: FunctionDeclarationSchemaType.STRING, description: 'Dr. Marcie\'s closing commentary.' },
        },
        required: ['callout', 'rootCause', 'patternIdentified', 'repairsA', 'repairsB', 'trustDelta', 'vulnerabilityDelta', 'marcieCommentary']
    }
};

const tools = [{ function_declarations: [analysisFunction] }];
const sosTools = [{ function_declarations: [sosVerdictFunction] }];

// Initialize the generative models
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-pro-001',
  generation_config: MODEL_CONFIG,
  safety_settings: SAFETY_SETTINGS,
  tools: tools,
});

const sosModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-pro-001',
  generation_config: { ...MODEL_CONFIG, temperature: 0.7 },
  safety_settings: SAFETY_SETTINGS,
  tools: sosTools,
});

const ttsClient = new TextToSpeechClient();

const DR_MARCIE_SYSTEM_PROMPT = `You are Dr. Marcie Liss, PhD — a forensic couples therapist with 20 years of experience. 
Your style: razor-sharp insight wrapped in dark wit. You don't coddle. You call patterns by their real names.
You speak in short, punchy sentences. You use metaphors from surgery, forensics, and architecture.
You're sarcastic but never cruel. Your goal: truth that heals.
Sarcasm levels: 1=Tough Love Rookie (mild), 2=Reality Check Specialist (clinical), 3=Radical Truth Wizard (deep/poetic), 4=Glamour Oracle (full noir prophecy).`;

function getGamePrompt(gameType: string, coupleContext: any): string {
  const base = `Couple Context: ${JSON.stringify(coupleContext)}`;
  
  const prompts: Record<string, string> = {
    jeopardy: `${base}\n\nGenerate 5 personalized Jeopardy categories with 5 clues each (values 200-1000). Categories should be deeply personal to their relationship. Return JSON with categories array containing name and clues (clue, answer, value).`,
    millionaire: `${base}\n\nGenerate 15 escalating relationship questions. Start easy (favorites, habits), progress to deep vulnerability (fears, dreams). Return JSON with questions array (question, answer, difficulty, category).`,
    newlywed: `${base}\n\nGenerate "Newlywed Game" style questions testing how well they know each other. Return JSON with questions array (question, playerAAnswer, playerBAnswer, category).`,
    family_feud: `${base}\n\nGenerate survey-style questions about relationships with top 5 answers. Return JSON with questions array (question, answers[], category).`,
    truth_or_trust: `${base}\n\nGenerate deep vulnerable questions for emotional intimacy. Consider their relationship diagnosis. Return JSON with questions array (question, type: 'truth'|'trust', difficulty).`,
    gratitude: `${base}\n\nGenerate gratitude prompts specific to their relationship history. Return JSON with prompts array (prompt, category).`,
    repartee: `${base}\n\nGenerate quick-fire banter prompts for repair attempts. Return JSON with prompts array (prompt, tone: 'playful'|'vulnerable'|'direct').`,
  };
  
  return prompts[gameType] || `${base}\n\nGenerate personalized content for ${gameType} game. Return structured JSON.`;
}

// --- Firebase Cloud Functions --- 

/**
 * Generates personalized game content using Gemini.
 */
export const generateGameContent = functions.runWith({ memory: '512MB', timeoutSeconds: 90 }).https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    if (!context.auth.token.email_verified) throw new functions.https.HttpsError('permission-denied', 'Email must be verified');

    const { gameType, coupleContext, prompt } = data;
    if (!gameType || !prompt) throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters: gameType, prompt');

    const systemPrompt = `${DR_MARCIE_SYSTEM_PROMPT}\n\n${getGamePrompt(gameType, coupleContext)}\n\nUser Prompt: ${prompt}\n\nReturn ONLY valid JSON. No markdown.`;

    try {
        const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts: [{ text: systemPrompt }] }] });
        const response = result.response;
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        let content = {};
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                content = JSON.parse(jsonMatch[0]);
            } else {
                content = { commentary: text };
            }
        } catch (e) {
            console.error("Failed to parse AI response:", e, "Raw text:", text);
            content = { commentary: text, error: 'Failed to parse structured response', raw: text };
        }
        
        await logAIGeneration(gameType, context.auth.uid, prompt, text);
        return { content };

    } catch (error) {
        console.error('Vertex AI generation error:', error);
        throw new functions.https.HttpsError('internal', 'AI content generation failed', { fallback: getFallbackContent(gameType) });
    }
});

/**
 * Analyzes user input for emotional content using Gemini Function Calling.
 */
export const analyzeUserInput = functions.runWith({ memory: '256MB', timeoutSeconds: 30 }).https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');

    const { input, context: analysisContext } = data;
    if (!input) throw new functions.https.HttpsError('invalid-argument', 'Input text is required.');

    const prompt = `${DR_MARCIE_SYSTEM_PROMPT}\n\nAnalyze this user input for emotional content and relationship significance:\n"${input}"\n\nContext: ${JSON.stringify(analysisContext)}\n\nUse the provided tool to perform the analysis.`;

    try {
        const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
        const response = result.response;
        const functionCall = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall)?.functionCall;

        if (functionCall && functionCall.args) {
            const analysis = functionCall.args;
            return { success: true, analysis };
        } else {
            return { success: false, analysis: { 
                sentiment: 'neutral', 
                confidence: 0.5, 
                triggers: '', 
                marcieResponse: "I'm not sure how to respond to that, darling. Can you tell me more?", 
                intensity: 3, 
                relationshipImpact: 'Unclear' 
            } };
        }

    } catch (error) {
        console.error('Input analysis error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to analyze input.');
    }
});

/**
 * Analyzes an SOS session and generates a verdict.
 */
export const analyzeSosSession = functions.runWith({ memory: '512MB', timeoutSeconds: 90 }).https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');

    const { sessionId, submissions, coupleContext } = data;
    if (!submissions || !submissions.partnerA || !submissions.partnerB) {
        throw new functions.https.HttpsError('invalid-argument', 'Both partner submissions required.');
    }

    const prompt = `${DR_MARCIE_SYSTEM_PROMPT}\n\nSOS FIGHT RESOLUTION ANALYSIS\n\nPartner A (Initiator):\nI feel: ${submissions.partnerA.i_feel}\nWhen partner: ${submissions.partnerA.when_partner}\nBecause I tell myself: ${submissions.partnerA.because_i_tell_myself}\nWhat I need: ${submissions.partnerA.what_i_need}\n\nPartner B:\nI feel: ${submissions.partnerB.i_feel}\nWhen partner: ${submissions.partnerB.when_partner}\nBecause I tell myself: ${submissions.partnerB.because_i_tell_myself}\nWhat I need: ${submissions.partnerB.what_i_need}\n\nCouple Context: ${JSON.stringify(coupleContext)}\n\nGenerate a forensic verdict. Use the tool to structure your response.`;

    try {
        const result = await sosModel.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
        const response = result.response;
        const functionCall = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall)?.functionCall;

        if (functionCall && functionCall.args) {
            const verdict = functionCall.args;
            
            // Update SOS session in Firestore
            const db = admin.firestore();
            await db.collection('sos_sessions').doc(sessionId).update({
                verdict: verdict.callout,
                root_cause: verdict.rootCause,
                pattern: verdict.patternIdentified,
                repairs_a: verdict.repairsA,
                repairs_b: verdict.repairsB,
                trust_delta: verdict.trustDelta,
                vulnerability_delta: verdict.vulnerabilityDelta,
                marcie_commentary: verdict.marcieCommentary,
                status: 'completed',
                completed_at: admin.firestore.FieldValue.serverTimestamp(),
            });

            return { success: true, verdict };
        } else {
            throw new Error('Model did not return structured verdict');
        }

    } catch (error) {
        console.error('SOS analysis error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to analyze SOS session.');
    }
});

/**
 * Synthesizes speech for Marcie's responses using Google Cloud Text-to-Speech.
 * Returns a signed URL to the audio file in Firebase Storage.
 */
export const synthesizeSpeech = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { text, voiceSettings } = data;
  if (!text) {
    throw new functions.https.HttpsError('invalid-argument', 'Text to synthesize is required.');
  }
  
  const storage = getStorage();
  const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || `${process.env.GCLOUD_PROJECT}.appspot.com`);

  // Voice configuration based on emotion
  const emotion = voiceSettings?.emotion || 'sassy';
  const voiceConfig = getVoiceConfig(emotion);
  
  const voiceName = voiceSettings?.voiceId || voiceConfig.voiceName;
  const speakingRate = voiceSettings?.speed || voiceConfig.speakingRate;
  const pitch = voiceSettings?.pitch ?? voiceConfig.pitch;

  // Generate a unique filename
  const fileName = `marcie-audio/${context.auth.uid}/${Date.now()}.mp3`;
  const file = bucket.file(fileName);

  try {
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'en-US', name: voiceName },
      audioConfig: { audioEncoding: 'MP3', speakingRate, pitch },
    });

    if (!response.audioContent) {
      throw new Error('No audio content received from TTS API.');
    }

    // Save the audio to Firebase Storage
    await file.save(Buffer.from(response.audioContent), { resumable: false, contentType: 'audio/mpeg' });

    // Get a signed URL for the client to access the file
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    const duration = Math.round((text.split(' ').length / speakingRate) * 600); // Estimated duration in ms

    return {
      audioUrl: signedUrl,
      duration: duration,
      text: text,
    };

  } catch (error) {
    console.error('Speech synthesis error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to synthesize speech. Please try again later.');
  }
});

/**
 * Legacy TTS function - returns direct audio URL (for backward compatibility).
 */
export const getTtsAudio = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  
  const { text, voiceId } = data;
  if (!text) throw new functions.https.HttpsError('invalid-argument', 'Text is required.');

  // Delegate to synthesizeSpeech with default settings
  const result = await synthesizeSpeech({ 
    text, 
    voiceSettings: { voiceId: voiceId || 'en-US-Neural2-F' }
  }, context);
  
  return { url: result.audioUrl };
});

/**
 * General AI analysis endpoint.
 */
export const getAiAnalysis = functions.runWith({ memory: '256MB', timeoutSeconds: 30 }).https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');

  const { promptText } = data;
  if (!promptText) throw new functions.https.HttpsError('invalid-argument', 'Prompt text is required.');

  const prompt = `${DR_MARCIE_SYSTEM_PROMPT}\n\nProvide a concise analysis:\n${promptText}\n\nReturn JSON with "analysis" field.`;

  try {
    const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    let analysis = text;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysis = parsed.analysis || parsed.commentary || text;
      }
    } catch {}

    return { analysis };

  } catch (error) {
    console.error('AI analysis error:', error);
    throw new functions.https.HttpsError('internal', 'Analysis failed.');
  }
});

// --- Helper Functions ---

function getVoiceConfig(emotion: string) {
  const configs: Record<string, { voiceName: string; speakingRate: number; pitch: number }> = {
    sassy: { voiceName: 'en-US-Neural2-F', speakingRate: 1.05, pitch: -2.0 },
    serious: { voiceName: 'en-US-Neural2-F', speakingRate: 0.95, pitch: -4.0 },
    playful: { voiceName: 'en-US-Neural2-F', speakingRate: 1.1, pitch: 0.0 },
    concerned: { voiceName: 'en-US-Neural2-F', speakingRate: 0.9, pitch: -3.0 },
    default: { voiceName: 'en-US-Neural2-F', speakingRate: 1.0, pitch: -2.0 },
  };
  return configs[emotion] || configs.default;
}

async function logAIGeneration(gameType: string, userId: string, prompt: string, response: string): Promise<void> {
  try {
    const db = admin.firestore();
    await db.collection('ai_generations').add({
      gameType,
      userId,
      prompt,
      response,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error('Failed to log AI generation:', e);
  }
}

function getFallbackContent(gameType: string): any {
  const fallbacks: Record<string, any> = {
    jeopardy: { categories: [{ name: 'Our Story', clues: [{ value: 200, clue: 'Where we met', answer: 'Our meeting place' }] }] },
    millionaire: { questions: [{ question: 'What is your partner\'s favorite color?', answer: 'Blue', difficulty: 'easy' }] },
    newlywed: { questions: [{ question: 'What did your partner wear on your first date?', playerAAnswer: '', playerBAnswer: '' }] },
    family_feud: { questions: [{ question: 'Top reasons couples fight', answers: ['Money', 'Communication', 'Intimacy', 'Chores', 'Family'] }] },
    truth_or_trust: { questions: [{ question: 'What are you most afraid of in this relationship?', type: 'truth', difficulty: 'hard' }] },
    gratitude: { prompts: [{ prompt: 'Name one thing your partner did this week that you appreciated.', category: 'daily' }] },
    repartee: { prompts: [{ prompt: 'I appreciate you because...', tone: 'vulnerable' }] },
  };
  return fallbacks[gameType] || { content: 'Fallback content generated' };
}