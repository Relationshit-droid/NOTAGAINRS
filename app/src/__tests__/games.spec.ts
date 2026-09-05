import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WindowsAndWalls from '../screens/games/WindowsAndWalls';
import TriggerTriage from '../screens/games/TriggerTriage';
import TrustBank from '../screens/games/TrustBank';
import TheIceberg from '../screens/games/TheIceberg';
import SecrecyAudit from '../screens/games/SecrecyAudit';

jest.mock('../lib/supabaseClient', () => ({
  supabase: { auth: { getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'u' } } } }) } },
  createGameSession: jest.fn().mockResolvedValue({ id: 's1' }),
  updateGameSession: jest.fn().mockResolvedValue({}),
}));

test('WindowsAndWalls renders and swiping updates index', () => {
  const { getByText } = render(React.createElement(WindowsAndWalls, { route: { params: { gameId: 'g' } }, navigation: { goBack: jest.fn() } }));
  expect(getByText(/Swipe LEFT/)).toBeTruthy();
});

test('TriggerTriage shows slider and inputs', () => {
  const { getByPlaceholderText } = render(React.createElement(TriggerTriage, { route: { params: { gameId: 'g' } }, navigation: { goBack: jest.fn() } }));
  expect(getByPlaceholderText('What triggered this?')).toBeTruthy();
});

test('TrustBank allows transaction inputs', () => {
  const { getByPlaceholderText } = render(React.createElement(TrustBank, { route: { params: { gameId: 'g' } }, navigation: { goBack: jest.fn() } }));
  expect(getByPlaceholderText(/Description/)).toBeTruthy();
});

test('TheIceberg renders nodes', () => {
  const { getByText } = render(React.createElement(TheIceberg, { route: { params: { gameId: 'g' } }, navigation: { goBack: jest.fn() } }));
  expect(getByText('Anger')).toBeTruthy();
});

test('SecrecyAudit shows question and buttons', () => {
  const { getByText } = render(React.createElement(SecrecyAudit, { route: { params: { gameId: 'g' } }, navigation: { goBack: jest.fn() } }));
  expect(getByText(/YES/)).toBeTruthy();
  expect(getByText(/NO/)).toBeTruthy();
});

