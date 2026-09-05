
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { 
  generateGameContent, 
  analyzeUserInput, 
  synthesizeSpeech,
  analyzeSosSession,
  getTtsAudio,
  getAiAnalysis
} from './vertex-ai-functions';

admin.initializeApp();

// Export Vertex AI functions
exports.generateGameContent = generateGameContent;
exports.analyzeUserInput = analyzeUserInput;
exports.synthesizeSpeech = synthesizeSpeech;
exports.analyzeSosSession = analyzeSosSession;
exports.getTtsAudio = getTtsAudio;
exports.getAiAnalysis = getAiAnalysis;

exports.calculateGameResults = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const { gameId, user1Answers, user2Answers } = data;
  const db = admin.firestore();

  // Basic scoring logic - this should be expanded based on game type
  let score = 0;
  for (let i = 0; i < user1Answers.length; i++) {
    if (user1Answers[i] === user2Answers[i]) {
      score += 10;
    }
  }

  const gameRef = db.collection("games").doc(gameId);
  await gameRef.update({ score });

  // Update the trust thermometer
  const user1Ref = db.collection("users").doc(context.auth.uid);
  const user2Ref = db.collection("users").doc(data.partnerId); // Assuming partnerId is passed in

  await db.runTransaction(async (transaction) => {
    const user1Doc = await transaction.get(user1Ref);
    const user2Doc = await transaction.get(user2Ref);

    if (!user1Doc.exists || !user2Doc.exists) {
      throw "User not found";
    }

    const user1Data = user1Doc.data();
    const user2Data = user2Doc.data();

    if (!user1Data || !user2Data) {
        throw "User data not found";
    }

    const user1Trust = user1Data.trust_thermometer || 50;
    const user2Trust = user2Data.trust_thermometer || 50;

    const newTrust = (user1Trust + user2Trust + score) / 3;

    transaction.update(user1Ref, { trust_thermometer: newTrust });
    transaction.update(user2Ref, { trust_thermometer: newTrust });
  });

  return { score };
});
