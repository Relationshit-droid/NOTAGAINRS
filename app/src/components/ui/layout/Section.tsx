import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import GlassCard from '../GlassCard';
import Typography from '../Typography';
import { VStack } from './VStack';
import { SPACING } from '../../../theme';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number;
  padding?: 'none' | 'small' | 'regular' | 'large';
}

const paddingMap = {
  none: 0,
  small: SPACING.small,
  regular: SPACING.regular,
  large: SPACING.large,
};

/**
 * Section - Pre-styled card section with optional title
 * 
 * Combines GlassCard, VStack, and Typography for consistent
 * content sections across the app.
 * 
 * @example
 * <Section title="Round Results">
 *   <Typography variant="body">You scored 400 points</Typography>
 * </Section>
 * 
 * @example
 * <Section title="Game Stats" padding="large">
 *   <HStack justifyContent="space-between">
 *     <Typography variant="body">Score</Typography>
 *     <Typography variant="h3">800</Typography>
 *   </HStack>
 * </Section>
 */
export const Section: React.FC<SectionProps> = ({ 
  title, 
  children,
  style,
  gap = SPACING.regular,
  padding = 'regular'
}) => {
  return (
    <GlassCard style={style} padding={padding === 'none' ? undefined : padding}>
      <VStack gap={gap}>
        {title && (
          <Typography variant="h3">{title}</Typography>
        )}
        {children}
      </VStack>
    </GlassCard>
  );
};

export default Section;
