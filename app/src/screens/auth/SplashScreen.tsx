import { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeIn } from 'react-native-reanimated';
import { GlassCard, Typography, RadialGradientBackground, SquishyButton } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenProps = {
  onStart: () => void;
  onLogin?: () => void;
};

export default function SplashScreen({ onStart, onLogin }: SplashScreenProps) {
  const [videoFinished, setVideoFinished] = useState(false);
  const videoRef = useRef<Video>(null);
  const marcieVideoAsset = Asset.fromModule(require('../../../public/animations/marcie-intro.webm'));

  const pulse = useSharedValue(1);
  const float = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
    float.value = withRepeat(withTiming(-10, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);

    (async () => {
      const hasSeenIntro = await AsyncStorage.getItem('hasSeenMarcieIntro');
      if (hasSeenIntro) {
        setVideoFinished(true);
      }
    })();
  }, []);

  const handleVideoEnd = async () => {
    await AsyncStorage.setItem('hasSeenMarcieIntro', 'true');
    setVideoFinished(true);
  };

  const animatedPulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const animatedFloatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: float.value }] }));

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <RadialGradientBackground />
      
      {!videoFinished ? (
        <Video
          ref={videoRef}
          source={{ uri: marcieVideoAsset.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              handleVideoEnd();
            }
          }}
        />
      ) : (
        <Animated.View style={styles.contentContainer} entering={FadeIn.duration(1000)}>
            <View style={styles.header}>
                <Image source={require('../../../public/logos/logo-light.png')} style={styles.headerLogo} resizeMode="contain" />
            </View>

            <View style={styles.centerContent}>
                <Animated.View style={[styles.logoContainer, animatedFloatStyle]}>
                    <Image source={require('../../../public/logos/logo-symbol-glow.png')} style={styles.logo} resizeMode="contain" />
                </Animated.View>
                <Typography variant="gameTitle" style={styles.gameTitle}>LOVE ACTUALLY...</Typography>
                <Typography variant="body" style={styles.tagline}>The game for couples who want to fight better.</Typography>
            </View>

            <SquishyButton onPress={() => { Haptics.selectionAsync(); onStart(); }} style={styles.startButton}>
                <Animated.View style={animatedPulseStyle}>
                    <Typography variant="button" style={styles.pressStart}>PRESS TO START</Typography>
                </Animated.View>
            </SquishyButton>

            <View style={styles.footer}>
                <Typography variant="caption" style={styles.footerText}>A new way to connect.</Typography>
            </View>
        </Animated.View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: SPACING.xxlarge,
      paddingHorizontal: SPACING.screenPadding,
  },
  header: {
      position: 'absolute',
      top: 60,
      alignItems: 'center',
  },
  headerLogo: {
      width: 150,
      height: 40,
      resizeMode: 'contain',
  },
  centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  logoContainer: {
    ...SHADOWS.neonStrong,
  },
  logo: {
    width: 200,
    height: 200,
  },
  gameTitle: {
    marginTop: SPACING.large,
    letterSpacing: 8,
  },
  tagline: {
    marginTop: SPACING.small,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  startButton: {
      position: 'absolute',
      bottom: 120,
  },
  pressStart: {
    color: COLORS.brightYellow,
    textShadowColor: COLORS.warmOrange,
    textShadowRadius: 15,
  },
  footer: {
      position: 'absolute',
      bottom: 50,
  },
  footerText: {
      color: COLORS.textHint,
  }
});
