
import * as admin from 'firebase-admin';

// =========================================================================================
// !! IMPORTANT !!
// =========================================================================================
// This script is for seeding the Firestore database with game data.
// To run it, you MUST first:
// 1. Go to your Firebase Project Settings -> Service Accounts.
// 2. Generate a new private key and download the resulting JSON file.
// 3. Place that file in the root of this project and rename it to 'serviceAccountKey.json'.
// 4. Uncomment the lines below and run `npx ts-node scripts/seedGames.ts` in your terminal.
// =========================================================================================



// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const games = [
  {
    gameId: 'truth-teller-tower',
    title: 'Truth Teller Tower',
    marcie_intro: 'Alright, love hackers—welcome to Truth Teller Tower. You’re not climbing a ladder. You’re scaling a lie-avalanche. Five questions. Three lifelines. One shared brain—if you’re lucky. Fail? You get ‘The Scripted Smile’ badge. Succeed? You earn ‘The Unfiltered Signal’—and bragging rights for six months. Let’s see if your truth bandwidth can handle the upload.',
    instructions: 'Answer 5 escalating questions cooperatively. Each question has two layers: Layer 1 (Fact) is the correct answer based on Phase 1 principles, and Layer 2 (Prediction) is what you think your partner picked. Points are awarded for correctness and for matching your partner’s prediction. Use lifelines like 50/50, Double Confidence, and Trust Check wisely.',
    level: 1,
    scoring_logic_type: 'sync_check',
    base_trust_points: 20
  },
  {
    gameId: 'escape-from-the-echo-chamber',
    title: 'Escape from the Echo Chamber',
    marcie_intro: 'Welcome to the Echo Chamber—where every reflection whispers the same lie in a different font. You’re not escaping a room. You’re escaping repetition. Five files. Five fractures in the script. Solve them together—or stay here forever, whispering ‘you’re my soulmate’ into the void. Let’s go.',
    instructions: 'Unlock 5 encrypted files by solving puzzles that dismantle the architecture of deception. Both players receive different clues (one emotional, one mechanical) and must verbally coordinate to find the combined solution for each terminal within a 90-second time limit.',
    level: 2,
    scoring_logic_type: 'honest_reveal',
    base_trust_points: 20
  },
  {
    gameId: 'the-intimacy-feud',
    title: 'Family Feud: Our New Reality Edition',
    marcie_intro: 'Step right up to Family Feud: Our New Reality Edition! Tonight’s opponent? The Ghosts of the Past — whispering ‘It should’ve been simpler.’ But you? You’re building something truer. Guess the top answers from couples who’ve forged families in fire. Match the survey. Match each other. And for the love of all that’s holy—stop saying ‘just a’. Let’s go!',
    instructions: 'Answer 5 “survey” questions. In the Face-Off, one player buzzes to guess the #1 answer. In the Main Board round, both players privately submit their top 3 guesses. Points are awarded for matching the survey answers. BONUS: If you match each other before seeing the board → Double Points!',
    level: 3,
    scoring_logic_type: 'sync_check',
    base_trust_points: 50
  },
  {
    gameId: 'relational-jeopardy',
    title: 'Relational Jeopardy!',
    marcie_intro: 'Welcome to Relational Jeopardy! I’m Dr. Marcie Liss, and tonight’s categories aren’t ‘Potent Potables’—they’re ‘Potent Promises.’ You’ll buzz in, wager points, and face Final Jeopardy: The Scar & Tattoo Ceremony. Win? You get ‘The Sovereign Pact.’ Lose? You get ‘The Provisional Truce’—and a strongly worded email from me. Let’s play!',
    instructions: 'Answer clues in 3 categories with point values from 100 to 500. The first to buzz in can consult their partner for 5 seconds before answering. Incorrect answers allow the opponent to steal. A hidden Daily Double allows you to wager any amount. Final Jeopardy is a joint creative challenge where you both submit answers independently.',
    level: 4,
    scoring_logic_type: 'binary_choice',
    base_trust_points: 500
  },
    {
    gameId: 'lie-detector-lite',
    title: 'Lie Detector: Lite™',
    marcie_intro: 'Ooh—24/25. Only slipped on ‘uh’ once. I’ll allow it… this time.',
    instructions: 'Partner records a voice response (≤10s) to a prompt like “What’s one thing you almost didn’t tell me this week?”. Marcie’s AI analyzes for fluency, vocal steadiness, and filler words.',
    level: 1,
    scoring_logic_type: 'honest_reveal',
    base_trust_points: 25
  },
  {
    gameId: 'transparency-toss',
    title: 'Transparency Toss',
    marcie_intro: 'You tossed ‘I scrolled TikTok while you talked’… and they confirmed? Bold. Respect.',
    instructions: 'On a shared board, partners “toss” low-stakes truths (e.g., “I pretended to like your friend’s lasagna”). The other partner must verify the truth with a ✅.',
    level: 1,
    scoring_logic_type: 'sync_check',
    base_trust_points: 10
  },
  {
    gameId: 'boundary-bingo',
    title: 'Boundary Bingo',
    marcie_intro: 'BINGO on ‘I asked for space and didn’t feel guilty’? Someone upgraded their firmware.',
    instructions: 'Mark squares on a 4x4 grid with boundary-related achievements (e.g., “Said no without guilt”), but only after mutual confirmation (✅). A disputed square requires evidence.',
    level: 1,
    scoring_logic_type: 'binary_choice',
    base_trust_points: 8
  },
  {
    gameId: 'the-apology-olympics',
    title: 'The Apology Olympics',
    marcie_intro: ‘I shut down and it made you feel abandoned—I’ll pause next time’? 35/35. Gold and my respect.',
    instructions: 'Rewrite a bad apology like “Sorry you felt that way” in under 60 seconds, avoiding blame-shifting words. An AI rubric scores for ownership, impact naming, and repair offering.',
    level: 2,
    scoring_logic_type: 'honest_reveal',
    base_trust_points: 35
  },
  {
    gameId: 'vibe-sync',
    title: 'Vibe Sync',
    marcie_intro: 'You guessed 68… they’re at 69. Psychic or just that in love? (Don’t answer.)',
    instructions: 'One partner sets their emotional battery level (0–100) on a slider, and the other partner guesses the level.',
    level: 1,
    scoring_logic_type: 'numeric_slider',
    base_trust_points: 15
  },
  {
    gameId: 'bid-radar',
    title: 'Bid Radar',
    marcie_intro: 'Honey, we need to recalibrate your emotional Wi-Fi.',
    instructions: 'Log real-world bids for connection made or received. AI cross-matches to see if you and your partner noticed the same bids.',
    level: 1,
    scoring_logic_type: 'sync_check',
    base_trust_points: 10
  },
  {
    gameId: 'gentle-start-up-gauntlet',
    title: 'Gentle Start-Up Gauntlet',
    marcie_intro: 'Ooh, ‘I feel like a solo podcast host’ — creative, but stick to the script, Picasso.',
    instructions: 'Rewrite a harsh start-up like “You never listen!” into a gentle one using the “I feel… about… I need…” format in under 20 seconds. AI grades on tone, structure, and vulnerability.',
    level: 2,
    scoring_logic_type: 'honest_reveal',
    base_trust_points: 15
  },
  {
    gameId: 'love-map-speedrun',
    title: 'Love Map Speedrun',
    marcie_intro: 'They changed their fave ice cream three weeks ago. If you missed that, you’re emotionally GPS-less.',
    instructions: 'A fast-paced quiz about your partner’s inner world, with questions like “What’s their go-to comfort snack this month?” pulled from your shared journal.',
    level: 1,
    scoring_logic_type: 'binary_choice',
    base_trust_points: 10
  }
];

async function seedDatabase() {
  for (const game of games) {
    try {
      await db.collection('game_library').doc(game.gameId).set(game);
      console.log(`Added game: ${game.title}`);
    } catch (e) {
      console.error('Error adding game: ', e);
    }
  }

  // Configure Marcie Settings
  try {
    await db.collection('system_config').doc('marcie_settings').set({ sass_level: 7 });
    console.log('Marcie settings configured.');
  } catch (e) {
    console.error('Error configuring Marcie settings: ', e);
  }
}

seedDatabase();


