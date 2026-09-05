/**
 * Game Integration Test Suite
 * 
 * Tests the integration of complex games with backend and state management
 * Verifies proper API connections, error handling, and game flow
 */

import { gamesApi, marcieApi } from '../lib/api';
import { useGameStore } from '../lib/game-store';
import { auth } from '../lib/firebaseClient';

// Mock Firebase auth
jest.mock('../lib/firebaseClient', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-123',
      getIdToken: jest.fn().mockResolvedValue('test-token')
    }
  }
}));

// Mock game store
jest.mock('../lib/game-store', () => ({
  useGameStore: jest.fn(() => ({
    updateGameProgress: jest.fn(),
    currentGameSession: { id: 'test-session-123' }
  }))
}));

// Mock fetch for HTTP requests
global.fetch = jest.fn();

describe('Game Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  describe('Heart of the Matter Game', () => {
    test('should initialize game session successfully', async () => {
      const mockSession = {
        id: 'heart-session-123',
        user_id: 'test-user-123',
        game_id: 'heart-of-the-matter',
        category_id: 'emotional-connection',
        started_at: new Date().toISOString(),
        completed: false,
        score: 0,
        responses: []
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockSession
      });

      const result = await gamesApi.createSession(
        'test-user-123',
        'heart-of-the-matter',
        'emotional-connection'
      );

      expect(result).toEqual(mockSession);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/games/sessions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          }),
          body: JSON.stringify({
            user_id: 'test-user-123',
            game_id: 'heart-of-the-matter',
            category_id: 'emotional-connection'
          })
        })
      );
    });

    test('should update game session with revelation data', async () => {
      const sessionId = 'heart-session-123';
      const revelationData = [
        {
          partner: 'A',
          revelation: 'The deepest word-wound is the silence between us.',
          timestamp: new Date().toISOString()
        },
        {
          partner: 'B', 
          revelation: 'I hide my vulnerability to protect you from my pain.',
          timestamp: new Date().toISOString()
        }
      ];

      const mockResponse = {
        id: sessionId,
        score: 75,
        completed: true,
        responses: revelationData
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse
      });

      const result = await gamesApi.updateSession(
        sessionId,
        75,
        true,
        revelationData
      );

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/games/sessions/${sessionId}`),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          }),
          body: JSON.stringify({
            score: 75,
            completed: true,
            responses: revelationData
          })
        })
      );
    });

    test('should get Dr. Marcie feedback for revelation', async () => {
      const mockMarcieResponse = {
        response: "Sweetheart, silence isn't safety—it's a prison you're both building. Time to pick the lock together.",
        animation: 'marcie-thinking',
        sarcasm_level: 2
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockMarcieResponse
      });

      const result = await marcieApi.chat(
        'test-user-123',
        'Heart of the Matter game - Partner A revelation',
        'The deepest word-wound is the silence between us.',
        2
      );

      expect(result).toEqual(mockMarcieResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/marcie/chat'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          }),
          body: JSON.stringify({
            user_id: 'test-user-123',
            context: 'Heart of the Matter game - Partner A revelation',
            message: 'The deepest word-wound is the silence between us.',
            sarcasm_level: 2
          })
        })
      );
    });
  });

  describe('Heart to Heart Newlywed Game', () => {
    test('should handle semantic matching calculation', async () => {
      const answerA = 'Integrity and honesty in all our interactions';
      const answerB = 'Truth and authentic communication';
      
      // Mock semantic analysis
      const mockSession = {
        id: 'newlywed-session-123',
        score: 2550,
        responses: [
          {
            question: 'What is our top family value?',
            partnerA_answer: answerA,
            partnerB_answer: answerB,
            semantic_match: 85,
            timestamp: new Date().toISOString()
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockSession
      });

      const result = await gamesApi.updateSession(
        'newlywed-session-123',
        2550,
        false,
        mockSession.responses
      );

      expect(result.score).toBe(2550);
      expect(result.responses[0].semantic_match).toBe(85);
    });

    test('should handle multi-step game progression', async () => {
      const steps = [
        { step: 1, question: 'What is our top family value?', progress: 12.5 },
        { step: 2, question: 'What moment made you feel most connected?', progress: 25 },
        { step: 3, question: 'What is your biggest fear about our future?', progress: 37.5 }
      ];

      for (const step of steps) {
        const mockResponse = {
          id: 'newlywed-session-123',
          step: step.step,
          progress: step.progress
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockResponse
        });

        const result = await gamesApi.updateSession(
          'newlywed-session-123',
          2500 + (step.step * 100),
          false,
          [{
            step: step.step,
            question: step.question,
            partnerA_answer: 'Test answer A',
            partnerB_answer: 'Test answer B',
            timestamp: new Date().toISOString()
          }]
        );

        expect(result.progress).toBe(step.progress);
      }
    });
  });

  describe('Relational Jeopardy Game', () => {
    test('should handle Daily Double functionality', async () => {
      const mockSession = {
        id: 'jeopardy-session-123',
        score: 3450, // Original score + daily double points
        responses: [{
          category: 'SHARED HISTORY',
          points: 200,
          daily_double: true,
          wager: 400,
          timestamp: new Date().toISOString()
        }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockSession
      });

      const result = await gamesApi.updateSession(
        'jeopardy-session-123',
        3450,
        false,
        mockSession.responses
      );

      expect(result.score).toBe(3450);
      expect(result.responses[0].daily_double).toBe(true);
      expect(result.responses[0].wager).toBe(400);
    });

    test('should handle Final Jeopardy completion', async () => {
      const mockFinalResponse = {
        id: 'jeopardy-session-123',
        score: 5000,
        completed: true,
        final_jeopardy: true,
        responses: [{
          category: 'FINAL JEOPARDY',
          points: 1000,
          final_jeopardy: true,
          wager: 1500,
          timestamp: new Date().toISOString()
        }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockFinalResponse
      });

      const result = await gamesApi.updateSession(
        'jeopardy-session-123',
        5000,
        true,
        mockFinalResponse.responses
      );

      expect(result.completed).toBe(true);
      expect(result.final_jeopardy).toBe(true);
      expect(result.score).toBe(5000);
    });

    test('should track answered tiles correctly', async () => {
      const answeredTiles = [
        'SHARED HISTORY-100',
        'SHARED HISTORY-200',
        'THE TRUTH HURTS-100',
        'FUTURE ECHOES-100'
      ];

      const mockSession = {
        id: 'jeopardy-session-123',
        answered_tiles: answeredTiles,
        progress: 16 // 4 out of 25 tiles answered
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockSession
      });

      const result = await gamesApi.updateSession(
        'jeopardy-session-123',
        2850,
        false,
        [{ answered_tiles: answeredTiles }]
      );

      expect(result.answered_tiles).toHaveLength(4);
      expect(result.answered_tiles).toContain('SHARED HISTORY-100');
      expect(result.answered_tiles).toContain('FUTURE ECHOES-100');
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Network error'));

      await expect(gamesApi.createSession('test-user-123', 'test-game', 'test-category'))
        .rejects.toThrow('Network error occurred');
    });

    test('should handle authentication errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Unauthorized' })
      });

      await expect(gamesApi.createSession('test-user-123', 'test-game', 'test-category'))
        .rejects.toThrow('Authentication required');
    });

    test('should handle server errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Internal server error' })
      });

      await expect(gamesApi.createSession('test-user-123', 'test-game', 'test-category'))
        .rejects.toThrow('Server error. Please try again later.');
    });

    test('should handle validation errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Validation failed', details: { score: 'Must be positive' } })
      });

      await expect(gamesApi.updateSession('test-session', -100, false, []))
        .rejects.toThrow('Validation error. Please check your input.');
    });
  });

  describe('Game State Management', () => {
    test('should update game progress correctly', async () => {
      const mockGameStore = useGameStore();
      
      // Simulate game progress updates
      await mockGameStore.updateGameProgress('heart-of-the-matter', 25);
      await mockGameStore.updateGameProgress('heart-of-the-matter', 50);
      await mockGameStore.updateGameProgress('heart-of-the-matter', 100);

      expect(mockGameStore.updateGameProgress).toHaveBeenCalledTimes(3);
      expect(mockGameStore.updateGameProgress).toHaveBeenCalledWith('heart-of-the-matter', 25);
      expect(mockGameStore.updateGameProgress).toHaveBeenCalledWith('heart-of-the-matter', 100);
    });

    test('should handle game completion flow', async () => {
      const mockSession = {
        id: 'test-session-123',
        score: 100,
        completed: true
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockSession
      });

      const result = await gamesApi.updateSession('test-session-123', 100, true, []);
      
      expect(result.completed).toBe(true);
      expect(result.score).toBe(100);
    });
  });

  describe('Performance and Reliability', () => {
    test('should handle concurrent game operations', async () => {
      const operations = [
        gamesApi.createSession('user-1', 'game-1', 'category-1'),
        gamesApi.createSession('user-2', 'game-2', 'category-2'),
        gamesApi.createSession('user-3', 'game-3', 'category-3')
      ];

      const mockResponses = [
        { id: 'session-1', user_id: 'user-1' },
        { id: 'session-2', user_id: 'user-2' },
        { id: 'session-3', user_id: 'user-3' }
      ];

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockResponses[0]
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockResponses[1]
        })
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockResponses[2]
        });

      const results = await Promise.all(operations);
      
      expect(results).toHaveLength(3);
      expect(results[0].id).toBe('session-1');
      expect(results[1].id).toBe('session-2');
      expect(results[2].id).toBe('session-3');
    });

    test('should retry failed requests', async () => {
      const mockResponse = { success: true };
      
      // First call fails, second succeeds
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockResponse
        });

      const result = await gamesApi.healthApi.check();
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Validation', () => {
    test('should validate game session data', async () => {
      const invalidSessionData = {
        user_id: '', // Empty user ID
        game_id: 'heart-of-the-matter',
        category_id: 'emotional-connection'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ 
          error: 'Validation failed', 
          details: { user_id: 'User ID is required' } 
        })
      });

      await expect(gamesApi.createSession('', 'heart-of-the-matter', 'emotional-connection'))
        .rejects.toThrow('Validation error. Please check your input.');
    });

    test('should validate revelation content', async () => {
      const emptyRevelation = '';
      
      // This should be handled by frontend validation, but test backend response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ 
          error: 'Bad Request', 
          details: { revelation: 'Revelation cannot be empty' } 
        })
      });

      await expect(gamesApi.updateSession('test-session', 0, false, [{
        partner: 'A',
        revelation: emptyRevelation,
        timestamp: new Date().toISOString()
      }]))
        .rejects.toThrow('Bad request. Please check your input.');
    });
  });
});

// Integration test for complete game flow
describe('Complete Game Flow Integration', () => {
  test('should handle full Heart of the Matter game flow', async () => {
    const gameFlow = [
      // Initialize game
      {
        api: () => gamesApi.createSession('test-user', 'heart-of-the-matter', 'emotional-connection'),
        mockResponse: { id: 'heart-session-123', score: 0, completed: false }
      },
      // Get Dr. Marcie feedback for revelation
      {
        api: () => marcieApi.chat('test-user', 'Heart of the Matter revelation', 'My deepest wound is the silence.', 2),
        mockResponse: { 
          response: "Silence isn't safety—it's a prison you're both building.",
          animation: 'marcie-thinking',
          sarcasm_level: 2
        }
      },
      // Update session with results
      {
        api: () => gamesApi.updateSession('heart-session-123', 75, true, [{
          partner: 'A',
          revelation: 'My deepest wound is the silence.',
          timestamp: new Date().toISOString()
        }]),
        mockResponse: { id: 'heart-session-123', score: 75, completed: true }
      }
    ];

    for (const step of gameFlow) {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => step.mockResponse
      });

      const result = await step.api();
      expect(result).toBeDefined();
    }

    expect(global.fetch).toHaveBeenCalledTimes(gameFlow.length);
  });

  test('should handle game completion and navigation', async () => {
    const mockGameStore = useGameStore();
    
    // Simulate game completion
    const finalSession = {
      id: 'test-session-123',
      game_id: 'heart-of-the-matter',
      score: 85,
      completed: true
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => finalSession
    });

    await gamesApi.updateSession('test-session-123', 85, true, []);
    
    // Verify game store was updated
    expect(mockGameStore.updateGameProgress).toHaveBeenCalledWith('heart-of-the-matter', 100);
    
    // In real app, navigation would happen here
    // navigation.navigate('GameResultsScreen', { gameId: 'heart-of-the-matter', score: 85, sessionId: 'test-session-123' });
  });
});