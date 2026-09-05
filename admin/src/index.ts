
import * as admin from "firebase-admin";
import * as crypto from "crypto";
import Stripe from "stripe";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";

admin.initializeApp();

const db = admin.firestore();

// Define Stripe secret keys as parameters
const stripeSecret = defineString("STRIPE_SECRET");
const stripeWebhookSecret = defineString("STRIPE_WEBHOOK_SECRET");

const stripe = new Stripe(stripeSecret.value(), {
  apiVersion: "2023-10-16",
});

// 1. validateBetaCode Function (v2)
export const validateBetaCode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to validate a beta code."
    );
  }

  const { code, email } = request.data;
  const uid = request.auth.uid;

  if (!code || !email) {
    throw new HttpsError(
      "invalid-argument",
      "Please provide both a code and an email."
    );
  }

  const normalizedCode = code.trim().toUpperCase();
  const staticCodes = ["MARCIEBETA", "LOVEBETA2025", "TABSIMONBETA"];

  let isValid = false;

  if (staticCodes.includes(normalizedCode)) {
    isValid = true;
  } else if (normalizedCode.startsWith("BETATESTER")) {
    const emailHash = crypto
      .createHash("sha256")
      .update(email.toLowerCase().trim())
      .digest("hex");
    const expectedCode = `BETATESTER${emailHash.substring(0, 8).toUpperCase()}`;

    if (normalizedCode === expectedCode) {
      isValid = true;
    }
  }

  if (isValid) {
    const userDocRef = db.collection("users").doc(uid);
    await userDocRef.update({
      isBetaTester: true,
      beta_code: code,
    });
    return { success: true, message: "Beta code validated successfully." };
  } else {
    throw new HttpsError("invalid-argument", "The provided beta code is invalid.");
  }
});

// 2. updateGameScore Function (v2)
export const updateGameScore = onDocumentUpdated(
  "game_sessions/{sessionId}",
  async (event) => {
    if (!event.data) {
      console.log("No data associated with the event");
      return;
    }

    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();

    if (!beforeData || !afterData) {
        console.log("Before or after data is missing.");
        return;
    }

    // Check if both partners have submitted answers
    if (
      afterData.user1_answer !== beforeData.user1_answer &&
      afterData.user2_answer !== beforeData.user2_answer
    ) {
      const { coupleId, user1_answer: user1Answer, user2_answer: user2Answer } = afterData;

      let vibeSyncScore = 0;
      const difference = Math.abs(user1Answer - user2Answer);

      if (difference === 0) {
        vibeSyncScore = 25;
      } else if (difference <= 10) {
        vibeSyncScore = 15;
      }

      if (user1Answer > 70 && user2Answer > 70 && difference <= 10) {
        vibeSyncScore += 10;
      }

      if (vibeSyncScore > 0) {
        const coupleDocRef = db.collection("couples").doc(coupleId);
        await coupleDocRef.update({
          trust_thermometer: admin.firestore.FieldValue.increment(vibeSyncScore),
        });

        console.log(
          `Vibe Sync score of ${vibeSyncScore} applied to couple ${coupleId}`
        );
      }
    }
  }
);

// 3. handleStripeWebhook Function (v2)
export const handleStripeWebhook = onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    res.status(400).send("Webhook Error: Missing stripe-signature");
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      stripeWebhookSecret.value()
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata.userId;

    if (userId) {
      const userDocRef = db.collection("users").doc(userId);
      await userDocRef.update({
        role: "premium",
      });
      console.log(`User ${userId} role updated to premium.`);
    }
  }

  res.status(200).send();
});
