import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../theme';

// Admin Screens
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboard from '../screens/AdminDashboard';
import AdminGameCMSListView from '../screens/AdminGameCMSListView';
import AdminGameEditorScreen from '../screens/AdminGameEditorScreen';
import AdminFightModerationQueue from '../screens/AdminFightModerationQueue';
import AdminUserManagement from '../screens/AdminUserManagement';
import AdminGlobalConfig from '../screens/AdminGlobalConfig';
import AdminPushComposer from '../screens/AdminPushComposer';

const AdminStack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <AdminStack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: {
          backgroundColor: COLORS.backgroundPrimary,
        },
      }}
    >
      <AdminStack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <AdminStack.Screen name="AdminGameCMS" component={AdminGameCMSListView} />
      <AdminStack.Screen name="AdminGameEditor" component={AdminGameEditorScreen} />
      <AdminStack.Screen name="AdminSOS" component={AdminFightModerationQueue} />
      <AdminStack.Screen name="AdminUserManagement" component={AdminUserManagement} />
      <AdminStack.Screen name="AdminGlobalConfig" component={AdminGlobalConfig} />
      <AdminStack.Screen name="AdminPushComposer" component={AdminPushComposer} />
    </AdminStack.Navigator>
  );
};

export default AdminNavigator;
