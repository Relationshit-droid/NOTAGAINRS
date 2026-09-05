import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Trophy, Clock } from 'lucide-react';

// TRUTH TELLER TOWER - Phase 1: Foundation
const TRUTH_TOWER_QUESTIONS = [
  {
    text: "Before rebuilding, you must name the dragon. What's the #1 reason couples fail Phase 1?",
    options: [
      { id: 'A', text: "They call it 'a rough patch.'" },
      { id: 'B', text: 'They skip naming the betrayal and jump to "fixing."' },
      { id: 'C', text: 'They let the betrayed partner define it alone.' },
      { id: 'D', text: 'They use clinical jargon to sound smart.' }
    ],
    correct: 'B',
    marcieQuip: "If you don't name the monster, it lives in your basement rent-free."
  },
  {
    text: "What's the most dangerous phrase in early recovery?",
    options: [
      { id: 'A', text: '"I said I was sorry."' },
      { id: 'B', text: '"Can we just move on?"' },
      { id: 'C', text: '"You need to trust me."' },
      { id: 'D', text: 'All of the above.' }
    ],
    correct: 'D',
    marcieQuip: "Every single one of these is a red flag parade. D wins by a landslide of denial."
  },
  {
    text: "True vulnerability in Phase 1 looks like:",
    options: [
      { id: 'A', text: 'Crying on command' },
      { id: 'B', text: 'Explaining why you did it' },
      { id: 'C', text: 'Sitting in discomfort without defending yourself' },
      { id: 'D', text: 'Promising it will never happen again' }
    ],
    correct: 'C',
    marcieQuip: "The hardest thing in the world: shutting up while someone you hurt describes their pain."
  },
  {
    text: "Your partner asks 'Why did you do it?' for the 47th time. The correct response is:",
    options: [
      { id: 'A', text: '"I already explained this."' },
      { id: 'B', text: '"Because I was broken in ways I\'m still learning about."' },
      { id: 'C', text: '"I don\'t know."' },
      { id: 'D', text: '"Can we talk about this later?"' }
    ],
    correct: 'B',
    marcieQuip: "They're not asking for information. They're asking if you're doing the work."
  },
  {
    text: "The Foundation phase is complete when:",
    options: [
      { id: 'A', text: 'They stop bringing it up' },
      { id: 'B', text: "You've done enough 'making it up to them'" },
      { id: 'C', text: 'Both partners can name the betrayal without defensiveness' },
      { id: 'D', text: 'A therapist says so' }
    ],
    correct: 'C',
    marcieQuip: "Nobody graduates until you can say the ugly truth without flinching or fighting."
  },
];

