
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from 'firebase-admin';
import { VertexAI } from "@google-cloud/vertexai";

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: process.env.VERTEX_AI_LOCATION || 'us-central1',
});

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export const getAiAnalysis = onCall(
  // The 'secrets' option makes the secret value available as an environment variable
  { secrets: ["GEMINI_API_KEY"] },
  async (request) => {
    // 1. Authentication Check
    if (!request.auth) {
      logger.error("Unauthenticated user tried to call getAiAnalysis");
      throw new HttpsError("unauthenticated", "You must be logged in to use this feature.");
    }

    // 2. Input Validation
    const promptText = request.data.promptText;
    if (typeof promptText !== 'string' || promptText.length === 0) {
      logger.warn("getAiAnalysis called with invalid promptText", { uid: request.auth.uid });
      throw new HttpsError("invalid-argument", "The function must be called with a non-empty 'promptText' string.");
    }

    // 3. API Call Logic
    const fullPrompt = `You are Dr. Marcie Liss, a witty and brutally honest couples therapist. Analyze the following user statement: ${promptText}`;

    try {
      logger.info(`Calling Gemini for user: ${request.auth.uid}`);
      const generativeModel = vertexAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }]}],
      });

      const analysis = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!analysis) {
          logger.error("Gemini response was empty or in an unexpected format.", { uid: request.auth.uid });
          throw new HttpsError('internal', 'Failed to get analysis. Please try again later.');
      }

      logger.info(`Successfully received analysis for user: ${request.auth.uid}`);
      return { analysis };

    } catch (error) {
      logger.error("Error calling Gemini API:", { error, uid: request.auth.uid });
      throw new HttpsError("internal", "Failed to get analysis. Please try again later.");
    }
  }
);
