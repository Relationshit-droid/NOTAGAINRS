import React from 'react';
import { render } from '@testing-library/react-native';
import OnboardingNavigator from '../screens/auth/OnboardingNavigator';

test('Navigator mounts without crashing', () => {
  const tree = render(<OnboardingNavigator />);
  expect(tree).toBeTruthy();
});
