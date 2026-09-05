// ============================================
// INTER FONT FAMILY SYSTEM
// ============================================
// All typography uses Inter font family for consistency

export const FONT_FAMILIES = {
  // Inter Font Family (Primary)
  InterBlack: 'Inter-Black',           // 900 - Game Titles
  InterBold: 'Inter-Bold',             // 700 - Headers
  InterSemiBold: 'Inter-SemiBold',     // 600 - Buttons, Subtitles
  InterMedium: 'Inter-Medium',         // 500 - Labels
  InterRegular: 'Inter-Regular',       // 400 - Body text
  InterLight: 'Inter-Light',           // 300 - Captions
  InterItalic: 'Inter-Italic',         // 400 italic - Dr. Marcie Dialogue

  // Legacy font families (deprecated, for backward compatibility only)
  BarbieDream: 'BarbieDream-Regular',
  Cheese: 'Cheese-Regular',
  HolidayChristmas: 'HolidayChristmas-Regular',
  SweetPink: 'SweetPink-Regular',
  WonderfulSometimes: 'WonderfulSometimes-Regular',
  Cute: 'Cute-Regular',
  Nietha: 'Nietha-Regular',
  Pink: 'Pink-Regular',
  Smile: 'Smile-Regular',
} as const;

export type FontFamilyKey = keyof typeof FONT_FAMILIES;

// Font weight mapping
export const FONT_WEIGHTS = {
  black: '900',
  bold: '700',
  semiBold: '600',
  medium: '500',
  regular: '400',
  light: '300',
} as const;

// Typography roles mapping to Inter weights
export const TYPOGRAPHY_ROLES = {
  gameTitle: {
    fontFamily: FONT_FAMILIES.InterBlack,
    fontWeight: FONT_WEIGHTS.black,
  },
  header: {
    fontFamily: FONT_FAMILIES.InterBold,
    fontWeight: FONT_WEIGHTS.bold,
  },
  button: {
    fontFamily: FONT_FAMILIES.InterSemiBold,
    fontWeight: FONT_WEIGHTS.semiBold,
    textTransform: 'uppercase' as const,
    minSize: 16,
  },
  body: {
    fontFamily: FONT_FAMILIES.InterRegular,
    fontWeight: FONT_WEIGHTS.regular,
  },
  marcieDialogue: {
    fontFamily: FONT_FAMILIES.InterItalic,
    fontWeight: FONT_WEIGHTS.regular,
    fontStyle: 'italic' as const,
  },
  caption: {
    fontFamily: FONT_FAMILIES.InterLight,
    fontWeight: FONT_WEIGHTS.light,
  },
} as const;
