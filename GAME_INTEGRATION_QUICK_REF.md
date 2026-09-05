# 🛠️ Game Integration Quick Reference

## Pattern for Connecting Any Game

### Step 1: Add Imports
```typescript
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';
```

### Step 2: Get Game Info and Initialize Session
```typescript
export default function YourGame({ route, navigation }: any) {
  // Get game info from registry
  const gameInfo = getGameByScreen('YourGameScreen');
  const GAME_ID = gameInfo?.id || 'fallback-game-id';
  const CATEGORY_ID = gameInfo?.categoryId || 'romance-hub';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing,
    partnerProgress
  } = useGameSession(GAME_ID, CATEGORY_ID);
```

### Step 3: Add Loading State
```typescript
  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading game...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting game...</Typography>
        </View>
      </ScreenLayout>
    );
  }
```

### Step 4: Update Score During Gameplay
```typescript
  const handleGameAction = async () => {
    // Your game logic
    const points = 10;
    const newScore = currentScore + points;
    setScore(newScore);
    
    // Save to backend
    await updateScore(newScore, [{
      action: 'your_action',
      points,
      timestamp: Date.now()
    }]);
  };
```

### Step 5: Complete Game
```typescript
  const finishGame = async () => {
    const achievements: string[] = [];
    
    // Calculate achievements
    if (score > 100) achievements.push('High Scorer');
    
    await completeGame(finalScore, [{
      completed: true,
      finalScore,
      totalRounds: rounds
    }], achievements);
    
    Alert.alert('Game Complete!', `Score: ${finalScore}`);
  };
```

### Step 6: Add Sync Indicator
```typescript
  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true}>
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        {/* Your game content */}
      </View>
    </ScreenLayout>
  );
}
```

### Step 7: Add Styles
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncIndicator: {
    position: 'absolute',
    top: SPACING.small,
    right: SPACING.small,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 1000,
  },
});
```

---

## Complete Example: TruthOrTrust.tsx

See the fully updated file for reference. Key changes:
- Removed all Firebase imports
- Added `useGameSession` hook
- Added loading state
- Updated `submitResponse()` to use `updateScore()`
- Added `finishGame()` to call `completeGame()`
- Added sync indicator
- Added Dr. Marcie quote

---

## Game ID Reference

### Romance Hub
- `six-second-kiss` - SixSecondKiss
- `bedroom-bingo` - BedroomBingo
- `date-night-roulette` - DateNightRoulette
- `touch-map` - TouchMap

### Emotional Connection
- `truth-or-trust` - TruthOrTrust ✅
- `gratitude-cloud` - GratitudeCloud
- `eye-contact-challenge` - EyeContactChallenge
- `memory-lane-map` - MemoryLaneMap

### Conflict Resolution
- `apology-auction` - ApologyAuction
- `slap-of-truth` - SlapOfTruth
- `defensiveness-detox` - DefensivenessDetox

### Healing Hospital
- `windows-and-walls` - WindowsAndWalls
- `trigger-triage` - TriggerTriage
- `trust-bank` - TrustBank ✅
- `the-iceberg` - TheIceberg

### Love Arcade
- `truth-teller-tower` - TruthTellerTower ✅
- `echo-chamber-escape` - EscapeEchoChamber
- `relational-jeopardy` - RelationalJeopardy ✅

---

## Common Patterns

### Pattern 1: Question/Answer Game (like TruthOrTrust)
```typescript
const submitAnswer = async () => {
  const points = calculatePoints();
  const newScore = score + points;
  
  await updateScore(newScore, [{
    questionId,
    answer,
    correct,
    points
  }]);
  
  if (isLastQuestion) {
    await completeGame(newScore, responses);
  } else {
    nextQuestion();
  }
};
```

### Pattern 2: Card Selection Game (like ApologyAuction)
```typescript
const selectCard = async (cardId: string) => {
  const card = cards.find(c => c.id === cardId);
  const newScore = score + card.value;
  
  await updateScore(newScore, [{
    round,
    selectedCard: cardId,
    cardType: card.type,
    points: card.value
  }]);
  
  if (round >= maxRounds) {
    await completeGame(newScore);
  } else {
    setRound(round + 1);
  }
};
```

### Pattern 3: Swipe/Interaction Game (like WindowsAndWalls)
```typescript
const onSwipe = async (choice: string) => {
  const isCorrect = choice === correctAnswer;
  const score = decisions.filter(d => d.correct).length * 10;
  
  await updateScore(score, [{
    behavior,
    choice,
    correct: isCorrect
  }]);
  
  if (isLastItem) {
    await completeGame(score, [{
      accuracy: (correct / total) * 100
    }]);
  }
};
```

### Pattern 4: Timer/Duration Game (like 6SecondKiss)
```typescript
const onComplete = async () => {
  const duration = timerValue;
  const score = duration >= target ? 100 : Math.round((duration / target) * 100);
  
  await completeGame(score, [{
    targetDuration: target,
    actualDuration: duration,
    success: duration >= target
  }]);
};
```

---

## Troubleshooting

### Session not creating?
```typescript
// Check user is authenticated
const { user } = useAuth();
console.log('User:', user);

// Check token
const token = await user?.getIdToken();
console.log('Token:', token);
```

### Score not saving?
```typescript
// Ensure session exists before updating
if (!session) {
  console.warn('No session available');
  return;
}

// Check backend URL
console.log('API URL:', ENV.BACKEND_URL);
```

### Partner sync not working?
```typescript
// Check coupleId is passed to useGameSession
const { partnerProgress } = useGameSession(GAME_ID, CATEGORY_ID, coupleId);
console.log('Partner progress:', partnerProgress);
```

---

## Testing Checklist Per Game

```
[ ] Game imports useGameSession
[ ] Game imports getGameByScreen
[ ] Game ID and category from registry
[ ] useGameSession called with correct params
[ ] Loading state shown while isLoading
[ ] updateScore() called during gameplay
[ ] completeGame() called when finished
[ ] Sync indicator shown when isSyncing
[ ] Dr. Marcie quote displayed
[ ] Error handling in place
[ ] Navigation to results screen
```

---

*Quick reference for connecting games to backend*
