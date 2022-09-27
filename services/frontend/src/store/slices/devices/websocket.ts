/** @format */

import { createAction } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '../..';
import { Url } from '../../../utils/url';
import {
  CreateDeviceWebsocketMessageType,
  DeleteDeviceWebsocketMessageType,
  DeviceWebsocketMessageType,
  isCreateDeviceWebsocketMessageType,
  isDeleteDeviceWebsocketMessageType,
  isUpdateDeviceWebsocketMessageType,
  UpdateDeviceWebsocketMessageType,
  UseDevicesWebsocketPropsType,
} from './types';

export const DevicesWebsocketUrl = new Url('http://iot.localhost/v0/devices/ws');

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
}: UseDevicesWebsocketPropsType) => {
  const dispatch = useDispatch();
  const websocket = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    websocket.current = new WebSocket(DevicesWebsocketUrl.build());
    websocket.current.onopen = (event) => {
      onOpen(event, websocket.current);
      setLastMessage(new Date().toISOString());
      setMessageCount(0);
    };
    websocket.current.onerror = (event) => onError(event, websocket.current);
    websocket.current.onclose = (event) => onClose(event, websocket.current);
    websocket.current.onmessage = (event: MessageEvent<DeviceWebsocketMessageType>) => {
      setLastMessage(new Date().toISOString());
      if (isCreateDeviceWebsocketMessageType(event.data))
        dispatch(CreateDeviceMessageAction(event.data));
      else if (isUpdateDeviceWebsocketMessageType(event.data))
        dispatch(UpdateDeviceMessageAction(event.data));
      else if (isDeleteDeviceWebsocketMessageType(event.data))
        dispatch(DeleteDeviceMessageAction(event.data));
      else
        throw Error(
          `Unknown devices websocket message type: \n${JSON.stringify(event.data, null, 4)}`
        );
      onMessage(event, websocket.current);
    };

    return () => websocket.current?.close();
  }, [dispatch, onOpen, onMessage, onError, onClose, setLastMessage, setMessageCount]);

  return { websocket, lastMessage, messageCount };
};
