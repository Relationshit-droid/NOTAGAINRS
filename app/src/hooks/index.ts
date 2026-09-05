/**
 * Hooks Index
 * 
 * Central export for all custom hooks.
 */

export { useAuth } from './useAuth';
export { useGameSession } from './useGameSession';
export { usePartnerPresence } from './usePartnerPresence';
// useWebSocket exports no ConnectionState symbol; nothing imports it either.
export { useWebSocket } from './useWebSocket';
