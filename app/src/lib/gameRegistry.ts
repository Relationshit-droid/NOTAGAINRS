/**
 * Game Registry
 * 
 * Central registry of all games with their metadata and category mappings.
 * This allows for automatic backend integration without modifying each game file.
 */

export interface GameMetadata {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  maxScore: number;
  screens: string[]; // Array of screen component names
  description?: string;
}

// Registry of all games with their backend mappings
export const gameRegistry: Record<string, GameMetadata> = {
  // Romance Hub Games
  'six-second-kiss': {
    id: 'six-second-kiss',
    name: '6-Second Kiss Challenge',
    categoryId: 'romance-hub',
    categoryName: 'Romance Hub',
    maxScore: 100,
    screens: ['SixSecondKissChallenge1', 'SixSecondKissChallenge2', 'SixSecondKiss'],
    description: 'Hold the kiss for 6 seconds to complete the challenge',
  },
  'bedroom-bingo': {
    id: 'bedroom-bingo',
    name: 'Bedroom Bingo',
    categoryId: 'romance-hub',
    categoryName: 'Romance Hub',
    maxScore: 200,
    screens: ['BedroomBingoCard', 'BedroomBingoGame1', 'BedroomBingoGame2'],
  },
  'date-night-roulette': {
    id: 'date-night-roulette',
    name: 'Date Night Roulette',
    categoryId: 'romance-hub',
    categoryName: 'Romance Hub',
    maxScore: 150,
    screens: ['DateNightRoulette', 'DateNightRouletteWheel', 'DateNightRouletteGame1', 'DateNightRouletteGame2'],
  },
  'foreplay-slider': {
    id: 'foreplay-slider',
    name: 'Foreplay Slider',
    categoryId: 'romance-hub',
    categoryName: 'Romance Hub',
    maxScore: 100,
    screens: ['ForeplaySliderGame1', 'ForeplaySliderGame2', 'ForeplayForecast'],
  },
  'touch-map': {
    id: 'touch-map',
    name: 'Touch Map',
    categoryId: 'romance-hub',
    categoryName: 'Romance Hub',
    maxScore: 100,
    screens: ['TouchMap', 'TouchMapConfiguration', 'TouchMapLiteGame', 'TouchMapPreferenceGame1', 'TouchMapPreferenceGame2'],
  },

  // Emotional Connection Games
  'truth-or-trust': {
    id: 'truth-or-trust',
    name: 'Truth or Trust',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['TruthOrTrust'],
  },
  'gratitude-cloud': {
    id: 'gratitude-cloud',
    name: 'Gratitude Cloud',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['GratitudeCloud', 'GratitudeGraffiti', 'GratitudeGraffitiMural'],
  },
  'eye-contact-challenge': {
    id: 'eye-contact-challenge',
    name: 'Eye Contact Challenge',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['EyeContactChallenge', 'EyeContactChallengeGame', 'SixSecondStareDown'],
  },
  'memory-lane-map': {
    id: 'memory-lane-map',
    name: 'Memory Lane Map',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 150,
    screens: ['MemoryLaneMap', 'MemoryLaneGPS', 'MemoryLaneDash', 'LoveMapGapQuest', 'LoveMapSpeedrun'],
  },
  'vibe-check': {
    id: 'vibe-check',
    name: 'Vibe Check',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['VibeSync', 'VibeSyncScreen'],
  },

  // Conflict Resolution Games
  'slap-of-truth': {
    id: 'slap-of-truth',
    name: 'Slap of Truth',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['SlapOfTruth'],
  },
  'apology-auction': {
    id: 'apology-auction',
    name: 'Apology Auction',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 200,
    screens: ['ApologyAuction', 'ApologyAuctionGame', 'ApologyOlympics', 'ApologyWorkshop', 'AppreciationAuction', 'AppreciationAuctionGame'],
  },
  'defensiveness-detox': {
    id: 'defensiveness-detox',
    name: 'Defensiveness Detox',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['DefensivenessDetox', 'DefensivenessDetoxGame'],
  },
  'whos-right': {
    id: 'whos-right',
    name: "Who's Right?",
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['WhosRight'],
  },
  'stress-test': {
    id: 'stress-test',
    name: 'Stress Test',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['StressTest', 'StressSynergyLab', 'FloodingForecast'],
  },

  // Creative Chaos Games
  'role-swap-roast': {
    id: 'role-swap-roast',
    name: 'Role Swap Roast',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 200,
    screens: ['RoleSwapRoast', 'RoleSwapRoastArGame', 'RoleSwap', 'RoleSwapGame'],
  },
  'draw-your-feelings': {
    id: 'draw-your-feelings',
    name: 'Draw Your Feelings',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['DrawYourFeelingsGame'],
  },
  'gif-battle': {
    id: 'gif-battle',
    name: 'GIF Battle',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['GifTheFeels'],
  },
  'karaoke-confessional': {
    id: 'karaoke-confessional',
    name: 'Karaoke Confessional',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 150,
    screens: ['KaraokeConfessional'],
  },
  'ransom-note': {
    id: 'ransom-note',
    name: 'Ransom Note Romance',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['RansomNoteRomance', 'TheRansomNoteGame'],
  },

  // Healing Hospital Games
  'windows-and-walls': {
    id: 'windows-and-walls',
    name: 'Windows and Walls',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 200,
    screens: ['WindowsAndWalls'],
  },
  'trigger-triage': {
    id: 'trigger-triage',
    name: 'Trigger Triage',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 150,
    screens: ['TriggerTriage', 'TriggerTakedown'],
  },
  'trust-bank': {
    id: 'trust-bank',
    name: 'Trust Bank',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 200,
    screens: ['TrustBank', 'TrustBingo', 'TrustWiring'],
  },
  'the-iceberg': {
    id: 'the-iceberg',
    name: 'The Iceberg',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 150,
    screens: ['TheIceberg', 'TheIcebergDive', 'TheIcebergEmotionalGame1', 'TheIcebergEmotionalGame2'],
  },
  'secrecy-audit': {
    id: 'secrecy-audit',
    name: 'Secrecy Audit',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['SecrecyAudit', 'SecrecyAuditQuizGame1', 'SecrecyAuditQuizGame2'],
  },

  // Game Show Games
  'couples-jeopardy': {
    id: 'couples-jeopardy',
    name: "Couples Jeopardy!",
    categoryId: 'game-show',
    categoryName: 'Game Show',
    maxScore: 2000,
    screens: ['CouplesJeopardyGame'],
  },
  'relationship-millionaire': {
    id: 'relationship-millionaire',
    name: 'Relationship Millionaire',
    categoryId: 'game-show',
    categoryName: 'Game Show',
    maxScore: 1000,
    screens: ['TruthTellerTower'],
  },
  'family-feud-couples': {
    id: 'family-feud-couples',
    name: 'Family Feud: Couples Edition',
    categoryId: 'game-show',
    categoryName: 'Game Show',
    maxScore: 250,
    screens: ['CouplesFamilyFeudGame', 'FamilyFeudNewReality', 'FamilyFeudSafety', 'SafetyAndEmpathyFeud', 'TheIntimacyFeud', 'IntimacyFeud'],
  },
  'newlywed-sync': {
    id: 'newlywed-sync',
    name: 'Newlywed Sync',
    categoryId: 'game-show',
    categoryName: 'Game Show',
    maxScore: 200,
    screens: ['NewlywedGame', 'NewlywedHeart', 'NewlywedSyncCheckGame', 'HeartToHeartNewlywedGame'],
  },
  'wheel-of-intimacy': {
    id: 'wheel-of-intimacy',
    name: 'Wheel of Intimacy',
    categoryId: 'game-show',
    categoryName: 'Game Show',
    maxScore: 150,
    screens: ['WheelOfIntimacy'],
  },

  // Love Arcade Games
  'truth-teller-tower': {
    id: 'truth-teller-tower',
    name: 'Truth Teller Tower',
    categoryId: 'love-arcade',
    categoryName: 'Love Arcade',
    maxScore: 100,
    screens: ['TruthTellerTower'],
  },
  'echo-chamber-escape': {
    id: 'echo-chamber-escape',
    name: 'Escape from the Echo Chamber',
    categoryId: 'love-arcade',
    categoryName: 'Love Arcade',
    maxScore: 100,
    screens: ['EscapeEchoChamber'],
  },
  'intimacy-feud-arcade': {
    id: 'intimacy-feud-arcade',
    name: 'The Intimacy Feud (Arcade)',
    categoryId: 'love-arcade',
    categoryName: 'Love Arcade',
    maxScore: 250,
    screens: ['IntimacyFeud'],
  },
  'relational-jeopardy': {
    id: 'relational-jeopardy',
    name: 'Relational Jeopardy!',
    categoryId: 'love-arcade',
    categoryName: 'Love Arcade',
    maxScore: 2000,
    screens: ['RelationalJeopardy', 'JeopardyRebuilding', 'JeopardyRebuildingRound'],
  },
  'family-forge': {
    id: 'family-forge',
    name: 'Family Forge Edition',
    categoryId: 'love-arcade',
    categoryName: 'Love Arcade',
    maxScore: 1800,
    screens: ['ChoppedFamily', 'LegacyDice', 'LegacyDiceGame', 'LegacyDash', 'AmazingRaceCrossroads', 'AmazingRaceLegacyDash'],
  },
  'harbor-storm': {
    id: 'harbor-storm',
    name: 'Harbor & Storm Edition',
    categoryId: 'love-arcade',
    categoryName: 'Love Arcade',
    maxScore: 1900,
    screens: ['HarborMasterChallenge', 'BPDPatternDetective', 'ConnectionConstructor'],
  },

  // Additional Games
  'bid-radar': {
    id: 'bid-radar',
    name: 'Bid Radar',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['BidRadar', 'BidRadarGame'],
  },
  'blame-flip': {
    id: 'blame-flip',
    name: 'Blame Flip',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['BlameFlip'],
  },
  'boundary-bingo': {
    id: 'boundary-bingo',
    name: 'Boundary Bingo',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['BoundaryBingo', 'BoundaryBingoGrid'],
  },
  'commitment-dice': {
    id: 'commitment-dice',
    name: 'Commitment Dice',
    categoryId: 'romance-hub',
    categoryName: 'Romance Hub',
    maxScore: 100,
    screens: ['CommitmentDice', 'CommitmentDiceGame', 'CommitmentCountdown'],
  },
  'compromise-jenga': {
    id: 'compromise-jenga',
    name: 'Compromise Jenga',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 150,
    screens: ['CompromiseJenga', 'CompromiseJengaGame'],
  },
  'conflict-dice': {
    id: 'conflict-dice',
    name: 'Conflict Dice',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['ConflictDice', 'ConflictDiceGame'],
  },
  'cycle-breaker': {
    id: 'cycle-breaker',
    name: 'Cycle Breaker',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 200,
    screens: ['CycleBreaker', 'CycleBreakerBoardGame'],
  },
  'deal-or-no-deal': {
    id: 'deal-or-no-deal',
    name: 'Deal or No Deal: Accountability',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 150,
    screens: ['DealOrNoDealAccountability'],
  },
  'de-escalation-lab': {
    id: 'de-escalation-lab',
    name: 'De-Escalation Lab',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['DeEscalationLab'],
  },
  'denial-detector': {
    id: 'denial-detector',
    name: 'Denial Detector',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['DenialDetector'],
  },
  'dream-decoder': {
    id: 'dream-decoder',
    name: 'Dream Decoder',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['DreamDecoder', 'DreamDecoderGame', 'DreamSupportSprint'],
  },
  'empathy-echo': {
    id: 'empathy-echo',
    name: 'Empathy Echo',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['EmpathyEcho', 'EmpathyEchoGame'],
  },
  'escapism-room': {
    id: 'escapism-room',
    name: 'Escapism Room',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 150,
    screens: ['EscapismRoom'],
  },
  'flashback-frenzy': {
    id: 'flashback-frenzy',
    name: 'Flashback Frenzy',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['FlashbackFrenzy'],
  },
  'gentle-startup': {
    id: 'gentle-startup',
    name: 'Gentle Startup Gauntlet',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['GentleStartUpGauntlet'],
  },
  'guilt-shame-sort': {
    id: 'guilt-shame-sort',
    name: 'Guilt vs Shame Sort',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['GuiltShameSort', 'GuiltVsShameSort'],
  },
  'healing-bingo': {
    id: 'healing-bingo',
    name: 'Healing Bingo',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['HealingBingo'],
  },
  'layers-of-hurt': {
    id: 'layers-of-hurt',
    name: 'Layers of Hurt',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 150,
    screens: ['LayersOfHurt'],
  },
  'lie-detector': {
    id: 'lie-detector',
    name: 'Lie Detector',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['LieDetector', 'LieDetectorLite'],
  },
  'micro-betrayal-golf': {
    id: 'micro-betrayal-golf',
    name: 'Micro-Betrayal Mini Golf',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['MicroBetrayalGolf', 'MicroBetrayalMiniGolfGame'],
  },
  'micro-moment-museum': {
    id: 'micro-moment-museum',
    name: 'Micro-Moment Museum',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['MicroMomentMuseum'],
  },
  'mirror-mode': {
    id: 'mirror-mode',
    name: 'Mirror Mode',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['MirrorMode'],
  },
  'needs-decoder': {
    id: 'needs-decoder',
    name: 'Needs Decoder',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['NeedsDecoder', 'TheNeedsDecoderGame'],
  },
  'repair-attempt': {
    id: 'repair-attempt',
    name: 'Repair Attempt',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['RepairAttemptScreen', 'RepairRelay', 'RepairReportCard'],
  },
  'rewrite-memory': {
    id: 'rewrite-memory',
    name: 'Rewrite the Memory',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 150,
    screens: ['RewriteMemory'],
  },
  'ritual-roulette': {
    id: 'ritual-roulette',
    name: 'Ritual Roulette',
    categoryId: 'romance-hub',
    categoryName: 'Romance Hub',
    maxScore: 100,
    screens: ['RitualRoulette', 'RitualRouletteGame', 'RitualBuilder'],
  },
  'shared-meaning-mural': {
    id: 'shared-meaning-mural',
    name: 'Shared Meaning Mural',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['SharedMeaningMural'],
  },
  'soundtrack-sync': {
    id: 'soundtrack-sync',
    name: 'Soundtrack Sync',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['SoundtrackSync'],
  },
  'timeline-detective': {
    id: 'timeline-detective',
    name: 'Timeline Detective',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['TimelineDetective'],
  },
  'tone-shift': {
    id: 'tone-shift',
    name: 'Tone Shift Challenge',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 100,
    screens: ['ToneShiftChallenge', 'ToneShiftChallengeGame', 'TextToneTranslator'],
  },
  'transparency-toss': {
    id: 'transparency-toss',
    name: 'Transparency Toss',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['TransparencyToss'],
  },
  'truth-transparency': {
    id: 'truth-transparency',
    name: 'Truth & Transparency Gauntlet',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 150,
    screens: ['TruthTransparencyGauntlet'],
  },
  'turning-toward': {
    id: 'turning-toward',
    name: 'Turning Toward Tally',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['TurningTowardTally', 'TurningTowardTallyGame1', 'TurningTowardTallyGame2'],
  },
  'validation-game-show': {
    id: 'validation-game-show',
    name: 'Validation Game Show',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 150,
    screens: ['ValidationGameShow'],
  },
  'vow-remix': {
    id: 'vow-remix',
    name: 'Vow Remix',
    categoryId: 'romance-hub',
    categoryName: 'Romance Hub',
    maxScore: 100,
    screens: ['VowRemix', 'VowRemixGame'],
  },
  'vulnerability-volley': {
    id: 'vulnerability-volley',
    name: 'Vulnerability Volley',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 150,
    screens: ['VulnerabilityVolley', 'VulnerabilityVolleyGame'],
  },
  'avoidance-arcade': {
    id: 'avoidance-arcade',
    name: 'Avoidance Arcade',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['AvoidanceArcade'],
  },
  'relationship-council': {
    id: 'relationship-council',
    name: 'Relationship Council',
    categoryId: 'conflict-resolution',
    categoryName: 'Conflict Resolution',
    maxScore: 150,
    screens: ['RelationshipCouncil'],
  },
  'connection-conundrum': {
    id: 'connection-conundrum',
    name: 'Connection Conundrum',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['ConnectionConundrum'],
  },
  'the-love-script': {
    id: 'the-love-script',
    name: 'The Love Script Debacle',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['TheLoveScriptDebacle'],
  },
  'antidote-arena': {
    id: 'antidote-arena',
    name: 'Antidote Arena',
    categoryId: 'healing-hospital',
    categoryName: 'Healing Hospital',
    maxScore: 100,
    screens: ['AntidoteArena', 'AntidoteArenaGame'],
  },
  'admiration-aim': {
    id: 'admiration-aim',
    name: 'Admiration Aim',
    categoryId: 'emotional-connection',
    categoryName: 'Emotional Connection',
    maxScore: 100,
    screens: ['AdmirationAim', 'AdmirationAimArGame'],
  },
  'results-roast': {
    id: 'results-roast',
    name: 'Results Roast',
    categoryId: 'creative-chaos',
    categoryName: 'Creative Chaos',
    maxScore: 100,
    screens: ['ResultsRoastScreen'],
  },
  'achievements-badges': {
    id: 'achievements-badges',
    name: 'Achievements & Badges',
    categoryId: 'game-show',
    categoryName: 'Game Show',
    maxScore: 0,
    screens: ['AchievementsAndBadges'],
  },
};

/**
 * Get game metadata by screen name
 * This allows looking up game info from any screen component
 */
export function getGameByScreen(screenName: string): GameMetadata | undefined {
  return Object.values(gameRegistry).find(game => 
    game.screens.some(screen => 
      screen.toLowerCase() === screenName.toLowerCase()
    )
  );
}

/**
 * Get game metadata by game ID
 */
export function getGameById(gameId: string): GameMetadata | undefined {
  return gameRegistry[gameId];
}

/**
 * Get all games in a category
 */
export function getGamesByCategory(categoryId: string): GameMetadata[] {
  return Object.values(gameRegistry).filter(game => game.categoryId === categoryId);
}

/**
 * Get all available categories
 */
export function getAllCategories(): { id: string; name: string }[] {
  const categories = new Map<string, string>();
  Object.values(gameRegistry).forEach(game => {
    categories.set(game.categoryId, game.categoryName);
  });
  return Array.from(categories.entries()).map(([id, name]) => ({ id, name }));
}

export default gameRegistry;