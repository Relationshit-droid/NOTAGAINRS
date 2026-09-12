/**
 * Theme re-export.
 *
 * There were previously TWO theme modules in this project:
 *   - src/theme.ts        (older, partial: no GRADIENTS, no backgroundPrimary/borderSubtle)
 *   - src/theme/index.ts  (complete design-system tokens)
 *
 * Node/Metro resolution prefers `theme.ts` over `theme/index.ts`, so every
 * `from '../theme'` import silently picked up the PARTIAL module. That made
 * `GRADIENTS.background`, `COLORS.backgroundPrimary` and `COLORS.borderSubtle`
 * undefined at runtime (600+ references) and crashed the app on first render.
 *
 * This file now forwards to the single canonical design system so both import
 * paths resolve to identical, spec-compliant tokens.
 */
export * from './theme/index';
export { default } from './theme/index';
