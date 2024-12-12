/** @format */
import styles from './styles.module.scss';

export const PageGrid: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.pageGrid}>{children}</div>;
};