// ECHO CHAMBER ESCAPE - Phase 2: Deconstruction
const ECHO_PUZZLES = [
  {
    title: "Mirror #1: The Origin Myth",
    prompt: "Identify the false belief: 'They completed me.'",
    options: [
      { id: 'A', text: "You were already whole—you just didn't believe it." },
      { id: 'B', text: "They filled a gap that was someone else's job to fill." },
      { id: 'C', text: "Completion is a destination, not a journey." },
      { id: 'D', text: "All of these are the escape hatch." }
    ],
    correct: 'D',
    escape: "You were never incomplete. You were just taught to believe you were."
  },
  {
    title: "Mirror #2: The Rescue Fantasy",
    prompt: "Break this pattern: 'If I love them hard enough, they'll change.'",
    options: [
      { id: 'A', text: "Love doesn't fix people—therapy and self-work do." },
      { id: 'B', text: "You're not a rehabilitation center with a heart." },
      { id: 'C', text: "Change comes from within, not from a partner's love." },
      { id: 'D', text: "All of these break the mirror." }
    ],
    correct: 'D',
    escape: "You can love someone completely and still not be their healer."
  },
  {
    title: "Mirror #3: The Scorekeeper",
    prompt: "Shatter this: 'I do more for this relationship than they do.'",
    options: [
      { id: 'A', text: "Scorekeeping is the death of intimacy." },
      { id: 'B', text: "You're measuring different currencies." },
      { id: 'C', text: "Resentment disguised as martyrdom." },
      { id: 'D', text: "All mirrors must break together." }
    ],
    correct: 'D',
    escape: "The moment you start keeping score, you've already lost the game."
  },
  {
    title: "Mirror #4: The Mind Reader",
    prompt: "Destroy this illusion: 'If they really loved me, they'd just know.'",
    options: [
      { id: 'A', text: "Telepathy isn't a love language." },
      { id: 'B', text: "You've been expecting magic instead of communication." },
      { id: 'C', text: "Unspoken expectations are premeditated resentments." },
      { id: 'D', text: "Every option breaks the spell." }
    ],
    correct: 'D',
    escape: "Use your words. You're an adult in a relationship, not a psychic at a carnival."
  },
  {
    title: "Mirror #5: The Forever Fallacy",
    prompt: "Escape this loop: 'Real love never ends.'",
    options: [
      { id: 'A', text: "Love can be real and still run its course." },
      { id: 'B', text: "Seasons change. So do people." },
      { id: 'C', text: "Holding on isn't always love—sometimes it's fear." },
      { id: 'D', text: "Breaking all mirrors sets you free." }
    ],
    correct: 'D',
    escape: "Not everything that ends was a failure. Sometimes it's just... complete."
  },
];

// INTIMACY FEUD - Phase 3: Shared Reality
const FEUD_ROUNDS = [
  {
    question: "What emotional need were you trying to meet outside the relationship?",
    answers: [
      { text: "Validation addiction", percent: 42 },
      { text: "Fear of real intimacy", percent: 28 },
      { text: "Thrill of reinvention", percent: 18 },
      { text: "Avoiding self-confrontation", percent: 8 },
    ]
  },
  {
    question: "What's the first sign a couple is actually healing?",
    answers: [
      { text: "They can laugh together again", percent: 35 },
      { text: "Arguments end differently", percent: 30 },
      { text: "Silence feels safe, not scary", percent: 22 },
      { text: "They stop needing to 'win'", percent: 10 },
    ]
  },
  {
    question: "What did you lose about yourself during the crisis?",
    answers: [
      { text: "Trust in my own judgment", percent: 38 },
      { text: "My sense of identity", percent: 28 },
      { text: "Joy in simple things", percent: 20 },
      { text: "Connection with friends", percent: 11 },
    ]
  },
  {
    question: "What 'small thing' would mean the most to your partner right now?",
    answers: [
      { text: "Being fully present during conversation", percent: 32 },
      { text: "Initiating physical affection", percent: 28 },
      { text: "Remembering something they mentioned", percent: 24 },
      { text: "Protecting time together", percent: 13 },
    ]
  },
];

// RELATIONAL JEOPARDY - Phase 4: The Future
const JEOPARDY_CATEGORIES = [
  {
    name: "Accountability Plans",
    questions: [
      { points: 200, q: "This is what you say instead of 'I'm sorry'", a: "What is 'I take responsibility for...'?" },
      { points: 400, q: "The frequency you should check in about trust rebuilding", a: "What is 'weekly, at minimum'?" },
      { points: 600, q: "This person should NOT be your only emotional support", a: "Who is 'your partner'?" },
      { points: 800, q: "The action that proves accountability more than words", a: "What is 'consistent behavior over time'?" },
      { points: 1000, q: "This must happen before demanding trust back", a: "What is 'earning it through actions'?" },
    ]
  },
  {
    name: "Redefinition",
    questions: [
      { points: 200, q: "A relationship does this, not 'goes back to normal'", a: "What is 'transforms'?" },
      { points: 400, q: "The old version of your relationship after betrayal", a: "What is 'gone forever'?" },
      { points: 600, q: "What both partners must create together in Phase 4", a: "What is 'a new shared story'?" },
      { points: 800, q: "The dangerous goal: wanting things to be this again", a: "What is 'the same as before'?" },
      { points: 1000, q: "This is better than 'getting over it'", a: "What is 'growing through it'?" },
    ]
  },
  {
    name: "Integration",
    questions: [
      { points: 200, q: "Triggers become this with enough healing", a: "What is 'manageable'?" },
      { points: 400, q: "The story you tell about what happened should include this", a: "What is 'growth and learning'?" },
      { points: 600, q: "Instead of forgetting the past, couples do this", a: "What is 'integrate it'?" },
      { points: 800, q: "The ultimate sign of Phase 4 completion", a: "What is 'mutual recommitment'?" },
      { points: 1000, q: "This ceremony marks the new beginning", a: "What is 'The Sovereign Pact'?" },
    ]
  },
];

