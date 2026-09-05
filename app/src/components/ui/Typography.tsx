import { ReactNode } from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { FONT_FAMILIES, TYPOGRAPHY_ROLES } from '../../constants/fontFamilies';
import { scaleFont } from '../../lib/typography';
import { useAppStore } from '../../state/store';
import { COLORS, TYPOGRAPHY } from '../../theme';

type Variant = 
  | 'gameTitle'
  | 'header'
  | 'body'
  | 'button'
  | 'marcieDialogue'
  | 'caption'
  | 'label'
  | 'title'
  | 'small'
  | 'instructions'
  | 'sass'
  | 'keyword'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  // Design-system scale names, mirroring TYPOGRAPHY.fontSize in the theme.
  // Screens address these directly, so they are first-class variants.
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headerLarge'
  | 'headerMedium'
  | 'headerSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall';

type TextProps = RNTextProps & {
  variant?: Variant;
  children: ReactNode;
  color?: string;
  center?: boolean;
};

export default function Text({ 
  variant = 'body', 
  style, 
  children, 
  color,
  center = false,
  ...rest 
}: TextProps) {
  const { family, size, weight, additionalStyles } = mapVariant(variant);
  const fontScale = useAppStore((s) => s.fontScale) || 1;
  const highContrast = useAppStore((s) => s.highContrast);

  const textColor = color || COLORS.textPrimary;
  const shadow = highContrast ? { 
    textShadowColor: COLORS.backgroundPrimary, 
    textShadowOffset: { width: 0, height: 1 }, 
    textShadowRadius: 2 
  } : {};

  const textStyle: TextStyle = {
    fontFamily: family,
    fontSize: scaleFont(size * fontScale),
    fontWeight: weight as TextStyle['fontWeight'],
    color: textColor,
    lineHeight: scaleFont(size * 1.5 * fontScale),
    textAlign: center ? 'center' : 'left',
  };

  return (
    <RNText 
      {...rest} 
      accessibilityRole={rest.accessibilityRole || 'text'}
      style={[
        textStyle,
        shadow,
        additionalStyles,
        style
      ]}
    >
      {children}
    </RNText>
  );
}

