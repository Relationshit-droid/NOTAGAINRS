"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedGameLibrary = void 0;
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
const gameLibrary = [
    {
        id: 'slap-of-truth',
        title: 'Slap of Truth',
        description: 'A high-stakes game of radical honesty where you can demand an unfiltered answer.',
        instructions: "When it's your turn, you can ask your partner a question. If you use a 'Truth Slap', they must answer with 100% honesty, no holding back. Each of you has 3 slaps. Use them wisely.",
        level: 5,
        game_type: 'choice-based',
        ui_theme_color: '#F9A825',
        marcie_intro_text: "Alright, lovebirds. Time to stop walking on eggshells. Let's see what happens when the filters come off.",
        marcie_tips: [
            "That long pause isn't fooling anyone. Spit it out.",
            'Are you asking a question to get information, or to prove a point?',
            "Remember, the goal is truth, not to win the argument. There's a difference.",
            "If you have to think that hard about the 'honest' answer, you're already in trouble."
        ],
        scoring_logic: {
            winning_condition: 'completion',
            base_trust_points: 10,
            marcie_fail_threshold: 3 // e.g., 3 refusals to answer
        }
    },
    {
        id: '6-second-hug',
        title: '6-Second Hug',
        description: 'Release oxytocin and ground each other through physical presence.',
        instructions: 'Stop what you are doing. Stand up and give your partner a full-bodied hug for at least six seconds. No talking. Just feel the connection.',
        level: 4,
        game_type: 'sync-tap',
        ui_theme_color: '#FA1F63',
        marcie_intro_text: "Words are failing you. Let's try something physical. Don't mess this up.",
        marcie_tips: [
            'Six seconds can feel like an eternity when you\'re disconnected. Lean into it.',
            'Are you actually hugging or just performing a hug?',
            'Pay attention to your partner\'s breathing. Are they relaxing into you or pulling away?'
        ],
        scoring_logic: {
            winning_condition: 'sync_match',
            base_trust_points: 15,
            match_threshold_percent: 80, // Custom for sync_match
            marcie_fail_threshold: 0
        }
    }
    // ... Add more game documents here
];
const seedGameLibrary = async () => {
    const batch = db.batch();
    gameLibrary.forEach(game => {
        const docRef = db.collection('game_library').doc(game.id);
        batch.set(docRef, game);
    });
    try {
        await batch.commit();
        console.log('Successfully seeded the game_library collection with scoring_logic.');
    }
    catch (error) {
        console.error('Error seeding game library:', error);
    }
};
exports.seedGameLibrary = seedGameLibrary;
//# sourceMappingURL=seed-games.js.map