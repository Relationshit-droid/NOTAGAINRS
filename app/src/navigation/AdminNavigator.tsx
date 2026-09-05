import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../theme';

// Admin Screens
import AdminLoginScreen from '../screens/admin-portal/AdminLoginScreen';
import AdminDashboard from '../screens/admin-portal/AdminDashboard';
import AdminGameCMSListView from '../screens/admin-portal/AdminGameCMSListView';
import AdminGameEditorScreen from '../screens/admin-portal/AdminGameEditorScreen';
import AdminFightModerationQueue from '../screens/admin-portal/AdminFightModerationQueue';
import AdminUserManagement from '../screens/admin-portal/AdminUserManagement';
import AdminGlobalConfig from '../screens/admin-portal/AdminGlobalConfig';
import AdminPushComposer from '../screens/admin-portal/AdminPushComposer';

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
