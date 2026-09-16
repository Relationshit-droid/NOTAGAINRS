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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Path to your service account key file
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount)
});
const db = (0, firestore_1.getFirestore)();
const seedDatabase = async () => {
    console.log('Seeding database...');
    // Dummy Data
    const users = [
        {
            uid: 'user1',
            email: 'user1@example.com',
            coupleId: 'couple1',
            onboarding_data: { q1: 'a', q2: 'b' },
            settings: { marcieSarcasmLevel: 5, notifications: { push: true, email: false } }
        },
        {
            uid: 'user2',
            email: 'user2@example.com',
            coupleId: 'couple1',
            onboarding_data: { q1: 'c', q2: 'd' },
            settings: { marcieSarcasmLevel: 8, notifications: { push: true, email: true } }
        }
    ];
    const couples = [
        {
            id: 'couple1',
            partners: ['user1', 'user2'],
            linking_code: '123456',
            trust_thermometer: 75
        }
    ];
    const game_sessions = [
        {
            coupleId: 'couple1',
            game_type: 'TheNewlywedGame',
            current_turn: 'user1',
            scores: { user1: 10, user2: 5 },
            status: 'in_progress',
            history: []
        }
    ];
    const sos_fights = [
        {
            coupleId: 'couple1',
            user1_input: 'She never listens to me!',
            user2_input: 'He always exaggerates!',
            verdict: 'You both need to work on your communication.',
            timestamp: new Date()
        }
    ];
    // Users
    for (const user of users) {
        await db.collection('users').doc(user.uid).set(user);
    }
    // Couples
    for (const couple of couples) {
        await db.collection('couples').doc(couple.id).set(couple);
    }
    // Game Sessions
    for (const session of game_sessions) {
        await db.collection('game_sessions').add(session);
    }
    // SOS Fights
    for (const fight of sos_fights) {
        await db.collection('sos_fights').add(fight);
    }
    console.log('Database seeded!');
};
seedDatabase().catch(console.error);
//# sourceMappingURL=seed.js.map