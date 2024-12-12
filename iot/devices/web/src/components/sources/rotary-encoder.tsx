/** @format */
import styles from './styles.module.scss';
import { DeviceRotaryEncoderSourcePropsType } from './types';

export const DeviceRotaryEncoderSource: React.FunctionComponent<
  DeviceRotaryEncoderSourcePropsType
> = ({ source }) => {
  return <div className={styles.source}>{source.id}</div>;
};
