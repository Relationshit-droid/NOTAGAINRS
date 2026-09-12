/**
 * Demo data for preview / DEMO_MODE.
 *
 * Lets the app demonstrate the full journey (dashboard, categories, Trust
 * Thermometer, couple state) without a live Firebase project or REST backend.
 *
 * Category names, game names and counts are taken verbatim from
 * /public/appdocs/RELATIONSHIT-PRODUCT-SPECIFICATION.txt section 6
 * (FULL GAME LIBRARY — 150+ GAMES). Nothing here invents product content.
 */

import type { User, Couple, GameCategory } from './api';

export const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'player.one@relationshit.app',
  display_name: 'Player One',
  partner_id: 'demo-user-2',
  couple_code: 'RSHIT-4242',
  couple_id: 'demo-couple-1',
  sarcasm_level: 3,
  trust_level: 68,
  vulnerability_level: 54,
  points: 4820,
  plan: 'premium',
  created_at: new Date('2026-01-04').toISOString(),
};

export const DEMO_PARTNER: User = {
  ...DEMO_USER,
  id: 'demo-user-2',
  email: 'player.two@relationshit.app',
  display_name: 'Player Two',
  partner_id: 'demo-user-1',
  points: 4515,
  trust_level: 71,
};

export const DEMO_COUPLE: Couple = {
  id: 'demo-couple-1',
  user1_id: 'demo-user-1',
  user2_id: 'demo-user-2',
  partners: ['demo-user-1', 'demo-user-2'],
  created_at: new Date('2026-01-04').toISOString(),
  trust_meter: 68,
  vulnerability_meter: 54,
  romance_meter: 77,
  connection_meter: 62,
  total_points: 9335,
  streak_days: 12,
  invite_code: 'RSHIT-4242',
  last_interaction: new Date().toISOString(),
  origin_story: {
    meet_cute: 'A karaoke bar, one shared microphone, zero shame.',
    first_impression: 'Way too confident. Annoyingly correct.',
    turning_point: 'The airport pickup at 2am, no questions asked.',
    current_status: 'Rebuilding, on purpose, together.',
  },
};

/** Section 6 category list, with the game counts stated in the spec. */
export const DEMO_CATEGORIES: GameCategory[] = [
  {
    id: 'love-arcade',
    name: 'Love Arcade',
    description: '4 phases of narrative progression — Foundation, Deconstruction, Shared Reality, The Future.',
    icon: '🕹️',
    color: '#FF6B6B',
    games: [
      'Truth Teller Tower',
      'Escape from the Echo Chamber',
      'Family Feud: Our New Reality Edition',
      'Emotional Archaeology',
      'Phantom Funeral',
      'Trust Thermometer Gauntlet',
      'Transparency Toss',
      'Relational Jeopardy!',
    ],
  },
  {
    id: 'emotional-connection',
    name: 'Emotional Connection',
    description: 'Bids, empathy and attunement. Learn each other on purpose.',
    icon: '💗',
    color: '#FA1F63',
    games: ['Bid Radar', 'Empathy Echo', 'The Iceberg Dive', 'Vulnerability Volley', 'Love Map Speedrun'],
  },
  {
    id: 'conflict-resolution',
    name: 'Conflict Resolution',
    description: 'Fight better. Repair faster. Keep the receipts.',
    icon: '⚔️',
    color: '#33DEA5',
    games: ['Antidote Arena', 'Gentle Start-Up Gauntlet', 'The De-Escalation Lab', 'Repair Relay', 'The Blame Flip'],
  },
  {
    id: 'creative-chaos',
    name: 'Creative Chaos',
    description: 'Ridiculous on purpose. Connection is a side effect.',
    icon: '🎨',
    color: '#E4E831',
    games: ['Gratitude Graffiti', 'Ransom Note Romance', 'Karaoke Confessional', 'Role-Swap Roast', 'Vow Remix'],
  },
  {
    id: 'romance-hub',
    name: 'Romance Hub',
    description: 'Desire, play and the good kind of tension.',
    icon: '💘',
    color: '#BE1980',
    games: ['6-Second Kiss Challenge', 'Bedroom Bingo', 'Date Night Roulette', 'Touch Map: Lite', 'Foreplay Forecast'],
  },
  {
    id: 'healing-hospital',
    name: 'Healing Hospital',
    description: 'Infidelity and rupture recovery, one honest step at a time.',
    icon: '🏥',
    color: '#5C1459',
    games: ['Healing Bingo', 'Timeline Detective', 'The Truth & Transparency Gauntlet', 'Micro-Betrayal Mini Golf', 'Rewrite the Memory'],
  },
];

/** Dr. Marcie greeting shown on the demo dashboard. */
export const DEMO_MARCIE_GREETING =
  "Well, well. Look who showed up. Let's see if you two can keep the streak alive.";
