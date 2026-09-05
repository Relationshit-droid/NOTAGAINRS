import React, { useState, useMemo } from 'react';
import { Heart, Shield, Sparkles, Flame, Stethoscope, Trophy, Gamepad2, Search, Home, User, PlayCircle, ChevronRight, AlertCircle } from 'lucide-react';

// Game Categories
const GAME_CATEGORIES = [
  {
    id: 'emotional-connection',
    name: 'Emotional Connection',
    description: 'SEEN Method focused games',
    icon: Heart,
    color: '#FA1F63',
    games: [
      { id: 'truth-or-trust', name: 'Truth or Trust', time: 15, xp: 100 },
      { id: 'gratitude-cloud', name: 'Gratitude Cloud', time: 10, xp: 75 },
      { id: 'eye-contact', name: 'Eye Contact Challenge', time: 5, xp: 50 },
      { id: 'memory-lane', name: 'Memory Lane Map', time: 20, xp: 125 },
      { id: 'vibe-sync', name: 'Vibe Sync', time: 8, xp: 60 },
    ],
  },
  {
    id: 'conflict-resolution',
    name: 'Conflict Resolution',
    description: 'Gottman-inspired healing',
    icon: Shield,
    color: '#33DEA5',
    games: [
      { id: 'slap-of-truth', name: 'Slap of Truth', time: 12, xp: 100 },
      { id: 'apology-auction', name: 'Apology Auction', time: 15, xp: 120 },
      { id: 'defensiveness-detox', name: 'Defensiveness Detox', time: 18, xp: 150 },
      { id: 'whos-right', name: "Who's Right?", time: 20, xp: 175 },
      { id: 'stress-test', name: 'Stress Test', time: 10, xp: 80 },
    ],
  },
  {
    id: 'creative-chaos',
    name: 'Creative Chaos',
    description: 'Playful creative challenges',
    icon: Sparkles,
    color: '#E4E831',
    games: [
      { id: 'role-swap-roast', name: 'Role-Swap Roast', time: 15, xp: 100 },
      { id: 'draw-feelings', name: 'Draw Your Feelings', time: 12, xp: 90 },
      { id: 'gif-battle', name: 'GIF Battle', time: 8, xp: 60 },
      { id: 'karaoke', name: 'Karaoke Confessional', time: 20, xp: 150 },
      { id: 'ransom-note', name: 'Ransom Note Romance', time: 10, xp: 75 },
    ],
  },
  {
    id: 'romance-hub',
    name: 'Romance Hub',
    description: 'Spicy & sweet connections',
    icon: Flame,
    color: '#BE1980',
    games: [
      { id: 'date-roulette', name: 'Date Night Roulette', time: 10, xp: 80 },
      { id: 'bedroom-bingo', name: 'Bedroom Bingo', time: 15, xp: 120 },
      { id: 'six-second-kiss', name: '6-Second Kiss', time: 3, xp: 50 },
      { id: 'foreplay-slider', name: 'Foreplay Forecast', time: 12, xp: 100 },
      { id: 'touch-map', name: 'Touch Map', time: 15, xp: 125 },
    ],
  },
  {
    id: 'healing-hospital',
    name: 'Healing Hospital',
    description: 'Deep repair & recovery',
    icon: Stethoscope,
    color: '#5C1459',
    games: [
      { id: 'windows-walls', name: 'Windows & Walls', time: 25, xp: 200 },
      { id: 'trigger-triage', name: 'Trigger Triage', time: 20, xp: 175 },
      { id: 'trust-bank', name: 'Trust Bank', time: 15, xp: 150 },
      { id: 'iceberg', name: 'The Iceberg', time: 18, xp: 160 },
      { id: 'secrecy-audit', name: 'Secrecy Audit', time: 12, xp: 100 },
    ],
  },
  {
    id: 'game-show',
    name: 'Game Show',
    description: 'Classic game show formats',
    icon: Trophy,
    color: '#22d3ee',
    games: [
      { id: 'couples-jeopardy', name: "Couple's Jeopardy", time: 25, xp: 200 },
      { id: 'millionaire', name: 'Relationship Millionaire', time: 20, xp: 175 },
      { id: 'family-feud', name: 'Family Feud Couples', time: 18, xp: 150 },
      { id: 'newlywed', name: 'Newlywed Sync', time: 15, xp: 125 },
      { id: 'wheel-intimacy', name: 'Wheel of Intimacy', time: 12, xp: 100 },
    ],
  },
  {
    id: 'love-arcade',
    name: 'The Love Arcade',
    description: 'Championship matches of honesty & wit',
    icon: Gamepad2,
    color: '#FF6B6B',
    featured: true,
    games: [
      { id: 'truth-teller-tower', name: 'Truth Teller Tower', time: 30, xp: 300, phase: 'Foundation' },
      { id: 'echo-chamber', name: 'Echo Chamber Escape', time: 35, xp: 350, phase: 'Deconstruction' },
      { id: 'intimacy-feud', name: 'The Intimacy Feud', time: 25, xp: 250, phase: 'Shared Reality' },
      { id: 'relational-jeopardy', name: 'Relational Jeopardy!', time: 40, xp: 400, phase: 'The Future' },
      { id: 'family-forge', name: 'Family Forge', time: 45, xp: 450, phase: 'Family Building' },
      { id: 'harbor-storm', name: 'Harbor & Storm', time: 40, xp: 400, phase: 'Emotional Regulation' },
    ],
  },
];

