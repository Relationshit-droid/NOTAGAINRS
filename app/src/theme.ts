import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Mobile-first responsive design
const guidelineBaseWidth = 375; // iPhone 12 width
const guidelineBaseHeight = 812; // iPhone 12 height

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// ============================================
// DEEP COSMIC COLOR SYSTEM (NON-NEGOTIABLE)
// ============================================
export const COLORS = {
  // Primary Backgrounds
  deepCosmic: '#1A0B2E',       // Main background
  richPlum: '#2D1B45',         // Cards
  midPurple: '#3D2A5C',        // Game areas
  nightSky: '#0F0A1F',         // Modals

  // Gradients
  primaryAction: ['#DB147C', '#F05D68'] as const,     // Buttons/CTAs
  connection: ['#FCC738', '#EA031F', '#C60AB3'] as const, // Avatar rings
  progress: ['#EF1B6E', '#C41E77', '#A22AC4', '#9056EF'] as const, // Progress bars

  // All 10 Accent Colors (Emotional Vocabulary)
  vibrantPink: '#FC0C84',      // Love, intensity, emotional hits
  warmOrange: '#FF7600',       // Energy, excitement, playful alerts
  brightYellow: '#FFEF1F',     // Joy, achievement, victory moments
  mintGreen: '#37CF97',        // Growth, safety, healing, positivity
  softViolet: '#B37DEC',       // Connection depth, mystery, calm intimacy
  rosePink: '#E16BA9',         // Tenderness, romance, gentle moments
  blushPink: '#FF6B9D',        // Playfulness, lightheartedness, fun
  lavenderPurple: '#A16BF2',   // Reflection, depth, thoughtful moments
  aquaTeal: '#00D4AA',         // Clarity, insight, understanding
  peachOrange: '#FF9E3D',      // Warmth, comfort, nurturing

  // Legacy gradient references (for backward compatibility)
  primaryGradientStart: '#DB147C',
  primaryGradientEnd: '#F05D68',
  avatarRingStart: '#FCC738',
  avatarRingMid: '#EA031F',
  avatarRingEnd: '#C60AB3',
  progressGradientStart: '#EF1B6E',
  progressGradientMid1: '#C41E77',
  progressGradientMid2: '#A22AC4',
  progressGradientEnd: '#9056EF',
  arenaBgStart: '#1A0D2E',
  arenaBgEnd: '#3D1B5A',
  deepCosmicPurple: '#1A0B2E',

  // Backwards-compatible aliases expected by tests
  background: '#1A0B2E',
  surface: '#2D1B45',
  accentPink: '#FC0C84',
  accentViolet: '#A16BF2',
  accentYellow: '#FFEF1F',
  accentTeal: '#00D4AA',
  // Connection gradient aliases
  connectionGradientStart: '#FCC738',
  connectionGradientMid: '#EA031F',
  connectionGradientEnd: '#C60AB3',

  // UI Element Colors
  inputFieldBg: 'rgba(255, 255, 255, 0.05)',
  dividerLines: 'rgba(255, 255, 255, 0.08)',
  subtleBorders: 'rgba(255, 255, 255, 0.12)',
  focusRings: '#FC0C84',

  // Text Colors (The Emotional Voice)
  textPrimary: '#FFFFFF',                    // Primary text - clarity
  textSecondary: 'rgba(255, 255, 255, 0.85)', // Secondary text - guidance
  textHint: 'rgba(255, 255, 255, 0.4)',      // Hint text - subtlety
  textDisabled: 'rgba(255, 255, 255, 0.3)',  // Disabled text - restraint

  // Status Colors (Emotional Feedback)
  success: '#33DEA5',   // Growth, achievement, positive feedback
  warning: '#FFB800',   // Caution, attention, gentle alerts
  error: '#E11637',     // Urgency, mistakes, critical feedback
  info: '#22D3EE',      // Information, clarity, neutral feedback

  // Game Category Colors
  emotionalConnection: '#FA1F63',
  conflictResolution: '#33DEA5',
  creativeChaos: '#E4E831',
  romanceHub: '#BE1980',
  healingHospital: '#5C1459',
  gameShow: '#22D3EE',
  loveArcade: '#FF6B6B',

  // Glow Effects
  neonGlow: 'rgba(219, 20, 124, 0.5)',
  cosmicGlow: 'rgba(252, 199, 56, 0.4)',
  retroShadow: 'rgba(240, 93, 104, 0.3)',
};

