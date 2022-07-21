/** @format */

import { useEffect, useRef, useState } from 'react';

export const useJsonWebsocket = <T>(
  url: string,
  eventCallbacks: {
    onOpen?: (event: WebSocketEventMap['open']) => void;
    onClose?: (event: WebSocketEventMap['close']) => void;
    onError?: (event: WebSocketEventMap['error']) => void;
    onMessage?: (event: WebSocketEventMap['message']) => void;
    onJson?: (json: T[]) => void;
  }
): WebSocket | null => {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const queuedMessages = useRef<T[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (queuedMessages.current.length) {
        if (eventCallbacks?.onJson) eventCallbacks.onJson(queuedMessages.current);
        queuedMessages.current = [];
      }
    }, 100);
    return () => clearInterval(interval);
  }, [eventCallbacks?.onJson]);

  useEffect(() => {
    const websocket = new WebSocket(url);
    setWebsocket(websocket);
    return () => {
      websocket.close();
      setWebsocket(null);
    };
  }, [url]);

  useEffect(() => {
    if (websocket != null) {
      websocket.onopen = (event) => eventCallbacks?.onOpen && eventCallbacks.onOpen(event);
      websocket.onclose = (event) => eventCallbacks?.onClose && eventCallbacks.onClose(event);
      websocket.onerror = (event) => eventCallbacks?.onError && eventCallbacks.onError(event);
      websocket.onmessage = (event) => {
        if (eventCallbacks?.onMessage) eventCallbacks.onMessage(event);
        queuedMessages.current.unshift(JSON.parse(event.data) as T);
      };
    }
  }, [websocket, eventCallbacks]);

  return websocket;
};
