/** @format */
import styles from './styles.module.scss';
import { DeviceButtonSourcePropsType } from './types';

export const DeviceButtonSource: React.FunctionComponent<DeviceButtonSourcePropsType> = ({
  source,
}) => {
  return <div className={styles.source}>{source.id}</div>;
};
