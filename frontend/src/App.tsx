import React, { useState } from 'react';
import GameLibrary from './components/GameLibrary';
import LoveArcade from './components/LoveArcade';
import SOSFightSolver from './components/SOSFightSolver';
import Dashboard from './components/Dashboard';
import { 
  TruthTellerTowerGame, 
  EchoChamberEscapeGame, 
  IntimacyFeudGame, 
  RelationalJeopardyGame 
} from './components/games/ArcadeGames';
import {
  TruthOrTrustGame,
  EyeContactChallengeGame,
  GratitudeCloudGame,
  ApologyAuctionGame,
  SixSecondKissGame,
} from './components/games/CategoryGames';
import './index.css';

type Screen = 'library' | 'arcade' | 'sos' | 'dashboard' | 'game' | 'profile' | 'settings' | 'translator' | 'achievements';

interface NavigationParams {
  gameId?: string;
  gameName?: string;
}

// Game ID to Component mapping
const GAME_COMPONENTS: Record<string, React.FC<any>> = {
  // Love Arcade Games
  'truth-teller-tower': TruthTellerTowerGame,
  'echo-chamber': EchoChamberEscapeGame,
  'echo-chamber-escape': EchoChamberEscapeGame,
  'intimacy-feud': IntimacyFeudGame,
  'relational-jeopardy': RelationalJeopardyGame,
  
  // Emotional Connection
  'truth-or-trust': TruthOrTrustGame,
  'eye-contact': EyeContactChallengeGame,
  'eye-contact-challenge': EyeContactChallengeGame,
  'gratitude-cloud': GratitudeCloudGame,
  
  // Conflict Resolution
  'apology-auction': ApologyAuctionGame,
  
  // Romance Hub
  'six-second-kiss': SixSecondKissGame,
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('library');
  const [navParams, setNavParams] = useState<NavigationParams>({});
  const [gameResults, setGameResults] = useState<{ score: number; badge: string } | null>(null);

  const handleNavigate = (screen: string, params?: NavigationParams) => {
    setCurrentScreen(screen as Screen);
    if (params) setNavParams(params);
    setGameResults(null);
  };

  const handleGameComplete = (score: number, badge: string) => {
    setGameResults({ score, badge });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'library':
        return <GameLibrary onNavigate={handleNavigate} />;
      case 'arcade':
        return <LoveArcade onNavigate={handleNavigate} />;
      case 'sos':
        return <SOSFightSolver onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'game':
        const GameComponent = navParams.gameId ? GAME_COMPONENTS[navParams.gameId] : null;
        if (GameComponent) {
          return (
            <GameComponent
              gameId={navParams.gameId}
              gameName={navParams.gameName}
              onBack={() => handleNavigate('library')}
              onComplete={handleGameComplete}
            />
          );
        }
        return <GamePlaceholder gameName={navParams.gameName} gameId={navParams.gameId} onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePlaceholder onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPlaceholder onNavigate={handleNavigate} />;
      case 'translator':
        return <TranslatorPlaceholder onNavigate={handleNavigate} />;
      case 'achievements':
        return <AchievementsPlaceholder onNavigate={handleNavigate} />;
      default:
        return <GameLibrary onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

// Updated placeholder with actual game list
const GamePlaceholder: React.FC<{ gameName?: string; gameId?: string; onNavigate: (screen: string) => void }> = ({ gameName, gameId, onNavigate }) => {
  const implementedGames = [
    'truth-teller-tower', 'echo-chamber', 'echo-chamber-escape', 'intimacy-feud', 'relational-jeopardy',
    'truth-or-trust', 'eye-contact', 'eye-contact-challenge', 'gratitude-cloud',
    'apology-auction', 'six-second-kiss'
  ];
  
  const isImplemented = gameId && implementedGames.includes(gameId);
  
  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6">
      <div className="glass-card p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-romance-pink mb-4">{gameName || 'Game'}</h2>
        <div className="text-6xl mb-6">🎮</div>
        
        {isImplemented ? (
          <p className="text-green-400 mb-6">
            This game is ready! There might be a routing issue.
          </p>
        ) : (
          <>
            <p className="text-gray-400 mb-4">
              This game is coming soon! Currently implemented games:
            </p>
            <div className="text-left text-sm text-gray-500 mb-6">
              <p className="text-romance-pink font-semibold mb-1">Love Arcade:</p>
              <p>• Truth Teller Tower ✓</p>
              <p>• Echo Chamber Escape ✓</p>
              <p>• Intimacy Feud ✓</p>
              <p>• Relational Jeopardy ✓</p>
              <p className="text-trust-green font-semibold mt-2 mb-1">Connection:</p>
              <p>• Truth or Trust ✓</p>
              <p>• Eye Contact Challenge ✓</p>
              <p>• Gratitude Cloud ✓</p>
              <p className="text-chaos-yellow font-semibold mt-2 mb-1">Resolution:</p>
              <p>• Apology Auction ✓</p>
              <p className="text-healing-purple font-semibold mt-2 mb-1">Romance:</p>
              <p>• 6-Second Kiss ✓</p>
            </div>
          </>
        )}
        
        <img
          src="/marcieimages/marcieimage1.png"
          alt="Dr. Marcie"
          className="w-24 h-36 object-contain mx-auto mb-4"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/96x144/FA1F63/ffffff?text=M')}
        />
        <p className="text-white italic text-sm mb-4">
          "More games are on the way. In the meantime, try the ones that work—novel concept, I know."
        </p>
        <button 
          onClick={() => onNavigate('library')}
          className="btn-primary"
          data-testid="back-btn"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
};

const ProfilePlaceholder: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => (
  <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6">
    <div className="glass-card p-8 text-center max-w-md">
      <h2 className="text-2xl font-bold text-romance-pink mb-4">Your Profile</h2>
      <div className="w-24 h-24 rounded-full bg-romance-pink/20 flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">👤</span>
      </div>
      <p className="text-white font-semibold mb-1">Guest User</p>
      <p className="text-gray-400 text-sm mb-6">Level 1 • 0 XP</p>
      <div className="space-y-3 text-left mb-6">
        <div className="p-3 bg-white/5 rounded-lg flex justify-between">
          <span className="text-gray-400">Sarcasm Level</span>
          <span className="text-white">2 - Reality Check</span>
        </div>
        <div className="p-3 bg-white/5 rounded-lg flex justify-between">
          <span className="text-gray-400">Games Played</span>
          <span className="text-white">0</span>
        </div>
        <div className="p-3 bg-white/5 rounded-lg flex justify-between">
          <span className="text-gray-400">Partner Status</span>
          <span className="text-yellow-500">Not Linked</span>
        </div>
      </div>
      <button 
        onClick={() => onNavigate('library')}
        className="btn-primary w-full"
        data-testid="back-btn"
      >
        Back to Games
      </button>
    </div>
  </div>
);

const SettingsPlaceholder: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => (
  <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6">
    <div className="glass-card p-8 text-center max-w-md">
      <h2 className="text-2xl font-bold text-white mb-4">⚙️ Settings</h2>
      <div className="space-y-3 text-left mb-6">
        {['Notifications', 'Privacy', 'Subscription', 'Help & FAQ', 'About'].map((item) => (
          <button key={item} className="w-full p-4 bg-white/5 rounded-lg text-left text-gray-300 hover:bg-white/10 transition">
            {item}
          </button>
        ))}
      </div>
      <button 
        onClick={() => onNavigate('dashboard')}
        className="btn-primary w-full"
        data-testid="back-btn"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
);

const TranslatorPlaceholder: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => (
  <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6">
    <div className="glass-card p-8 text-center max-w-md">
      <h2 className="text-2xl font-bold text-healing-purple mb-4">🔮 Partner Translator</h2>
      <p className="text-gray-400 mb-6">
        Decode what your partner really means when they say things like "I'm fine" or "Whatever you want."
      </p>
      <div className="text-6xl mb-6">💬 → 💜</div>
      <p className="text-white italic text-sm mb-4">Coming Soon!</p>
      <button 
        onClick={() => onNavigate('dashboard')}
        className="btn-primary w-full"
        data-testid="back-btn"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
);

const AchievementsPlaceholder: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => (
  <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6">
    <div className="glass-card p-8 text-center max-w-md">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">🏆 Achievements</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {['🔥', '💜', '🛡️', '🎮', '💬', '🤝', '⭐', '🏅'].map((badge, i) => (
          <div key={i} className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
            {badge}
          </div>
        ))}
      </div>
      <p className="text-gray-400 mb-6">8 of 50 badges earned</p>
      <button 
        onClick={() => onNavigate('dashboard')}
        className="btn-primary w-full"
        data-testid="back-btn"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
);

export default App;
