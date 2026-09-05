/**
 * Game Integration Test Suite
 *
 * Exercises the game data layer end to end: gamesApi -> httpClient ->
 * firestoreRouter.
 *
 * The previous version of this suite mocked `global.fetch` and asserted HTTP
 * URLs, bearer headers and JSON bodies against a FastAPI backend. That backend
 * was removed under the Firebase-only mandate, so those assertions tested a
 * transport that no longer exists. These tests mock the Firestore router
 * instead -- the real boundary the app now talks to -- and assert on behaviour
 * rather than on wire format.
 */

import { gamesApi } from '../lib/api';
import * as firestoreRouter from '../lib/firestoreRouter';

jest.mock('../lib/firebaseClient', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-123',
      getIdToken: jest.fn().mockResolvedValue('test-token'),
    },
  },
  db: {},
  isFirebaseConfigured: true,
}));

jest.mock('../lib/firestoreRouter', () => ({
  request: jest.fn(),
}));

const mockRequest = firestoreRouter.request as jest.Mock;

describe('Game data layer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sessions', () => {
    it('creates a game session and returns it', async () => {
      const session = {
        id: 'heart-session-123',
        user_id: 'test-user-123',
        game_id: 'heart-of-the-matter',
        category_id: 'emotional-connection',
        status: 'in_progress',
        score: 0,
      };
      mockRequest.mockResolvedValueOnce(session);

      const result = await gamesApi.createSession(
        'test-user-123',
        'heart-of-the-matter',
        'emotional-connection'
      );

      expect(result).toEqual(session);

      const [method, endpoint, body] = mockRequest.mock.calls[0];
      expect(method).toBe('POST');
      expect(endpoint).toContain('games/sessions');
      expect(body).toMatchObject({
        game_id: 'heart-of-the-matter',
        category_id: 'emotional-connection',
      });
    });

    it('updates a session with new score and responses', async () => {
      const updated = { id: 'heart-session-123', score: 75, status: 'in_progress' };
      mockRequest.mockResolvedValueOnce(updated);

      const result = await gamesApi.updateSession(
        'heart-session-123',
        { score: 75 } as any,
        'test-token'
      );

      expect(result).toEqual(updated);
      const [method, endpoint] = mockRequest.mock.calls[0];
      expect(['PUT', 'POST']).toContain(method);
      expect(endpoint).toContain('heart-session-123');
    });

    it('reads a session back by id', async () => {
      mockRequest.mockResolvedValueOnce({ id: 'sess-1', status: 'in_progress' });

      const result = await gamesApi.getSession('sess-1', 'test-token');

      expect(result).toMatchObject({ id: 'sess-1' });
      expect(mockRequest.mock.calls[0][0]).toBe('GET');
    });
  });

  describe('catalogue', () => {
    it('returns the game categories', async () => {
      mockRequest.mockResolvedValueOnce({
        categories: [{ id: 'love-arcade', name: 'Love Arcade' }],
      });

      const result = await gamesApi.getCategories();

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].id).toBe('love-arcade');
    });

    it('returns the game registry', async () => {
      mockRequest.mockResolvedValueOnce({
        games: { 'bid-radar': { id: 'bid-radar' } },
        total_games: 1,
        categories: 1,
      });

      const result = await gamesApi.getRegistry();

      expect(result.total_games).toBe(1);
      expect(Object.keys(result.games)).toContain('bid-radar');
    });
  });

  describe('error handling', () => {
    it('surfaces a failure from the data layer', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Session sess-x not found'));

      await expect(gamesApi.getSession('sess-x', 'test-token')).rejects.toThrow(
        /not found/
      );
    });

    it('propagates permission errors', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Missing or insufficient permissions'));

      await expect(
        gamesApi.updateSession('sess-1', { score: 1 } as any, 'bad-token')
      ).rejects.toThrow(/permission/i);
    });
  });

  describe('concurrency', () => {
    it('handles concurrent session reads independently', async () => {
      mockRequest
        .mockResolvedValueOnce({ id: 'a', status: 'in_progress' })
        .mockResolvedValueOnce({ id: 'b', status: 'completed' });

      const [a, b] = await Promise.all([
        gamesApi.getSession('a', 't'),
        gamesApi.getSession('b', 't'),
      ]);

      expect(a).toMatchObject({ id: 'a' });
      expect(b).toMatchObject({ id: 'b' });
      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });
});
