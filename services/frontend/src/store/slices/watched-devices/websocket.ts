/** @format */

import { createAction } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from '../..';
import { config } from '../../../config';
import { Url } from '../../../utils/url';
import {
  WatchedDevicesWebsocketUrlParamsType,
  isUpdateWatchedDevicesWebsocketMessageType,
  UpdateWatchedDevicesWebsocketMessageType,
  UseWatchedDevicesWebsocketPropsType,
} from './types';

export const WatchedDevicesWebsocketUrl = new Url<null, WatchedDevicesWebsocketUrlParamsType>(
  `${config.urls.scrapers.devices.replace('http', 'ws')}/v0/watch/ws`
);

export const UpdateWatchedDevicesMessageAction =
  createAction<UpdateWatchedDevicesWebsocketMessageType>('updateWatchedDevices/recieved');

export const useWatchedDevicesWebsocket = ({
  onOpen,
  onMessage,
  onClose,
  onError,
  access_token,
}: UseWatchedDevicesWebsocketPropsType) => {
  const dispatch = useDispatch();
  const websocket = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    if (access_token) {
      websocket.current = new WebSocket(WatchedDevicesWebsocketUrl.build({ access_token }));
      websocket.current.onopen = (event) => {
        onOpen?.(event, websocket.current);
        setLastMessage(new Date().toISOString());
        setMessageCount(0);
      };
      websocket.current.onerror = (event) => onError?.(event, websocket.current);
      websocket.current.onclose = (event) => onClose?.(event, websocket.current);
      websocket.current.onmessage = (event: MessageEvent<string>) => {
        setLastMessage(new Date().toISOString());
        const data = JSON.parse(event.data);
        if (isUpdateWatchedDevicesWebsocketMessageType(data))
          dispatch(UpdateWatchedDevicesMessageAction(data));
        else
          console.error(
            `Unknown watched devices websocket message type: \n${JSON.stringify(data, null, 4)}`
          );
        onMessage?.(event, data, websocket.current);
      };
    }

    return () => websocket.current?.close();
  }, [
    dispatch,
    access_token,
    onOpen,
    onMessage,
    onError,
    onClose,
    setLastMessage,
    setMessageCount,
  ]);

  return { websocket, lastMessage, messageCount };
};
