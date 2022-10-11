/** @format */

import { createAction } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from '../..';
import { config } from '../../../config';
import { Url } from '../../../utils/url';
import {
  CreateMeasurementWebsocketMessageType,
  DeleteMeasurementWebsocketMessageType,
  MeasurementsWebsocketUrlParamsType,
  isCreateMeasurementWebsocketMessageType,
  isDeleteMeasurementWebsocketMessageType,
  isUpdateMeasurementWebsocketMessageType,
  UpdateMeasurementWebsocketMessageType,
  UseMeasurementsWebsocketPropsType,
} from './types';

export const MeasurementsWebsocketUrl = new Url<null, MeasurementsWebsocketUrlParamsType>(
  `${config.urls.apis.iot.replace('http', 'ws')}/v0/measurements/ws`
);

export const CreateMeasurementMessageAction = createAction<CreateMeasurementWebsocketMessageType>(
  'createMeasurement/recieved'
);

export const UpdateMeasurementMessageAction = createAction<UpdateMeasurementWebsocketMessageType>(
  'updateMeasurement/recieved'
);

export const DeleteMeasurementMessageAction = createAction<DeleteMeasurementWebsocketMessageType>(
  'deleteMeasurement/recieved'
);

export const useMeasurementWebsocket = ({
  onOpen,
  onMessage,
  onClose,
  onError,
  access_token,
}: UseMeasurementsWebsocketPropsType) => {
  const dispatch = useDispatch();
  const websocket = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    if (access_token) {
      websocket.current = new WebSocket(MeasurementsWebsocketUrl.build({ access_token }));
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
        if (isCreateMeasurementWebsocketMessageType(data))
          dispatch(CreateMeasurementMessageAction(data));
        else if (isUpdateMeasurementWebsocketMessageType(data))
          dispatch(UpdateMeasurementMessageAction(data));
        else if (isDeleteMeasurementWebsocketMessageType(data))
          dispatch(DeleteMeasurementMessageAction(data));
        else
          console.error(
            `Unknown measurements websocket message type: \n${JSON.stringify(data, null, 4)}`
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
