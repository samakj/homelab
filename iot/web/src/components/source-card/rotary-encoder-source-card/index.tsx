/** @format */
import { GridCard } from '@/components/page-structure/cards';

import styles from '../styles.module.scss';
import { RotaryEncoderSourceCardPropsType } from './types';

export const RotaryEncoderSourceCard: React.FunctionComponent<RotaryEncoderSourceCardPropsType> = ({
  source,
}) => {
  return (
    <GridCard className={styles.sourceGridCard}>
      <span className={styles.value}>{source.position}</span>
      <span>Encoder Postion</span>
    </GridCard>
  );
};
