import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { SPACING } from '../../../theme';

interface VStackProps {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

/**
 * VStack - Vertical Stack Layout
 * 
 * Stacks children vertically with consistent spacing.
 * No margin styles needed anymore.
 * 
 * @example
 * <VStack>
 *   <Typography variant="h1">Title</Typography>
 *   <Typography variant="body">Description</Typography>
 * </VStack>
 */
export const VStack: React.FC<VStackProps> = ({ 
  children, 
  gap = SPACING.regular, 
  style,
  alignItems = 'stretch',
  justifyContent = 'flex-start'
}) => {
  return (
    <View style={[{ 
      flexDirection: 'column', 
      gap,
      alignItems,
      justifyContent
    }, style]}>
      {children}
    </View>
  );
};

export default VStack;
