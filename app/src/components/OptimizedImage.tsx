/**
 * Optimized Image Component
 * Caching, progressive loading, and memory management
 */

import React, { memo, useState, useCallback } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

interface OptimizedImageProps {
  source: { uri: string } | number;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  placeholder?: { uri: string } | number;
  cacheKey?: string;
  priority?: 'low' | 'normal' | 'high';
  onLoad?: () => void;
  onError?: () => void;
}

// Use Expo Image for better performance if available
const isExpoImageAvailable = !!ExpoImage;

export const OptimizedImage = memo(function OptimizedImage({
  source,
  style,
  resizeMode = 'cover',
  placeholder,
  cacheKey,
  priority = 'normal',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Use Expo Image for better caching and performance
  if (isExpoImageAvailable && typeof source === 'object' && 'uri' in source) {
    return (
      <ExpoImage
        source={source.uri}
        style={style}
        contentFit={resizeMode}
        cachePolicy="memory-disk"
        transition={200}
        placeholder={placeholder}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  // Fallback to React Native Image
  return (
    <View style={[style, styles.container]}>
      <Image
        source={source}
        style={[StyleSheet.absoluteFill, { resizeMode }]}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color="#FA1F63" />
        </View>
      )}
      {hasError && (
        <View style={styles.errorOverlay}>
          {/* Show placeholder or error state */}
        </View>
      )}
    </View>
  );
});

// Preload images into cache
export function preloadImages(uris: string[]): void {
  if (isExpoImageAvailable) {
    // Expo Image prefetch
    uris.forEach(uri => {
      ExpoImage.prefetch(uri);
    });
  } else {
    // RN Image prefetch
    uris.forEach(uri => {
      Image.prefetch(uri);
    });
  }
}

// Clear image cache
export function clearImageCache(): void {
  if (isExpoImageAvailable) {
    ExpoImage.clearMemoryCache();
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a4a',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3a1a2a',
  },
});

export default OptimizedImage;
