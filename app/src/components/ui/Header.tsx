import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import Text from './Typography';

type HeaderProps = {
  showNav?: boolean;
  onNavPress?: (screen: string) => void;
  variant?: 'default' | 'transparent';
};

const Header = ({ showNav = true, onNavPress, variant = 'default' }: HeaderProps) => {
  const navItems = [
    { label: 'How to Play', screen: 'HowToPlay' },
    { label: 'Nebula Guide', screen: 'NebulaGuide' },
    { label: 'About Us', screen: 'AboutUs' },
  ];

  return (
    <View style={[
      styles.headerContainer,
      variant === 'transparent' && styles.transparentHeader
    ]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo/mainlogo.png')}
          style={styles.logoMark}
          resizeMode="contain"
          accessibilityLabel="RELATIONSHIT! logo"
        />
        <Text variant="header" style={styles.logoText}>
          RELATIONSHIT!
        </Text>
      </View>
      
      {showNav && (
        <View style={styles.navContainer}>
          {navItems.map((item) => (
            <TouchableOpacity 
              key={item.screen}
              onPress={() => onNavPress?.(item.screen)}
              style={styles.navButton}
            >
              <Text variant="caption" style={styles.navText}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.deepCosmic,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  logoMark: {
    width: 28,
    height: 28,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  logoText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  navContainer: {
    flexDirection: 'row',
    gap: SPACING.large,
  },
  navButton: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.small,
  },
  navText: {
    color: COLORS.textSecondary,
    opacity: 0.8,
  },
});

export default Header;
