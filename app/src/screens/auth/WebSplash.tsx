import React from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { LOGO_IMAGES } from '../../constants/assetManifest';
import { Typography, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

export default function WebSplash() {
  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <RadialGradientBackground />
      <View style={styles.content}>
        <Image source={LOGO_IMAGES[0]} style={styles.logo} resizeMode="contain" />
        <Typography variant="header" style={styles.title}>Love, Actually... The Game</Typography>
        <Typography variant="body" style={styles.subtitle}>How About We Don't Break Up?</Typography>
        
        <View style={styles.buttons}>
          <SquishyButton onPress={() => Linking.openURL('https://trae.ai')}>
            <Typography variant="button">Download App</Typography>
          </SquishyButton>
        </View>
        
        <Typography variant="caption" style={styles.footer}>Preview Mode • Web</Typography>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xlarge,
    padding: SPACING.screenPadding,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    color: COLORS.vibrantPink,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.romanceHub,
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
  buttons: {
    gap: SPACING.regular,
    width: '100%',
    maxWidth: 300,
  },
  footer: {
    marginTop: SPACING.xxlarge,
    color: COLORS.textHint,
  },
});
