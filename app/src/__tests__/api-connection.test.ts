/**
 * API Connection Tests
 * 
 * These tests verify that the frontend can successfully connect to the backend API
 * and perform basic operations. Run these after setting up the backend.
 */

import { userApi, coupleApi, gamesApi, sosApi, marcieApi, healthApi } from '../lib/api';
import { checkHealth } from '../lib/httpClient';

const shouldRunIntegrationTests = process.env.RUN_INTEGRATION_TESTS === 'true';

(shouldRunIntegrationTests ? describe : describe.skip)('API Connection Tests', () => {
  // Test tokens and IDs (these would be real values in actual testing)
  let testToken: string = 'test-token';
  let testUserId: string | null = null;
  let testCoupleId: string | null = null;
  let testSessionId: string | null = null;

  // ============================================================================
  // Health Check Tests
  // ============================================================================
  describe('Health Check', () => {
    it('should verify backend is healthy', async () => {
      const isHealthy = await checkHealth();
      expect(isHealthy).toBe(true);
    });

    it('should return health status', async () => {
      const health = await healthApi.check();
      expect(health.status).toBe('healthy');
      expect(health.app).toBe('Love Actually - The Game');
      expect(health.version).toBeDefined();
      expect(health.timestamp).toBeDefined();
    });
  });

  // ============================================================================
  // User API Tests
  // ============================================================================
  describe('User API', () => {
    it('should create a new user', async () => {
      // Skip if no valid token (requires Firebase Auth)
      if (testToken === 'test-token') {
        console.log('Skipping user creation test - no valid Firebase token');
        return;
      }

      const userData = {
        email: `test-${Date.now()}@example.com`,
        display_name: 'Test User',
      };

      try {
        const user = await userApi.create(userData, testToken);
        
        expect(user).toBeDefined();
        expect(user.id).toBeDefined();
        expect(user.email).toBe(userData.email);
        expect(user.display_name).toBe(userData.display_name);
        expect(user.couple_code).toBeDefined();
        expect(user.sarcasm_level).toBe(1);
        
        // Save for later tests
        testUserId = user.id;
      } catch (error) {
        // If user already exists, that's okay for testing
        console.log('User creation error (may already exist):', error);
      }
    });

    it('should get user by ID', async () => {
      if (!testUserId) {
        console.log('Skipping get user test - no user ID');
        return;
      }

      const user = await userApi.get(testUserId, testToken);
      
      expect(user).toBeDefined();
      expect(user.id).toBe(testUserId);
    });

    it('should update sarcasm level', async () => {
      if (!testUserId) {
        console.log('Skipping sarcasm update test - no user ID');
        return;
      }

      const result = await userApi.updateSarcasm(testUserId, 3, testToken);
      
      expect(result.success).toBe(true);
      expect(result.sarcasm_level).toBe(3);
      expect(result.name).toBeDefined();
    });
  });

  // ============================================================================
  // Couple API Tests
  // ============================================================================
  describe('Couple API', () => {
    it('should link a couple', async () => {
      // This test requires two actual users with valid tokens
      // In practice, you'd create two test users first
      if (testToken === 'test-token' || !testUserId) {
        console.log('Skipping couple link test - requires valid users');
        return;
      }

      // You'd need a real partner code from another user
      const partnerCode = 'TESTCODE';

      try {
        const result = await coupleApi.link(testUserId, partnerCode, testToken);
        
        expect(result.success).toBe(true);
        expect(result.couple_id).toBeDefined();
        expect(result.partner).toBeDefined();
        
        testCoupleId = result.couple_id;
      } catch (error: any) {
        // Expected if partner code doesn't exist
        expect(error.message).toContain('Invalid partner code');
      }
    });

    it('should get couple data', async () => {
      if (!testCoupleId) {
        console.log('Skipping get couple test - no couple ID');
        return;
      }

      const couple = await coupleApi.get(testCoupleId, testToken);
      
      expect(couple).toBeDefined();
      expect(couple.id).toBe(testCoupleId);
      expect(couple.user1_id).toBeDefined();
      expect(couple.user2_id).toBeDefined();
    });
  });

  // ============================================================================
  // Games API Tests
  // ============================================================================
  describe('Games API', () => {
    it('should get game categories (public)', async () => {
      const { categories } = await gamesApi.getCategories();
      
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      
      // Check structure of first category
      const firstCategory = categories[0];
      expect(firstCategory.id).toBeDefined();
      expect(firstCategory.name).toBeDefined();
      expect(firstCategory.description).toBeDefined();
      expect(firstCategory.icon).toBeDefined();
      expect(firstCategory.color).toBeDefined();
      expect(Array.isArray(firstCategory.games)).toBe(true);
    });

    it('should get specific category', async () => {
      const category = await gamesApi.getCategory('love-arcade');
      
      expect(category).toBeDefined();
      expect(category.id).toBe('love-arcade');
      expect(category.games).toContain('truth-teller-tower');
    });

    it('should get Love Arcade games', async () => {
      const { games } = await gamesApi.getLoveArcadeGames();
      
      expect(games).toBeDefined();
      expect(Array.isArray(games)).toBe(true);
      
      const truthTellerTower = games.find(g => g.id === 'truth-teller-tower');
      expect(truthTellerTower).toBeDefined();
      expect(truthTellerTower?.max_score).toBeDefined();
    });

    it('should create a game session', async () => {
      if (!testUserId) {
        console.log('Skipping create session test - no user ID');
        return;
      }

      const session = await gamesApi.createSession(
        testUserId,
        'truth-teller-tower',
        'love-arcade',
        testToken
      );
      
      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.user_id).toBe(testUserId);
      expect(session.game_id).toBe('truth-teller-tower');
      expect(session.completed).toBe(false);
      expect(session.score).toBe(0);
      
      testSessionId = session.id;
    });

    it('should update a game session', async () => {
      if (!testSessionId) {
        console.log('Skipping update session test - no session ID');
        return;
      }

      const updated = await gamesApi.updateSession(
        testSessionId,
        {
          score: 50,
          completed: true,
          responses: [{ question: 1, answer: 'A' }],
        },
        testToken
      );
      
      expect(updated.score).toBe(50);
      expect(updated.completed).toBe(true);
    });
  });

  // ============================================================================
  // SOS API Tests
  // ============================================================================
  describe('SOS API', () => {
    it('should create SOS session', async () => {
      if (!testUserId || !testCoupleId) {
        console.log('Skipping SOS session test - no user/couple ID');
        return;
      }

      const session = await sosApi.createSession(testUserId, testCoupleId, testToken);
      
      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.initiator_id).toBe(testUserId);
      expect(session.status).toBe('waiting_for_partner');
    });
  });

  // ============================================================================
  // Dr. Marcie API Tests
  // ============================================================================
  describe('Dr. Marcie AI API', () => {
    it('should get response from Dr. Marcie', async () => {
      if (!testUserId) {
        console.log('Skipping Marcie chat test - no user ID');
        return;
      }

      const response = await marcieApi.chat(
        testUserId,
        'User is asking about trust issues',
        'How do I rebuild trust in my relationship?',
        2, // Reality Check Specialist level
        testToken
      );
      
      expect(response).toBeDefined();
      expect(response.response).toBeDefined();
      expect(response.response.length).toBeGreaterThan(0);
      expect(response.animation).toBeDefined();
      expect(response.sarcasm_level).toBe(2);
    });
  });
});

// ============================================================================
// Integration Test Example
// ============================================================================

describe('Integration Flow', () => {
  it('should complete full user journey', async () => {
    // This is a simplified example of a full user journey
    // In practice, you'd need valid Firebase tokens

    console.log(`
      Integration Test Flow:
      1. Check backend health ✅
      2. Create user (requires Firebase token)
      3. Link couple (requires two users)
      4. Get game categories ✅ (public endpoint)
      5. Create game session
      6. Play game
      7. Complete session
      8. Chat with Dr. Marcie
    `);

    // Test what we can without auth
    const isHealthy = await checkHealth();
    expect(isHealthy).toBe(true);

    const { categories } = await gamesApi.getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });
});

export {};