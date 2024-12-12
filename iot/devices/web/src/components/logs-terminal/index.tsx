/** @format */
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

import { SECOND_IN_MS } from '../..//common/time';
import styles from './styles.module.scss';
import { LogMessageType, LogsTerminalPropsType } from './types';

const LOG_STORE_COUNT = 250;

export const LogsTerminal: React.FunctionComponent<LogsTerminalPropsType> = () => {
  const [_trigger, setTrigger] = useState(0);

  const logs = useRef<LogMessageType[]>([]);
  const logsWebsocket = useRef<WebSocket>();
  const websocketConnecting = useRef<boolean>(false);
  const websocketConnectTime = useRef<number>();
  const websocketManuallyClosed = useRef<boolean>(false);
  const rerenderTimeout = useRef<ReturnType<typeof setTimeout>>();

  const [showLevels, setShowLevels] = useState({
    debug: false,
    info: true,
    warn: true,
    error: true,
  });

  const queueRerender = useCallback(() => {
    if (!rerenderTimeout.current) {
      rerenderTimeout.current = setTimeout(() => {
        setTrigger(+new Date());
        rerenderTimeout.current = undefined;
      }, 300);
    }
  }, [setTrigger]);

  const connectToWebsocket = useCallback(async () => {
    if (websocketConnecting.current) {
      return;
    }

    websocketConnecting.current = true;

    await new Promise((resolve) => setTimeout(resolve, SECOND_IN_MS));

    logsWebsocket.current = new WebSocket(`ws://${window.deviceIp}/logs`);

    logsWebsocket.current.onmessage = (event) => {
      const log = JSON.parse(event.data) as LogMessageType;
      logs.current.unshift(log);

      if (logs.current.length > LOG_STORE_COUNT) {
        logs.current = logs.current.slice(0, LOG_STORE_COUNT);
      }

      queueRerender();

      websocketConnecting.current = false;
    };

    logsWebsocket.current.onopen = () => {
      websocketConnectTime.current = +new Date();
    };

    logsWebsocket.current.onclose = () => {
      websocketConnectTime.current = undefined;
      logsWebsocket.current?.close();
      if (!websocketManuallyClosed.current) {
        connectToWebsocket();
        logs.current.unshift({
          level: 'error',
          timestamp: new Date().toISOString(),
          message: 'Websocket closed, reconnecting...',
        });
      }
    };

    logsWebsocket.current.onerror = () => {
      websocketConnectTime.current = undefined;
      logsWebsocket.current?.close();
      if (!websocketManuallyClosed.current) {
        connectToWebsocket();
        logs.current.unshift({
          level: 'error',
          timestamp: new Date().toISOString(),
          message: 'Websocket error, reconnecting...',
        });
      }
    };
  }, [queueRerender]);

  useEffect(() => {
    connectToWebsocket();
    return () => {
      websocketManuallyClosed.current = true;
      logsWebsocket.current?.close();
    };
  }, [connectToWebsocket]);

  return (
    <div className={styles.terminal}>
      <div className={styles.topBar}>
        <div className={styles.hostConnection}>
          <div
            className={`${styles.connectionIndicator} ${logsWebsocket.current?.readyState === WebSocket.OPEN ? styles.connected : ''}`}
          ></div>
          <span className={styles.host}>ws://{window.deviceIp}/logs</span>
        </div>

        <div className={styles.levelInputs}>
          <label>
            <input
              type="checkbox"
              checked={showLevels.debug}
              onChange={(event) =>
                setShowLevels({ ...showLevels, debug: event.currentTarget.checked })
              }
            />
            debug
          </label>
          <label>
            <input
              type="checkbox"
              checked={showLevels.info}
              onChange={(event) =>
                setShowLevels({ ...showLevels, info: event.currentTarget.checked })
              }
            />
            info
          </label>
          <label>
            <input
              type="checkbox"
              checked={showLevels.warn}
              onChange={(event) =>
                setShowLevels({ ...showLevels, warn: event.currentTarget.checked })
              }
            />
            warn
          </label>
          <label>
            <input
              type="checkbox"
              checked={showLevels.error}
              onChange={(event) =>
                setShowLevels({ ...showLevels, error: event.currentTarget.checked })
              }
            />
            error
          </label>
        </div>
      </div>
      <div className={styles.logs}>
        {logs.current.map(
          (log) =>
            showLevels[log.level] && (
              <pre
                key={`${log.timestamp}:${log.message}`}
                className={`${styles.logLine} ${styles[log.level]}`}
              >
                <span className={styles.timestamp}>
                  {log.timestamp.replace('T', ' ').split('.')[0]}
                </span>
                <span className={styles.message}>{log.message}</span>
              </pre>
            )
        )}
      </div>
    </div>
  );
};
