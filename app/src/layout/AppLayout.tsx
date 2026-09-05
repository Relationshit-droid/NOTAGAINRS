import React, { ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, SPACING } from '../theme';
import { RadialGradientBackground } from '../components/ui';
import DrMarcieOverlay from '../components/DrMarcieOverlay';

interface AppLayoutProps {
  children: ReactNode;
  showBackground?: boolean;
  backgroundVariant?: 'default' | 'dark' | 'purple';
  showMarcie?: boolean;
  marcieQuote?: string;
  marcieAnimation?: 'idle' | 'intro' | 'thinking' | 'celebrate';
  safeArea?: boolean;
  statusBarStyle?: 'light' | 'dark';
}

export default function AppLayout({
  children,
  showBackground = true,
  backgroundVariant = 'default',
  showMarcie = true,
  marcieQuote,
  marcieAnimation = 'idle',
  safeArea = true,
  statusBarStyle = 'light',
}: AppLayoutProps) {
  const content = (
    <View style={styles.container}>
      {showBackground && (
        <RadialGradientBackground variant={backgroundVariant} />
      )}
      
      <View style={styles.content}>
        {children}
      </View>
      
      {showMarcie && (
        <DrMarcieOverlay
          animation={marcieAnimation}
          quote={marcieQuote}
          showBubble={!!marcieQuote}
          position="bottom-right"
          size="medium"
        />
      )}
    </View>
  );

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.backgroundPrimary}
        translucent={false}
      />
      {safeArea ? (
        <SafeAreaView style={styles.safeArea}>
          {content}
        </SafeAreaView>
      ) : (
        content
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
