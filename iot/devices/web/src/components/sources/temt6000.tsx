/** @format */
import styles from './styles.module.scss';
import { DeviceTEMT6000SourcePropsType } from './types';

export const DeviceTEMT6000Source: React.FunctionComponent<DeviceTEMT6000SourcePropsType> = ({
  source,
}) => {
  return (
    <div className={styles.source}>
      <span className={styles.label}>Light Level</span>
      <span className={styles.value}>{source.lux?.toFixed?.(0) || '- '}lux</span>
    </div>
  );
};
