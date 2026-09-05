import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { GlassCard, Typography, ScreenLayout } from '../../components/ui';
import GlobalMarcieOverlay from '../../components/ai-host/GlobalMarcieOverlay';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

const VibeSyncScreen = () => {
  const [syncProgress, setSyncProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate the sync progress
    Animated.timing(syncProgress, {
      toValue: 100,
      duration: ANIMATIONS.duration.slower * 3, // 2100ms, close to original 2000ms
      useNativeDriver: false, // Cannot use native driver for color interpolation
    }).start();
  }, []);

  const ring1Rotation = syncProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
  });

  const ring2Rotation = syncProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '-360deg'],
  });

  const syncColor = syncProgress.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [COLORS.emotionalConnection, COLORS.warning, COLORS.success]
  })

  return (
    <ScreenLayout showHeader={true} scrollable={false}>
      <View style={styles.content}>
        <Typography variant="h1" center>Synchronize Your Vibes</Typography>
        <Typography variant="body" center style={styles.subtitle}>Tap and hold when you feel the connection</Typography>

        <View style={styles.syncContainer}>
          <Animated.View style={[styles.ring, { transform: [{ rotate: ring1Rotation }] }]} />
          <Animated.View style={[styles.ring, styles.ring2, { transform: [{ rotate: ring2Rotation }] }]} />
          <Animated.Text style={[styles.syncPercentage, {color: syncColor}]}>
            {/* This would be bound to a real-time value */}
            88%
          </Animated.Text>
        </View>

        <View style={styles.playerTagsContainer}>
            <View style={styles.playerTag}>
              <Typography variant="caption">You</Typography>
            </View>
            <View style={styles.playerTag}>
              <Typography variant="caption">Partner</Typography>
            </View>
        </View>
      </View>
      <GlobalMarcieOverlay quote="Feel the rhythm? That's your connection strengthening."/>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: SPACING.screenPadding 
  },
  syncContainer: {
    width: '80%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 5,
    borderColor: COLORS.emotionalConnection,
    borderTopColor: 'transparent',
    borderBottomColor: COLORS.success,
  },
  ring2: {
      width: '80%',
      height: '80%',
      borderRadius: BORDER_RADIUS.round,
      borderColor: COLORS.success,
      borderTopColor: COLORS.emotionalConnection,
      borderBottomColor: 'transparent',
  },
  syncPercentage: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.displayLarge * 2.25,
  },
  playerTagsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: SPACING.xlarge,
      marginTop: SPACING.xxlarge,
  },
  playerTag: {
      backgroundColor: COLORS.backgroundInput,
      paddingHorizontal: SPACING.xlarge,
      paddingVertical: SPACING.small,
      borderRadius: BORDER_RADIUS.xlarge,
  },
  subtitle: {
      marginBottom: SPACING.xxlarge,
  }
});

export default VibeSyncScreen;
