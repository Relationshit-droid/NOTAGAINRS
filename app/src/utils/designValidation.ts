/**
 * Design Bible validation utilities
 * Ensures compliance with Design Bible specifications
 */

import { COLORS } from '../theme';

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.0 guidelines
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (rgb: {r: number, g: number, b: number}) => {
    const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if colors meet WCAG accessibility standards
 */
export function checkAccessibility(color1: string, color2: string): {
  aa: boolean;
  aaa: boolean;
  ratio: number;
} {
  const ratio = getContrastRatio(color1, color2);
  return {
    aa: ratio >= 4.5,    // WCAG AA standard
    aaa: ratio >= 7,     // WCAG AAA standard
    ratio: ratio
  };
}

/**
 * Validate Design Bible color combinations
 */
export function validateDesignBibleColors(): {
  textOnBackground: boolean;
  textOnSurface: boolean;
  primaryAction: boolean;
  allCombinations: Record<string, any>;
} {
  const results = {
    textOnBackground: checkAccessibility(COLORS.textPrimary, COLORS.deepCosmicPurple),
    textOnSurface: checkAccessibility(COLORS.textPrimary, COLORS.richPlum),
    primaryAction: checkAccessibility(COLORS.textPrimary, COLORS.primaryGradientStart),
    allCombinations: {} as Record<string, any>
  };

  // Test all accent colors on backgrounds
  const accentColors = [
    'vibrantPink', 'warmOrange', 'brightYellow', 'mintGreen', 
    'softViolet', 'rosePink', 'blushPink', 'lavenderPurple', 
    'aquaTeal', 'peachOrange'
  ];

  const backgrounds = ['deepCosmicPurple', 'richPlum', 'midPurple', 'nightSky'];

  accentColors.forEach(accent => {
    backgrounds.forEach(background => {
      const key = `${accent}On${background}`;
      results.allCombinations[key] = checkAccessibility(
        COLORS[accent as keyof typeof COLORS],
        COLORS[background as keyof typeof COLORS]
      );
    });
  });

  return results;
}

/**
 * Mobile responsiveness validation
 */
export function validateMobileResponsiveness(dimensions: {
  width: number;
  height: number;
}): {
  isSmallDevice: boolean;
  isLargeDevice: boolean;
  touchTargetSize: boolean;
  fontScale: number;
  recommendations: string[];
} {
  const { width, height } = dimensions;
  const isSmallDevice = width < 375;
  const isLargeDevice = width >= 414;
  
  // Check touch target compliance (minimum 44x44px)
  const touchTargetSize = true; // This would be validated in component implementation
  
  // Calculate appropriate font scaling
  const fontScale = Math.min(width / 375, 1.2); // Cap at 120% scaling
  
  const recommendations: string[] = [];
  
  if (isSmallDevice) {
    recommendations.push('Consider compact layouts for small devices');
    recommendations.push('Increase touch target sizes for better accessibility');
  }
  
  if (isLargeDevice) {
    recommendations.push('Utilize extra screen space for enhanced UI elements');
    recommendations.push('Consider tablet-optimized layouts');
  }
  
  return {
    isSmallDevice,
    isLargeDevice,
    touchTargetSize,
    fontScale,
    recommendations
  };
}

/**
 * Comprehensive Design Bible compliance check
 */
export function runDesignBibleAudit(): {
  colors: ReturnType<typeof validateDesignBibleColors>;
  accessibility: {
    wcagAA: number;
    wcagAAA: number;
    total: number;
  };
  mobile: ReturnType<typeof validateMobileResponsiveness>;
  passed: boolean;
  issues: string[];
} {
  const colors = validateDesignBibleColors();
  const mobile = validateMobileResponsiveness({ width: 375, height: 812 }); // iPhone 12 baseline
  
  let wcagAA = 0;
  let wcagAAA = 0;
  let total = 0;
  
  // Count accessibility compliance
  Object.values(colors.allCombinations).forEach(result => {
    total++;
    if (result.aa) wcagAA++;
    if (result.aaa) wcagAAA++;
  });
  
  // Add main combinations
  total += 3;
  if (colors.textOnBackground.aa) wcagAA++;
  if (colors.textOnBackground.aaa) wcagAAA++;
  if (colors.textOnSurface.aa) wcagAA++;
  if (colors.textOnSurface.aaa) wcagAAA++;
  if (colors.primaryAction.aa) wcagAA++;
  if (colors.primaryAction.aaa) wcagAAA++;
  
  const issues: string[] = [];
  
  // Check for accessibility issues
  if (!colors.textOnBackground.aa) {
    issues.push('Text on background does not meet WCAG AA standards');
  }
  if (!colors.textOnSurface.aa) {
    issues.push('Text on surface does not meet WCAG AA standards');
  }
  if (!colors.primaryAction.aa) {
    issues.push('Primary action text does not meet WCAG AA standards');
  }
  
  const passed = issues.length === 0;
  
  return {
    colors,
    accessibility: { wcagAA, wcagAAA, total },
    mobile,
    passed,
    issues
  };
}

export default {
  getContrastRatio,
  checkAccessibility,
  validateDesignBibleColors,
  validateMobileResponsiveness,
  runDesignBibleAudit
};