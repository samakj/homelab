/** @format */
import styles from './styles.module.scss';
import { DeviceWifiSourcePropsType } from './types';

export const DeviceWifiSource: React.FunctionComponent<DeviceWifiSourcePropsType> = ({
  source,
}) => {
  return (
    <div className={`${styles.source} ${styles.wifi}`}>
      {source.strength == 'excellent' ? (
        <svg viewBox="0 0 24 24">
          <path d="M12.01 21.49 23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01z"></path>
        </svg>
      ) : source.strength == 'good' ? (
        <svg viewBox="0 0 24 24">
          <path
            fill-opacity=".3"
            d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"
          ></path>
          <path d="M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"></path>
        </svg>
      ) : source.strength == 'medium' ? (
        <svg viewBox="0 0 24 24">
          <path
            fill-opacity=".3"
            d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"
          ></path>
          <path d="M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"></path>
        </svg>
      ) : source.strength == 'weak' ? (
        <svg viewBox="0 0 24 24">
          <path
            fill-opacity=".3"
            d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"
          ></path>
          <path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"></path>
        </svg>
      ) : source.strength == 'minimal' ? (
        <svg viewBox="0 0 24 24">
          <path
            fill-opacity=".3"
            d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"
          ></path>
          <path d="M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"></path>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <path d="M12 6c3.33 0 6.49 1.08 9.08 3.07L12 18.17l-9.08-9.1C5.51 7.08 8.67 6 12 6m0-2C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4"></path>
        </svg>
      )}
    </div>
  );
};
