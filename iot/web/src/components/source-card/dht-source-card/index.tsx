/** @format */
import { GridCard } from '@/components/page-structure/cards';
import { useMetricByName } from '@/store/slices/metrics/hooks';

import styles from '../styles.module.scss';
import { DHTSourceCardPropsType } from './types';

export const DHTSourceCard: React.FunctionComponent<DHTSourceCardPropsType> = ({ source }) => {
  const temperatureMetric = useMetricByName('temperature');
  const humidityMetric = useMetricByName('humidity');

  return (
    <>
      <GridCard className={styles.sourceGridCard}>
        <span className={styles.value}>
          {source.temperature}
          {temperatureMetric?.unit}
        </span>
        <span>{temperatureMetric?.name}</span>
      </GridCard>
      <GridCard className={styles.sourceGridCard}>
        <span className={styles.value}>
          {source.humidity}
          {humidityMetric?.unit}
        </span>
        <span>{humidityMetric?.name}</span>
      </GridCard>
    </>
  );
};
