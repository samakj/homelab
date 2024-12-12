/** @format */
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

import { SECOND_IN_MS } from '../../common/time';
import { DeviceButtonSource } from './button';
import { DeviceDHTSource } from './dht';
import { DeviceIRSenderSource } from './ir-sender';
import { DeviceNeopixelsSource } from './neopixels';
import { DeviceNTPSource } from './ntp';
import { DeviceRotaryEncoderSource } from './rotary-encoder';
import styles from './styles.module.scss';
import { DeviceTEMT6000Source } from './temt6000';
import {
  DeviceSourceType,
  SourcesPropsType,
  isDeviceButtonSourceType,
  isDeviceDHTSourceType,
  isDeviceIRSenderourceType,
  isDeviceNTPSourceType,
  isDeviceNeopixelsSourceType,
  isDeviceRotaryEncoderSourceType,
  isDeviceTEMT6000SourceType,
  isDeviceWifiSourceType,
} from './types';
import { DeviceWifiSource } from './wifi';

declare global {
  interface Window {
    sources: { [id: string]: DeviceSourceType };
  }
}

export const Sources: React.FunctionComponent<SourcesPropsType> = ({
  setModalSourceId,
  setModalType,
  content,
  setContent,
}) => {
  const [_trigger, setTrigger] = useState(0);

  const sourcesWebsocket = useRef<WebSocket>();
  const websocketConnecting = useRef<boolean>(false);
  const websocketConnectTime = useRef<number>();
  const websocketManuallyClosed = useRef<boolean>(false);
  const rerenderTimeout = useRef<ReturnType<typeof setTimeout>>();

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

    sourcesWebsocket.current = new WebSocket(`ws://${window.deviceIp}/reports`);

    sourcesWebsocket.current.onmessage = (event) => {
      if (window.sources) {
        const report = JSON.parse(event.data) as DeviceSourceType;
        window.sources = window.sources || {};
        window.sources[report.id] = report;
        queueRerender();
      }
    };

    sourcesWebsocket.current.onopen = () => {
      websocketConnectTime.current = +new Date();
      websocketConnecting.current = false;
    };

    sourcesWebsocket.current.onclose = () => {
      websocketConnectTime.current = undefined;
      sourcesWebsocket.current?.close();
      if (!websocketManuallyClosed.current) connectToWebsocket();
    };

    sourcesWebsocket.current.onerror = () => {
      websocketConnectTime.current = undefined;
      sourcesWebsocket.current?.close();
      if (!websocketManuallyClosed.current) connectToWebsocket();
    };
  }, [queueRerender]);

  useEffect(() => {
    connectToWebsocket();
    return () => {
      websocketManuallyClosed.current = true;
      sourcesWebsocket.current?.close();
    };
  }, [connectToWebsocket]);

  useEffect(() => {
    fetch(`http://${window.deviceIp}/sources`)
      .then((resp) => resp.json())
      .then((data) => {
        window.sources = window.sources || {};
        data.forEach((id) => {
          window.sources[id] = {} as DeviceSourceType;
        });
        queueRerender();
      });
  }, [queueRerender]);

  return (
    <div className={styles.sources}>
      {window.sources == null ? (
        <div className={styles.source}>loading...</div>
      ) : (
        <>
          <div
            className={styles.source}
            onClick={() => setContent(content === 'logs' ? 'docs' : 'logs')}
          >
            Switch to {content === 'logs' ? 'docs' : 'logs'}
          </div>
          {Object.values(window.sources).map((source) =>
            isDeviceButtonSourceType(source) ? (
              <DeviceButtonSource source={source} />
            ) : isDeviceDHTSourceType(source) ? (
              <DeviceDHTSource source={source} />
            ) : isDeviceIRSenderourceType(source) ? (
              <DeviceIRSenderSource
                source={source}
                setModalSourceId={setModalSourceId}
                setModalType={setModalType}
              />
            ) : isDeviceNeopixelsSourceType(source) ? (
              <DeviceNeopixelsSource
                source={source}
                setModalSourceId={setModalSourceId}
                setModalType={setModalType}
              />
            ) : isDeviceNTPSourceType(source) ? (
              <DeviceNTPSource source={source} />
            ) : isDeviceTEMT6000SourceType(source) ? (
              <DeviceTEMT6000Source source={source} />
            ) : isDeviceRotaryEncoderSourceType(source) ? (
              <DeviceRotaryEncoderSource source={source} />
            ) : isDeviceWifiSourceType(source) ? (
              <DeviceWifiSource source={source} />
            ) : (
              // @ts-expect-error Fallback case
              <div key={source.id} className={styles.source}>
                {/* @ts-expect-error Fallback case */}
                {source.id}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};
