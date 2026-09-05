import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, TYPOGRAPHY } from '../theme';
import Svg, { LinearGradient, Defs, Stop, Circle, Path, Rect } from 'react-native-svg';

import HomeScreen from '../screens/HomeScreen';
import MainGameLibrary from '../screens/MainGameLibrary';
import SOSScreen from '../screens/sos/SOSScreen';
import PartnerTranslator from '../screens/dashboard/PartnerTranslator';
import LoveArcadeHub from '../screens/LoveArcadeHub';
import DateNightRoulette from '../screens/games/DateNightRoulette';
import ProfileScreen from '../screens/dashboard/ProfileScreen';

const Tab = createBottomTabNavigator();

type TabName = 'Home' | 'Games' | 'SOS' | 'Translator' | 'LoveArcade' | 'RomanceHub' | 'Profile';

const TAB_CONFIG: Record<TabName, { label: string; icon: string }> = {
  Home: { label: 'HOME', icon: '🏠' },
  Games: { label: 'GAMES', icon: '🎮' },
  SOS: { label: 'SOS', icon: '🆘' },
  Translator: { label: 'DECODER', icon: '🔍' },
  LoveArcade: { label: 'ARCADE', icon: '🕹️' },
  RomanceHub: { label: 'ROMANCE', icon: '💘' },
  Profile: { label: 'PROFILE', icon: '👤' },
};

function TabBarIcon({ icon }: { icon: string }) {
  return <Text style={styles.tabIcon}>{icon}</Text>;
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const isSOSActive = state.index === 2;

  return (
    <View style={[styles.tabContainer, isSOSActive && styles.tabContainerActive]}>
      <View style={styles.tabBackground} />
      
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined
          ? options.title
          : TAB_CONFIG[route.name as TabName]?.label || route.name;
        
        const isFocused = state.index === index;
        const isSOSTab = route.name === 'SOS';
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const config = TAB_CONFIG[route.name as TabName] || { label, icon: '•' };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={config.label}
            testID={`tab-${route.name.toLowerCase()}`}
            onPress={onPress}
            style={[
              styles.tabButton,
              isSOSTab && styles.sosTabButton,
              isFocused && !isSOSTab && styles.tabButtonActive,
              isFocused && isSOSTab && styles.tabButtonSOSActive,
            ]}
            activeOpacity={0.7}
          >
            {isSOSTab ? (
              <View style={styles.sosIconContainer}>
                <Svg width="28" height="28" viewBox="0 0 28 28">
                  <Defs>
                    <LinearGradient id="sosGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor={COLORS.primaryGradientStart} />
                      <Stop offset="100%" stopColor={COLORS.primaryGradientEnd} />
                    </LinearGradient>
                  </Defs>
                  <Circle cx="14" cy="14" r="10" fill="url(#sosGradient)" />
                  <Text x="14" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    !
                  </Text>
                </Svg>
              </View>
            ) : (
              <TabBarIcon icon={config.icon} />
            )}
            {!isSOSTab && (
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? COLORS.textPrimary : COLORS.textDisabled },
                isFocused && styles.tabLabelActive
              ]}>
                {config.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'HOME' }}
      />
      <Tab.Screen
        name="Games"
        component={MainGameLibrary}
        options={{ title: 'GAMES' }}
      />
      <Tab.Screen
        name="SOS"
        component={SOSScreen}
        options={{ title: 'SOS' }}
      />
      <Tab.Screen
        name="Translator"
        component={PartnerTranslator}
        options={{ title: 'DECODER' }}
      />
      <Tab.Screen
        name="LoveArcade"
        component={LoveArcadeHub}
        options={{ title: 'ARCADE' }}
      />
      <Tab.Screen
        name="RomanceHub"
        component={DateNightRoulette}
        options={{ title: 'ROMANCE' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'PROFILE' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 11, 46, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    height: Platform.OS === 'ios' ? 85 : 70,
    position: 'relative',
  },
  tabContainerActive: {
    borderTopColor: COLORS.error,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 11, 46, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(219, 20, 124, 0.15)',
  },
  sosTabButton: {
    position: 'relative',
    top: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 'auto',
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundPrimary,
    borderColor: COLORS.primaryGradientStart,
    borderWidth: 2,
    shadowColor: COLORS.primaryGradientStart,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  tabButtonSOSActive: {
    transform: [{ scale: 1.1 }],
  },
  sosIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tabLabelActive: {
    fontSize: 12,
    fontWeight: '600',
  },
});