function mapVariant(variant: Variant) {
  switch (variant) {
    case 'gameTitle':
      return {
        family: TYPOGRAPHY_ROLES.gameTitle.fontFamily,
        weight: TYPOGRAPHY_ROLES.gameTitle.fontWeight,
        size: TYPOGRAPHY.fontSize.displayLarge,
        additionalStyles: {
          letterSpacing: TYPOGRAPHY.letterSpacing.tight,
          lineHeight: TYPOGRAPHY.fontSize.displayLarge * 1.2,
        } as TextStyle,
      };

    case 'displayLarge':
      return {
        family: TYPOGRAPHY_ROLES.gameTitle.fontFamily,
        weight: TYPOGRAPHY_ROLES.gameTitle.fontWeight,
        size: TYPOGRAPHY.fontSize.displayLarge,
        additionalStyles: {
          letterSpacing: TYPOGRAPHY.letterSpacing.tight,
          lineHeight: TYPOGRAPHY.fontSize.displayLarge * TYPOGRAPHY.lineHeight.tight,
        } as TextStyle,
      };

    case 'displayMedium':
      return {
        family: TYPOGRAPHY_ROLES.gameTitle.fontFamily,
        weight: TYPOGRAPHY_ROLES.gameTitle.fontWeight,
        size: TYPOGRAPHY.fontSize.displayMedium,
        additionalStyles: {
          letterSpacing: TYPOGRAPHY.letterSpacing.tight,
          lineHeight: TYPOGRAPHY.fontSize.displayMedium * TYPOGRAPHY.lineHeight.tight,
        } as TextStyle,
      };

    case 'displaySmall':
      return {
        family: TYPOGRAPHY_ROLES.gameTitle.fontFamily,
        weight: TYPOGRAPHY_ROLES.gameTitle.fontWeight,
        size: TYPOGRAPHY.fontSize.displaySmall,
        additionalStyles: {
          letterSpacing: TYPOGRAPHY.letterSpacing.tight,
          lineHeight: TYPOGRAPHY.fontSize.displaySmall * TYPOGRAPHY.lineHeight.tight,
        } as TextStyle,
      };

    case 'headerMedium':
      return {
        family: TYPOGRAPHY_ROLES.header.fontFamily,
        weight: TYPOGRAPHY.fontWeight.semiBold,
        size: TYPOGRAPHY.fontSize.headerMedium,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.headerMedium * TYPOGRAPHY.lineHeight.normal,
        } as TextStyle,
      };

    case 'headerSmall':
      return {
        family: TYPOGRAPHY_ROLES.header.fontFamily,
        weight: TYPOGRAPHY.fontWeight.medium,
        size: TYPOGRAPHY.fontSize.headerSmall,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.headerSmall * TYPOGRAPHY.lineHeight.normal,
        } as TextStyle,
      };

    case 'bodyMedium':
      return {
        family: TYPOGRAPHY_ROLES.body.fontFamily,
        weight: TYPOGRAPHY_ROLES.body.fontWeight,
        size: TYPOGRAPHY.fontSize.bodyMedium,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.bodyMedium * TYPOGRAPHY.lineHeight.relaxed,
        } as TextStyle,
      };

    case 'bodySmall':
      return {
        family: TYPOGRAPHY_ROLES.body.fontFamily,
        weight: TYPOGRAPHY_ROLES.body.fontWeight,
        size: TYPOGRAPHY.fontSize.bodySmall,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.bodySmall * TYPOGRAPHY.lineHeight.relaxed,
        } as TextStyle,
      };

    case 'h1':
    case 'header':
    case 'headerLarge':
    case 'title':
      return {
        family: TYPOGRAPHY_ROLES.header.fontFamily,
        weight: TYPOGRAPHY_ROLES.header.fontWeight,
        size: TYPOGRAPHY.fontSize.headerLarge,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.headerLarge * 1.3,
          letterSpacing: TYPOGRAPHY.letterSpacing.tight,
        } as TextStyle,
      };

    case 'h2':
      return {
        family: TYPOGRAPHY_ROLES.header.fontFamily,
        weight: TYPOGRAPHY.fontWeight.semiBold,
        size: TYPOGRAPHY.fontSize.headerMedium,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.headerMedium * 1.3,
        } as TextStyle,
      };

    case 'h3':
      return {
        family: TYPOGRAPHY_ROLES.header.fontFamily,
        weight: TYPOGRAPHY.fontWeight.medium,
        size: TYPOGRAPHY.fontSize.headerSmall,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.headerSmall * 1.4,
        } as TextStyle,
      };

    case 'h4':
      return {
        family: TYPOGRAPHY_ROLES.header.fontFamily,
        weight: TYPOGRAPHY.fontWeight.medium,
        size: TYPOGRAPHY.fontSize.bodyLarge,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.bodyLarge * 1.4,
        } as TextStyle,
      };

    case 'body':
    case 'bodyLarge':
      return {
        family: TYPOGRAPHY_ROLES.body.fontFamily,
        weight: TYPOGRAPHY_ROLES.body.fontWeight,
        size: TYPOGRAPHY.fontSize.bodyLarge,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.bodyLarge * 1.5,
        } as TextStyle,
      };

    case 'button':
    case 'keyword':
      return {
        family: TYPOGRAPHY_ROLES.button.fontFamily,
        weight: TYPOGRAPHY_ROLES.button.fontWeight,
        size: Math.max(TYPOGRAPHY.fontSize.button, 16),
        additionalStyles: {
          textTransform: 'uppercase',
          letterSpacing: TYPOGRAPHY.letterSpacing.button,
          lineHeight: TYPOGRAPHY.fontSize.button * 1.2,
        } as TextStyle,
      };

    case 'label':
      return {
        family: FONT_FAMILIES.InterMedium,
        weight: TYPOGRAPHY.fontWeight.medium,
        size: TYPOGRAPHY.fontSize.label,
        additionalStyles: {
          letterSpacing: TYPOGRAPHY.letterSpacing.wide,
          lineHeight: TYPOGRAPHY.fontSize.label * 1.4,
          textTransform: 'uppercase',
        } as TextStyle,
      };

    case 'marcieDialogue':
    case 'sass':
      return {
        family: TYPOGRAPHY_ROLES.marcieDialogue.fontFamily,
        weight: TYPOGRAPHY_ROLES.marcieDialogue.fontWeight,
        size: TYPOGRAPHY.fontSize.marcieDialogue,
        additionalStyles: {
          fontStyle: 'italic',
          lineHeight: TYPOGRAPHY.fontSize.marcieDialogue * TYPOGRAPHY.lineHeight.relaxed,
        } as TextStyle,
      };

    case 'caption':
    case 'small':
      return {
        family: TYPOGRAPHY_ROLES.caption.fontFamily,
        weight: TYPOGRAPHY_ROLES.caption.fontWeight,
        size: TYPOGRAPHY.fontSize.bodySmall,
        additionalStyles: {
          letterSpacing: TYPOGRAPHY.letterSpacing.wide,
          lineHeight: TYPOGRAPHY.fontSize.bodySmall * 1.4,
        } as TextStyle,
      };

    case 'instructions':
      return {
        family: TYPOGRAPHY_ROLES.body.fontFamily,
        weight: TYPOGRAPHY_ROLES.body.fontWeight,
        size: TYPOGRAPHY.fontSize.bodyMedium,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.bodyMedium * TYPOGRAPHY.lineHeight.relaxed,
        } as TextStyle,
      };

    default:
      return {
        family: TYPOGRAPHY_ROLES.body.fontFamily,
        weight: TYPOGRAPHY_ROLES.body.fontWeight,
        size: TYPOGRAPHY.fontSize.bodyLarge,
        additionalStyles: {
          lineHeight: TYPOGRAPHY.fontSize.bodyLarge * 1.5,
        } as TextStyle,
      };
  }
}