// ============================================
// TYPOGRAPHY SYSTEM (INTER FONT FAMILY)
// ============================================
export const TYPOGRAPHY = {
  // Font Families (Inter for all weights)
  fontFamily: {
    black: 'Inter-Black',        // 900 weight - Game Titles
    bold: 'Inter-Bold',          // 700 weight - Headers
    semiBold: 'Inter-SemiBold',  // 600 weight - Buttons, Subtitles
    medium: 'Inter-Medium',      // 500 weight - Labels
    regular: 'Inter-Regular',    // 400 weight - Body text
    light: 'Inter-Light',        // 300 weight - Captions
    italic: 'Inter-Italic',      // 400 italic - Dr. Marcie Dialogue
  },

  // Font Weights
  fontWeight: {
    black: '900',      // Game Titles
    bold: '700',       // Headers
    semiBold: '600',   // Buttons
    medium: '500',     // Labels
    regular: '400',    // Body
    light: '300',      // Captions
  },

  // Font Sizes (Mobile-first responsive)
  fontSize: {
    // Display Sizes (Game Titles - Inter Black 900)
    displayLarge: scale(32),     // 32px - Main game titles
    displayMedium: scale(28),    // 28px - Section titles
    displaySmall: scale(24),     // 24px - Card titles

    // Header Sizes (Inter Bold 700)
    headerLarge: scale(20),      // 20px - Screen headers
    headerMedium: scale(18),     // 18px - Subheaders
    headerSmall: scale(16),      // 16px - Small headers

    // Body Sizes (Inter Regular 400)
    bodyLarge: scale(16),        // 16px - Primary body text
    bodyMedium: scale(14),       // 14px - Secondary body text
    bodySmall: scale(12),        // 12px - Caption text

    // Button Text (Inter SemiBold 600, UPPERCASE, 16px minimum)
    button: Math.max(scale(16), 16),

    // Special Sizes
    input: scale(14),            // 14px - Input text
    label: scale(12),            // 12px - Label text

    // Dr. Marcie Dialogue (Inter Italic 400)
    marcieDialogue: scale(14),   // 14px - Character dialogue
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,      // For headers and display text
    normal: 1.4,     // For body text
    relaxed: 1.6,    // For long-form content
  },

  header: {
    fontFamily: 'Inter-Bold',
    fontSize: scale(20),
    lineHeight: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: scale(18),
    lineHeight: 22,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: scale(16),
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: scale(12),
    lineHeight: 16,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.02,    // For display text
    normal: 0,       // For body text
    wide: 0.02,      // For captions and labels
    button: 0.05,    // For button text (uppercase)
  },

  // Text Transform
  textTransform: {
    button: 'uppercase' as const,  // Buttons must be UPPERCASE
    none: 'none' as const,
  },
};

