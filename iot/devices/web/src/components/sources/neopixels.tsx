/** @format */
import { useCallback } from 'preact/hooks';

import styles from './styles.module.scss';
import { DeviceNeopixelsSourcePropsType } from './types';

export const DeviceNeopixelsSource: React.FunctionComponent<DeviceNeopixelsSourcePropsType> = ({
  source,
  setModalSourceId,
  setModalType,
}) => {
  const onClick = useCallback(() => {
    setModalSourceId(source.id);
    setModalType('neopixels');
  }, [source.id, setModalSourceId, setModalType]);

  return (
    <div className={styles.source} onClick={onClick}>
      <span className={styles.colour}>
        <span className={styles.label}>red</span>
        <span className={styles.value}>{source.colour?.red != null ? source.colour.red : '-'}</span>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${(100 * (source.colour?.red || 0)) / 255}%` }}
          />
        </div>
      </span>
      <span className={styles.colour}>
        <span className={styles.label}>green</span>
        <span className={styles.value}>
          {source.colour?.green != null ? source.colour.green : '-'}
        </span>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${(100 * (source.colour?.green || 0)) / 255}%` }}
          />
        </div>
      </span>
      <span className={styles.colour}>
        <span className={styles.label}>blue</span>
        <span className={styles.value}>
          {source.colour?.blue != null ? source.colour.blue : '-'}
        </span>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${(100 * (source.colour?.blue || 0)) / 255}%` }}
          />
        </div>
      </span>
      <span className={styles.colour}>
        <span className={styles.label}>white</span>
        <span className={styles.value}>
          {source.colour?.white != null ? source.colour.white : '-'}
        </span>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${(100 * (source.colour?.white || 0)) / 255}%` }}
          />
        </div>
      </span>
    </div>
  );
};
