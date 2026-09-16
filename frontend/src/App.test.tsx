import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * Smoke test for the web app shell.
 *
 * This file started life as CRA's default test, which asserted a "learn react"
 * link that this app never rendered — so `npm test` failed on a clean checkout.
 * Assert on the real Game Library entry screen instead.
 */
test('renders the game library entry screen', () => {
  render(<App />);

  expect(screen.getByText(/love, actually/i)).toBeInTheDocument();
  expect(screen.getByTestId('sos-button')).toBeInTheDocument();
});