// ============================================
// SPACING SYSTEM
// ============================================
export const SPACING = {
  // Base spacing unit (4px)
  unit: 4,

  // Micro spacing
  micro: 2,        // 2px
  tiny: 4,         // 4px
  small: 8,        // 8px
  medium: 12,      // 12px
  regular: 16,     // 16px
  large: 20,       // 20px
  xlarge: 24,      // 24px
  xxlarge: 32,     // 32px
  xxxlarge: 48,    // 48px

  // Component-specific spacing
  buttonPadding: 16,
  cardPadding: 20,
  screenPadding: 24,
  sectionPadding: 32,

  // Safe area spacing
  safeTop: 'env(safe-area-inset-top)',
  safeBottom: 'env(safe-area-inset-bottom)',
  safeLeft: 'env(safe-area-inset-left)',
  safeRight: 'env(safe-area-inset-right)',

  // Legacy aliases
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// ============================================
// BORDER RADIUS SYSTEM
// ============================================
export const BORDER_RADIUS = {
  // Standard radii
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,   // Primary buttons, cards
  xxlarge: 20,
  round: 9999,  // Fully rounded

  // Legacy aliases
  button: 16,
  card: 16,
  avatar: 9999,
};

// ============================================
// SIZES (Legacy compatibility)
// ============================================
export const SIZES = {
  borderRadius: 16,
  buttonBorderRadius: 16,
  cardBorderRadius: 16,
  inputHeight: 48,
};

// ============================================
// SHADOW SYSTEM (Cosmic Glow Effects)
// ============================================
export const SHADOWS = {
  // Neon glow shadows
  neon: {
    shadowColor: COLORS.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },

  neonSoft: {
    shadowColor: COLORS.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },

  neonStrong: {
    shadowColor: COLORS.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 12,
  },

  // Cosmic glow effects
  cosmic: {
    shadowColor: COLORS.cosmicGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },

  // Retro arcade shadows
  retro: {
    shadowColor: COLORS.retroShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },

  // Standard shadows
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

// Legacy GLOWS export
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
// ANIMATION SYSTEM (Technical Specs)
// ============================================
export const ANIMATIONS = {
  // Timing Specifications
  duration: {
    instant: 100,
    fast: 200,           // Micro-interactions: 200-300ms
    normal: 300,         // State transitions: 300-400ms
    slow: 500,           // Celebrations start
    slower: 700,         // Celebrations: 500-700ms
  },

  // Standard Easing (cubic-bezier(0.4, 0.0, 0.2, 1))
  easing: {
    standard: [0.4, 0.0, 0.2, 1] as const,
    easeIn: [0.4, 0, 1, 1] as const,
    easeOut: [0, 0, 0.2, 1] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
    // String versions for CSS
    standardCSS: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    easeInCSS: 'ease-in',
    easeOutCSS: 'ease-out',
    easeInOutCSS: 'ease-in-out',
  },

  // Preset animations
  fadeIn: {
    opacity: [0, 1],
    duration: 300,
    easing: 'ease-out',
  },

  slideUp: {
    transform: [{ translateY: 100 }, { translateY: 0 }],
    duration: 300,
    easing: 'ease-out',
  },

  scaleIn: {
    transform: [{ scale: 0.8 }, { scale: 1 }],
    duration: 200,
    easing: 'ease-out',
  },

  // Cosmic animations
  float: {
    transform: [{ translateY: 0 }, { translateY: -10 }, { translateY: 0 }],
    duration: 3000,
    easing: 'ease-in-out',
    iterations: -1, // Infinite
  },

  pulseNeon: {
    opacity: [0.6, 1, 0.6],
    duration: 2000,
    easing: 'ease-in-out',
    iterations: -1, // Infinite
  },

  liquidFill: {
    transform: [{ scaleY: 0 }, { scaleY: 0.5 }, { scaleY: 1 }],
    duration: 2000,
    easing: 'ease-in-out',
  },
};

// ============================================
// COMPONENT STYLES
// ============================================
export const COMPONENTS = {
  // Primary Button Styles (Inter SemiBold 600, UPPERCASE, 16px minimum)
  primaryButton: {
    backgroundColor: COLORS.primaryGradientStart,
    borderRadius: BORDER_RADIUS.button,
    paddingVertical: SPACING.regular,
    paddingHorizontal: SPACING.xlarge,
    shadowColor: COLORS.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },

  // Game Card Styles
  gameCard: {
    backgroundColor: 'rgba(45, 25, 80, 0.7)',
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    shadowColor: COLORS.cosmicGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },

  // Daily Quest Card
  dailyQuestCard: {
    backgroundColor: COLORS.richPlum,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    borderWidth: 1,
    borderColor: COLORS.subtleBorders,
  },

  // Global Header Styles
  globalHeader: {
    backgroundColor: 'rgba(26, 11, 46, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(252, 199, 56, 0.2)',
  },

  // Dr. Marcie Host Styles
  marcieHost: {
    position: 'absolute',
    zIndex: 9999,
    shadowColor: COLORS.cosmicGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },

  // Input Field Styles
  inputField: {
    height: 48,
    backgroundColor: COLORS.inputFieldBg,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.subtleBorders,
    paddingHorizontal: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.input,
  },

  // Gradient Border for Inputs
  gradientBorder: {
    padding: 2,
    borderRadius: BORDER_RADIUS.xlarge,
    backgroundGradient: COLORS.primaryAction,
  },
};

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================
export const BREAKPOINTS = {
  mobileSmall: 320,
  mobileMedium: 375,
  mobileLarge: 414,
  tablet: 768,
  desktop: 1024,
};

// ============================================
// DEVICE-SPECIFIC ADJUSTMENTS
// ============================================
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
// COMPLETE THEME EXPORT
// ============================================
export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  components: COMPONENTS,
  breakpoints: BREAKPOINTS,
  device: DEVICE,
};

// Legacy exports for backward compatibility
export default THEME;
