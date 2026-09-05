import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Eye, Send } from 'lucide-react';

interface GameProps {
  gameId: string;
  gameName: string;
  onBack: () => void;
  onComplete: (score: number, badge: string) => void;
}

// TRUTH OR TRUST - Emotional Connection
const TRUTH_PROMPTS = [
  "What's one thing you've never told your partner because you were afraid of their reaction?",
  "When was the last time you felt truly seen by your partner? Describe it.",
  "What's a fear about your relationship you've never voiced?",
  "Describe a moment when you felt most vulnerable with your partner.",
  "What's one thing you wish your partner understood about you?",
];

export const TruthOrTrustGame: React.FC<GameProps> = ({ onBack, onComplete }) => {
  const [promptIndex, setPromptIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const currentPrompt = TRUTH_PROMPTS[promptIndex];

  const analyzeResponse = (text: string) => {
    const vulnerabilityWords = ['feel', 'afraid', 'scared', 'love', 'hurt', 'trust', 'vulnerable', 'honest', 'sorry', 'appreciate'];
    const wordCount = text.split(/\s+/).length;
    const vulnCount = vulnerabilityWords.filter(w => text.toLowerCase().includes(w)).length;
    
    let points = 0;
    if (wordCount >= 20) points += 10;
    if (wordCount >= 50) points += 10;
    if (vulnCount >= 2) points += 10;
    if (vulnCount >= 4) points += 10;
    
    return { points: Math.min(40, points), vulnCount, wordCount };
  };

  const submitResponse = () => {
    if (!response.trim()) return;
    
    const analysis = analyzeResponse(response);
    const newScore = score + analysis.points;
    setScore(newScore);
    
    if (analysis.points >= 30) {
      setFeedback("Now THAT'S vulnerability. I'm almost proud of you.");
    } else if (analysis.points >= 20) {
      setFeedback("Getting warmer. But I can tell you're still holding back.");
    } else {
      setFeedback("Authenticity check: needs work. Dig deeper, sweetheart.");
    }
    
    setSubmitted(true);
  };

  const nextPrompt = () => {
    if (promptIndex < TRUTH_PROMPTS.length - 1) {
      setPromptIndex(i => i + 1);
      setResponse('');
      setSubmitted(false);
      setFeedback('');
    } else {
      const badge = score >= 80 ? '💎 Radical Honesty Champion' : 
                   score >= 50 ? '🌟 Truth Seeker' : '🌱 Vulnerability Apprentice';
      onComplete(score, badge);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-romance-pink">❤️ Truth or Trust</h1>
          <p className="text-xs text-gray-500">Emotional Connection</p>
        </div>
        <div className="text-right">
          <p className="text-yellow-500 font-bold">{score} pts</p>
          <p className="text-xs text-gray-500">{promptIndex + 1}/5</p>
        </div>
      </header>

      <main className="px-6 pb-8">
        <div className="glass-card p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-romance-pink" />
            <span className="text-gray-400 text-sm">Prompt {promptIndex + 1}</span>
          </div>
          <p className="text-white text-lg">{currentPrompt}</p>
        </div>

        {!submitted ? (
          <>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Speak your truth... (minimum 20 words for full points)"
              className="w-full glass-card p-4 bg-transparent text-white outline-none min-h-[200px] resize-none mb-4"
            />
            <p className="text-gray-500 text-sm mb-4">
              {response.split(/\s+/).filter(w => w).length} words
            </p>
            <button 
              onClick={submitResponse}
              disabled={!response.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              Submit Truth
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="glass-card p-4 bg-romance-pink/10 border-romance-pink/30">
              <p className="text-white italic">"{feedback}"</p>
              <p className="text-romance-pink text-sm mt-2">— Dr. Marcie</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-gray-400 text-sm">Your response:</p>
              <p className="text-white mt-2">{response}</p>
            </div>
            <button onClick={nextPrompt} className="btn-primary w-full">
              {promptIndex < 4 ? 'Next Prompt' : 'See Results'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

// EYE CONTACT CHALLENGE
export const EyeContactChallengeGame: React.FC<GameProps> = ({ onBack, onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'challenge' | 'reflect' | 'complete'>('intro');
  const [timer, setTimer] = useState(0);
  const [targetTime] = useState(60); // 60 seconds
  const [isActive, setIsActive] = useState(false);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timer < targetTime) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else if (timer >= targetTime) {
      setIsActive(false);
      setPhase('reflect');
    }
    return () => clearInterval(interval);
  }, [isActive, timer, targetTime]);

  const startChallenge = () => {
    setPhase('challenge');
    setIsActive(true);
  };

  const submitReflection = () => {
    const score = Math.round((timer / targetTime) * 50) + (reflection.length > 50 ? 50 : 25);
    const badge = timer >= 60 ? '👁️ Soul Gazer' : timer >= 30 ? '✨ Connection Seeker' : '🌱 Eye Contact Beginner';
    onComplete(score, badge);
    setPhase('complete');
  };

  if (phase === 'complete') {
    const score = Math.round((timer / targetTime) * 50) + (reflection.length > 50 ? 50 : 25);
    const badge = timer >= 60 ? '👁️ Soul Gazer' : timer >= 30 ? '✨ Connection Seeker' : '🌱 Eye Contact Beginner';
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <Eye className="w-16 h-16 text-romance-pink mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Challenge Complete!</h2>
          <p className="text-gray-400 mb-2">You held eye contact for {timer} seconds</p>
          <p className="text-4xl font-bold text-romance-pink mb-4">{score}/100</p>
          <div className="p-4 bg-white/10 rounded-xl mb-6">
            <p className="text-lg">{badge}</p>
          </div>
          <button onClick={onBack} className="btn-primary w-full">Back to Games</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-romance-pink">👁️ Eye Contact Challenge</h1>
        </div>
      </header>

      <main className="px-6 pb-8 flex flex-col items-center justify-center min-h-[70vh]">
        {phase === 'intro' && (
          <div className="text-center max-w-md">
            <Eye className="w-20 h-20 text-romance-pink mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-4">The Eye Contact Challenge</h2>
            <p className="text-gray-400 mb-6">
              Sit facing your partner. Maintain eye contact for 60 seconds without speaking.
              Just... see each other.
            </p>
            <div className="glass-card p-4 mb-6">
              <p className="text-white italic">"The eyes are the window to the soul. Time to clean the glass."</p>
              <p className="text-romance-pink text-sm mt-2">— Dr. Marcie</p>
            </div>
            <button onClick={startChallenge} className="btn-primary">
              Start Challenge
            </button>
          </div>
        )}

        {phase === 'challenge' && (
          <div className="text-center">
            <div className="w-40 h-40 rounded-full border-4 border-romance-pink flex items-center justify-center mb-8 mx-auto">
              <span className="text-5xl font-bold text-white">{timer}s</span>
            </div>
            <p className="text-gray-400 mb-4">Look into your partner's eyes...</p>
            <div className="w-full bg-white/10 rounded-full h-2 mb-6">
              <div 
                className="bg-romance-pink h-2 rounded-full transition-all"
                style={{ width: `${(timer / targetTime) * 100}%` }}
              />
            </div>
            <button 
              onClick={() => { setIsActive(false); setPhase('reflect'); }}
              className="text-gray-500 underline"
            >
              End Early
            </button>
          </div>
        )}

        {phase === 'reflect' && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              You held eye contact for {timer} seconds
            </h2>
            <p className="text-gray-400 text-center mb-6">What did you feel?</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Describe what you experienced..."
              className="w-full glass-card p-4 bg-transparent text-white outline-none min-h-[150px] resize-none mb-4"
            />
            <button onClick={submitReflection} className="btn-primary w-full">
              Complete Challenge
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

// GRATITUDE CLOUD
const GRATITUDE_PROMPTS = [
  "Something small they did this week that made you smile",
  "A quality about them you've never thanked them for",
  "A sacrifice they made that you noticed",
  "Something about your life together you're grateful for",
  "A way they've helped you grow",
];

export const GratitudeCloudGame: React.FC<GameProps> = ({ onBack, onComplete }) => {
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  const addGratitude = () => {
    if (!currentInput.trim()) return;
    setGratitudes([...gratitudes, currentInput]);
    setCurrentInput('');
    
    if (promptIndex < GRATITUDE_PROMPTS.length - 1) {
      setPromptIndex(i => i + 1);
    } else {
      const score = gratitudes.length * 20;
      const badge = score >= 80 ? '☁️ Gratitude Master' : score >= 40 ? '🌤️ Appreciation Adept' : '🌱 Thanks Trainee';
      onComplete(score, badge);
      setComplete(true);
    }
  };

  if (complete) {
    const score = gratitudes.length * 20;
    const badge = score >= 80 ? '☁️ Gratitude Master' : score >= 40 ? '🌤️ Appreciation Adept' : '🌱 Thanks Trainee';
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">☁️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Gratitude Cloud</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {gratitudes.map((g, i) => (
              <span key={i} className="px-3 py-1 bg-romance-pink/20 rounded-full text-sm text-white">
                {g.substring(0, 30)}...
              </span>
            ))}
          </div>
          <p className="text-4xl font-bold text-romance-pink mb-4">{score}/100</p>
          <p className="text-lg mb-6">{badge}</p>
          <button onClick={onBack} className="btn-primary w-full">Back to Games</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-trust-green">☁️ Gratitude Cloud</h1>
        </div>
        <p className="text-gray-500">{promptIndex + 1}/5</p>
      </header>

      <main className="px-6 pb-8">
        {/* Existing gratitudes */}
        <div className="flex flex-wrap gap-2 mb-6">
          {gratitudes.map((g, i) => (
            <span key={i} className="px-3 py-2 bg-trust-green/20 rounded-full text-sm text-trust-green">
              💚 {g.substring(0, 25)}...
            </span>
          ))}
        </div>

        <div className="glass-card p-6">
          <p className="text-gray-400 text-sm mb-2">Prompt {promptIndex + 1}</p>
          <p className="text-white text-lg mb-6">{GRATITUDE_PROMPTS[promptIndex]}</p>
          
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Express your gratitude..."
            className="w-full bg-transparent text-white outline-none min-h-[120px] resize-none border-b border-white/20 mb-4"
          />
          
          <button 
            onClick={addGratitude}
            disabled={!currentInput.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            Add to Cloud ☁️
          </button>
        </div>
      </main>
    </div>
  );
};

// APOLOGY AUCTION
const APOLOGY_SCENARIOS = [
  {
    scenario: "You forgot an important date (anniversary, birthday, etc.)",
    options: [
      { text: '"Sorry, I forgot."', value: 10 },
      { text: '"I\'m sorry I forgot. I know how important this was to you, and I feel terrible."', value: 40 },
      { text: '"I\'m sorry I forgot. I know this made you feel unimportant. What can I do to make this right?"', value: 80 },
      { text: '"Why are you making such a big deal out of it?"', value: -20 },
    ]
  },
  {
    scenario: "You raised your voice during an argument",
    options: [
      { text: '"Well, you made me yell."', value: -20 },
      { text: '"Sorry I yelled."', value: 20 },
      { text: '"I\'m sorry I raised my voice. That wasn\'t okay, regardless of how I was feeling."', value: 60 },
      { text: '"I apologize for yelling. I know that felt scary/hurtful. I\'m working on managing my emotions better."', value: 100 },
    ]
  },
  {
    scenario: "You made a decision without consulting your partner",
    options: [
      { text: '"I didn\'t think you\'d care."', value: -10 },
      { text: '"Sorry, I should have asked."', value: 30 },
      { text: '"I apologize for not including you. I understand why that felt disrespectful."', value: 70 },
      { text: '"I\'m sorry I made this decision alone. In the future, I commit to discussing things like this with you first."', value: 100 },
    ]
  },
];

export const ApologyAuctionGame: React.FC<GameProps> = ({ onBack, onComplete }) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [complete, setComplete] = useState(false);

  const currentScenario = APOLOGY_SCENARIOS[scenarioIndex];

  const selectApology = (index: number) => {
    setSelectedOption(index);
    const value = currentScenario.options[index].value;
    setTotalScore(s => s + value);
    setShowResult(true);
  };

  const nextScenario = () => {
    if (scenarioIndex < APOLOGY_SCENARIOS.length - 1) {
      setScenarioIndex(i => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      const badge = totalScore >= 200 ? '🏆 Apology Expert' : totalScore >= 100 ? '💪 Repair Specialist' : '📚 Learning Humility';
      onComplete(totalScore, badge);
      setComplete(true);
    }
  };

  if (complete) {
    const badge = totalScore >= 200 ? '🏆 Apology Expert' : totalScore >= 100 ? '💪 Repair Specialist' : '📚 Learning Humility';
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">Auction Complete!</h2>
          <p className="text-4xl font-bold text-trust-green mb-4">{totalScore} pts</p>
          <p className="text-lg mb-6">{badge}</p>
          <button onClick={onBack} className="btn-primary w-full">Back to Games</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-trust-green">🏆 Apology Auction</h1>
        </div>
        <p className="text-yellow-500 font-bold">{totalScore} pts</p>
      </header>

      <main className="px-6 pb-8">
        <div className="glass-card p-6 mb-4">
          <p className="text-gray-400 text-sm mb-2">Scenario {scenarioIndex + 1}/3</p>
          <p className="text-white text-lg">{currentScenario.scenario}</p>
        </div>

        <p className="text-gray-400 mb-4">Choose the best apology:</p>

        <div className="space-y-3">
          {currentScenario.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => !showResult && selectApology(index)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-left transition ${
                showResult && selectedOption === index
                  ? opt.value >= 60 ? 'bg-green-500/30 border-green-500' : 
                    opt.value >= 0 ? 'bg-yellow-500/30 border-yellow-500' : 'bg-red-500/30 border-red-500'
                  : 'bg-white/5 hover:bg-white/10'
              } border border-transparent`}
            >
              <p className="text-white">{opt.text}</p>
              {showResult && selectedOption === index && (
                <p className={`text-sm mt-2 ${opt.value >= 60 ? 'text-green-400' : opt.value >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {opt.value >= 0 ? '+' : ''}{opt.value} points
                </p>
              )}
            </button>
          ))}
        </div>

        {showResult && (
          <button onClick={nextScenario} className="btn-primary w-full mt-6">
            {scenarioIndex < 2 ? 'Next Scenario' : 'See Results'}
          </button>
        )}
      </main>
    </div>
  );
};

// SIX SECOND KISS
export const SixSecondKissGame: React.FC<GameProps> = ({ onBack, onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'kiss' | 'reflect' | 'complete'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [kissTimer, setKissTimer] = useState(0);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'countdown' && countdown > 0) {
      interval = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (phase === 'countdown' && countdown === 0) {
      setPhase('kiss');
    }
    return () => clearTimeout(interval);
  }, [phase, countdown]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'kiss' && kissTimer < 6) {
      interval = setInterval(() => setKissTimer(t => t + 1), 1000);
    } else if (phase === 'kiss' && kissTimer >= 6) {
      setPhase('reflect');
    }
    return () => clearInterval(interval);
  }, [phase, kissTimer]);

  const finish = () => {
    const score = kissTimer >= 6 ? 100 : Math.round((kissTimer / 6) * 100);
    const badge = score >= 100 ? '💋 Kiss Champion' : '💕 Affection Apprentice';
    onComplete(score, badge);
    setPhase('complete');
  };

  if (phase === 'complete') {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">💋</div>
          <h2 className="text-2xl font-bold text-white mb-4">Challenge Complete!</h2>
          <p className="text-romance-pink italic mb-6">"{reflection || 'Connection made'}"</p>
          <button onClick={onBack} className="btn-primary w-full">Back to Games</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center p-6 max-w-md">
        {phase === 'intro' && (
          <>
            <div className="text-6xl mb-6">💋</div>
            <h2 className="text-2xl font-bold text-white mb-4">6-Second Kiss Challenge</h2>
            <p className="text-gray-400 mb-6">
              Research shows a 6-second kiss creates connection.
              Put down your phones. Face each other. Ready?
            </p>
            <button onClick={() => setPhase('countdown')} className="btn-primary">
              Start Challenge
            </button>
          </>
        )}

        {phase === 'countdown' && (
          <>
            <p className="text-gray-400 mb-4">Get ready...</p>
            <div className="text-8xl font-bold text-romance-pink mb-6">{countdown}</div>
          </>
        )}

        {phase === 'kiss' && (
          <>
            <Heart className="w-20 h-20 text-romance-pink mx-auto mb-4 animate-pulse" />
            <div className="text-6xl font-bold text-white mb-4">{kissTimer}s</div>
            <p className="text-romance-pink">Keep kissing...</p>
            <div className="w-full bg-white/10 rounded-full h-3 mt-6">
              <div 
                className="bg-romance-pink h-3 rounded-full transition-all"
                style={{ width: `${(kissTimer / 6) * 100}%` }}
              />
            </div>
          </>
        )}

        {phase === 'reflect' && (
          <>
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-xl font-bold text-white mb-4">How did that feel?</h2>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Describe the moment..."
              className="w-full glass-card p-4 bg-transparent text-white outline-none min-h-[100px] resize-none mb-4"
            />
            <button onClick={finish} className="btn-primary w-full">
              Complete
            </button>
          </>
        )}

        {phase !== 'intro' && phase !== 'countdown' && (
          <button onClick={onBack} className="text-gray-500 mt-4 underline">
            Back to Games
          </button>
        )}
      </div>
    </div>
  );
};

export default {
  TruthOrTrustGame,
  EyeContactChallengeGame,
  GratitudeCloudGame,
  ApologyAuctionGame,
  SixSecondKissGame,
};
