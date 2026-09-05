/**
 * Optimized Navigation Stack
 * Lazy-loaded screens with code splitting for better performance
 */

import React, { Suspense, lazy } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Eagerly load critical screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginAndSignUp from '../screens/auth/LoginAndSignUp';

// Lazy load non-critical screens
const GameLibraryScreen = lazy(() => import('../screens/games/GameLibraryScreen'));
const DashboardHome = lazy(() => import('../screens/dashboard/DashboardHome'));
const ProfileScreen = lazy(() => import('../screens/dashboard/ProfileScreen'));
const SettingsScreen = lazy(() => import('../screens/dashboard/SettingsScreen'));
const CoupleLinkingScreen = lazy(() => import('../screens/onboarding/CoupleLinkingScreen'));
const SOSModal = lazy(() => import('../screens/sos/SOSModal'));
const LeaderboardScreen = lazy(() => import('../screens/dashboard/LeaderboardScreen'));

// Lazy load game screens - only loaded when accessed
const TruthOrTrustGame = lazy(() => import('../screens/games/TruthOrTrust'));
const SixSecondKissGame = lazy(() => import('../screens/games/SixSecondKiss'));
const GratitudeCloudGame = lazy(() => import('../screens/games/GratitudeCloud'));
const BidRadarGame = lazy(() => import('../screens/games/BidRadar'));

// Loading fallback component
const ScreenLoader = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#FA1F63" />
  </View>
);

// Lazy wrapper with Suspense
const LazyScreen = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<ScreenLoader />}>
      <Component {...props} />
    </Suspense>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (lazy loaded)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: true, // Lazy load tab screens
        unmountOnBlur: false, // Keep screens mounted for performance
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={LazyScreen(DashboardHome)} 
      />
      <Tab.Screen 
        name="Games" 
        component={LazyScreen(GameLibraryScreen)} 
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LazyScreen(LeaderboardScreen)} 
      />
      <Tab.Screen 
        name="Profile" 
        component={LazyScreen(ProfileScreen)} 
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export function OptimizedNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
        initialRouteName="Splash"
      >
        {/* Auth screens - eager loaded */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginAndSignUp} />
        
        {/* Onboarding - lazy loaded */}
        <Stack.Screen 
          name="CoupleLinking" 
          component={LazyScreen(CoupleLinkingScreen)} 
        />
        
        {/* Main app - lazy loaded */}
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ gestureEnabled: false }}
        />
        
        {/* Game screens - lazy loaded with preloading option */}
        <Stack.Screen 
          name="GameTruthOrTrust" 
          component={LazyScreen(TruthOrTrustGame)}
        />
        <Stack.Screen 
          name="GameSixSecondKiss" 
          component={LazyScreen(SixSecondKissGame)}
        />
        <Stack.Screen 
          name="GameGratitudeCloud" 
          component={LazyScreen(GratitudeCloudGame)}
        />
        <Stack.Screen 
          name="GameBidRadar" 
          component={LazyScreen(BidRadarGame)}
        />
        
        {/* Modal screens */}
        <Stack.Screen 
          name="SOS" 
          component={LazyScreen(SOSModal)}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={LazyScreen(SettingsScreen)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Preload critical screens after initial load
export function preloadCriticalScreens() {
  // Preload dashboard after a short delay
  setTimeout(() => {
    import('../screens/dashboard/DashboardHome');
    import('../screens/games/GameLibraryScreen');
  }, 2000);
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});

export default OptimizedNavigator;
