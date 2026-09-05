import React from 'react';
import { View } from 'react-native';
import { SPACING } from '../../theme';

interface SpacerProps {
  size?: number;
  horizontal?: boolean;
}

/**
 * Spacer - Creates empty space between elements
 * 
 * Use instead of margin styles for cleaner component separation.
 * 
 * @example
 * <Typography variant="h2">Score</Typography>
 * <Spacer size={SPACING.large} />
 * <SquishyButton>Continue</SquishyButton>
 * 
 * @example
 * <HStack>
 *   <Icon name="star" />
 *   <Spacer horizontal size={SPACING.small} />
 *   <Typography variant="body">Favorites</Typography>
 * </HStack>
 */
export const Spacer: React.FC<SpacerProps> = ({ 
  size = SPACING.regular,
  horizontal = false
}) => {
  return (
    <View style={{ 
      [horizontal ? 'width' : 'height']: size 
    }} />
  );
};

export default Spacer;
