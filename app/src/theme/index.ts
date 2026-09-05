/**
 * RELATIONSHIT! - Design System v2.0
 * Centralized Design Tokens based on COMPLETE UI_UX DESIGN SPECIFICATION 2.0
 * 
 * NON-NEGOTIABLE: All colors, gradients, typography, spacing must use these tokens.
 * NO hardcoded values allowed in components.
 */

import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ============================================
// BASE SCALING
// ============================================
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// ============================================
// COLOR TOKENS (Exact hex values from spec)
// ============================================
export const COLORS = {
  // Primary Brand Colors
  vibrantPink: '#FC0C84',
  deepCosmic: '#1A0B2E',
  richPlum: '#2D1B45',
  
  // Gradient Colors
  gradientStart: '#DB147C',
  gradientEnd: '#F05D68',
  
  // Background Colors
  backgroundPrimary: '#1A0B2E',
  backgroundSecondary: '#2D1B45',
  backgroundCard: '#2D1B45',
  backgroundModal: '#0F0A1F',
  backgroundInput: 'rgba(255, 255, 255, 0.05)',
  
  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textHint: 'rgba(255, 255, 255, 0.4)',
  textDisabled: 'rgba(255, 255, 255, 0.3)',
  
  // Accent Colors (Emotional Vocabulary)
  warmOrange: '#FF7600',
  brightYellow: '#FFEF1F',
  mintGreen: '#37CF97',
  softViolet: '#B37DEC',
  rosePink: '#E16BA9',
  blushPink: '#FF6B9D',
  lavenderPurple: '#A16BF2',
  aquaTeal: '#00D4AA',
  peachOrange: '#FF9E3D',
  crimsonRed: '#DC143C',
  
  // Status Colors
  success: '#33DEA5',
  warning: '#FFB800',
  error: '#E11637',
  info: '#22D3EE',
  
  // UI Element Colors
  borderSubtle: 'rgba(255, 255, 255, 0.12)',
  borderFocus: '#FC0C84',
  divider: 'rgba(255, 255, 255, 0.08)',
  
  // Glow Effects
  glowPink: 'rgba(252, 12, 132, 0.5)',
  glowYellow: 'rgba(255, 239, 31, 0.4)',
  glowOrange: 'rgba(255, 118, 0, 0.3)',
  
  // Game Category Colors
  emotionalConnection: '#FA1F63',
  conflictResolution: '#33DEA5',
  creativeChaos: '#E4E831',
  romanceHub: '#BE1980',
  healingHospital: '#5C1459',
  gameShow: '#22D3EE',
  loveArcade: '#FF6B6B',
  
  // Legacy compatibility
  nightSky: '#0F0A1F',
  midPurple: '#3D2A5C',
  primaryGradientStart: '#DB147C',
  primaryGradientEnd: '#F05D68',
  neonGlow: 'rgba(219, 20, 124, 0.5)',
  cosmicGlow: 'rgba(252, 199, 56, 0.4)',
  retroShadow: 'rgba(240, 93, 104, 0.3)',
  inputFieldBg: 'rgba(255, 255, 255, 0.05)',
  dividerLines: 'rgba(255, 255, 255, 0.08)',
  subtleBorders: 'rgba(255, 255, 255, 0.12)',
  focusRings: '#FC0C84',
  focusOutline: '#FC0C84',
  card: '#2D1B45',
  deepCosmicPurple: '#1A0B2E',
  avatarRingStart: '#FCC738',
  avatarRingMid: '#EA031F',
  avatarRingEnd: '#C60AB3',
  profileRingStart: '#FCC738',
  profileRingMid: '#EA031F',
  profileRingEnd: '#C60AB3',
  progressGradientStart: '#EF1B6E',
  progressGradientMid1: '#C41E77',
  progressGradientMid2: '#A22AC4',
  progressGradientEnd: '#9056EF',
  arenaBgStart: '#1A0D2E',
  arenaBgEnd: '#3D1B5A',
  progress: ['#EF1B6E', '#C41E77', '#A22AC4', '#9056EF'] as const,
  primaryAction: ['#DB147C', '#F05D68'] as const,
  connection: ['#FCC738', '#EA031F', '#C60AB3'] as const,

  // Aliases kept for older screens/tests that referenced the previous theme file.
  surface: '#2D1B45',
  innerLineStart: '#EF1B6E',
  innerLineEnd: '#9056EF',
  accentRose: '#E16BA9',
  accentOrange: '#FF7600',
  accentPink: '#FC0C84',
  accentViolet: '#A16BF2',
  accentYellow: '#FFEF1F',
  accentTeal: '#00D4AA',
  connectionGradientStart: '#FCC738',
  connectionGradientMid: '#EA031F',
  connectionGradientEnd: '#C60AB3',
};

