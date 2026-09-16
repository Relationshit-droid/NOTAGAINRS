import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';

import { auth, isFirebaseConfigured } from './src/lib/firebaseClient';
import { ENV } from './src/lib/env';
import Provider from './src/state/Provider';
import AppNavigator from './src/navigation/AppNavigator';
import LoginAndSignUpScreen from './src/screens/auth/LoginAndSignUp';
import SplashScreen from './src/screens/auth/SplashScreen';
import { COLORS } from './src/theme';
import Typography from './src/components/ui/Typography';
import { navigationRef } from './src/lib/navigation';
import ErrorBoundary from './src/components/ErrorBoundary';
import { initSentry } from './src/config/sentry';
import { useFonts } from 'expo-font';

// The design system references Inter by family name everywhere
// (FONT_FAMILIES / TYPOGRAPHY.fontFamily). Those faces must be registered at
// startup or every platform falls back to its default font (serif on web).
const FONT_FILES = {
  'Inter-Black': require('./assets/fonts/Inter-Black.ttf'),
  'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
  'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
  'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
  'Inter-Italic': require('./assets/fonts/Inter-Italic.ttf'),
};

const Stack = createNativeStackNavigator();

/**
 * DEMO_MODE lets the preview run the full app (dashboard, games, SOS) without a
 * live Firebase project. With real Firebase credentials in .env it is off and
 * the normal auth gate applies.
 */
const DEMO_MODE = ENV.DEMO_MODE || !isFirebaseConfigured;

// Initialize Sentry (respects feature flag)
initSentry();

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [checkingAuthState, setCheckingAuthState] = useState(!DEMO_MODE);
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded, fontsError] = useFonts(FONT_FILES);

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

  // Render nothing while the Inter faces stream in. If loading FAILED, keep
  // going with system fonts rather than hanging on a blank screen forever.
  if (!fontsLoaded && !fontsError) return null;

  const content = () => {
    if (showSplash) {
      return <SplashScreen onStart={() => setShowSplash(false)} />;
    }
    // Never render a bare `null` here: a slow Firebase auth resolve (or a
    // crash further down) used to look exactly like a dead app. Show a real
    // loading state, and wrap the login navigator in an ErrorBoundary so a
    // broken screen surfaces a message + TRY AGAIN instead of a blank page.
    if (checkingAuthState) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.vibrantPink} />
          <Typography variant="body" style={styles.checkingText}>
            Checking the stars…
          </Typography>
        </View>
      );
    }

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
          <ErrorBoundary>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="LoginAndSignUp" component={LoginAndSignUpScreen} />
            </Stack.Navigator>
          </ErrorBoundary>
        )}
      </NavigationContainer>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.backgroundPrimary }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Provider>
          {content()}
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: COLORS.backgroundPrimary,
  },
  checkingText: { color: COLORS.textSecondary },
});

export default App;
