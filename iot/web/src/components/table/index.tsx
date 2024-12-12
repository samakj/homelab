/** @format */
import styles from './styles.module.scss';
import {
  TBodyPropsType,
  TDPropsType,
  THPropsType,
  THeadPropsType,
  TRPropsType,
  TablePropsType,
} from './types';

export const Table: React.FunctionComponent<TablePropsType> = ({
  children,
  className = '',
  ...rest
}) => (
  <table className={`${styles.table} ${className}`} {...rest}>
    {children}
  </table>
);

export const THead: React.FunctionComponent<THeadPropsType> = ({
  children,
  className = '',
  ...rest
}) => (
  <thead className={`${styles.thead} ${className}`} {...rest}>
    {children}
  </thead>
);

export const TBody: React.FunctionComponent<TBodyPropsType> = ({
  children,
  className = '',
  ...rest
}) => (
  <tbody className={`${styles.tbody} ${className}`} {...rest}>
    {children}
  </tbody>
);

export const TR: React.FunctionComponent<TRPropsType> = ({ children, className = '', ...rest }) => (
  <tr className={`${styles.tr} ${className}`} {...rest}>
    {children}
  </tr>
);

export const TH: React.FunctionComponent<THPropsType> = ({
  children,
  className = '',
  left,
  center,
  right,
  ...rest
}) => (
  <th
    className={
      `${styles.td} ` +
      `${left ? styles.left : center ? styles.center : right ? styles.right : ''} ` +
      `${className}`
    }
    {...rest}
  >
    {children}
  </th>
);

export const TD: React.FunctionComponent<TDPropsType> = ({
  children,
  className = '',
  left,
  center,
  right,
  ...rest
}) => (
  <td
    className={
      `${styles.td} ` +
      `${left ? styles.left : center ? styles.center : right ? styles.right : ''} ` +
      `${className}`
    }
    {...rest}
  >
    {children}
  </td>
);