interface GameLibraryProps {
  onNavigate: (screen: string, params?: any) => void;
}

const GameLibrary: React.FC<GameLibraryProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCat = useMemo(
    () => GAME_CATEGORIES.find((c) => c.id === selectedCategory),
    [selectedCategory]
  );

  const filteredGames = useMemo(() => {
    if (!searchQuery) return selectedCat?.games || [];
    const query = searchQuery.toLowerCase();
    const allGames = selectedCat ? selectedCat.games : GAME_CATEGORIES.flatMap((c) => c.games);
    return allGames.filter((g) => g.name.toLowerCase().includes(query));
  }, [selectedCat, searchQuery]);

  const handleGamePress = (game: any) => {
    onNavigate('game', { gameId: game.id, gameName: game.name });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-bg/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-romance-pink">Love, Actually...</h1>
          <p className="text-sm text-gray-400">The Game</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-full hover:bg-white/10 transition"
            data-testid="home-btn"
          >
            <Home className="w-6 h-6 text-romance-pink" />
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="p-2 rounded-full hover:bg-white/10 transition"
            data-testid="profile-btn"
          >
            <User className="w-6 h-6 text-romance-pink" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 glass-card px-4 py-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="search-input"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-6 pb-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
              !selectedCategory ? 'bg-romance-pink text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            data-testid="all-games-btn"
          >
            All Games
          </button>
          {GAME_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  selectedCategory === cat.id
                    ? 'text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
                data-testid={`category-pill-${cat.id}`}
              >
                <Icon className="w-4 h-4" style={{ color: selectedCategory === cat.id ? '#fff' : cat.color }} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 pb-32">
        {/* Category Cards Grid */}
        {!selectedCategory && !searchQuery && (
          <>
            <h2 className="text-xl font-bold mb-4">Game Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {GAME_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="category-card glass-card p-5 text-left transition duration-300 relative overflow-hidden group"
                    style={{ background: `linear-gradient(135deg, ${cat.color}15 0%, transparent 100%)` }}
                    data-testid={`category-card-${cat.id}`}
                  >
                    {cat.featured && (
                      <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        ★ FEATURED
                      </span>
                    )}
                    <Icon className="w-10 h-10 mb-3" style={{ color: cat.color }} />
                    <h3 className="font-bold text-white mb-1" style={{ color: cat.color }}>{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                    <div className="text-xs text-gray-600 mt-2">{cat.games.length} games</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Games List */}
        {(selectedCategory || searchQuery) && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              {selectedCat ? `${selectedCat.name} Games` : 'Search Results'}
              <span className="text-gray-500 font-normal ml-2">({filteredGames.length})</span>
            </h2>
            <div className="space-y-3">
              {filteredGames.map((game: any) => (
                <button
                  key={game.id}
                  onClick={() => handleGamePress(game)}
                  className="w-full flex items-center gap-4 glass-card p-4 hover:border-romance-pink/50 transition group"
                  data-testid={`game-card-${game.id}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedCat?.color || '#FA1F63'}30` }}
                  >
                    <PlayCircle className="w-6 h-6" style={{ color: selectedCat?.color || '#FA1F63' }} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-white group-hover:text-romance-pink transition">{game.name}</h4>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>⏱️ {game.time}m</span>
                      <span>✨ {game.xp} XP</span>
                      {game.phase && (
                        <span style={{ color: selectedCat?.color }}>{game.phase}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-romance-pink transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dr. Marcie Section */}
        <div className="mt-8 glass-card p-6 border-romance-pink/30" style={{ background: 'rgba(250,31,99,0.1)' }}>
          <div className="flex items-start gap-4">
            <img
              src="/marcieimages/marcieimage1.png"
              alt="Dr. Marcie"
              className="w-20 h-28 object-contain marcie-glow"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x120/FA1F63/ffffff?text=Marcie')}
            />
            <div>
              <p className="text-white italic">
                "Pick a game, any game. But remember—I see everything. And I judge accordingly."
              </p>
              <p className="text-romance-pink text-sm mt-2 font-semibold">— Dr. Marcie Liss</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating SOS Button */}
      <button
        onClick={() => onNavigate('sos')}
        className="fixed bottom-8 right-6 sos-button flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white shadow-2xl"
        data-testid="sos-button"
      >
        <AlertCircle className="w-5 h-5" />
        SOS
        <Heart className="w-4 h-4" />
      </button>
    </div>
  );
};

export default GameLibrary;
