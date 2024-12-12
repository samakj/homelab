/** @format */
import { GridCard } from '@/components/page-structure/cards';

import styles from '../styles.module.scss';
import { ButtonSourceCardPropsType } from './types';

export const ButtonSourceCard: React.FunctionComponent<ButtonSourceCardPropsType> = ({
  source,
}) => {
  return (
    <GridCard className={styles.sourceGridCard}>
      <span className={styles.value}>{source.state?.toString()}</span>
      <span>Button</span>
    </GridCard>
  );
};
