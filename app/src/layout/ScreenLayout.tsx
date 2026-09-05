import React, { ReactNode } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme';
import { Header } from '../components/ui';
import DrMarcieOverlay, { MarcieAnimation, MarciePosition } from '../components/DrMarcieOverlay';

interface ScreenLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  scrollable?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  contentStyle?: any;
  headerVariant?: 'default' | 'transparent';
  onNavPress?: (screen: string) => void;
  showMarcie?: boolean;
  marcieQuote?: string;
  marcieAnimation?: MarcieAnimation;
  marciePosition?: MarciePosition;
}

export default function ScreenLayout({
  children,
  showHeader = true,
  scrollable = true,
  onRefresh,
  refreshing = false,
  contentStyle,
  headerVariant = 'default',
  onNavPress,
  showMarcie = false,
  marcieQuote,
  marcieAnimation = 'idle',
  marciePosition = 'bottom-right',
}: ScreenLayoutProps) {
  const content = (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {showHeader && (
        <Header 
          variant={headerVariant}
          onNavPress={onNavPress}
        />
      )}
      
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.vibrantPink}
                colors={[COLORS.vibrantPink]}
              />
            ) : undefined
          }
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}

      {showMarcie && (
        <DrMarcieOverlay 
          animation={marcieAnimation}
          quote={marcieQuote}
          visible={true}
          position={marciePosition}
          showBubble={!!marcieQuote}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge * 2, // Extra space for DrMarcieOverlay
  },
});