interface GameProps {
  gameId: string;
  gameName: string;
  onBack: () => void;
  onComplete: (score: number, badge: string) => void;
}

// TRUTH TELLER TOWER GAME
export const TruthTellerTowerGame: React.FC<GameProps> = ({ gameName, onBack, onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [myAnswer, setMyAnswer] = useState<string | null>(null);
  const [partnerPrediction, setPartnerPrediction] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundResult, setRoundResult] = useState<{ correct: boolean; predicted: boolean } | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [lifelines, setLifelines] = useState({ fiftyFifty: true, doubleConfidence: true, trustCheck: true });

  const currentQ = TRUTH_TOWER_QUESTIONS[questionIndex];

  const submitAnswer = () => {
    if (!myAnswer || !partnerPrediction) return;
    
    const correct = myAnswer === currentQ.correct;
    const predicted = partnerPrediction === currentQ.correct; // Simulated partner answer
    
    let points = 0;
    if (correct) points += 10;
    if (predicted) points += 5;
    if (correct && predicted) points += 5; // Bonus for double match
    
    setScore(s => s + points);
    setRoundResult({ correct, predicted });
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (questionIndex < TRUTH_TOWER_QUESTIONS.length - 1) {
      setQuestionIndex(i => i + 1);
      setMyAnswer(null);
      setPartnerPrediction(null);
      setShowResult(false);
      setRoundResult(null);
    } else {
      setGameComplete(true);
      const finalScore = score;
      const badge = finalScore >= 90 ? '📡 The Unfiltered Signal' : 
                   finalScore >= 70 ? '📻 Truth Adjacent' :
                   finalScore >= 50 ? '⚡ Static & Hope' : '🎭 The Scripted Smile';
      onComplete(finalScore, badge);
    }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty) return;
    setLifelines(l => ({ ...l, fiftyFifty: false }));
    // In real implementation, would hide 2 wrong answers
  };

  if (gameComplete) {
    const badge = score >= 90 ? '📡 The Unfiltered Signal' : 
                 score >= 70 ? '📻 Truth Adjacent' :
                 score >= 50 ? '⚡ Static & Hope' : '🎭 The Scripted Smile';
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Tower Scaled!</h2>
          <p className="text-4xl font-bold text-yellow-500 mb-4">{score}/100</p>
          <div className="p-4 bg-white/10 rounded-xl mb-6">
            <p className="text-lg mb-2">{badge}</p>
            <p className="text-sm text-gray-400">You've earned this badge</p>
          </div>
          <button onClick={onBack} className="btn-primary w-full">
            Back to Arcade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0012 0%, #2a0020 100%)' }}>
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#FF6B6B]">🗼 Truth Teller Tower</h1>
          <p className="text-xs text-gray-500">Phase 1: Foundation</p>
        </div>
        <div className="text-right">
          <p className="text-yellow-500 font-bold">{score} pts</p>
          <p className="text-xs text-gray-500">Q{questionIndex + 1}/5</p>
        </div>
      </header>

      <main className="px-6 pb-8">
        {/* Lifelines */}
        <div className="flex justify-center gap-3 mb-6">
          <button 
            onClick={useFiftyFifty}
            disabled={!lifelines.fiftyFifty}
            className={`px-3 py-2 rounded-lg text-sm ${lifelines.fiftyFifty ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-600'}`}
          >
            50/50
          </button>
          <button 
            disabled={!lifelines.doubleConfidence}
            className={`px-3 py-2 rounded-lg text-sm ${lifelines.doubleConfidence ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-600'}`}
          >
            2x Confidence
          </button>
          <button 
            disabled={!lifelines.trustCheck}
            className={`px-3 py-2 rounded-lg text-sm ${lifelines.trustCheck ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-600'}`}
          >
            Trust Check
          </button>
        </div>

        {/* Question */}
        <div className="glass-card p-6 mb-6">
          <p className="text-white text-lg mb-6">{currentQ.text}</p>

          {/* My Answer Section */}
          <p className="text-[#33DEA5] font-semibold mb-3">🎯 Your Truth:</p>
          <div className="space-y-2 mb-6">
            {currentQ.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => !showResult && setMyAnswer(opt.id)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition ${
                  showResult && opt.id === currentQ.correct ? 'bg-green-500/30 border-green-500' :
                  showResult && myAnswer === opt.id && opt.id !== currentQ.correct ? 'bg-red-500/30 border-red-500' :
                  myAnswer === opt.id ? 'bg-[#33DEA5] text-black' : 'bg-white/5 hover:bg-white/10'
                } border border-transparent`}
              >
                <span className="font-bold mr-2">{opt.id}.</span>
                {opt.text}
              </button>
            ))}
          </div>

          {/* Partner Prediction Section */}
          <p className="text-[#FA1F63] font-semibold mb-3">🔮 What will THEY pick?</p>
          <div className="space-y-2 mb-6">
            {currentQ.options.map((opt) => (
              <button
                key={`pred-${opt.id}`}
                onClick={() => !showResult && setPartnerPrediction(opt.id)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition ${
                  partnerPrediction === opt.id ? 'bg-[#FA1F63] text-white' : 'bg-white/5 hover:bg-white/10'
                } border border-transparent`}
              >
                <span className="font-bold mr-2">{opt.id}.</span>
                {opt.text}
              </button>
            ))}
          </div>

          {/* Result or Submit */}
          {showResult && roundResult ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${roundResult.correct ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <p className="text-white">
                  {roundResult.correct ? '✅ Correct!' : '❌ Not quite.'}
                  {roundResult.predicted ? ' And you predicted your partner!' : ''}
                </p>
              </div>
              <div className="p-4 bg-romance-pink/20 rounded-xl">
                <p className="text-white italic">"{currentQ.marcieQuip}"</p>
                <p className="text-romance-pink text-sm mt-2">— Dr. Marcie</p>
              </div>
              <button onClick={nextQuestion} className="btn-primary w-full">
                {questionIndex < 4 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          ) : (
            <button 
              onClick={submitAnswer}
              disabled={!myAnswer || !partnerPrediction}
              className="btn-primary w-full disabled:opacity-50"
            >
              Lock In Answers 🔒
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

// ECHO CHAMBER ESCAPE GAME
export const EchoChamberEscapeGame: React.FC<GameProps> = ({ onBack, onComplete }) => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showEscape, setShowEscape] = useState(false);
  const [mirrorsShattered, setMirrorsShattered] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  const currentPuzzle = ECHO_PUZZLES[puzzleIndex];

  useEffect(() => {
    if (timeLeft > 0 && !showEscape && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showEscape, gameComplete]);

  const shatterMirror = () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === currentPuzzle.correct;
    if (correct) {
      setMirrorsShattered(m => m + 1);
    }
    setShowEscape(true);
  };

  const nextPuzzle = () => {
    if (puzzleIndex < ECHO_PUZZLES.length - 1) {
      setPuzzleIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowEscape(false);
      setTimeLeft(90);
    } else {
      setGameComplete(true);
      const score = mirrorsShattered * 20;
      const badge = score >= 80 ? '💥 Echo Exorcist' : 
                   score >= 60 ? '🔧 Mirror Breaker' :
                   score >= 40 ? '➖ Reverb Reducer' : '🌀 Still Whispering';
      onComplete(score, badge);
    }
  };

  if (gameComplete) {
    const score = mirrorsShattered * 20;
    const badge = score >= 80 ? '💥 Echo Exorcist' : 
                 score >= 60 ? '🔧 Mirror Breaker' :
                 score >= 40 ? '➖ Reverb Reducer' : '🌀 Still Whispering';
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🪞💥</div>
          <h2 className="text-2xl font-bold text-white mb-2">Chamber Escaped!</h2>
          <p className="text-gray-400 mb-4">{mirrorsShattered}/5 mirrors shattered</p>
          <p className="text-4xl font-bold text-purple-400 mb-4">{score}/100</p>
          <div className="p-4 bg-white/10 rounded-xl mb-6">
            <p className="text-lg mb-2">{badge}</p>
          </div>
          <button onClick={onBack} className="btn-primary w-full">
            Back to Arcade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0012 0%, #1a0030 100%)' }}>
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-purple-400">🪞 Echo Chamber Escape</h1>
          <p className="text-xs text-gray-500">Phase 2: Deconstruction</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-orange-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{timeLeft}s</span>
          </div>
          <div className="text-right">
            <p className="text-purple-400 font-bold">{mirrorsShattered}/5</p>
            <p className="text-xs text-gray-500">Shattered</p>
          </div>
        </div>
      </header>

      <main className="px-6 pb-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-purple-300 mb-2">{currentPuzzle.title}</h2>
          <p className="text-gray-400 mb-4">{currentPuzzle.prompt}</p>

          <div className="space-y-3 mb-6">
            {currentPuzzle.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => !showEscape && setSelectedAnswer(opt.id)}
                disabled={showEscape}
                className={`w-full p-4 rounded-xl text-left transition ${
                  selectedAnswer === opt.id ? 'bg-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {showEscape ? (
            <div className="space-y-4">
              <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-500/50">
                <p className="text-white text-center">🪞 MIRROR SHATTERED 🪞</p>
                <p className="text-purple-300 mt-2 text-center italic">"{currentPuzzle.escape}"</p>
              </div>
              <button onClick={nextPuzzle} className="btn-primary w-full">
                {puzzleIndex < 4 ? 'Next Mirror' : 'Escape Complete'}
              </button>
            </div>
          ) : (
            <button 
              onClick={shatterMirror}
              disabled={!selectedAnswer}
              className="w-full py-4 rounded-xl font-bold transition bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            >
              💥 Shatter This Mirror
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

// INTIMACY FEUD GAME
export const IntimacyFeudGame: React.FC<GameProps> = ({ onBack, onComplete }) => {
  const [roundIndex, setRoundIndex] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false]);
  const [score, setScore] = useState(0);
  const [showRoundEnd, setShowRoundEnd] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const currentRound = FEUD_ROUNDS[roundIndex];

  const buzzIn = (index: number) => {
    if (revealed[index]) return;
    
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    
    const points = currentRound.answers[index].percent;
    setScore(s => s + points);
    
    // Check if all revealed
    if (newRevealed.every(r => r)) {
      setShowRoundEnd(true);
    }
  };

  const nextRound = () => {
    if (roundIndex < FEUD_ROUNDS.length - 1) {
      setRoundIndex(i => i + 1);
      setRevealed([false, false, false, false]);
      setRevealed([false, false, false, false]);
      setShowRoundEnd(false);
    } else {
      setGameComplete(true);
      const badge = score >= 200 ? '👑 Authenticity Overlord' : 
                   score >= 150 ? '🗡️ Realness Raider' :
                   score >= 100 ? '🔍 Script Skeptic' : '🎤 Still Auditioning';
      onComplete(score, badge);
    }
  };

  if (gameComplete) {
    const badge = score >= 200 ? '👑 Authenticity Overlord' : 
                 score >= 150 ? '🗡️ Realness Raider' :
                 score >= 100 ? '🔍 Script Skeptic' : '🎤 Still Auditioning';
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h2 className="text-2xl font-bold text-white mb-2">Survey Complete!</h2>
          <p className="text-4xl font-bold text-blue-400 mb-4">{score}/250</p>
          <div className="p-4 bg-white/10 rounded-xl mb-6">
            <p className="text-lg mb-2">{badge}</p>
          </div>
          <button onClick={onBack} className="btn-primary w-full">
            Back to Arcade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0012 0%, #001030 100%)' }}>
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-blue-400">👨‍👩‍👧‍👦 The Intimacy Feud</h1>
          <p className="text-xs text-gray-500">Phase 3: Shared Reality</p>
        </div>
        <div className="text-right">
          <p className="text-yellow-500 font-bold">{score} pts</p>
          <p className="text-xs text-gray-500">Round {roundIndex + 1}/4</p>
        </div>
      </header>

      <main className="px-6 pb-8">
        <div className="glass-card p-6 mb-4">
          <p className="text-blue-300 text-sm mb-2">Survey of 100 Recovered Couples</p>
          <p className="text-white text-lg">{currentRound.question}</p>
        </div>

        <div className="space-y-3 mb-6">
          {currentRound.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => buzzIn(index)}
              disabled={revealed[index]}
              className={`w-full p-4 rounded-xl flex justify-between items-center transition ${
                revealed[index] 
                  ? 'bg-blue-500/30 border border-blue-500' 
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <span className={revealed[index] ? 'text-white' : 'text-gray-500'}>
                {revealed[index] ? answer.text : `Answer ${index + 1}`}
              </span>
              {revealed[index] && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                  {answer.percent}
                </span>
              )}
            </button>
          ))}
        </div>

        {showRoundEnd && (
          <button onClick={nextRound} className="btn-primary w-full">
            {roundIndex < 3 ? 'Next Round' : 'See Final Score'}
          </button>
        )}

        <div className="text-center text-gray-500 text-sm mt-4">
          Tap to reveal answers • Higher % = More points
        </div>
      </main>
    </div>
  );
};

