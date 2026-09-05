import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GentleStartUpGauntlet from '../GentleStartUpGauntlet';
import { speakMarcie } from '../../../lib/voice-engine';

// Mocks
jest.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-user' } } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { couple_code: 'test-couple' } })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { id: 'test-session' }, error: null })),
        })),
      })),
    })),
  },
  createGameSession: jest.fn(() => Promise.resolve({ id: 'test-session' })),
  updateGameSession: jest.fn(() => Promise.resolve({})),
}));

jest.mock('../../../lib/voice-engine', () => ({
  speakMarcie: jest.fn(),
}));

jest.mock('../../../components/games/engine', () => ({
  GameContainer: ({ inputArea }: any) => <>{inputArea}</>,
  HapticFeedbackSystem: {
    success: jest.fn(),
    warning: jest.fn(),
  },
}));

const mockNavigation = {
  goBack: jest.fn(),
};

const mockRoute = {
  params: {
    gameId: 'req-2',
  },
};

describe('GentleStartUpGauntlet', () => {
  it('validates correct input', async () => {
    const { getByPlaceholderText, getByText } = render(
      <GentleStartUpGauntlet navigation={mockNavigation} route={mockRoute} />
    );

    const input = getByPlaceholderText('I feel...');
    const submitBtn = getByText('Check Tone');

    // Incorrect input
    fireEvent.changeText(input, "You are annoying");
    fireEvent.press(submitBtn);
    expect(speakMarcie).toHaveBeenCalledWith(expect.stringContaining("Start with 'I feel'"));

    // Correct input
    fireEvent.changeText(input, "I feel sad about the mess and I need help");
    fireEvent.press(submitBtn);
    expect(speakMarcie).toHaveBeenCalledWith(expect.stringContaining("Ooh, smooth"));
  });
});
