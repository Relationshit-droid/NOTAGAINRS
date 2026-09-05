import GameContainer from '../components/games/engine/GameContainer';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';

const baseState = {
  id: 't', title: 'Test', description: '', category: 'healing' as const, difficulty: 'medium' as const,
  xpReward: 70, currentStep: 0, totalTime: 60,
  playerData: { vulnerabilityScore: 60, honestyScore: 60, completionTime: 10, partnerSync: 50 }
};

test('GameContainer renders header and computes score/xp', () => {
  const { getByText } = render(React.createElement(GameContainer, { state: baseState, inputs: ['text'], onComplete: () => {} }));
  expect(getByText('Test')).toBeTruthy();
  expect(getByText(/Score/)).toBeTruthy();
  expect(getByText(/XP \+/)).toBeTruthy();
});

test('GameContainer skip triggers penalty and callback', async () => {
  const onSkip = jest.fn();
  const { getByText } = render(React.createElement(GameContainer, { state: baseState, inputs: ['text'], onComplete: () => {}, onSkip }));
  fireEvent.press(getByText('Start'));
  fireEvent.press(getByText('Skip'));
  // skip() awaits the penalty write before invoking the callback.
  await waitFor(() => expect(onSkip).toHaveBeenCalled());
});
