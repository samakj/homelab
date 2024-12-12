/** @format */
import { GridCard } from '@/components/page-structure/cards';

import styles from '../styles.module.scss';
import { WifiSourceCardPropsType } from './types';

export const WifiSourceCard: React.FunctionComponent<WifiSourceCardPropsType> = ({ source }) => {
  return (
    <GridCard className={styles.sourceGridCard}>
      <span className={styles.value}>{source.strength}</span>
      <span>Wifi</span>
    </GridCard>
  );
};
