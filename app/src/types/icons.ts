import React from 'react';
import type { Ionicons } from '@expo/vector-icons';

/**
 * The union of valid Ionicons glyph names.
 *
 * Data-driven screens keep icon names in fixtures/config where they widen to
 * `string`, which Ionicons' `name` prop rejects. Annotating those fields with
 * this type keeps the compile-time check that the glyph actually exists --
 * that check has already caught six names in this codebase that silently
 * rendered blank.
 */
export type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
