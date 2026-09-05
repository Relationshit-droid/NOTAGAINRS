/**
 * useGameSession Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useGameSession } from '../useGameSession';
import { gamesApi } from '../../lib/api';

// Mock the API
jest.mock('../../lib/api', () => ({
  gamesApi: {
    createSession: jest.fn(),
    getSession: jest.fn(),
    updateSession: jest.fn(),
    completeSession: jest.fn(),
    submitAnswer: jest.fn(),
  }
}));

// Mock Firebase auth
jest.mock('../../lib/firebaseClient', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
      getIdToken: jest.fn().mockResolvedValue('test-token')
    }
  }
}));

// Mock Alert
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn()
  }
}));

describe('useGameSession', () => {
  const mockSession = {
    id: 'session-123',
    user_id: 'test-user-id',
    game_id: 'truth-or-trust',
    category_id: 'emotional-connection',
    status: 'active',
    score: 0,
    completed: false,
    responses: [],
    game_state: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (gamesApi.createSession as jest.Mock).mockResolvedValue(mockSession);
  });

  it('should create session on mount', async () => {
    const { result } = renderHook(() => 
      useGameSession('truth-or-trust', 'emotional-connection')
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for session creation
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.session).toEqual(mockSession);
    expect(gamesApi.createSession).toHaveBeenCalledWith(
      'test-user-id',
      'truth-or-trust',
      'emotional-connection',
      'test-token',
      undefined
    );
  });

  it('should update score', async () => {
    const updatedSession = { ...mockSession, score: 50 };
    (gamesApi.updateSession as jest.Mock).mockResolvedValue(updatedSession);

    const { result } = renderHook(() => 
      useGameSession('truth-or-trust', 'emotional-connection')
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateScore(50);
    });

    expect(gamesApi.updateSession).toHaveBeenCalledWith(
      'session-123',
      expect.objectContaining({ score: 50, completed: false }),
      'test-token'
    );
    expect(result.current.session?.score).toBe(50);
  });

  it('should complete game', async () => {
    const completedSession = { 
      ...mockSession, 
      completed: true, 
      status: 'completed',
      score: 100 
    };
    (gamesApi.completeSession as jest.Mock).mockResolvedValue(completedSession);

    const { result } = renderHook(() => 
      useGameSession('truth-or-trust', 'emotional-connection')
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.completeGame(100);
    });

    expect(gamesApi.completeSession).toHaveBeenCalledWith(
      'session-123',
      expect.objectContaining({ final_score: 100 }),
      'test-token'
    );
  });

  it('should handle session creation error', async () => {
    (gamesApi.createSession as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => 
      useGameSession('truth-or-trust', 'emotional-connection')
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.session).toBeNull();
  });

  it('should reset session', async () => {
    const newSession = { ...mockSession, id: 'session-456' };
    (gamesApi.createSession as jest.Mock)
      .mockResolvedValueOnce(mockSession)
      .mockResolvedValueOnce(newSession);

    const { result } = renderHook(() => 
      useGameSession('truth-or-trust', 'emotional-connection')
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.resetSession();
    });

    await waitFor(() => {
      expect(result.current.session?.id).toBe('session-456');
    });

    expect(gamesApi.createSession).toHaveBeenCalledTimes(2);
  });
});
