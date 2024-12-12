/** @format */
import { useState } from 'preact/hooks';
import { useEffect } from 'react';

import { SECOND_IN_MS, formatTimeDelta } from '../../common/time';
import styles from './styles.module.scss';
import { DeviceNTPSourcePropsType } from './types';

export const DeviceNTPSource: React.FunctionComponent<DeviceNTPSourcePropsType> = ({ source }) => {
  const [_trigger, setTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger(+new Date());
      return () => clearInterval(interval);
    }, SECOND_IN_MS);
  }, [setTrigger]);

  return (
    <div className={`${styles.source} ${styles.ntp}`}>
      <span className={styles.label}>Uptime</span>
      <span className={styles.value}>
        {source.startTimestamp && source.startTimestampOffset
          ? formatTimeDelta(
              +new Date() - +new Date(source.startTimestamp) + source.startTimestampOffset
            )
          : '-'}
      </span>
    </div>
  );
};