// ============================================
// GRADIENT TOKENS
// ============================================
export const GRADIENTS = {
  // Primary Button Gradient
  primary: {
    colors: [COLORS.gradientStart, COLORS.gradientEnd] as const,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  
  // Background Gradient
  background: {
    colors: ['#1A0B2E', '#3D2A5C'] as const,
    start: { x: 0.5, y: 0.2 },
    end: { x: 0.5, y: 1 },
  },
  
  // Progress Bar Gradient
  progress: {
    colors: ['#EF1B6E', '#C41E77', '#A22AC4', '#9056EF'] as const,
    start: { x: 0, y: 1 },
    end: { x: 0, y: 0 },
  },
  
  // Avatar Ring Gradient
  avatarRing: {
    colors: ['#FCC738', '#EA031F', '#C60AB3'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Card Border Gradient
  cardBorder: {
    colors: ['rgba(252, 12, 132, 0.3)', 'rgba(252, 12, 132, 0.1)'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Romance Hub Gradient (category color #BE1980 -> vibrant pink)
  romanceHub: {
    colors: ['#BE1980', '#FC0C84'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Marcie Bubble Gradient
  marcieBubble: {
    colors: ['#FA1F63', 'rgba(250, 31, 99, 0)'] as const,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
};

// ============================================
// TYPOGRAPHY TOKENS
// ============================================
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    black: 'Inter-Black',
    bold: 'Inter-Bold',
    semiBold: 'Inter-SemiBold',
    medium: 'Inter-Medium',
    regular: 'Inter-Regular',
    light: 'Inter-Light',
    italic: 'Inter-Italic',
  },
  
  // Font Weights
  fontWeight: {
    black: '900',
    bold: '700',
    semiBold: '600',
    medium: '500',
    regular: '400',
    light: '300',
  },
  
  // Font Sizes (Mobile-first responsive)
  fontSize: {
    displayLarge: scale(32),
    displayMedium: scale(28),
    displaySmall: scale(24),
    headerLarge: scale(20),
    headerMedium: scale(18),
    headerSmall: scale(16),
    bodyLarge: scale(16),
    bodyMedium: scale(14),
    bodySmall: scale(12),
    button: Math.max(scale(16), 16),
    input: scale(14),
    label: scale(12),
    marcieDialogue: scale(14),
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: -0.02,
    normal: 0,
    wide: 0.02,
    button: 0.05,
  },
};

// ============================================
// SPACING TOKENS
// ============================================
export const SPACING = {
  // Base unit (4px)
  unit: 4,
  none: 0,
  safeTop: 44,
  
  // Scale
  micro: 2,
  tiny: 4,
  small: 8,
  medium: 12,
  regular: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  xxxlarge: 48,
  
  // Component-specific
  buttonPadding: 16,
  cardPadding: 20,
  screenPadding: 24,
  sectionPadding: 32,
  
  // Legacy aliases
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// ============================================
// BORDER RADIUS TOKENS
// ============================================
export const BORDER_RADIUS = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  xxlarge: 20,
  round: 9999,
  
  // Component-specific
  button: 16,
  card: 16,
  input: 16,
  avatar: 9999,
  bubble: 16,
};

// ============================================
// SHADOW TOKENS
// ============================================
export const SHADOWS = {
  // Cosmic / retro glows (referenced by ThemeMapper)
  cosmic: {
    shadowColor: COLORS.cosmicGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 7,
  },

  retro: {
    shadowColor: COLORS.retroShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },

  // Neon Glow
  neon: {
    shadowColor: COLORS.glowPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  
  neonSoft: {
    shadowColor: COLORS.glowPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  
  neonStrong: {
    shadowColor: COLORS.glowPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 12,
  },
  
  // Button Glow
  buttonGlow: {
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Card Shadow
  card: {
    shadowColor: COLORS.deepCosmic,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Standard
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ============================================
// ANIMATION TOKENS
// ============================================
export const ANIMATIONS = {
  // Named presets (referenced by ThemeMapper)
  fadeIn: { duration: 300, from: { opacity: 0 }, to: { opacity: 1 } },
  slideUp: { duration: 300, from: { translateY: 24, opacity: 0 }, to: { translateY: 0, opacity: 1 } },
  scaleIn: { duration: 200, from: { scale: 0.92, opacity: 0 }, to: { scale: 1, opacity: 1 } },
  pulseNeon: { duration: 1600, from: { opacity: 0.6 }, to: { opacity: 1 }, loop: true },
  liquidFill: { duration: 800, from: { width: '0%' }, to: { width: '100%' } },

  // Timing
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  
  // Easing
  easing: {
    standard: [0.4, 0.0, 0.2, 1] as const,
    easeIn: [0.4, 0, 1, 1] as const,
    easeOut: [0, 0, 0.2, 1] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
  },
  
  // Presets
  press: {
    scale: 0.95,
    duration: 100,
  },
  
  float: {
    duration: 3000,
    distance: 10,
  },
  
  pulse: {
    duration: 2000,
    minOpacity: 0.6,
    maxOpacity: 1,
  },
};

// ============================================
// COMPONENT TOKENS
// ============================================
export const COMPONENTS = {
  // Button
  button: {
    height: 48,
    borderRadius: BORDER_RADIUS.button,
    paddingVertical: SPACING.regular,
    paddingHorizontal: SPACING.xlarge,
  },
  
  // Card
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
  },
  
  // Input
  input: {
    height: 48,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
  },
  
  // Modal
  modal: {
    backgroundColor: COLORS.backgroundModal,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.xlarge,
  },
};

// ============================================
// DEVICE/BREAKPOINT TOKENS
// ============================================
export const BREAKPOINTS = {
  mobileSmall: 320,
  mobileMedium: 375,
  mobileLarge: 414,
  tablet: 768,
  desktop: 1024,
};

export const DEVICE = {
  isSmallDevice: width < BREAKPOINTS.mobileMedium,
  isMediumDevice: width >= BREAKPOINTS.mobileMedium && width < BREAKPOINTS.mobileLarge,
  isLargeDevice: width >= BREAKPOINTS.mobileLarge,
  isTablet: width >= BREAKPOINTS.tablet,
  screenWidth: width,
  screenHeight: height,
  scale,
  verticalScale,
  moderateScale,
};

// ============================================
// LEGACY COMPATIBILITY
// ============================================
export const SIZES = {
  borderRadius: BORDER_RADIUS.xlarge,
  buttonBorderRadius: BORDER_RADIUS.button,
  cardBorderRadius: BORDER_RADIUS.card,
  inputHeight: COMPONENTS.input.height,
};

export const GLOWS = {
  soft: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  }),
  medium: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  }),
  strong: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 12,
  }),
};

// ============================================
// COMPLETE THEME EXPORT
// ============================================
export const THEME = {
  colors: COLORS,
  gradients: GRADIENTS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  components: COMPONENTS,
  breakpoints: BREAKPOINTS,
  device: DEVICE,
};

export default THEME;
