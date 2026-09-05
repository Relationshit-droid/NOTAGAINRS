import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, ANIMATIONS } from '../theme';

/**
 * ThemeMapper - Utility for consistent design token usage across the application
 * Maps design tokens to NativeWind classes and React Native styles
 */

// Color token mapper
export const ColorTokens = {
  // Primary gradients
  primaryButton: 'from-primary-gradient-start to-primary-gradient-end',
  primaryButtonBg: COLORS.primaryGradientStart,
  primaryButtonEnd: COLORS.primaryGradientEnd,
  
  // Avatar ring
  avatarRing: 'from-profile-ring-start via-profile-ring-mid to-profile-ring-end',
  avatarRingStart: COLORS.avatarRingStart,
  avatarRingMid: COLORS.avatarRingMid,
  avatarRingEnd: COLORS.avatarRingEnd,
  
  // Progress bars
  progressBar: 'from-progress-gradient-start via-progress-gradient-mid1 via-progress-gradient-mid2 to-progress-gradient-end',
  progressStart: COLORS.progressGradientStart,
  progressMid1: COLORS.progressGradientMid1,
  progressMid2: COLORS.progressGradientMid2,
  progressEnd: COLORS.progressGradientEnd,
  
  // Arena background
  arenaBg: 'from-arena-bg-start to-arena-bg-end',
  arenaStart: COLORS.arenaBgStart,
  arenaEnd: COLORS.arenaBgEnd,
  
  // UI Colors
  background: COLORS.deepCosmicPurple,
  surface: COLORS.richPlum,
  card: 'bg-card', // Using Tailwind class for rgba(45, 25, 80, 0.7)
  cardBg: 'rgba(45, 25, 80, 0.7)',
  
  // Text colors
  textPrimary: COLORS.textPrimary,
  textSecondary: COLORS.textSecondary,
  textHint: COLORS.textHint,
  
  // Status colors
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  info: COLORS.info,
  
  // Accent colors
  accentPink: COLORS.vibrantPink,
  accentOrange: COLORS.warmOrange,
  accentYellow: COLORS.brightYellow,
  accentTeal: COLORS.mintGreen,
  accentViolet: COLORS.softViolet,
  accentRose: COLORS.rosePink,
};

// Typography token mapper
export const TypographyTokens = {
  // Font families
  fontBlack: 'font-inter-black',
  fontBold: 'font-inter-bold',
  fontSemiBold: 'font-inter-semibold',
  fontMedium: 'font-inter-medium',
  fontRegular: 'font-inter-regular',
  fontLight: 'font-inter-light',
  
  // Font sizes
  displayLarge: 'text-mobile-header',
  displayMedium: 'text-[28px]',
  displaySmall: 'text-[24px]',
  headerLarge: 'text-[20px]',
  headerMedium: 'text-[18px]',
  headerSmall: 'text-[16px]',
  bodyLarge: 'text-[16px]',
  bodyMedium: 'text-mobile-body',
  bodySmall: 'text-[12px]',
  
  // Line heights
  leadingTight: 'leading-tight',
  leadingNormal: 'leading-normal',
  leadingRelaxed: 'leading-relaxed',
  
  // Letter spacing
  trackingTight: 'tracking-tight',
  trackingNormal: 'tracking-normal',
  trackingWide: 'tracking-wide',
};

// Spacing token mapper
export const SpacingTokens = {
  // Micro spacing
  micro: 'p-0.5', // 2px
  tiny: 'p-1',    // 4px
  small: 'p-2',   // 8px
  medium: 'p-3',  // 12px
  regular: 'p-4', // 16px
  large: 'p-5',   // 20px
  xlarge: 'p-6',  // 24px
  xxlarge: 'p-8', // 32px
  xxxlarge: 'p-12', // 48px
  
  // Component-specific
  buttonPadding: 'px-6 py-4', // 24px horizontal, 16px vertical
  cardPadding: 'p-5', // 20px
  screenPadding: 'p-6', // 24px
  sectionPadding: 'p-8', // 32px
};

// Border radius token mapper
export const BorderRadiusTokens = {
  button: 'rounded-button', // 16px
  card: 'rounded-card',     // 16px
  avatar: 'rounded-full',   // 9999px
  small: 'rounded',         // 4px
  medium: 'rounded-md',     // 8px
  large: 'rounded-lg',      // 12px
  xlarge: 'rounded-xl',     // 20px
  round: 'rounded-full',    // 9999px
};

// Shadow token mapper
export const ShadowTokens = {
  // Neon shadows
  neon: 'shadow-neon',
  neonSoft: 'shadow-neon-soft',
  neonStrong: 'shadow-neon-strong',
  
  // Cosmic shadows
  cosmic: 'shadow-cosmic-glow',
  
  // Standard shadows
  small: 'shadow-sm',
  medium: 'shadow-md',
  large: 'shadow-lg',
  
  // React Native shadow styles
  neonStyle: SHADOWS.neon,
  neonSoftStyle: SHADOWS.neonSoft,
  neonStrongStyle: SHADOWS.neonStrong,
  cosmicStyle: SHADOWS.cosmic,
  retroStyle: SHADOWS.retro,
};

