import React, { useState } from 'react';
import { ArrowLeft, Send, Loader2, Sparkles } from 'lucide-react';
import { marcieApi } from '../lib/api';

interface SOSFightSolverProps {
  onNavigate: (screen: string, params?: any) => void;
}

const SARCASM_LEVELS = [
  { level: 1, name: 'Tough Love Rookie', description: 'Mild sarcasm, warm but blunt', emoji: '💕' },
  { level: 2, name: 'Reality Check Specialist', description: 'Clinical, analytical sarcasm', emoji: '🔬' },
  { level: 3, name: 'Radical Truth Wizard', description: 'Deep, powerful, poetic truth', emoji: '🔮' },
  { level: 4, name: 'The Glamour Oracle', description: 'Full Noir Prophecy Mode', emoji: '👑' },
];

const EMOTIONS = [
  'Angry', 'Frustrated', 'Hurt', 'Disappointed', 'Anxious', 
  'Sad', 'Overwhelmed', 'Confused', 'Unheard', 'Disconnected'
];

const SOSFightSolver: React.FC<SOSFightSolverProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<'intro' | 'booth' | 'cooldown' | 'verdict'>('intro');
  const [sarcasmLevel, setSarcasmLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [marcieResponse, setMarcieResponse] = useState('');
  
  // Booth form state
  const [iFeel, setIFeel] = useState('');
  const [whenPartner, setWhenPartner] = useState('');
  const [becauseITellMyself, setBecauseITellMyself] = useState('');
  const [whatINeed, setWhatINeed] = useState('');

  const handleSubmitBooth = async () => {
    if (!iFeel || !whenPartner || !becauseITellMyself || !whatINeed) return;
    
    setLoading(true);
    setStep('cooldown');
    
    try {
      const response = await marcieApi.chat({
        user_id: 'guest',
        context: 'SOS Fight Solver - Analyzing couple conflict',
        message: `Partner feels: ${iFeel}. When their partner: ${whenPartner}. Because they tell themselves: ${becauseITellMyself}. What they need: ${whatINeed}. Please provide therapeutic insight and actionable advice.`,
        sarcasm_level: sarcasmLevel,
        game_context: 'SOS Fight Solver',
      });
      
      setMarcieResponse(response.response);
      setTimeout(() => setStep('verdict'), 3000);
    } catch (error) {
      setMarcieResponse("Looks like my sarcasm circuits got crossed. Take a breath, count to 10, and try again. Or, you know, actually talk to each other. Revolutionary concept, I know.");
      setTimeout(() => setStep('verdict'), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0012 0%, #2a0020 50%, #400020 100%)' }}>
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button 
          onClick={() => step === 'intro' ? onNavigate('library') : setStep('intro')}
          className="p-2 rounded-full hover:bg-white/10 transition"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-red-500">🚨 SOS FIGHT SOLVER 🚨</h1>
          <p className="text-xs text-gray-500">Because screaming into a pillow only works for so long</p>
        </div>
      </header>

      <main className="px-6 pb-32">
        {/* Step 1: Intro */}
        {step === 'intro' && (
          <div className="space-y-6 pt-4">
            {/* Marcie Intro */}
            <div className="glass-card p-5 border-red-500/30" style={{ background: 'rgba(255,0,0,0.1)' }}>
              <div className="flex items-start gap-4">
                <img
                  src="/marcieimages/marcieimage1.png"
                  alt="Dr. Marcie"
                  className="w-16 h-24 object-contain"
                  onError={(e) => (e.currentTarget.src = 'https://placehold.co/64x96/FA1F63/ffffff?text=M')}
                />
                <div>
                  <p className="text-white italic text-sm">
                    "Oh honey, you pressed the big red button. This means someone either said something unforgivable, 
                    or you're both hungry. Let's find out which."
                  </p>
                  <p className="text-romance-pink text-xs mt-2">— Dr. Marcie Liss</p>
                </div>
              </div>
            </div>

            {/* Sarcasm Level Selector */}
            <div>
              <h3 className="text-white font-bold mb-3">Choose Your Truth Tolerance</h3>
              <div className="space-y-2">
                {SARCASM_LEVELS.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => setSarcasmLevel(level.level)}
                    className={`w-full p-4 rounded-xl text-left transition ${
                      sarcasmLevel === level.level
                        ? 'bg-romance-pink/20 border-2 border-romance-pink'
                        : 'glass-card hover:border-romance-pink/50'
                    }`}
                    data-testid={`sarcasm-level-${level.level}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{level.emoji}</span>
                      <div>
                        <p className="font-semibold text-white">{level.name}</p>
                        <p className="text-xs text-gray-500">{level.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep('booth')}
              className="btn-primary w-full py-4 text-lg"
              data-testid="start-sos-btn"
            >
              Enter the Booth 🎙️
            </button>
          </div>
        )}

        {/* Step 2: Booth */}
        {step === 'booth' && (
          <div className="space-y-5 pt-4">
            <h2 className="text-xl font-bold text-white text-center">The Confession Booth</h2>
            <p className="text-sm text-gray-400 text-center mb-4">
              Speak your truth. No judgment. (Okay, a little judgment from Marcie.)
            </p>

            {/* I Feel */}
            <div>
              <label className="text-white font-semibold mb-2 block">I feel...</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {EMOTIONS.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => setIFeel(emotion)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      iFeel === emotion
                        ? 'bg-romance-pink text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or type your own..."
                className="w-full glass-card px-4 py-3 bg-transparent text-white outline-none"
                value={iFeel}
                onChange={(e) => setIFeel(e.target.value)}
                data-testid="i-feel-input"
              />
            </div>

            {/* When partner... */}
            <div>
              <label className="text-white font-semibold mb-2 block">When my partner...</label>
              <textarea
                placeholder="Describe what happened..."
                className="w-full glass-card px-4 py-3 bg-transparent text-white outline-none min-h-[100px] resize-none"
                value={whenPartner}
                onChange={(e) => setWhenPartner(e.target.value)}
                data-testid="when-partner-input"
              />
            </div>

            {/* Because I tell myself... */}
            <div>
              <label className="text-white font-semibold mb-2 block">Because I tell myself...</label>
              <textarea
                placeholder="What story are you telling yourself?"
                className="w-full glass-card px-4 py-3 bg-transparent text-white outline-none min-h-[80px] resize-none"
                value={becauseITellMyself}
                onChange={(e) => setBecauseITellMyself(e.target.value)}
                data-testid="because-input"
              />
            </div>

            {/* What I need... */}
            <div>
              <label className="text-white font-semibold mb-2 block">What I actually need is...</label>
              <textarea
                placeholder="What do you really need right now?"
                className="w-full glass-card px-4 py-3 bg-transparent text-white outline-none min-h-[80px] resize-none"
                value={whatINeed}
                onChange={(e) => setWhatINeed(e.target.value)}
                data-testid="what-i-need-input"
              />
            </div>

            <button
              onClick={handleSubmitBooth}
              disabled={!iFeel || !whenPartner || !becauseITellMyself || !whatINeed}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="submit-booth-btn"
            >
              <Send className="w-5 h-5" />
              Submit to Dr. Marcie
            </button>
          </div>
        )}

        {/* Step 3: Cooldown */}
        {step === 'cooldown' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Loader2 className="w-16 h-16 text-romance-pink animate-spin mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Dr. Marcie is Analyzing...</h2>
            <p className="text-gray-400">
              Take 3 deep breaths. Seriously. I'm watching.
            </p>
            <div className="mt-8 text-6xl animate-bounce">🧘</div>
          </div>
        )}

        {/* Step 4: Verdict */}
        {step === 'verdict' && (
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Dr. Marcie's Verdict</h2>
            </div>

            <div className="glass-card p-6 border-romance-pink/30" style={{ background: 'rgba(250,31,99,0.1)' }}>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src="/marcieimages/marcieimage1.png"
                  alt="Dr. Marcie"
                  className="w-20 h-28 object-contain marcie-glow"
                  onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x112/FA1F63/ffffff?text=M')}
                />
                <div className="flex-1">
                  <p className="text-white text-lg leading-relaxed">{marcieResponse}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-romance-pink text-sm font-semibold">— Dr. Marcie Liss</span>
                <span className="text-gray-500 text-xs ml-2">
                  Sarcasm Level {sarcasmLevel}: {SARCASM_LEVELS[sarcasmLevel - 1].name}
                </span>
              </div>
            </div>

            {/* Action Suggestions */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3">Suggested Next Steps</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">🤝</span>
                  <span className="text-gray-300 text-sm">Schedule a calm conversation in 30 mins</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">💬</span>
                  <span className="text-gray-300 text-sm">Use "I feel" statements instead of "You always"</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">🎮</span>
                  <span className="text-gray-300 text-sm">Play a reconnection game together</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('library')}
                className="flex-1 glass-card py-3 text-white font-semibold hover:border-romance-pink/50 transition"
                data-testid="back-to-games-btn"
              >
                Back to Games
              </button>
              <button
                onClick={() => setStep('intro')}
                className="flex-1 btn-primary py-3"
                data-testid="try-again-btn"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SOSFightSolver;
