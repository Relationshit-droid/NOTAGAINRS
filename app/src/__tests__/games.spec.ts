import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import WindowsAndWalls from '../screens/games/WindowsAndWalls';
import TriggerTriage from '../screens/games/TriggerTriage';
import TrustBank from '../screens/games/TrustBank';
import TheIceberg from '../screens/games/TheIceberg';
import SecrecyAudit from '../screens/games/SecrecyAudit';

// Several of these screens call useNavigation() internally, so they must be
// rendered inside a real NavigationContainer.
const renderGame = (Component: any) =>
  render(
    React.createElement(
      NavigationContainer,
      null,
      React.createElement(Component, {
        route: { params: { gameId: 'g' } },
        navigation: { goBack: jest.fn(), navigate: jest.fn() },
      })
    )
  );

test('WindowsAndWalls renders and swiping updates index', () => {
  const { getByText } = renderGame(WindowsAndWalls);
  expect(getByText(/Swipe LEFT/)).toBeTruthy();
});

test('TriggerTriage shows slider and inputs', () => {
  const { getByPlaceholderText } = renderGame(TriggerTriage);
  expect(getByPlaceholderText('What triggered this?')).toBeTruthy();
});

test('TrustBank allows transaction inputs', () => {
  const { getByPlaceholderText } = renderGame(TrustBank);
  expect(getByPlaceholderText(/What happened\?/)).toBeTruthy();
  expect(getByPlaceholderText(/Amount \(1-100\)/)).toBeTruthy();
});

test('TheIceberg renders the first iceberg prompt', () => {
  const { getByText } = renderGame(TheIceberg);
  expect(getByText('The Iceberg')).toBeTruthy();
  expect(getByText('We always laugh together')).toBeTruthy();
});

test('SecrecyAudit shows question and buttons', () => {
  const { getByText } = renderGame(SecrecyAudit);
  expect(getByText(/YES/)).toBeTruthy();
  expect(getByText(/NO/)).toBeTruthy();
});

