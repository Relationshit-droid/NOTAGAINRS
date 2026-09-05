import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';
import { RadialGradient } from 'expo-linear-gradient'; 
import { useGameContent } from '../../lib/useGameContent';
import GlobalHeader from '../../components/layout/GlobalHeader';
import MarcieHost from '../../components/gameplay/MarcieHost';
import { ScreenLayout, Typography } from '../../components/ui';
import { COLORS } from '../../theme';

// A map to associate game IDs with their specific assets
const gameAssetMap: Record<string, any[]> = {
  '6-second-hug': [
    require('../../../assets/images/hugging_couple.png'),
    require('../../../assets/lottie/marcie_talking.json')
  ],
  'slap-of-truth': [
    require('../../../assets/images/truth_slap_icon.png'),
    require('../../../assets/lottie/marcie_judging.json')
  ],
  // ... other games
};

interface GameWrapperProps {
  coupleId: string;
  gameSessionId: string;
}

const GameWrapper = ({ coupleId, gameSessionId }: GameWrapperProps) => {
  const { gameContent, isLoading, error } = useGameContent(coupleId, gameSessionId);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Asset Preloading Hook
  useEffect(() => {
    const preloadAssets = async () => {
      if (!gameContent) return;

      const assetsToLoad = gameAssetMap[gameContent.id] || [];
      // Also preload the idle animation for Marcie, which is common to all games
      assetsToLoad.push(require('../../../assets/lottie/marcie_idle.json'));

      if (assetsToLoad.length > 0) {
        await Asset.loadAsync(assetsToLoad);
      }
      setAssetsLoaded(true);
    };

    preloadAssets();
  }, [gameContent]);

  if (isLoading || !assetsLoaded) {
    // You can return a loading spinner or a splash screen here
    return null; 
  }

  if (error) {
    return (
      <ScreenLayout showHeader={false} scrollable={true}>
        <Typography variant="body" color={COLORS.textPrimary}>{error}</Typography>
      </ScreenLayout>
    );
  }

  const themeColor = gameContent.ui_theme_color || COLORS.healingHospital;

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <RadialGradient
        style={StyleSheet.absoluteFill}
        colors={[`${themeColor}50`, COLORS.backgroundPrimary]}
        stops={[0.1, 0.7]}
        center={[0.5, 0.2]}
      />
      <GlobalHeader progress={50} /> 
      <View style={styles.hostContainer}>
        <MarcieHost state={'talking'} />
      </View>
      {/* Your actual game components will go here */}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  hostContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GameWrapper;
