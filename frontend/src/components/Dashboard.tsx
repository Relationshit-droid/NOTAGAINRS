import React, { useState } from 'react';
import { Heart, Star, TrendingUp, Trophy, Settings, Gamepad2, Users, Calendar, Lock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: string, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [user] = useState({
    name: 'You',
    partnerName: 'Partner',
    linked: true,
    sarcasmLevel: 2,
    trustLevel: 0.65,
    vulnerabilityLevel: 0.45,
    romanceLevel: 0.55,
    connectionLevel: 0.72,
    totalPoints: 1250,
    streak: 7,
    plan: 'free',
  });

  const meterStyle = (value: number, color: string) => ({
    width: `${value * 100}%`,
    backgroundColor: color,
  });

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-romance-pink">Love, Actually...</h1>
            <p className="text-xs text-gray-400">Welcome back, {user.name}</p>
          </div>
          <button 
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-full hover:bg-white/10 transition"
            data-testid="settings-btn"
          >
            <Settings className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </header>

      <main className="px-6 pb-32">
        {/* Couple Status Card */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-romance-pink/20 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center -ml-2 border-2 border-dark-bg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="w-14 h-14 rounded-full bg-healing-purple/20 flex items-center justify-center -ml-2">
                <span className="text-xl">👤</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{user.name} & {user.partnerName}</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Linked & Synced
              </p>
            </div>
            <div className="text-right">
              <p className="text-yellow-500 font-bold text-lg">{user.totalPoints}</p>
              <p className="text-xs text-gray-500">Total XP</p>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center justify-center gap-2 p-3 bg-orange-500/10 rounded-lg">
            <span className="text-2xl">🔥</span>
            <span className="text-orange-500 font-bold">{user.streak} Day Streak!</span>
            <span className="text-xs text-gray-500">Keep it going!</span>
          </div>
        </div>

        {/* Relationship Meters */}
        <h2 className="text-lg font-bold text-white mb-4">Relationship Meters</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Trust', value: user.trustLevel, color: '#33DEA5', icon: '🛡️' },
            { label: 'Vulnerability', value: user.vulnerabilityLevel, color: '#BE1980', icon: '💜' },
            { label: 'Romance', value: user.romanceLevel, color: '#FA1F63', icon: '🔥' },
            { label: 'Connection', value: user.connectionLevel, color: '#22d3ee', icon: '🤝' },
          ].map((meter) => (
            <div key={meter.label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>{meter.icon}</span>
                <span className="text-white font-medium text-sm">{meter.label}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={meterStyle(meter.value, meter.color)}
                />
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">{Math.round(meter.value * 100)}%</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="space-y-3 mb-6">
          <button
            onClick={() => onNavigate('library')}
            className="w-full glass-card p-4 flex items-center gap-4 hover:border-romance-pink/50 transition"
            data-testid="play-games-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-romance-pink/20 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-romance-pink" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">Play Games</p>
              <p className="text-xs text-gray-500">50+ relationship games</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>

          <button
            onClick={() => onNavigate('arcade')}
            className="w-full glass-card p-4 flex items-center gap-4 hover:border-[#FF6B6B]/50 transition"
            data-testid="love-arcade-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FF6B6B]/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-[#FF6B6B]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">The Love Arcade</p>
              <p className="text-xs text-gray-500">Championship matches</p>
            </div>
            <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">NEW</span>
          </button>

          <button
            onClick={() => onNavigate('translator')}
            className="w-full glass-card p-4 flex items-center gap-4 hover:border-healing-purple/50 transition"
            data-testid="translator-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-healing-purple/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-healing-purple" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">Partner Translator</p>
              <p className="text-xs text-gray-500">Decode what they really mean</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>

          <button
            onClick={() => onNavigate('achievements')}
            className="w-full glass-card p-4 flex items-center gap-4 hover:border-yellow-500/50 transition"
            data-testid="achievements-btn"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-semibold">Achievements</p>
              <p className="text-xs text-gray-500">12 badges earned</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Premium Upsell */}
        {user.plan === 'free' && (
          <div className="glass-card p-5 border-yellow-500/30" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.1), transparent)' }}>
            <div className="flex items-center gap-4">
              <Lock className="w-10 h-10 text-yellow-500" />
              <div className="flex-1">
                <p className="text-white font-bold">Unlock Premium</p>
                <p className="text-xs text-gray-400">Access all games, unlimited AI insights, and more</p>
              </div>
              <button className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-full text-sm">
                Upgrade
              </button>
            </div>
          </div>
        )}

        {/* Dr. Marcie Section */}
        <div className="mt-6 glass-card p-5 border-romance-pink/30" style={{ background: 'rgba(250,31,99,0.05)' }}>
          <div className="flex items-start gap-4">
            <img
              src="/marcieimages/marcieimage1.png"
              alt="Dr. Marcie"
              className="w-16 h-24 object-contain"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/64x96/FA1F63/ffffff?text=M')}
            />
            <div>
              <p className="text-white italic text-sm">
                "Your connection meter is looking good, but that vulnerability score? 
                We need to talk about feelings, not just Netflix preferences."
              </p>
              <p className="text-romance-pink text-xs mt-2 font-semibold">— Dr. Marcie Liss</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 px-6 py-3 backdrop-blur-lg bg-dark-bg/90">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1 text-romance-pink" data-testid="nav-home">
            <Heart className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => onNavigate('library')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition"
            data-testid="nav-games"
          >
            <Gamepad2 className="w-6 h-6" />
            <span className="text-xs">Games</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition" data-testid="nav-calendar">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">History</span>
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition"
            data-testid="nav-profile"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
