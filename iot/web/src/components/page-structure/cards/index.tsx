/** @format */
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';
import { CreateGridCardPropsType, GridCardPropsType, LinkGridCardPropsType } from './types';

export const GridCard: React.FunctionComponent<GridCardPropsType> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = '',
  ...rest
}) => (
  <div
    className={
      `${styles.gridCard} ` +
      `${styles[`rows-${rowSpan}`]} ${styles[`columns-${colSpan}`]} ` +
      `${className}`
    }
    {...rest}
  >
    {children}
  </div>
);

export const LinkGridCard: React.FunctionComponent<LinkGridCardPropsType> = ({
  children,
  to,
  colSpan = 1,
  rowSpan = 1,
  className = '',
  ...rest
}) => (
  <Link
    to={to}
    className={
      `${styles.gridCard} ` +
      `${styles.linkGridCard} ` +
      `${styles[`rows-${rowSpan}`]} ${styles[`columns-${colSpan}`]} ` +
      `${className || ''}`
    }
    {...rest}
  >
    {children}
  </Link>
);

export const CreateGridCard: React.FunctionComponent<CreateGridCardPropsType> = ({
  className = '',
  ...rest
}) => (
  <LinkGridCard className={`${styles.createGridCard} ${className}`} {...rest}>
    <span className={styles.icon}>+</span>
    <span className={styles.label}>Create</span>
  </LinkGridCard>
);
