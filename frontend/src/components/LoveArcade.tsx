import React, { useState } from 'react';
import { ArrowLeft, Play, Trophy, Star, Flame } from 'lucide-react';

const ARCADE_GAMES = [
  {
    id: 'truth-teller-tower',
    name: 'Truth Teller Tower',
    phase: 'Phase 1: Foundation',
    modules: 'Modules 1-3',
    format: 'Who Wants to Be a Millionaire meets Newlywed Game',
    description: "Scale the lie-avalanche. Five questions. Three lifelines. One shared brain—if you're lucky.",
    icon: '🗼',
    color: '#FF6B6B',
    maxScore: 100,
    badges: ['📡 The Unfiltered Signal', '📻 Truth Adjacent', '⚡ Static & Hope', '🎭 The Scripted Smile'],
  },
  {
    id: 'echo-chamber-escape',
    name: 'Escape from the Echo Chamber',
    phase: 'Phase 2: Deconstruction',
    modules: 'Modules 4-6',
    format: 'Digital Escape Room',
    description: "Trapped in a hall of infinite mirrors, each reflecting a version of the 'love script.' Break the loop.",
    icon: '🪞',
    color: '#9B59B6',
    maxScore: 100,
    badges: ['💥 Echo Exorcist', '🔧 Mirror Breaker', '➖ Reverb Reducer', '🌀 Still Whispering'],
  },
  {
    id: 'intimacy-feud',
    name: 'The Intimacy Feud',
    phase: 'Phase 3: Shared Reality',
    modules: 'Modules 7-9',
    format: 'Family Feud Style',
    description: "Survey says... be boring. Be authentic. Face off against The Ghost of the Old Script.",
    icon: '👨‍👩‍👧‍👦',
    color: '#3498DB',
    maxScore: 250,
    badges: ['👑 Authenticity Overlord', '🗡️ Realness Raider', '🔍 Script Skeptic', '🎤 Still Auditioning'],
  },
  {
    id: 'relational-jeopardy',
    name: 'Relational Jeopardy!',
    phase: 'Phase 4: The Future',
    modules: 'Modules 10-12',
    format: 'Jeopardy Style',
    description: "Categories designed by couples who rebuilt. Win 'The Sovereign Pact' or face a strongly worded email.",
    icon: '❓',
    color: '#2ECC71',
    maxScore: 2000,
    badges: ['📜 Sovereign Pact', '⏳ Provisional Truce', '📄 Treaty in Draft', '💣 Ceasefire Pending'],
  },
  {
    id: 'family-forge',
    name: 'Family Forge Edition',
    phase: 'Special: Family Building',
    modules: 'For couples building families after betrayal',
    format: 'Mixed Game Shows',
    description: "Insert Coin. Hold Baby. Choose Each Other—Again. You looked at a newborn and said: 'We're building here.'",
    icon: '👶',
    color: '#E74C3C',
    maxScore: 1800,
    badges: ['🔥 Forge Masters', '⚓ Unshakable Co-Captains', '🧱 Brave Builders', '🛠️ Work-in-Progress'],
  },
  {
    id: 'harbor-storm',
    name: 'Harbor & Storm Edition',
    phase: 'Special: Emotional Regulation',
    modules: 'BPD/Emotional sensitivity focus',
    format: 'Cooperative Challenges',
    description: "Build a better boat—and learn to sail as a crew. One feels the storm. The other reads the barometer.",
    icon: '⛵',
    color: '#1ABC9C',
    maxScore: 1900,
    badges: ['🏰 Harbor Masters', '⛵ Resilient Co-Captains', '🧭 Skilled Navigators', '🌟 Brave Apprentices'],
  },
];

interface LoveArcadeProps {
  onNavigate: (screen: string, params?: any) => void;
}

const LoveArcade: React.FC<LoveArcadeProps> = ({ onNavigate }) => {
  const [totalScore] = useState(0);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0012 0%, #1a0025 50%, #2a0035 100%)' }}>
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <button 
          onClick={() => onNavigate('library')}
          className="p-2 rounded-full hover:bg-white/10 transition"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-[#FF6B6B]">🎮 THE LOVE ARCADE 🎮</h1>
          <p className="text-xs text-gray-500">Insert Coin. Hold Hands. Prepare for Truth.</p>
        </div>
      </header>

      {/* Dr. Marcie Intro */}
      <div className="mx-6 my-4 p-4 rounded-xl border-l-4 border-[#FF6B6B]" style={{ background: 'rgba(255,107,107,0.1)' }}>
        <p className="text-white italic text-sm">
          "Welcome to the Love Arcade, you glorious disaster couple. We don't do 'safe spaces.' We do safe SCORES."
        </p>
        <p className="text-[#FF6B6B] text-xs mt-2">— Dr. Marcie Liss, PhD in Calling It Like She Sees It</p>
      </div>

      {/* Leaderboard Summary */}
      <div className="flex gap-4 mx-6 mb-6">
        <div className="flex-1 glass-card p-4 text-center" style={{ background: 'rgba(255,215,0,0.1)' }}>
          <p className="text-xs text-gray-500">Total Arcade Score</p>
          <p className="text-3xl font-bold text-yellow-500">{totalScore}</p>
          <p className="text-xs text-gray-600">/ 2450 max</p>
        </div>
        <div className="flex-1 glass-card p-4 text-center">
          <p className="text-xs text-gray-500 mb-2">Badges Earned</p>
          <div className="flex justify-center gap-2 text-2xl">
            <span>🏗️</span>
            <span>🪞</span>
            <span>🗡️</span>
            <span>🏰</span>
          </div>
        </div>
      </div>

      {/* Games List */}
      <main className="px-6 pb-32">
        <h2 className="text-lg font-bold text-white mb-4">Championship Games</h2>
        <div className="space-y-4">
          {ARCADE_GAMES.map((game) => (
            <div
              key={game.id}
              className="glass-card overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${game.color}20 0%, ${game.color}05 50%, transparent 100%)` }}
              data-testid={`arcade-game-${game.id}`}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-4xl">{game.icon}</span>
                  <span 
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10"
                    style={{ color: game.color }}
                  >
                    {game.phase}
                  </span>
                </div>

                {/* Title & Format */}
                <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{game.format}</p>
                
                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">{game.description}</p>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-500">Max: {game.maxScore} pts</span>
                  </div>
                  <button
                    onClick={() => onNavigate('game', { gameId: game.id, gameName: game.name })}
                    className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-white"
                    style={{ backgroundColor: game.color }}
                  >
                    PLAY
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Ritual Teaser */}
        <div className="mt-8 glass-card p-6 text-center" style={{ background: 'rgba(255,100,0,0.1)', borderColor: 'rgba(255,100,0,0.3)' }}>
          <Flame className="w-12 h-12 mx-auto mb-3 text-orange-500" />
          <h3 className="text-lg font-bold text-orange-500 mb-2">THE DIGITAL BONFIRE</h3>
          <p className="text-sm text-gray-400">
            Complete all 4 phases to unlock the Final Ritual. Burn the workbook. Rise from the ashes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoveArcade;
