"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.updateGameScore = exports.validateBetaCode = void 0;
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const stripe_1 = __importDefault(require("stripe"));
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const https_2 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
admin.initializeApp();
const db = admin.firestore();
// Define Stripe secret keys as parameters
const stripeSecret = (0, params_1.defineString)("STRIPE_SECRET");
const stripeWebhookSecret = (0, params_1.defineString)("STRIPE_WEBHOOK_SECRET");
const stripe = new stripe_1.default(stripeSecret.value(), {
    apiVersion: "2023-10-16",
});
// 1. validateBetaCode Function (v2)
exports.validateBetaCode = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be logged in to validate a beta code.");
    }
    const { code, email } = request.data;
    const uid = request.auth.uid;
    if (!code || !email) {
        throw new https_1.HttpsError("invalid-argument", "Please provide both a code and an email.");
    }
    const normalizedCode = code.trim().toUpperCase();
    const staticCodes = ["MARCIEBETA", "LOVEBETA2025", "TABSIMONBETA"];
    let isValid = false;
    if (staticCodes.includes(normalizedCode)) {
        isValid = true;
    }
    else if (normalizedCode.startsWith("BETATESTER")) {
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
    }
    else {
        throw new https_1.HttpsError("invalid-argument", "The provided beta code is invalid.");
    }
});
// 2. updateGameScore Function (v2)
exports.updateGameScore = (0, firestore_1.onDocumentUpdated)("game_sessions/{sessionId}", async (event) => {
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
    if (afterData.user1_answer !== beforeData.user1_answer &&
        afterData.user2_answer !== beforeData.user2_answer) {
        const { coupleId, user1_answer: user1Answer, user2_answer: user2Answer } = afterData;
        let vibeSyncScore = 0;
        const difference = Math.abs(user1Answer - user2Answer);
        if (difference === 0) {
            vibeSyncScore = 25;
        }
        else if (difference <= 10) {
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
            console.log(`Vibe Sync score of ${vibeSyncScore} applied to couple ${coupleId}`);
        }
    }
});
// 3. handleStripeWebhook Function (v2)
exports.handleStripeWebhook = (0, https_2.onRequest)(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        res.status(400).send("Webhook Error: Missing stripe-signature");
        return;
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret.value());
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
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
//# sourceMappingURL=index.js.map