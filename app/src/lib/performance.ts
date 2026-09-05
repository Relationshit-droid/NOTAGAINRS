/**
 * Performance Utilities
 * React.memo optimization, bundle splitting helpers
 */

import React, { memo, useMemo, useCallback } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Enhanced React.memo with custom comparison
 */
export function memoize<T extends React.ComponentType<any>>(
  Component: T,
  customComparison?: (prev: any, next: any) => boolean
): T {
  return memo(Component, customComparison) as T;
}

/**
 * Shallow equality comparison for props
 */
export function shallowEqual(prev: any, next: any): boolean {
  if (prev === next) return true;
  
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  
  if (prevKeys.length !== nextKeys.length) return false;
  
  for (const key of prevKeys) {
    if (prev[key] !== next[key]) return false;
  }
  
  return true;
}

/**
 * Deep equality comparison for complex props
 */
export function deepEqual(prev: any, next: any): boolean {
  if (prev === next) return true;
  
  if (typeof prev !== typeof next) return false;
  
  if (typeof prev !== 'object' || prev === null || next === null) {
    return prev === next;
  }
  
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  
  if (prevKeys.length !== nextKeys.length) return false;
  
  for (const key of prevKeys) {
    if (!nextKeys.includes(key)) return false;
    if (!deepEqual(prev[key], next[key])) return false;
  }
  
  return true;
}

/**
 * Schedule work after interactions
 */
export function scheduleAfterInteractions<T>(callback: () => T): Promise<T> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      resolve(callback());
    });
  });
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Measure component render time (dev only)
 */
export function measureRender<T extends React.ComponentType<any>>(
  Component: T,
  name: string
): T {
  if (!__DEV__) return Component;
  
  return React.forwardRef((props, ref) => {
    const startTime = performance.now();
    
    const result = React.createElement(Component, { ...props, ref });
    
    React.useEffect(() => {
      const endTime = performance.now();
      console.log(`[Render] ${name}: ${(endTime - startTime).toFixed(2)}ms`);
    });
    
    return result;
  }) as T;
}

/**
 * Hook for memoized callbacks
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

/**
 * Hook for memoized values with deep comparison
 */
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = React.useRef<{ deps: React.DependencyList; value: T } | null>(null);
  
  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() };
  }
  
  return ref.current.value;
}

/**
 * Virtual list item layout calculator
 */
export function getItemLayout(
  data: any[] | null | undefined,
  index: number,
  itemHeight: number
) {
  return {
    length: itemHeight,
    offset: itemHeight * index,
    index,
  };
}

/**
 * Batch array updates for performance
 */
export function batchArray<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Memory usage monitor (dev only)
 */
export function monitorMemoryUsage(label: string) {
  if (__DEV__ && global.performance && (performance as any).memory) {
    const memory = (performance as any).memory;
    console.log(`[Memory] ${label}:`, {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
}

/**
 * Generate unique IDs for list keys
 */
let idCounter = 0;
export function generateUniqueId(prefix = 'id'): string {
  return `${prefix}_${++idCounter}_${Date.now()}`;
}

/**
 * Optimize FlatList props for large datasets
 */
export const optimizedFlatListProps = {
  removeClippedSubviews: true,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 50,
  initialNumToRender: 10,
  windowSize: 5,
  getItemLayout: undefined, // Define per component based on item height
};

/**
 * Image size optimizer
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  height?: number,
  quality: number = 80
): string {
  // If using a CDN with image optimization
  if (url.includes('cloudinary.com')) {
    const transformations = `w_${width},q_${quality}`;
    return url.replace('/upload/', `/upload/${transformations}/`);
  }
  
  if (url.includes('imgix.net')) {
    const params = `?w=${width}&q=${quality}&auto=format`;
    return url + params;
  }
  
  return url;
}

export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
    img.src = url;
  });
}

export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map((url) => preloadImage(url)));
}

export default {
  memoize,
  shallowEqual,
  deepEqual,
  scheduleAfterInteractions,
  debounce,
  throttle,
  measureRender,
  useMemoizedCallback,
  useDeepMemo,
  getItemLayout,
  batchArray,
  monitorMemoryUsage,
  generateUniqueId,
  optimizedFlatListProps,
  getOptimizedImageUrl,
  preloadImage,
  preloadImages,
};
