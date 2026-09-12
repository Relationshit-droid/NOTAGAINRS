import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { SPACING } from '../../../theme';

interface HStackProps {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

/**
 * HStack - Horizontal Stack Layout
 * 
 * Stacks children horizontally with consistent spacing.
 * Perfect for rows of items, headers, and inline elements.
 * 
 * @example
 * <HStack>
 *   <Icon name="settings" />
 *   <Typography variant="body">Settings</Typography>
 * </HStack>
 * 
 * @example
 * <HStack justifyContent="space-between">
 *   <Typography variant="h3">Score</Typography>
 *   <Typography variant="h3">800</Typography>
 * </HStack>
 */
export const HStack: React.FC<HStackProps> = ({ 
  children, 
  gap = SPACING.small, 
  style,
  alignItems = 'center',
  justifyContent = 'flex-start'
}) => {
  return (
    <View style={[{ 
      flexDirection: 'row', 
      gap, 
      alignItems,
      justifyContent
    }, style]}>
      {children}
    </View>
  );
};

export default HStack;
