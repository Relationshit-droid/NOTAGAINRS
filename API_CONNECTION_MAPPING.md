# LoveTrae API Connection Mapping

## Backend Server Endpoints (backend/server.py)

### Authentication & User Management
| Endpoint | Method | Description | Frontend API Function | Status |
|----------|--------|-------------|----------------------|--------|
| `/api/users` | POST | Create new user | `userApi.create()` | **MISSING** |
| `/api/users/{user_id}` | GET | Get user by ID | `userApi.get(userId)` | **MISSING** |
| `/api/users/{user_id}/sarcasm` | PUT | Update sarcasm level | `userApi.updateSarcasm(userId, level)` | **MISSING** |

### Couple Management
| Endpoint | Method | Description | Frontend API Function | Status |
|----------|--------|-------------|----------------------|--------|
| `/api/couples/link` | POST | Link couple with partner code | `coupleApi.link(userId, partnerCode)` | **MISSING** |
| `/api/couples/{couple_id}` | GET | Get couple details | `coupleApi.get(coupleId)` | **MISSING** |
| `/api/couples/{couple_id}/presence` | GET | Check couple online presence | **NOT IMPLEMENTED** | **MISSING** |

### Game Management
| Endpoint | Method | Description | Frontend API Function | Status |
|----------|--------|-------------|----------------------|--------|
| `/api/games/categories` | GET | Get all game categories | `gamesApi.getCategories()` | **MISSING** |
| `/api/games/categories/{category_id}` | GET | Get specific category | **NOT IMPLEMENTED** | **MISSING** |
| `/api/games/sessions` | POST | Create game session | `gamesApi.createSession(userId, gameId, categoryId)` | **MISSING** |
| `/api/games/sessions/{session_id}` | PUT | Update game session | `gamesApi.updateSession(sessionId, score, completed, responses)` | **MISSING** |
| `/api/love-arcade/games` | GET | Get Love Arcade games | `gamesApi.getLoveArcadeGames()` | **MISSING** |

### SOS Fight Solver
| Endpoint | Method | Description | Frontend API Function | Status |
|----------|--------|-------------|----------------------|--------|
| `/api/sos/sessions` | POST | Create SOS session | `sosApi.createSession(initiatorId, coupleId)` | **MISSING** |
| `/api/sos/sessions/{session_id}/submit` | POST | Submit SOS booth response | `sosApi.submitBooth(sessionId, userId, responses)` | **MISSING** |
| `/api/sos/sessions/{session_id}` | GET | Get SOS session details | `sosApi.getSession(sessionId)` | **MISSING** |

### Dr. Marcie AI
| Endpoint | Method | Description | Frontend API Function | Status |
|----------|--------|-------------|----------------------|--------|
| `/api/marcie/chat` | POST | Chat with Dr. Marcie AI | `marcieApi.chat(userId, context, message, sarcasmLevel)` | **MISSING** |

### Real-time Communication
| Endpoint | Type | Description | Frontend Implementation | Status |
|----------|------|-------------|------------------------|--------|
| `/ws/{couple_id}` | WebSocket | Real-time couple sync | **NOT IMPLEMENTED** | **MISSING** |

### Health & Utility
| Endpoint | Method | Description | Frontend Implementation | Status |
|----------|--------|-------------|------------------------|--------|
| `/api/health` | GET | Health check | **NOT IMPLEMENTED** | **MISSING** |

## Current Frontend API Issues

### 1. Direct Firebase Usage
The frontend API (`app/src/lib/api.ts`) currently uses Firebase directly instead of connecting to the backend server:

```typescript
// Current implementation (WRONG)
import { auth, db } from './firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Should be connecting to backend server instead
```

### 2. Missing Backend Connection
No HTTP client is configured to connect to the backend server running on port 8001.

### 3. Missing Endpoints
Many backend endpoints have no corresponding frontend API functions.

## Required Implementation

### Step 1: Create HTTP Client
Create a proper HTTP client for backend communication:

