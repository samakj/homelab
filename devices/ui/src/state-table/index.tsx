/** @format */

import React, { useCallback, useEffect, useState } from 'react';
import { PageSection } from '../shared-elements';
import { useJsonWebsocket } from '../websocket';
import {
  DeviceStateGrid,
  DeviceStateGridItem,
  DeviceStateGridItemMetric,
  DeviceStateGridItemTags,
  DeviceStateGridItemTimestamp,
  DeviceStateGridItemValue,
  DeviceStateSectionTitle,
} from './elements';
import { ReportWebsocketDataType, DeviceStateType, LiveTimeDeltaPropsType } from './types';

const formatMetric = (metric: string, value: string | number | boolean | null): string => {
  if (value == null) return '...';

  if (metric == 'temperature' && typeof value === 'number') return `${value.toFixed(1)}°c`;
  if (metric == 'humidity' && typeof value === 'number') return `${value.toFixed(1)}%`;
  if (metric == 'strength' && typeof value === 'number') return `${value.toFixed(1)}%`;

  return value.toString();
};

export const LiveTimeDelta: React.FunctionComponent<LiveTimeDeltaPropsType> = ({ date }) => {
  const [delta, setDelta] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      const dt = +new Date() - +new Date(date);
      if (dt < 1000) setDelta(`${dt}ms`);
      else setDelta(`${Math.round(dt / 1000)}s`);
    }, 100);
    return () => clearInterval(interval);
  }, [date]);

  return <span>{delta}</span>;
};

export const StateTable: React.FunctionComponent = () => {
  const [closed, setClosed] = useState(false);
  const [lastMessage, setLastMessage] = useState<Date | null>(null);
  const [deviceState, setDeviceState] = useState<DeviceStateType>({});

  const onMessage = useCallback(
    (_, data: ReportWebsocketDataType) => {
      data = { ...data, timestamp: data.timestamp || new Date().toISOString() };
      setLastMessage(new Date());
      if (data.metric !== 'ping')
        setDeviceState({ ...deviceState, [`${data.tags},${data.metric}`]: data });
    },
    [deviceState]
  );

  const websocket = useJsonWebsocket<ReportWebsocketDataType>(
    `ws://${process.env.IP_ADDRESS}/reports`,
    { onMessage }
  );

  return (
    <PageSection closed={closed}>
      <DeviceStateSectionTitle onClick={() => setClosed(!closed)}>
        <span>State</span>
        <span>
          Last Message <LiveTimeDelta date={lastMessage} />
        </span>
      </DeviceStateSectionTitle>
      <DeviceStateGrid>
        {Object.entries(deviceState)
          .sort(([keyA], [keyB]) => {
            if (keyA > keyB) return 1;
            if (keyA < keyB) return -1;
            return 0;
          })
          .map(([key, data]) => (
            <DeviceStateGridItem key={key}>
              <DeviceStateGridItemTags>{data.tags.join(', ')}</DeviceStateGridItemTags>
              <DeviceStateGridItemValue>
                {formatMetric(data.metric, data.message)}
              </DeviceStateGridItemValue>
              <DeviceStateGridItemMetric>{data.metric}</DeviceStateGridItemMetric>
              <DeviceStateGridItemTimestamp>
                {new Date(data.timestamp).toLocaleTimeString()}
              </DeviceStateGridItemTimestamp>
            </DeviceStateGridItem>
          ))}
      </DeviceStateGrid>
    </PageSection>
  );
};
