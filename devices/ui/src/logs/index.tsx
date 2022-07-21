/** @format */

<<<<<<< HEAD
import React, { useCallback, useState } from 'react';
import { PageSection, PageSectionTitle } from '../shared-elements';
import { useJsonWebsocket } from '../websocket';
import { LogLine, LogLineLevel, LogLineMessage, LogLineTimestamp, LogsContainer } from './elements';
import { LogsWebsocketDataType } from './types';

export const Logs: React.FunctionComponent = () => {
  const [closed, setClosed] = useState(false);
  const [lastMessage, setLastMessage] = useState<Date | null>(null);
  const [logs, setLogs] = useState<LogsWebsocketDataType[]>([]);

  const onJson = useCallback(
    (newLogs: LogsWebsocketDataType[]) => {
      setLastMessage(new Date());
      setLogs(
        [
          ...newLogs.map((log) => ({
            ...log,
            timestamp: log.timestamp || new Date().toISOString(),
          })),
          ...logs,
        ].slice(0, 1000)
      );
    },
    [logs]
  );

  const websocket = useJsonWebsocket<LogsWebsocketDataType>(`ws://${process.env.IP_ADDRESS}/logs`, {
    onJson,
  });

  return (
    <PageSection closed={closed}>
      <PageSectionTitle onClick={() => setClosed(!closed)}>Logs</PageSectionTitle>
      <LogsContainer>
        {logs.map((log) => (
          <LogLine key={log.timestamp} level={log.level}>
            <LogLineTimestamp>{new Date(log.timestamp).toLocaleTimeString()}</LogLineTimestamp>
            <LogLineLevel>{log.level}</LogLineLevel>
            <LogLineMessage>{log.message}</LogLineMessage>
          </LogLine>
        ))}
      </LogsContainer>
=======
import React, { useState } from 'react';
import { PageSection, PageSectionTitle } from '../shared-elements';

export const Logs: React.FunctionComponent = () => {
  const [closed, setClosed] = useState(false);
  return (
    <PageSection closed={closed}>
      <PageSectionTitle onClick={() => setClosed(!closed)}>Logs</PageSectionTitle>
>>>>>>> f347110 (fix: Start device ui with simple state view)
    </PageSection>
  );
};
