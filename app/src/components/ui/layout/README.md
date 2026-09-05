# Layout Primitives

Fast, consistent layouts without repetitive styles.

## Quick Start

```tsx
import { ScreenLayout, VStack, HStack, Spacer, Section, Typography, SquishyButton } from '../ui';

export const MyScreen = () => (
  <ScreenLayout>
    <VStack>
      <Typography variant="h1">Couples Jeopardy</Typography>
      
      <Spacer />
      
      <Section title="Score">
        <HStack justifyContent="space-between">
          <Typography variant="body">Current</Typography>
          <Typography variant="h2">800</Typography>
        </HStack>
      </Section>
      
      <Spacer size={SPACING.xlarge} />
      
      <SquishyButton>Next Round</SquishyButton>
    </VStack>
  </ScreenLayout>
);
```

## Components

### VStack

Vertical stack with consistent spacing.

```tsx
<VStack gap={SPACING.large} alignItems="center">
  <Typography>Item 1</Typography>
  <Typography>Item 2</Typography>
</VStack>
```

**Props:**
- `gap` - Space between children (default: `SPACING.regular`)
- `alignItems` - Horizontal alignment
- `justifyContent` - Vertical distribution
- `style` - Additional styles

### HStack

Horizontal stack with consistent spacing.

```tsx
<HStack gap={SPACING.small} justifyContent="space-between">
  <Icon name="star" />
  <Typography>Favorites</Typography>
  <Badge>3</Badge>
</HStack>
```

**Props:**
- `gap` - Space between children (default: `SPACING.small`)
- `alignItems` - Vertical alignment (default: `center`)
- `justifyContent` - Horizontal distribution
- `style` - Additional styles

### Spacer

Creates empty space. Use instead of margins.

```tsx
<Typography>Above</Typography>
<Spacer size={SPACING.large} />
<Typography>Below</Typography>

// Horizontal spacer
<HStack>
  <Icon />
  <Spacer horizontal size={SPACING.small} />
  <Typography>Label</Typography>
</HStack>
```

**Props:**
- `size` - Space size (default: `SPACING.regular`)
- `horizontal` - Create horizontal space instead of vertical

### Section

Pre-styled card with optional title.

```tsx
<Section title="Game Settings">
  <Typography>Content here</Typography>
</Section>

<Section title="Stats" padding="large">
  <HStack justifyContent="space-between">
    <Typography>Wins</Typography>
    <Typography>12</Typography>
  </HStack>
</Section>
```

**Props:**
- `title` - Section header (optional)
- `children` - Section content
- `padding` - `'none' | 'small' | 'regular' | 'large'`
- `gap` - Space between title and content
- `style` - Additional card styles

## Common Patterns

### Header with Action

```tsx
<HStack justifyContent="space-between" alignItems="center">
  <Typography variant="h1">Games</Typography>
  <SquishyButton size="small">+ New</SquishyButton>
</HStack>
```

### List Items

```tsx
<VStack gap={SPACING.small}>
  {items.map(item => (
    <Section key={item.id} padding="small">
      <HStack justifyContent="space-between">
        <Typography>{item.name}</Typography>
        <Typography variant="caption">{item.score}</Typography>
      </HStack>
    </Section>
  ))}
</VStack>
```

### Form Layout

```tsx
<VStack gap={SPACING.large}>
  <VStack gap={SPACING.small}>
    <Typography variant="label">Username</Typography>
    <TextInput style={styles.input} />
  </VStack>
  
  <VStack gap={SPACING.small}>
    <Typography variant="label">Password</Typography>
    <TextInput secureTextEntry style={styles.input} />
  </VStack>
  
  <Spacer />
  
  <SquishyButton>Sign In</SquishyButton>
</VStack>
```

## Migration Guide

### Before

```tsx
<View style={{ flexDirection: 'column', gap: SPACING.regular }}>
  <View style={{ marginBottom: SPACING.small }}>
    <Typography>Title</Typography>
  </View>
  <View style={{ marginBottom: SPACING.large }}>
    <GlassCard style={{ padding: SPACING.regular }}>
      <View style={{ flexDirection: 'column', gap: SPACING.small }}>
        <Typography variant="h3">Section</Typography>
        <Typography>Content</Typography>
      </View>
    </GlassCard>
  </View>
</View>
```

### After

```tsx
<VStack>
  <Spacer size={SPACING.small} />
  <Typography>Title</Typography>
  <Spacer size={SPACING.large} />
  <Section title="Section">
    <Typography>Content</Typography>
  </Section>
</VStack>
```

## Benefits

1. **No inline styles** - All spacing uses theme tokens
2. **Consistent spacing** - Same gaps across all screens
3. **Faster development** - Less code, fewer decisions
4. **Easier maintenance** - Change spacing in one place
5. **Better readability** - Declarative layout structure
