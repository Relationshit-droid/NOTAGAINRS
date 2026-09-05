import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';

import { auth, isFirebaseConfigured } from './src/lib/firebaseClient';
import { ENV } from './src/lib/env';
import AppNavigator from './src/navigation/AppNavigator';
import LoginAndSignUpScreen from './src/screens/auth/LoginAndSignUp';
import SplashScreen from './src/screens/auth/SplashScreen';
import { COLORS } from './src/theme';
import { navigationRef } from './src/lib/navigation';
import ErrorBoundary from './src/components/ErrorBoundary';

const Stack = createNativeStackNavigator();

/**
 * DEMO_MODE lets the preview run the full app (dashboard, games, SOS) without a
 * live Firebase project. With real Firebase credentials in .env it is off and
 * the normal auth gate applies.
 */
const DEMO_MODE = ENV.DEMO_MODE || !isFirebaseConfigured;

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [checkingAuthState, setCheckingAuthState] = useState(!DEMO_MODE);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) return;
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setCheckingAuthState(false);
      });
    } catch (e) {
      // Never let an auth misconfiguration hard-crash the app shell.
      console.warn('Auth unavailable, continuing unauthenticated:', e);
      setCheckingAuthState(false);
    }
    return () => unsubscribe();
  }, []);

  const content = () => {
    if (showSplash) {
      return <SplashScreen onStart={() => setShowSplash(false)} />;
    }
    if (checkingAuthState) return null;

    return (
      <NavigationContainer
        ref={navigationRef}
        theme={{
          dark: true,
          colors: {
            primary: COLORS.gradientStart,
            background: COLORS.backgroundPrimary,
            card: COLORS.backgroundCard,
            text: COLORS.textPrimary,
            border: COLORS.borderSubtle,
            notification: COLORS.vibrantPink,
          },
        } as any}
      >
        {DEMO_MODE || user ? (
          <ErrorBoundary>
            <AppNavigator />
          </ErrorBoundary>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginAndSignUp" component={LoginAndSignUpScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.backgroundPrimary }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {content()}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
