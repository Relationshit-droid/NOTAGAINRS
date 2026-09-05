/**
 * Layout Primitives
 * 
 * These components provide consistent, theme-aware layout structures
 * that eliminate the need for repetitive style definitions.
 * 
 * Usage:
 * import { VStack, HStack, Spacer, Section } from './layout';
 * 
 * <VStack>
 *   <Typography variant="h1">Title</Typography>
 *   <Spacer />
 *   <HStack justifyContent="space-between">
 *     <Typography>Left</Typography>
 *     <Typography>Right</Typography>
 *   </HStack>
 *   <Section title="Details">
 *     <Typography>Content</Typography>
 *   </Section>
 * </VStack>
 */

export { VStack } from './VStack';
export { HStack } from './HStack';
export { Spacer } from './Spacer';
export { Section } from './Section';

// Default exports
export { default as VStackDefault } from './VStack';
export { default as HStackDefault } from './HStack';
export { default as SpacerDefault } from './Spacer';
export { default as SectionDefault } from './Section';
