/** @format */

import { createAction } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from '../..';
import { Url } from '../../../utils/url';
import {
  CreateDeviceWebsocketMessageType,
  DeleteDeviceWebsocketMessageType,
  DevicesWebsocketUrlParamsType,
  isCreateDeviceWebsocketMessageType,
  isDeleteDeviceWebsocketMessageType,
  isUpdateDeviceWebsocketMessageType,
  UpdateDeviceWebsocketMessageType,
  UseDevicesWebsocketPropsType,
} from './types';

export const DevicesWebsocketUrl = new Url<null, DevicesWebsocketUrlParamsType>(
  'ws://iot.localhost/v0/devices/ws'
);

export const CreateDeviceMessageAction =
  createAction<CreateDeviceWebsocketMessageType>('createDevice/recieved');

export const UpdateDeviceMessageAction =
  createAction<UpdateDeviceWebsocketMessageType>('updateDevice/recieved');

export const DeleteDeviceMessageAction =
  createAction<DeleteDeviceWebsocketMessageType>('deleteDevice/recieved');

export const useDeviceWebsocket = ({
  onOpen,
  onMessage,
  onClose,
  onError,
  access_token,
}: UseDevicesWebsocketPropsType) => {
  const dispatch = useDispatch();
  const websocket = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    if (access_token) {
      websocket.current = new WebSocket(DevicesWebsocketUrl.build({ access_token }));
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
        if (isCreateDeviceWebsocketMessageType(data)) dispatch(CreateDeviceMessageAction(data));
        else if (isUpdateDeviceWebsocketMessageType(data))
          dispatch(UpdateDeviceMessageAction(data));
        else if (isDeleteDeviceWebsocketMessageType(data))
          dispatch(DeleteDeviceMessageAction(data));
        else
          console.error(
            `Unknown devices websocket message type: \n${JSON.stringify(data, null, 4)}`
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
