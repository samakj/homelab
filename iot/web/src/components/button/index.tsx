/** @format */
import styles from './styles.module.scss';
import { ButtonPropsType } from './types';

export const Button: React.FunctionComponent<ButtonPropsType> = ({ className, ...rest }) => {
  return <button className={`${styles.button} ${className || ''}`} {...rest} />;
};
