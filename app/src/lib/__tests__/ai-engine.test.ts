import { analyzeFight } from '../ai-engine';

// Mock the ENV module
jest.mock('../env', () => ({
  ENV: {
    OPENAI_API_KEY: 'mock-openai-key',
    ANTHROPIC_API_KEY: 'mock-anthropic-key',
  },
}));

global.fetch = jest.fn();

describe('analyzeFight', () => {
  const mockInput = {
    origin_story: 'test',
    first_red_flag: 'test',
    partner_a_input: 'test',
    partner_b_input: 'test',
    personality: 'test',
    sarcasm_level: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use OpenAI if key is present', async () => {
    // Mock OpenAI success
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"right":[]}' } }] }),
    });

    const result = await analyzeFight(mockInput);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('openai.com'), expect.any(Object));
    expect(result).toEqual({ right: [] });
  });

  it('should fallback to Anthropic if OpenAI fails', async () => {
    // OpenAI fail
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
    // Anthropic success
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: [{ text: '{"right":["ant"]}' }] }),
    });

    const result = await analyzeFight(mockInput);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ right: ['ant'] });
  });
});
