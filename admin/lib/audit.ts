
import { db } from './firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// From: public/appdocs/__THE LOVE ARCADE__.txt
const TRUTH_TELLER_TOWER_ANSWERS = {
  Q1: 'B',
  Q2: 'B',
  Q3: 'A',
  Q4: 'B',
  Q5: 'B',
};

const ESCAPE_FROM_THE_ECHO_CHAMBER_SOLUTIONS = {
    FILE_M4_SYSTEM: "3 | Notes | It’s not cheating if they don’t know",
    FILE_M5_SCRIPT: "decorative but empty jewelry box",
    FILE_M6_PHANTOM: "Expired due to excessive copy-paste. Collapsed under the weight of one person’s fear of being known.",
    FILE_M4_COMPART: "Nashville",
    FILE_M6_RITUAL: "2 | The script is dead. Long live us.",
};

const THE_INTIMACY_FEUD_SURVEY_ANSWERS = {
    Q1: {
        "Validation addiction": 50,
        "Fear of real intimacy": 30,
        "Thrill of reinvention": 20,
        "Avoiding self-confrontation": 10,
        "Boredom with authenticity": 10,
    },
    Q2: {
        "Reconnected with an old friend (no filter)": 50,
        "Made a decision without consulting them": 30,
        "Wore something they hated": 20,
        "Canceled a plan to nap": 10,
        "Ate the last slice of pizza": 10,
    },
    Q3: {
        "I cried during a car commercial": 50,
        "I farted and didn’t blame the dog": 30,
        "I admitted I Googled my symptoms": 20,
        "I wore mismatched socks all day": 10,
        "I said ‘I don’t know’ three times in a row": 10,
    },
    Q4: {
        "My impostor syndrome is throwing a rave": 50,
        "I’m feeling like a NPC": 30,
        "My ‘I’m not enough’ gremlin is awake": 20,
        "Code Red: Authenticity Low": 10,
        "Send snacks and silence": 10,
    },
    Q5: {
        "How they load the dishwasher": 50,
        "Their weird laugh-snort": 30,
        "The way they argue for my point": 20,
        "Their terrible singing in the shower": 10,
        "How they remember my coffee order wrong but try": 10,
    },
};

const RELATIONAL_JEOPARDY_ANSWERS = {
    'ACCOUNTABILITY PLANS': {
        100: 'What is a ‘Transparency Rhythm’?’,
        200: 'What is ‘verbalizing the urge to a safe person’?’,
        300: ‘What is a ‘sunset clause’ (e.g., 6 months)?’,
        400: ‘What is ‘lack of co-creation’?’, // Daily Double
        500: ‘What is ‘contextual transparency’?¡
    },
    'REDEFINITION': {
        100: ‘What is ‘co-creating something unknown and weird’?’, 
        200: ‘What is ‘pretend the past didn’t happen’?’, 
        300: ‘What is ‘mutual becoming’?’, 
        400: ‘What is ‘redefinition’?’, 
        500: ‘What is ‘shared authorship of the story’?¡
    },
    'INTEGRATION': {
        100: ‘What is ‘symbolic integration’?’, 
        200: ‘What is ‘the work you chose to do’?’, 
        300: ‘What are ‘clichés and absolutes’?’, 
        400: ‘What is ‘releasing the artifact of the old story’?’, 
        500: ‘What is ‘embodied recommitment’?¡
    }
};

interface AuditEvent {
  coupleId: string;
  userId: string;
  game: string;
  phase?: string;
  module?: string;
  scenario: string; // e.g., 'Q1', 'Q2'
  playerActions: { 
    playerA: { answer: string; prediction: string; top3?: string[], wager?: number, finalJeopardy?: string };
    playerB: { answer: string; prediction: string; top3?: string[], wager?: number, finalJeopardy?: string };
    lifelineUsed?: '50/50' | 'Double Confidence' | 'Trust Check';
    solveTimeSeconds?: number;
    retries?: number;
    solution?: string;
    correct?: boolean;
    stolen?: boolean;
    dailyDouble?: boolean;
    value?: number;
  };
  outcome: Record<string, any>;
  timestamp: FieldValue;
}

