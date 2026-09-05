import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './src/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import AppNavigator from './src/navigation/AppNavigator';
import LoginAndSignUpScreen from './src/screens/auth/LoginAndSignUp';
import SplashScreen from './src/screens/auth/SplashScreen';

const Stack = createStackNavigator();

const AuthenticatedApp = () => {
  return <AppNavigator />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [checkingAuthState, setCheckingAuthState] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setCheckingAuthState(false);
      setShowSplash(false);
    });

    return unsubscribe;
  }, []);

  if (checkingAuthState || showSplash) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="Splash" 
            component={() => <SplashScreen onStart={() => setShowSplash(false)} />} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="AuthenticatedApp" component={AuthenticatedApp} />
        ) : (
          <Stack.Screen name="LoginAndSignUp" component={LoginAndSignUpScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;