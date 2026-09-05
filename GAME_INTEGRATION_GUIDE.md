# Game Backend Integration Guide

## Overview

This guide explains how to connect all game screens to the backend API. Instead of manually updating 100+ files, use the provided infrastructure components.

## ✅ Infrastructure Created

### 1. HTTP Client (`app/src/lib/httpClient.ts`)
- Base URL from `EXPO_PUBLIC_API_URL`
- `get()`, `post()`, `put()`, `delete()` functions
- Automatic Firebase Auth token handling
- Error handling with `ApiError` class

### 2. API Functions (`app/src/lib/api.ts`)
Complete API module with:
- `userApi`: create, get, updateSarcasm
- `coupleApi`: link, get, getPresence
- `gamesApi`: getCategories, getCategory, createSession, updateSession, getLoveArcadeGames
- `sosApi`: createSession, submitBooth, getSession
- `marcieApi`: chat
- Full TypeScript types

### 3. Game Session Hook (`app/src/hooks/useGameSession.ts`)
Reusable hook for any game:

```typescript
const { 
  session,        // Backend session object
  isLoading,      // Creating session
  isSyncing,      // Saving score
  error,          // Any error
  updateScore,    // Update score mid-game
  completeGame,   // Mark as completed
  resetSession    // Start new session
} = useGameSession('game-id', 'category-id');
```

### 4. Game Connector Component (`app/src/components/games/GameConnector.tsx`)
Wraps games with automatic backend integration:

```typescript
<GameConnector
  gameId="six-second-kiss"
  categoryId="romance-hub"
  onComplete={(score, session) => console.log('Done!', score)}
>
  {(session, updateScore, isSyncing) => (
    <YourGameComponent 
      session={session} 
      updateScore={updateScore}
      isSyncing={isSyncing}
    />
  )}
</GameConnector>
```

### 5. Game Registry (`app/src/lib/gameRegistry.ts`)
Maps all 100+ games to their IDs and categories:

```typescript
import { getGameByScreen, getGameById, getGamesByCategory } from './lib/gameRegistry';

// Lookup game info from any screen
const gameInfo = getGameByScreen('SixSecondKissChallenge1');
// Returns: { id: 'six-second-kiss', categoryId: 'romance-hub', ... }
```

## 🎮 How to Update a Game Screen

### Method 1: Using useGameSession Hook (Recommended)

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGameSession } from '../../hooks/useGameSession';

const MyGameScreen = () => {
  // Connect to backend
  const { 
    session, 
    updateScore, 
    completeGame, 
    isLoading, 
    isSyncing 
  } = useGameSession('my-game-id', 'my-category-id');
  
  const [score, setScore] = useState(0);

  // Handle game completion
  const handleGameEnd = async () => {
    await completeGame(score, [{ answer: 'A', time: 10 }]);
    navigation.navigate('Results', { score });
  };

  // Show loading while creating session
  if (isLoading) return <LoadingScreen />;

  return (
    <View>
      <Text>Score: {score}</Text>
      {isSyncing && <Text>Saving...</Text>}
      <TouchableOpacity onPress={handleGameEnd}>
        <Text>Complete Game</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Method 2: Using GameConnector Component

```typescript
import React from 'react';
import { GameConnector } from '../../components/games/GameConnector';

const MyGameScreen = () => {
  return (
    <GameConnector
      gameId="my-game-id"
      categoryId="my-category-id"
      onComplete={(score, session) => {
        navigation.navigate('Results', { score, sessionId: session.id });
      }}
    >
      {(session, updateScore, isSyncing) => (
        <GameContent 
          session={session}
          onScore={(s) => updateScore(s)}
          isSyncing={isSyncing}
        />
      )}
    </GameConnector>
  );
};
```

## 📋 Game ID Reference

### Categories:
- `romance-hub` - Romance & intimacy games
- `emotional-connection` - Emotional bonding games
- `conflict-resolution` - Fight resolution games
- `creative-chaos` - Creative & fun games
- `healing-hospital` - Repair & recovery games
- `game-show` - Game show format games
- `love-arcade` - Arcade-style championship games

### Example Game IDs:
- `six-second-kiss` - 6-Second Kiss Challenge
- `truth-teller-tower` - Truth Teller Tower
- `apology-auction` - Apology Auction
- `bedroom-bingo` - Bedroom Bingo
- `trust-bank` - Trust Bank
- `couples-jeopardy` - Couples Jeopardy!
- `intimacy-feud` - The Intimacy Feud

See `app/src/lib/gameRegistry.ts` for complete list of 100+ games.

## 🚀 Quick Update Script

To update multiple games at once, use this pattern:

```typescript
// At the top of any game screen, add:
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

// In your component:
const gameInfo = getGameByScreen('YourScreenName');
const { session, updateScore, completeGame, isLoading } = useGameSession(
  gameInfo?.id || 'default-game',
  gameInfo?.categoryId || 'romance-hub'
);

// When game ends:
await completeGame(finalScore);
```

## ✅ Verification Checklist

For each game screen, verify:
- [ ] Imports `useGameSession` hook
- [ ] Calls `useGameSession` with correct game ID and category
- [ ] Shows loading state while `isLoading` is true
- [ ] Calls `updateScore()` during gameplay
- [ ] Calls `completeGame()` when finished
- [ ] Handles errors gracefully
- [ ] Shows sync indicator when `isSyncing` is true

## 🔄 Testing Backend Connection

```typescript
// Test in any game screen
useEffect(() => {
  if (session) {
    console.log('✅ Backend session created:', session.id);
  }
}, [session]);
```

## 📊 Backend Data Flow

1. **Game Start**: `useGameSession` creates session via `POST /api/games/sessions`
2. **During Game**: Call `updateScore()` to save progress via `PUT /api/games/sessions/{id}`
3. **Game End**: Call `completeGame()` to mark complete via `PUT /api/games/sessions/{id}`
4. **Results**: Backend stores: score, responses, completed_at timestamp

## 🛠️ Troubleshooting

### Session not creating?
- Check user is authenticated: `auth.currentUser` should exist
- Verify environment variable: `EXPO_PUBLIC_API_URL`
- Check backend is running on correct port

### Score not saving?
- Ensure `session` exists before calling `updateScore()`
- Check network connectivity
- Verify Firebase token is valid

### Game ID not found?
- Check `gameRegistry.ts` for correct ID
- Use `getGameByScreen()` to lookup by screen name

## 📝 Example: Fully Integrated Game

See: `app/src/screens/games/6SecondKissChallenge1.tsx`

This file demonstrates:
- ✅ Using GameConnector component
- ✅ Backend session management
- ✅ Score tracking
- ✅ Completion handling
- ✅ Loading states
- ✅ Error handling

## 🎯 Next Steps

1. Review the example in `6SecondKissChallenge1.tsx`
2. Apply the pattern to other games using the hook approach
3. Test each game to verify backend connection
4. Monitor backend logs for successful API calls

## 📞 Support

For issues:
1. Check browser console / React Native logs
2. Verify backend health: `GET /api/health`
3. Review network requests in DevTools
4. Check Firebase Auth token validity