```typescript
// app/src/lib/httpClient.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

export const httpClient = {
  get: async (endpoint: string, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    return response.json();
  },
  
  post: async (endpoint: string, data: any, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  put: async (endpoint: string, data: any, token?: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### Step 2: Update API Functions
Replace Firebase calls with backend API calls:

```typescript
// app/src/lib/api.ts - Updated userApi
export const userApi = {
  create: async (data: { email: string; display_name: string }, token: string) => {
    return httpClient.post('/users', data, token);
  },
  
  get: async (userId: string, token: string) => {
    return httpClient.get(`/users/${userId}`, token);
  },
  
  updateSarcasm: async (userId: string, level: number, token: string) => {
    return httpClient.put(`/users/${userId}/sarcasm`, { level }, token);
  }
};
```

### Step 3: Add Missing API Functions
Implement the missing API functions:

```typescript
// Game sessions
export const gamesApi = {
  createSession: async (userId: string, gameId: string, categoryId: string, token: string) => {
    return httpClient.post('/games/sessions', { user_id: userId, game_id: gameId, category_id: categoryId }, token);
  },
  
  updateSession: async (sessionId: string, score?: number, completed?: boolean, responses?: any[], token: string) => {
    return httpClient.put(`/games/sessions/${sessionId}`, { score, completed, responses }, token);
  },
  
  getLoveArcadeGames: async () => {
    return httpClient.get('/love-arcade/games');
  }
};

// SOS Fight Solver
export const sosApi = {
  createSession: async (initiatorId: string, coupleId: string, token: string) => {
    return httpClient.post('/sos/sessions', { initiator_id: initiatorId, couple_id: coupleId }, token);
  },
  
  submitBooth: async (sessionId: string, userId: string, responses: any, token: string) => {
    return httpClient.post(`/sos/sessions/${sessionId}/submit`, { 
      session_id: sessionId, 
      user_id: userId, 
      ...responses 
    }, token);
  },
  
  getSession: async (sessionId: string, token: string) => {
    return httpClient.get(`/sos/sessions/${sessionId}`, token);
  }
};

// Dr. Marcie AI
export const marcieApi = {
  chat: async (userId: string, context: string, message: string, sarcasmLevel: number = 1, token: string) => {
    return httpClient.post('/marcie/chat', {
      user_id: userId,
      context,
      message,
      sarcasm_level: sarcasmLevel
    }, token);
  }
};
```

### Step 4: Authentication Integration
Update authentication to work with backend:

```typescript
// Update auth hooks to get tokens for API calls
const { user } = useAuth();
const token = await user.getIdToken(); // Firebase token for backend authentication
```

## Priority Implementation Order

1. **Authentication endpoints** (login, signup, user management)
2. **Game state endpoints** (session creation, updates, completion)
3. **User data endpoints** (profile, settings, progress)
4. **Admin endpoints** (user management, content management)
5. **Real-time features** (WebSocket for couple sync)

## Testing Strategy

Create comprehensive API connection tests:

```typescript
// app/src/__tests__/api-connection.test.ts
describe('API Connection Tests', () => {
  test('Backend health check', async () => {
    const response = await httpClient.get('/health');
    expect(response.status).toBe('healthy');
  });
  
  test('User creation and retrieval', async () => {
    const userData = { email: 'test@example.com', display_name: 'Test User' };
    const created = await userApi.create(userData, 'test-token');
    const retrieved = await userApi.get(created.id, 'test-token');
    expect(retrieved.email).toBe(userData.email);
  });
  
  // Add more comprehensive tests...
});
```

## Error Handling

Implement proper error handling for API failures:

```typescript
export const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Handle authentication errors
    redirectToLogin();
  } else if (error.status === 404) {
    // Handle not found errors
    showNotFoundMessage();
  } else if (error.status >= 500) {
    // Handle server errors
    showServerErrorMessage();
  }
  
  // Log error for debugging
  console.error('API Error:', error);
  
  // Return user-friendly error message
  return error.message || 'An unexpected error occurred';
};