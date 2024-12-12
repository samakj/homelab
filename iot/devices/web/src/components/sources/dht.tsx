/** @format */
import styles from './styles.module.scss';
import { DeviceDHTSourcePropsType } from './types';

export const DeviceDHTSource: React.FunctionComponent<DeviceDHTSourcePropsType> = ({ source }) => {
  return (
    <>
      <div className={styles.source}>
        <span className={styles.label}>temperature</span>
        <span className={styles.value}>
          {source.temperature != null ? source.temperature : '- '}&deg;c
        </span>
      </div>
      <div className={styles.source}>
        <span className={styles.label}>humidity</span>
        <span className={styles.value}>{source.humidity != null ? source.humidity : '- '}%</span>
      </div>
    </>
  );
};