// RELATIONAL JEOPARDY GAME  
export const RelationalJeopardyGame: React.FC<GameProps> = ({ onBack, onComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [showFinalJeopardy, setShowFinalJeopardy] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const selectQuestion = (catIndex: number, qIndex: number) => {
    const key = `${catIndex}-${qIndex}`;
    if (usedQuestions.has(key)) return;
    setSelectedCategory(catIndex);
    setSelectedQuestion(qIndex);
  };

  const answerQuestion = (correct: boolean) => {
    if (selectedCategory === null || selectedQuestion === null) return;
    
    const points = JEOPARDY_CATEGORIES[selectedCategory].questions[selectedQuestion].points;
    if (correct) {
      setScore(s => s + points);
    } else {
      setScore(s => Math.max(0, s - points));
    }
    
    const key = `${selectedCategory}-${selectedQuestion}`;
    setUsedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.add(key);
      return newSet;
    });
    setShowAnswer(true);
  };

  const backToBoard = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setShowAnswer(false);
    
    // Check if all questions answered
    if (usedQuestions.size >= 14) { // 15 questions total minus current
      setShowFinalJeopardy(true);
    }
  };

  const finishGame = () => {
    setGameComplete(true);
    const badge = score >= 1500 ? '📜 Sovereign Pact' : 
                 score >= 1000 ? '⏳ Provisional Truce' :
                 score >= 500 ? '📄 Treaty in Draft' : '💣 Ceasefire Pending';
    onComplete(score, badge);
  };

  if (gameComplete) {
    const badge = score >= 1500 ? '📜 Sovereign Pact' : 
                 score >= 1000 ? '⏳ Provisional Truce' :
                 score >= 500 ? '📄 Treaty in Draft' : '💣 Ceasefire Pending';
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-white mb-2">Jeopardy Complete!</h2>
          <p className="text-4xl font-bold text-green-400 mb-4">${score}</p>
          <div className="p-4 bg-white/10 rounded-xl mb-6">
            <p className="text-lg mb-2">{badge}</p>
          </div>
          <button onClick={onBack} className="btn-primary w-full">
            Back to Arcade
          </button>
        </div>
      </div>
    );
  }

  if (showFinalJeopardy) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-green-400 mb-4">🎯 Final Jeopardy!</h2>
          <p className="text-white mb-6">Category: THE SOVEREIGN PACT</p>
          <p className="text-gray-300 mb-6">
            "This is what you commit to when you choose to rebuild—not to forget, but to forge something new together."
          </p>
          <button onClick={finishGame} className="btn-primary w-full">
            Complete Game
          </button>
        </div>
      </div>
    );
  }

  // Question View
  if (selectedCategory !== null && selectedQuestion !== null) {
    const category = JEOPARDY_CATEGORIES[selectedCategory];
    const question = category.questions[selectedQuestion];
    
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-lg">
          <p className="text-green-400 mb-2">{category.name} - ${question.points}</p>
          <p className="text-white text-xl mb-6">{question.q}</p>
          
          {showAnswer ? (
            <>
              <div className="p-4 bg-green-500/20 rounded-xl mb-6">
                <p className="text-green-300">{question.a}</p>
              </div>
              <button onClick={backToBoard} className="btn-primary w-full">
                Back to Board
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => answerQuestion(true)}
                className="flex-1 py-4 bg-green-500 rounded-xl font-bold text-white"
              >
                <Check className="w-6 h-6 mx-auto" />
                Correct
              </button>
              <button 
                onClick={() => answerQuestion(false)}
                className="flex-1 py-4 bg-red-500 rounded-xl font-bold text-white"
              >
                <X className="w-6 h-6 mx-auto" />
                Wrong
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Game Board
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0012 0%, #002010 100%)' }}>
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-green-400">❓ Relational Jeopardy!</h1>
          <p className="text-xs text-gray-500">Phase 4: The Future</p>
        </div>
        <div className="text-right">
          <p className="text-yellow-500 font-bold">${score}</p>
        </div>
      </header>

      <main className="px-4 pb-8">
        <div className="grid grid-cols-3 gap-2">
          {/* Category Headers */}
          {JEOPARDY_CATEGORIES.map((cat, i) => (
            <div key={cat.name} className="bg-blue-800 p-3 text-center rounded-t-lg">
              <p className="text-white font-bold text-sm">{cat.name}</p>
            </div>
          ))}
          
          {/* Questions Grid */}
          {[0, 1, 2, 3, 4].map(qIndex => (
            JEOPARDY_CATEGORIES.map((cat, catIndex) => {
              const key = `${catIndex}-${qIndex}`;
              const used = usedQuestions.has(key);
              const points = cat.questions[qIndex].points;
              return (
                <button
                  key={key}
                  onClick={() => selectQuestion(catIndex, qIndex)}
                  disabled={used}
                  className={`p-4 text-center transition ${
                    used 
                      ? 'bg-gray-800 text-gray-600' 
                      : 'bg-blue-600 hover:bg-blue-500 text-yellow-400'
                  } font-bold text-lg`}
                >
                  {used ? '' : `$${points}`}
                </button>
              );
            })
          ))}
        </div>
      </main>
    </div>
  );
};

export default {
  TruthTellerTowerGame,
  EchoChamberEscapeGame,
  IntimacyFeudGame,
  RelationalJeopardyGame,
};
