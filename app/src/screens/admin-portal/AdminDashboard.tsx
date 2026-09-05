
import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useAppStore } from '../../state/store';
import { auth } from '../../lib/firebaseClient';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const AdminDashboard = () => {
  const navigation = useAppNavigation();
  const setAdmin = useAppStore((s) => s.setAdmin);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setAdmin(false);
    });
  };

  const menuItems = [
    { title: 'Game Content CMS', screen: 'AdminGameCMSListView', icon: '🎮' },
    { title: 'SOS Fight Queue', screen: 'AdminFightModerationQueue', icon: '⚔️' },
    { title: 'User Management', screen: 'AdminUserManagement', icon: '👥' },
    { title: 'Global AI Config', screen: 'AdminGlobalConfig', icon: '⚙️' },
    { title: 'Push Notification Composer', screen: 'AdminPushComposer', icon: '📬' },
  ];

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo/mainlogoone.png')} style={styles.logo} />
        </View>
        <Typography variant="h1" center style={styles.title}>
          Puppet Master Portal
        </Typography>
        <ScrollView contentContainerStyle={styles.menuContainer}>
          {menuItems.map((item) => (
            <SquishyButton
              key={item.title}
              onPress={() => navigation.navigate(item.screen)}
              accessibilityLabel={item.title}
              variant="secondary"
              size="large"
              style={styles.menuItem}
            >
              <View style={styles.menuItemContent}>
                <Typography variant="body" style={styles.menuIcon}>
                  {item.icon}
                </Typography>
                <Typography variant="body" style={styles.menuText}>
                  {item.title}
                </Typography>
              </View>
            </SquishyButton>
          ))}
        </ScrollView>
        <SquishyButton
          onPress={handleLogout}
          accessibilityLabel="Logout"
          variant="primary"
          size="medium"
          style={styles.logoutButton}
        >
          <Typography variant="button" color={COLORS.textPrimary}>
            Logout
          </Typography>
        </SquishyButton>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.healingHospital,
    paddingTop: SPACING.xxlarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    color: COLORS.emotionalConnection,
    marginBottom: SPACING.xlarge,
  },
  menuContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.regular,
  },
  menuItem: {
    width: '100%',
    marginBottom: SPACING.regular,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  menuIcon: {
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    marginRight: SPACING.regular,
  },
  menuText: {
    fontFamily: 'SweetPink-Regular',
    color: COLORS.textPrimary,
  },
  logoutButton: {
    margin: SPACING.regular,
  },
});

export default AdminDashboard;
