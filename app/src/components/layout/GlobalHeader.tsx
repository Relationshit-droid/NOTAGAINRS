import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import * as Haptics from 'expo-haptics';

const loveActuallyLogo = require('../../../assets/logo/mainlogoone.png');

interface GlobalHeaderProps {
  progress?: number;
  title?: string;
  showProgress?: boolean;
}

const GlobalHeader = ({ 
  progress = 0, 
  title = "LOVE, ACTUALLY...", 
  showProgress = true 
}: GlobalHeaderProps) => {
  const handleLogoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      {/* Backdrop blur background with cosmic gradient */}
      <LinearGradient
        colors={[COLORS.arenaBgStart, COLORS.arenaBgEnd]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      {/* Neon divider line */}
      <View style={styles.neonDivider} />
      
      <View style={styles.content}>
        {/* Logo with cosmic glow */}
        <View style={styles.logoContainer}>
          <Image source={loveActuallyLogo} style={styles.logo} />
          <View style={styles.logoGlow} />
        </View>
        
        {/* Title with neon effect */}
        <Text style={styles.title}>{title}</Text>
        
        {/* Enhanced progress bar with cosmic theme */}
        {showProgress && (
          <View style={styles.progressSection}>
            <View style={styles.progressWrapper}>
              <View style={styles.progressContainer}>
                <LinearGradient
                  colors={[
                    COLORS.progressGradientStart,
                    COLORS.progressGradientMid1,
                    COLORS.progressGradientMid2,
                    COLORS.progressGradientEnd
                  ]}
                  style={[styles.progressBar, { width: `${progress}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              {/* Enhanced glow effect */}
              <LinearGradient
                colors={[
                  COLORS.progressGradientStart,
                  COLORS.progressGradientEnd
                ]}
                style={[styles.glow, { width: `${progress}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            
            {/* Progress percentage */}
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}
      </View>
      
      {/* Bottom neon divider */}
      <View style={styles.neonDividerBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    paddingTop: SPACING.safeTop || 50,
    overflow: 'hidden',
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  
  neonDivider: {
    height: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.3)',
    shadowColor: '#FCC738',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  
  neonDividerBottom: {
    height: 1,
    backgroundColor: 'rgba(234, 3, 31, 0.3)',
    shadowColor: '#EA031F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.regular,
  },
  
  logoContainer: {
    position: 'relative',
    marginRight: SPACING.regular,
  },
  
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  
  logoGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: 25,
    shadowColor: '#FCC738',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.black,
    fontSize: TYPOGRAPHY.fontSize.headerLarge,
    color: COLORS.textPrimary,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    textShadowColor: 'rgba(252, 199, 56, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    flex: 1,
  },
  
  progressSection: {
    flex: 2,
    marginLeft: SPACING.regular,
  },
  
  progressWrapper: {
    position: 'relative',
    marginBottom: SPACING.tiny,
  },
  
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(26, 11, 46, 0.6)',
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(252, 199, 56, 0.2)',
  },
  
  progressBar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.small,
  },
  
  glow: {
    position: 'absolute',
    height: 12,
    top: -2,
    borderRadius: BORDER_RADIUS.small,
    opacity: 0.6,
    shadowColor: COLORS.progressGradientStart,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  
  progressText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 2,
  },
});

export default GlobalHeader;