// Animation token mapper
export const AnimationTokens = {
  // Spin animations
  spinSlow: 'animate-spin-slow',
  
  // Pulse animations
  pulseNeon: 'animate-pulse-neon',
  
  // Float animations
  float: 'animate-float',
  
  // Liquid fill animation
  liquidFill: 'animate-liquid-fill',
  
  // React Native animation configs
  fadeIn: ANIMATIONS.fadeIn,
  slideUp: ANIMATIONS.slideUp,
  scaleIn: ANIMATIONS.scaleIn,
  floatStyle: ANIMATIONS.float,
  pulseNeonStyle: ANIMATIONS.pulseNeon,
  liquidFillStyle: ANIMATIONS.liquidFill,
};

// Background gradient token mapper
export const BackgroundTokens = {
  // Primary button gradient
  primaryButton: 'bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end',
  
  // Avatar ring gradient
  avatarRing: 'bg-conic-gradient from-profile-ring-start via-profile-ring-mid to-profile-ring-end',
  
  // Progress bar gradient
  progressBar: 'bg-gradient-to-r from-progress-gradient-start via-progress-gradient-mid1 via-progress-gradient-mid2 to-progress-gradient-end',
  
  // Arena background
  arenaBg: 'bg-gradient-to-b from-arena-bg-start to-arena-bg-end',
  
  // Cosmic splash
  cosmicSplash: 'bg-gradient-to-br from-arena-bg-start via-arena-bg-end to-primary-gradient-start',
  
  // React Native gradient colors
  primaryButtonColors: [COLORS.primaryGradientStart, COLORS.primaryGradientEnd],
  progressBarColors: [COLORS.progressGradientStart, COLORS.progressGradientMid1, COLORS.progressGradientMid2, COLORS.progressGradientEnd],
  arenaBgColors: [COLORS.arenaBgStart, COLORS.arenaBgEnd],
};

// Component-specific token combinations
export const ComponentTokens = {
  // Primary Button
  primaryButton: [
    BackgroundTokens.primaryButton,
    BorderRadiusTokens.button,
    ShadowTokens.neon,
    SpacingTokens.buttonPadding,
    'active:scale-95 transition-transform',
  ].join(' '),
  
  // Game Card
  gameCard: [
    'bg-card',
    BorderRadiusTokens.card,
    ShadowTokens.cosmic,
    SpacingTokens.cardPadding,
    'border border-white/10',
  ].join(' '),
  
  // Global Header
  globalHeader: [
    'bg-background/80',
    'backdrop-blur-xl',
    'border-b border-accent-yellow/20',
    'sticky top-0 z-header',
  ].join(' '),
  
  // Marcie Host
  marcieHost: [
    'absolute z-marcie',
    'shadow-cosmic-glow',
    'animate-float',
  ].join(' '),
  
  // Trust Thermometer
  trustThermometer: [
    BackgroundTokens.progressBar,
    BorderRadiusTokens.large,
    'h-4 overflow-hidden',
  ].join(' '),
  
  // SOS Button
  sosButton: [
    BackgroundTokens.primaryButton,
    BorderRadiusTokens.round,
    ShadowTokens.neonStrong,
    'w-16 h-16 items-center justify-center',
    'active:scale-95 transition-transform',
  ].join(' '),
};

// Utility functions for dynamic styling
export const ThemeUtils = {
  // Get gradient colors for React Native LinearGradient
  getGradientColors: (gradientType: string): string[] => {
    switch (gradientType) {
      case 'primaryButton':
        return BackgroundTokens.primaryButtonColors;
      case 'progressBar':
        return BackgroundTokens.progressBarColors;
      case 'arenaBg':
        return BackgroundTokens.arenaBgColors;
      case 'avatarRing':
        return [ColorTokens.avatarRingStart, ColorTokens.avatarRingMid, ColorTokens.avatarRingEnd];
      default:
        return BackgroundTokens.primaryButtonColors;
    }
  },
  
  // Get shadow style for React Native
  getShadowStyle: (shadowType: string) => {
    switch (shadowType) {
      case 'neon':
        return ShadowTokens.neonStyle;
      case 'neonSoft':
        return ShadowTokens.neonSoftStyle;
      case 'neonStrong':
        return ShadowTokens.neonStrongStyle;
      case 'cosmic':
        return ShadowTokens.cosmicStyle;
      case 'retro':
        return ShadowTokens.retroStyle;
      default:
        return ShadowTokens.neonStyle;
    }
  },
  
  // Get animation config for React Native
  getAnimationConfig: (animationType: string) => {
    switch (animationType) {
      case 'fadeIn':
        return AnimationTokens.fadeIn;
      case 'slideUp':
        return AnimationTokens.slideUp;
      case 'scaleIn':
        return AnimationTokens.scaleIn;
      case 'float':
        return AnimationTokens.floatStyle;
      case 'pulseNeon':
        return AnimationTokens.pulseNeonStyle;
      case 'liquidFill':
        return AnimationTokens.liquidFillStyle;
      default:
        return AnimationTokens.fadeIn;
    }
  },
  
  // Combine multiple token classes
  combineClasses: (...classes: string[]): string => {
    return classes.filter(Boolean).join(' ');
  },
};

// Export all tokens as a single object
export const ThemeTokens = {
  colors: ColorTokens,
  typography: TypographyTokens,
  spacing: SpacingTokens,
  borderRadius: BorderRadiusTokens,
  shadows: ShadowTokens,
  animations: AnimationTokens,
  backgrounds: BackgroundTokens,
  components: ComponentTokens,
  utils: ThemeUtils,
};

export default ThemeTokens;