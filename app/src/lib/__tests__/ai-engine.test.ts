import { analyzeFight } from '../ai-engine';
import { vertexAIService } from '../vertex-ai-service';

/**
 * analyzeFight delegates to Vertex AI (Gemini) through the app's Cloud
 * Functions. The previous version of this test asserted a direct fetch to
 * openai.com with an Anthropic fallback -- both prohibited by the
 * Gemini-only mandate, and neither present in the implementation any more.
 */
jest.mock('../vertex-ai-service', () => ({
  vertexAIService: {
    analyzeUserInput: jest.fn(),
  },
}));

const mockedAnalyze = vertexAIService.analyzeUserInput as jest.Mock;

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

  it('routes analysis through the Vertex AI (Gemini) service', async () => {
    mockedAnalyze.mockResolvedValue({
      sentiment: 'negative',
      confidence: 0.9,
      marcieResponse: 'You are both avoiding the real issue.',
      triggers: ['avoidance'],
    });

    const result = await analyzeFight(mockInput as any);

    expect(mockedAnalyze).toHaveBeenCalledTimes(1);
    expect(mockedAnalyze).toHaveBeenCalledWith(
      mockInput.partner_a_input,
      expect.objectContaining({ origin_story: mockInput.origin_story })
    );
    expect(result).toBeDefined();
  });

  it('returns a usable result when the AI service fails', async () => {
    mockedAnalyze.mockRejectedValue(new Error('service unavailable'));

    const result = await analyzeFight(mockInput as any);

    // The engine degrades to fallback prompts rather than throwing, so the
    // SOS flow stays usable when the model is unreachable.
    expect(result).toBeDefined();
  });

  it('never calls a third-party AI provider directly', async () => {
    const fetchSpy = jest.fn();
    (global as any).fetch = fetchSpy;

    mockedAnalyze.mockResolvedValue({
      sentiment: 'neutral',
      confidence: 0.5,
      marcieResponse: 'Tell me more.',
      triggers: [],
    });

    await analyzeFight(mockInput as any);

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
