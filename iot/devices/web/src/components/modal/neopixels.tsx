/** @format */
import { useCallback } from 'preact/hooks';
import { useState } from 'react';
import { useEffect } from 'react';

import { SECOND_IN_MS } from '../../common/time';
import { DeviceNeopixelsSourceType, isDeviceNeopixelsSourceType } from '../sources/types';
import styles from './styles.module.scss';
import { SourceModalProps } from './types';

export const NeopixelsModal: React.FunctionComponent<SourceModalProps> = ({
  sourceId,
  setSourceId,
  setModalType,
}) => {
  const close = useCallback(() => {
    setModalType(undefined);
    setSourceId(undefined);
  }, [setModalType, setSourceId]);

  const [source, setSource] = useState<DeviceNeopixelsSourceType | undefined>(
    window.sources[sourceId] && isDeviceNeopixelsSourceType(window.sources[sourceId])
      ? window.sources[sourceId]
      : undefined
  );

  const updateColourPart = useCallback(
    (colour: keyof NonNullable<DeviceNeopixelsSourceType['colour']>, value: string) => {
      if (source && isDeviceNeopixelsSourceType(source)) {
        const newSource: DeviceNeopixelsSourceType = { ...source };
        newSource.colour = newSource.colour || { red: 0, green: 0, blue: 0, white: 0 };
        newSource.colour[colour] = parseInt(value);
        setSource(newSource);
      }
    },
    [source]
  );

  const updateColour = useCallback(
    (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

      if (!result) return undefined;

      const red = parseInt(result[1], 16);
      const green = parseInt(result[2], 16);
      const blue = parseInt(result[3], 16);

      if (source && isDeviceNeopixelsSourceType(source)) {
        const newSource: DeviceNeopixelsSourceType = { ...source };
        const white = Math.min(red, green, blue);
        newSource.colour = {
          red: red - white,
          green: green - white,
          blue: blue - white,
          white: white,
        };
        setSource(newSource);
      }
    },
    [source]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (source)
        fetch(`http://${window.deviceIp}/${source.id}`, {
          method: 'POST',
          body: JSON.stringify({
            colour: source.colour,
            duration: 300,
          }),
        });
    }, SECOND_IN_MS / 3);
    return () => clearTimeout(timeout);
  }, [source]);

  if (!source || !isDeviceNeopixelsSourceType(source)) {
    return 'Failed to get source';
  }

  return (
    <>
      <div className={styles.modalBackdrop} onClick={close} />
      <div className={styles.modal}>
        <div className={styles.title}>Update neopixels: {sourceId}</div>
        <div key={source.id} className={styles.source}>
          <span className={styles.colour}>
            <span
              className={styles.label}
              onClick={() => updateColourPart('red', source?.colour?.red ? '0' : '255')}
            >
              red
            </span>
            <span className={styles.value}>
              {source.colour?.red != null ? source.colour.red : '-'}
            </span>
            <div className={styles.bar}>
              <input
                type="range"
                value={source.colour?.red || 0}
                min={0}
                max={255}
                step={1}
                onInput={(event) => updateColourPart('red', event.currentTarget.value)}
              />
            </div>
          </span>
          <span className={styles.colour}>
            <span
              className={styles.label}
              onClick={() => updateColourPart('green', source?.colour?.green ? '0' : '255')}
            >
              green
            </span>
            <span className={styles.value}>
              {source.colour?.green != null ? source.colour.green : '-'}
            </span>
            <div className={styles.bar}>
              <input
                type="range"
                value={source.colour?.green || 0}
                min={0}
                max={255}
                step={1}
                onInput={(event) => updateColourPart('green', event.currentTarget.value)}
              />
            </div>
          </span>
          <span className={styles.colour}>
            <span
              className={styles.label}
              onClick={() => updateColourPart('blue', source?.colour?.blue ? '0' : '255')}
            >
              blue
            </span>
            <span className={styles.value}>
              {source.colour?.blue != null ? source.colour.blue : '-'}
            </span>
            <div className={styles.bar}>
              <input
                type="range"
                value={source.colour?.blue || 0}
                min={0}
                max={255}
                step={1}
                onInput={(event) => updateColourPart('blue', event.currentTarget.value)}
              />
            </div>
          </span>
          <span className={styles.colour}>
            <span
              className={styles.label}
              onClick={() => updateColourPart('white', source?.colour?.white ? '0' : '255')}
            >
              white
            </span>
            <span className={styles.value}>
              {source.colour?.white != null ? source.colour.white : '-'}
            </span>
            <div className={styles.bar}>
              <input
                type="range"
                value={source.colour?.white || 0}
                min={0}
                max={255}
                step={1}
                onInput={(event) => updateColourPart('white', event.currentTarget.value)}
              />
            </div>
          </span>
          <div className={styles.colourBox}>
            <input
              type="color"
              value={
                `#` +
                `${((source.colour?.red || 0) + (source.colour?.white || 0)).toString(16).padStart(2, '0')}` +
                `${((source.colour?.green || 0) + (source.colour?.white || 0)).toString(16).padStart(2, '0')}` +
                `${((source.colour?.blue || 0) + (source.colour?.white || 0)).toString(16).padStart(2, '0')}`
              }
              onInput={(event) => updateColour(event.currentTarget.value)}
            />
            <button onClick={() => updateColour('#000000')}>Off</button>
          </div>
        </div>
      </div>
    </>
  );
};
