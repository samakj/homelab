/** @format */
import { GridCard } from '@/components/page-structure/cards';
import { useMetricByName } from '@/store/slices/metrics/hooks';

import styles from '../styles.module.scss';
import { TEMT6000SourceCardPropsType } from './types';

export const TEMT6000SourceCard: React.FunctionComponent<TEMT6000SourceCardPropsType> = ({
  source,
}) => {
  const lightLevelMetric = useMetricByName('light level');

  return (
    <GridCard className={styles.sourceGridCard}>
      <span className={styles.value}>
        {source.lux && Math.floor(source.lux)}
        {lightLevelMetric?.unit}
      </span>
      <span>{lightLevelMetric?.name}</span>
    </GridCard>
  );
};
