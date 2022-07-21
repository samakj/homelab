/** @format */

import { useEffect, useState } from 'react';

export const useJsonWebsocket = <T>(
  url: string,
  eventCallbacks: {
    onOpen?: (event: WebSocketEventMap['open']) => void;
    onClose?: (event: WebSocketEventMap['close']) => void;
    onError?: (event: WebSocketEventMap['error']) => void;
    onMessage?: (event: WebSocketEventMap['message'], data: T) => void;
  }
): WebSocket | null => {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

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
      websocket.onmessage = (event) =>
        eventCallbacks?.onMessage && eventCallbacks.onMessage(event, JSON.parse(event.data) as T);
    }
  }, [websocket, eventCallbacks]);

  return websocket;
};
