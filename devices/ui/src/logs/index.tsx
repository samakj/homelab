/** @format */

<<<<<<< HEAD
import React, { useCallback, useState } from 'react';
import { PageSection } from '../shared-elements';
import { useJsonWebsocket } from '../websocket';
import {
  LevelSelect,
  LogLine,
  LogLineLevel,
  LogLineMessage,
  LogLineTimestamp,
  LogsContainer,
  LogsSectionTitle,
} from './elements';
import { LogLevel, LogsWebsocketDataType } from './types';

export const Logs: React.FunctionComponent = () => {
  const [closed, setClosed] = useState(false);
  const [lastMessage, setLastMessage] = useState<Date | null>(null);
  const [logs, setLogs] = useState<LogsWebsocketDataType[]>([]);
  const [logLevel, setLogLevel] = useState<LogLevel>(LogLevel.DEBUG);

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
      <LogsSectionTitle onClick={() => setClosed(!closed)}>
        <span>Logs</span>
        <LevelSelect
          onChange={(event) => setLogLevel(LogLevel[event.target.value.toUpperCase()])}
          defaultValue={logLevel}
        >
          <option>DEBUG</option>
          <option>INFO</option>
          <option>WARN</option>
          <option>ERROR</option>
        </LevelSelect>
      </LogsSectionTitle>
      <LogsContainer>
        {logs.map((log) => (
          <LogLine
            key={log.timestamp}
            level={log.level}
            hide={LogLevel[log.level.toUpperCase()] < logLevel}
          >
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
