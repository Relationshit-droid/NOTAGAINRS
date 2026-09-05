
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewGameLibrary from '../screens/games/NewGameLibrary';
import { AdminNavigator } from '../screens/admin-portal';
import { PrivacyPolicy, RateTheExperience, RelationalJeopardy, RelationshipDiagnosisCard, RelationshipDiagnosisCard1, RelationshipDiagnosisCard2, RelationshipDiagnosisCard3 } from '../screens';

const MainStack = createStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator initialRouteName="GameLibrary">
      <MainStack.Screen name="GameLibrary" component={NewGameLibrary} options={{ headerShown: false }} />
      <MainStack.Screen name="AdminPortal" component={AdminNavigator} options={{ headerShown: false }} />
      <MainStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
      <MainStack.Screen name="RateTheExperience" component={RateTheExperience} options={{ headerShown: false }} />
      <MainStack.Screen name="RelationalJeopardy" component={RelationalJeopardy} options={{ headerShown: false }} />
      <MainStack.Screen name="RelationshipDiagnosisCard" component={RelationshipDiagnosisCard} options={{ headerShown: false }} />
      <MainStack.Screen name="RelationshipDiagnosisCard1" component={RelationshipDiagnosisCard1} options={{ headerShown: false }} />
      <MainStack.Screen name="RelationshipDiagnosisCard2" component={RelationshipDiagnosisCard2} options={{ headerShown: false }} />
      <MainStack.Screen name="RelationshipDiagnosisCard3" component={RelationshipDiagnosisCard3} options={{ headerShown: false }} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
