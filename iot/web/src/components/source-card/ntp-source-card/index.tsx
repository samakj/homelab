/** @format */
import { useEffect, useMemo, useState } from 'react';

import { GridCard } from '@/components/page-structure/cards';
import { DAY_IN_MS, HOUR_IN_MS, MINUTE_IN_MS, SECOND_IN_MS } from '@/configs/timing';

import styles from '../styles.module.scss';
import { NtpSourceCardPropsType } from './types';

export const NTPSourceCard: React.FunctionComponent<NtpSourceCardPropsType> = ({ source }) => {
  const [uptime, setUptime] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (source.startTimestamp && source.startTimestampOffset) {
        const start = +new Date(source.startTimestamp) - source.startTimestampOffset;
        setUptime(+new Date() - start);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [source.startTimestamp, source.startTimestampOffset]);

  const serialisedUptime = useMemo(() => {
    if (!uptime) return '-';

    let _uptime = uptime;
    const days = Math.floor(_uptime / DAY_IN_MS);
    _uptime -= days * DAY_IN_MS;
    const hours = Math.floor(_uptime / HOUR_IN_MS);
    _uptime -= hours * HOUR_IN_MS;
    const minutes = Math.floor(_uptime / MINUTE_IN_MS);
    _uptime -= minutes * MINUTE_IN_MS;
    const seconds = Math.floor(_uptime / SECOND_IN_MS);
    _uptime -= seconds * SECOND_IN_MS;

    if (days) {
      return `${days}d ${hours}h`;
    }
    if (hours) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes) {
      return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
  }, [uptime]);

  return (
    <GridCard className={styles.sourceGridCard}>
      <span className={styles.value}>{serialisedUptime}</span>
      <span>Uptime</span>
    </GridCard>
  );
};