export async function logAuditEvent(event: Omit<AuditEvent, 'timestamp'>) {
  try {
    const auditLogRef = db.collection('audit_logs');
    const newLog = {
      ...event,
      timestamp: FieldValue.serverTimestamp(),
    };
    await auditLogRef.add(newLog);
    console.log('Audit event logged successfully');
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

interface UserStats {
  relationshipIntegrityScore: number;
  badges: string[];
  grandTitle: string;
  gameScores: Record<string, number | Record<string, any>>;
}

const INITIAL_COUPLE_STATS: UserStats = {
  relationshipIntegrityScore: 0,
  badges: [],
  grandTitle: 'The Work-in-Progress Wonders',
  gameScores: {},
};

function calculateTruthTellerTowerScore(events: AuditEvent[]): { score: number; title: string; } {
  let score = 0;
  const gameEvents = events.filter(e => e.game === 'truth-teller-tower');

  for (const event of gameEvents) {
    const question = event.scenario as keyof typeof TRUTH_TELLER_TOWER_ANSWERS;
    const correctAnswer = TRUTH_TELLER_TOWER_ANSWERS[question];
    if (!correctAnswer) continue;

    const { playerA, playerB, lifelineUsed } = event.playerActions;

    const isPlayerACorrect = playerA.answer === correctAnswer;
    const isPlayerBCorrect = playerB.answer === correctAnswer;
    const didPlayerAPredictCorrectly = playerA.prediction === playerB.answer;
    const didPlayerBPredictCorrectly = playerB.prediction === playerA.answer;

    let questionScore = 0;
    if (isPlayerACorrect) questionScore += 10;
    if (isPlayerBCorrect) questionScore += 10;
    if (didPlayerAPredictCorrectly) questionScore += 5;
    if (didPlayerBPredictCorrectly) questionScore += 5;

    if (isPlayerACorrect && isPlayerBCorrect && didPlayerAPredictCorrectly && didPlayerBPredictCorrectly) {
        questionScore = 30; 
    } else if (isPlayerACorrect && isPlayerBCorrect && (didPlayerAPredictCorrectly || didPlayerBPredictCorrectly)){
        questionScore = 25;
    }

    if (lifelineUsed) {
      if (isPlayerACorrect || isPlayerBCorrect) { 
        questionScore += 5;
      } else {
        questionScore -= 5;
      }
    }
    score += questionScore;
  }

  let title = 'The Scripted Smile';
  if (score >= 90) title = 'The Unfiltered Signal';
  else if (score >= 70) title = 'Truth Adjacent';
  else if (score >= 50) title = 'Static & Hope';

  return { score, title };
}

function calculateEscapeFromEchoChamberScore(events: AuditEvent[]): { score: number; title: string; } {
    let score = 0;
    const gameEvents = events.filter(e => e.game === 'escape-from-the-echo-chamber');

    for (const event of gameEvents) {
        const puzzle = event.scenario as keyof typeof ESCAPE_FROM_THE_ECHO_CHAMBER_SOLUTIONS;
        const correctSolution = ESCAPE_FROM_THE_ECHO_CHAMBER_SOLUTIONS[puzzle];
        if (!correctSolution) continue;

        const { solution, solveTimeSeconds, retries } = event.playerActions;

        if (solution === correctSolution) {
            if (retries && retries > 0) {
                score += 5; 
            } else if (solveTimeSeconds && solveTimeSeconds < 60) {
                score += 20;
            } else if (solveTimeSeconds && solveTimeSeconds >= 60 && solveTimeSeconds <= 90) {
                score += 10;
            }
        }
    }

    let title = 'Still Whispering';
    if (score >= 100) title = 'Echo Exorcist';
    else if (score >= 80) title = 'Mirror Breaker';
    else if (score >= 60) title = 'Reverb Reducer';

    return { score, title };
}

function calculateIntimacyFeudScore(events: AuditEvent[]): { score: number; title: string; } {
    let score = 0;
    const gameEvents = events.filter(e => e.game === 'the-intimacy-feud');

    for (const event of gameEvents) {
        const question = event.scenario as keyof typeof THE_INTIMACY_FEUD_SURVEY_ANSWERS;
        const surveyAnswers = THE_INTIMACY_FEUD_SURVEY_ANSWERS[question];
        if (!surveyAnswers) continue;

        const { playerA, playerB } = event.playerActions;
        const playerAGuesses = playerA.top3 || [];
        const playerBGuesses = playerB.top3 || [];

        for (const guess of new Set([...playerAGuesses, ...playerBGuesses])) {
            if (surveyAnswers[guess]) {
                score += surveyAnswers[guess];
            }
        }

        const sharedGuesses = playerAGuesses.filter(g => playerBGuesses.includes(g));
        score += sharedGuesses.length * 10;

        if (playerAGuesses.length === 3 && playerBGuesses.length === 3 && playerAGuesses.every((g, i) => g === playerBGuesses[i])) {
            score += 15; 
        }
    }

    let title = 'Still Auditioning';
    if (score >= 250) title = 'Authenticity Overlord';
    else if (score >= 200) title = 'Realness Raider';
    else if (score >= 150) title = 'Script Skeptic';

    return { score, title };
}

function calculateRelationalJeopardyScore(events: AuditEvent[]): { score: number; title: string; } {
    let score = 0;
    const gameEvents = events.filter(e => e.game === 'relational-jeopardy');

    for (const event of gameEvents) {
        const { playerActions } = event;
        const { correct, stolen, dailyDouble, value, playerA, playerB } = playerActions;

        if (event.scenario === 'Final Jeopardy') {
            let finalScore = 0;
            const submissionA = playerA.finalJeopardy || "";
            const submissionB = playerB.finalJeopardy || "";
            
            // Simplified scoring rubric
            const scoreA = (submissionA.length > 10 ? 100 : 0) + (submissionA.includes("past") ? 100 : 0) + (submissionA.includes("future") ? 100 : 0);
            const scoreB = (submissionB.length > 10 ? 100 : 0) + (submissionB.includes("past") ? 100 : 0) + (submissionB.includes("future") ? 100 : 0);
            finalScore = (scoreA + scoreB) / 2;

            if(playerA.wager && playerA.wager <= score) score += finalScore > 250 ? playerA.wager : -playerA.wager
            if(playerB.wager && playerB.wager <= score) score += finalScore > 250 ? playerB.wager : -playerB.wager

        } else {
            if (correct) {
                if (dailyDouble) {
                    score += playerActions.wager || 0;
                } else {
                    score += value || 0;
                }
            } else if (!stolen) {
                if (dailyDouble) {
                    score -= playerActions.wager || 0;
                } else {
                    score -= value || 0;
                }
            }
        }
    }

    let title = 'Ceasefire Pending';
    if (score >= 2000) title = 'Sovereign Pact';
    else if (score >= 1500) title = 'Provisional Truce';
    else if (score >= 1000) title = 'Treaty in Draft';

    return { score, title };
}


export async function updateUserStats(coupleId: string): Promise<UserStats> {
  const coupleStatsRef = db.collection('couples').doc(coupleId);
  const auditLogsRef = db.collection('audit_logs').where('coupleId', '==', coupleId).orderBy('timestamp');

  const [coupleStatsDoc, auditLogsSnapshot] = await Promise.all([
    coupleStatsRef.get(),
    auditLogsRef.get(),
  ]);

  let stats: UserStats = coupleStatsDoc.exists
    ? (coupleStatsDoc.data() as UserStats)
    : INITIAL_COUPLE_STATS;

  const auditEvents = auditLogsSnapshot.docs.map(doc => doc.data() as AuditEvent);
  
  console.log(`Processing ${auditEvents.length} events for couple ${coupleId}.`);

  const truthTellerEvents = auditEvents.filter(e => e.game === 'truth-teller-tower');
  if (truthTellerEvents.length > 0) {
    const { score, title } = calculateTruthTellerTowerScore(truthTellerEvents);
    stats.gameScores['truth-teller-tower'] = { score, title };
    if (!stats.badges.includes('FOUNDATION LAYER')) {
        stats.badges.push('FOUNDATION LAYER');
    }
  }

  const escapeChamberEvents = auditEvents.filter(e => e.game === 'escape-from-the-echo-chamber');
  if (escapeChamberEvents.length > 0) {
      const { score, title } = calculateEscapeFromEchoChamberScore(escapeChamberEvents);
      stats.gameScores['escape-from-the-echo-chamber'] = { score, title };
      if (!stats.badges.includes('ESCAPE ARTIST')) {
          stats.badges.push('ESCAPE ARTIST');
      }
  }

  const intimacyFeudEvents = auditEvents.filter(e => e.game === 'the-intimacy-feud');
  if (intimacyFeudEvents.length > 0) {
      const { score, title } = calculateIntimacyFeudScore(intimacyFeudEvents);
      stats.gameScores['the-intimacy-feud'] = { score, title };
      if (!stats.badges.includes('REALNESS RAIDERS')) {
          stats.badges.push('REALNESS RAIDERS');
      }
  }

  const relationalJeopardyEvents = auditEvents.filter(e => e.game === 'relational-jeopardy');
  if (relationalJeopardyEvents.length > 0) {
      const { score, title } = calculateRelationalJeopardyScore(relationalJeopardyEvents);
      stats.gameScores['relational-jeopardy'] = { score, title };
      if (!stats.badges.includes('SOVEREIGN ARCHITECTS')) {
          stats.badges.push('SOVEREIGN ARCHITECTS');
      }
  }

  let totalScore = 0;
  for(const game in stats.gameScores){
      const gameScore = stats.gameScores[game];
      if(typeof gameScore === 'object' && gameScore !== null && 'score' in gameScore && typeof (gameScore as any).score === 'number'){
          totalScore += (gameScore as any).score as number;
      }
  }
  stats.relationshipIntegrityScore = totalScore;

  if (totalScore >= 2200) stats.grandTitle = 'The Unscripted Dynasty';
  else if (totalScore >= 1800) stats.grandTitle = 'The Authentically Awkward';
  else if (totalScore >= 1400) stats.grandTitle = 'The Recovered Romantics';
  else stats.grandTitle = 'The Work-in-Progress Wonders';


  await coupleStatsRef.set(stats, { merge: true });
  console.log(`Updated stats for couple ${coupleId}:`, stats);

  return stats;
}
