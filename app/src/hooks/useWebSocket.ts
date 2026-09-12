/**
 * Enhanced WebSocket Hook with Auto-Reconnection
 * Handles real-time sync between partners with automatic recovery
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ENV } from '../lib/env';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  coupleId: string;
  userId: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  sendMessage: (message: WebSocketMessage) => boolean;
  lastMessage: WebSocketMessage | null;
  connectionAttempts: number;
  reconnect: () => void;
}

export function useWebSocket(
  optionsOrCoupleId?: UseWebSocketOptions | string | null,
  maybeUserId?: string | null,
): UseWebSocketReturn {
  // Call sites use both shapes: useWebSocket({ coupleId, userId }) and the
  // positional useWebSocket(coupleId, userId). Normalise before destructuring,
  // otherwise a null argument throws "Cannot destructure property 'coupleId'
  // of 'object null'" and takes the whole screen down.
  const options: UseWebSocketOptions =
    optionsOrCoupleId && typeof optionsOrCoupleId === 'object'
      ? optionsOrCoupleId
      : ({ coupleId: (optionsOrCoupleId as string) ?? '', userId: maybeUserId ?? '' } as UseWebSocketOptions);

  const {
    coupleId,
    userId,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    heartbeatInterval = 30000,
  } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const intentionalClose = useRef(false);
  const messageQueue = useRef<WebSocketMessage[]>([]);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ 
        type: 'heartbeat', 
        timestamp: Date.now(),
        userId 
      }));
    }
  }, [userId]);

  // Connect WebSocket
  const connect = useCallback(() => {
    if (!coupleId || !userId) {
      console.log('[WebSocket] Missing coupleId or userId, skipping connection');
      return;
    }

    // Don't connect if already connected or connecting
    if (ws.current?.readyState === WebSocket.OPEN || 
        ws.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    setIsConnecting(true);
    intentionalClose.current = false;

    const wsUrl = `${ENV.WS_URL}/ws/${coupleId}`;
    console.log(`[WebSocket] Connecting to ${wsUrl}`);

    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionAttempts(0);
        
        // Send any queued messages
        while (messageQueue.current.length > 0) {
          const msg = messageQueue.current.shift();
          if (msg) sendMessage(msg);
        }

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(sendHeartbeat, heartbeatInterval);

        // Notify connected
        if (onConnect) onConnect();
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          
          if (onMessage) {
            onMessage(message);
          }
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log(`[WebSocket] Closed: ${event.code} - ${event.reason}`);
        setIsConnected(false);
        setIsConnecting(false);
        clearTimers();

        if (onDisconnect) onDisconnect();

        // Attempt reconnection if not intentional
        if (!intentionalClose.current && connectionAttempts < maxReconnectAttempts) {
          const nextAttempt = connectionAttempts + 1;
          setConnectionAttempts(nextAttempt);
          
          const delay = Math.min(
            reconnectInterval * Math.pow(1.5, nextAttempt - 1),
            30000 // Max 30 second delay
          );
          
          console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${nextAttempt})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.current.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        if (onError) onError(error);
      };

    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      setIsConnecting(false);
    }
  }, [coupleId, userId, onMessage, onConnect, onDisconnect, onError, 
      reconnectInterval, maxReconnectAttempts, heartbeatInterval, 
      sendHeartbeat, connectionAttempts]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    intentionalClose.current = true;
    clearTimers();
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, [clearTimers]);

  // Send message
  const sendMessage = useCallback((message: WebSocketMessage): boolean => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        ...message,
        userId,
        timestamp: Date.now(),
      }));
      return true;
    } else {
      // Queue message for later
      messageQueue.current.push(message);
      console.log('[WebSocket] Message queued (not connected)');
      return false;
    }
  }, [userId]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    disconnect();
    setConnectionAttempts(0);
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  // Connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Reconnect when coupleId changes
  useEffect(() => {
    if (isConnected) {
      reconnect();
    }
  }, [coupleId]);

  return {
    isConnected,
    isConnecting,
    sendMessage,
    lastMessage,
    connectionAttempts,
    reconnect,
  };
}

export default useWebSocket;
