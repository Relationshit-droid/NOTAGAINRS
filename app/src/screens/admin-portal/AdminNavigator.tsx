
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminLoginScreen from './AdminLoginScreen';
import AdminDashboard from './AdminDashboard';
import AdminGameCMSListView from './AdminGameCMSListView';
import AdminGameEditorScreen from './AdminGameEditorScreen';
import AdminFightModerationQueue from './AdminFightModerationQueue';
import AdminPromptEngineeringConsole from './AdminPromptEngineeringConsole';

const AdminStack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <AdminStack.Navigator initialRouteName="AdminLogin">
      <AdminStack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }} />
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
      <AdminStack.Screen name="AdminGameCMS" component={AdminGameCMSListView} options={{ headerShown: false }} />
      <AdminStack.Screen name="AdminGameEditor" component={AdminGameEditorScreen} options={{ headerShown: false }} />
      <AdminStack.Screen name="AdminSOSControl" component={AdminFightModerationQueue} options={{ headerShown: false }} />
      <AdminStack.Screen name="AdminPuppetMaster" component={AdminPromptEngineeringConsole} options={{ headerShown: false }} />
    </AdminStack.Navigator>
  );
};

export default AdminNavigator;
