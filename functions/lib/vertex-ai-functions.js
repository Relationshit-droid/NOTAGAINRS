"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesizeSpeech = exports.analyzeUserInput = exports.generateGameContent = void 0;
const functions = require("firebase-functions");
const { setGlobalOptions } = require("firebase-functions/v2");
const vertexai_1 = require("@google-cloud/vertexai");
const storage_1 = require("firebase-admin/storage");
const text_to_speech_1 = require("@google-cloud/text-to-speech");

// Set global options
setGlobalOptions({ memory: "256MB", timeoutSeconds: 60 });

// Initialize Vertex AI
const vertexAI = new vertexai_1.VertexAI({
    project: process.env.GCLOUD_PROJECT || 'love-actually-game',
    location: 'us-central1',
});

// --- Gemini Model Configuration ---
const MODEL_CONFIG = {
    temperature: 0.8,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
};

const SAFETY_SETTINGS = [
    { category: vertexai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: vertexai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: vertexai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: vertexai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: vertexai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: vertexai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: vertexai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: vertexai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- Tool and Function Declarations for Gemini --- 
const analysisFunction = {
    name: 'perform_analysis',
    description: 'Performs a detailed analysis of user input within a relationship context.',
    parameters: {
        type: vertexai_1.FunctionDeclarationSchemaType.OBJECT,
        properties: {
            sentiment: { type: vertexai_1.FunctionDeclarationSchemaType.STRING, description: 'Sentiment of the user input (e.g., positive, negative, neutral, vulnerable).' },
            confidence: { type: vertexai_1.FunctionDeclarationSchemaType.NUMBER, description: 'Confidence score (0.0-1.0) of the sentiment analysis.' },
            triggers: { type: vertexai_1.FunctionDeclarationSchemaType.STRING, description: 'Comma-separated list of emotional triggers detected in the input.' },
            marcieResponse: { type: vertexai_1.FunctionDeclarationSchemaType.STRING, description: 'Dr. Marcie\'s empathetic, witty response to the user input.' },
            intensity: { type: vertexai_1.FunctionDeclarationSchemaType.INTEGER, description: 'Emotional intensity of the input on a scale of 1-10.' },
            relationshipImpact: { type: vertexai_1.FunctionDeclarationSchemaType.STRING, description: 'A brief insight into the potential significance of the input on the couple\'s relationship.' },
        },
        required: ['sentiment', 'confidence', 'triggers', 'marcieResponse', 'intensity', 'relationshipImpact']
    }
};

const tools = [{ function_declarations: [analysisFunction] }];

// Initialize the generative model with tools
const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.0-pro-001',
    generation_config: MODEL_CONFIG,
    safety_settings: SAFETY_SETTINGS,
    tools: tools,
});

const ttsClient = new text_to_speech_1.TextToSpeechClient();

// --- Firebase Cloud Functions --- 
/**
 * Generates personalized game content using Gemini and a detailed prompt.
 */
exports.generateGameContent = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e;
    if (!context.auth)
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    const { gameType, prompt } = data;
    if (!gameType || !prompt)
        throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
    // Detailed system prompts (no change from original)
    const systemPrompt = `...`; // Your existing system prompts here
    try {
        const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts: [{ text: systemPrompt }] }] });
        const response = result.response;
        const text = ((_e = (_d = (_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || '';
        let content = {};
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                content = JSON.parse(jsonMatch[0]);
            }
            else {
                content = { commentary: text };
            }
        }
        catch (e) {
            console.error("Failed to parse AI response:", e, "Raw text:", text);
            content = { commentary: text, error: 'Failed to parse structured response' };
        }
        await logAIGeneration(gameType, context.auth.uid, prompt, text);
        return { content };
    }
    catch (error) {
        console.error('Vertex AI generation error:', error);
        throw new functions.https.HttpsError('internal', 'AI content generation failed', { fallback: getFallbackContent(gameType) });
    }
});

/**
 * Analyzes user input for emotional content using Gemini Function Calling.
 */
exports.analyzeUserInput = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d;
    if (!context.auth)
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    const { input, context: analysisContext } = data;
    if (!input)
        throw new functions.https.HttpsError('invalid-argument', 'Input text is required.');
    const prompt = `Analyze this user input for emotional content and relationship significance:\n\"${input}\"\n\nContext: ${JSON.stringify(analysisContext)}\n\nNow, use the provided tool to perform the analysis.`;
    try {
        const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
        const response = result.response;
        const functionCall = (_d = (_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts.find(p => p.functionCall)) === null || _d === void 0 ? void 0 : _d.functionCall;
        if (functionCall && functionCall.args) {
            const analysis = functionCall.args; // Arguments are already parsed JSON
            return { success: true, analysis };
        }
        else {
            // Fallback if the model doesn\'t call the function
            return { success: false, analysis: { marcieResponse: "I'm not sure how to respond to that, darling. Can you tell me more?" } };
        }
    }
    catch (error) {
        console.error('Input analysis error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to analyze input.');
    }
});

/**
 * Synthesizes speech for Marcie's responses using Google Cloud Text-to-Speech
 * and serves it securely from Firebase Storage.
 */
exports.synthesizeSpeech = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    }
    const { text, voiceSettings } = data;
    if (!text) {
        throw new functions.https.HttpsError('invalid-argument', 'Text to synthesize is required.');
    }
    const storage = (0, storage_1.getStorage)();
    const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || `${process.env.GCLOUD_PROJECT}.appspot.com`);
    const voiceName = (voiceSettings === null || voiceSettings === void 0 ? void 0 : voiceSettings.voiceId) || 'en-US-Wavenet-F'; // Default voice
    const speakingRate = (voiceSettings === null || voiceSettings === void 0 ? void 0 : voiceSettings.speed) || 1.1;
    const pitch = (voiceSettings === null || voiceSettings === void 0 ? void 0 : voiceSettings.pitch) || -2.0;
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
        await file.save(Buffer.from(response.audioContent), { resumable: false });
        // Get a signed URL for the client to access the file
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });
        const duration = (text.split(' ').length / speakingRate) * 500; // Estimated duration
        return {
            audioUrl: signedUrl,
            duration: Math.round(duration),
            text: text,
        };
    }
    catch (error) {
        console.error('Speech synthesis error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to synthesize speech. Please try again later.');
    }
});

// --- Helper Functions (unchanged) ---
async function logAIGeneration(gameType, userId, prompt, response) {
    /* ... */
}

function getFallbackContent(gameType) {
    /* ... */
}

//# sourceMappingURL=vertex-ai-functions.js.map
