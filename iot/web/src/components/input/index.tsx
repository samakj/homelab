/** @format */
import styles from './styles.module.scss';
import { InputPropsType } from './types';

export const Input: React.FunctionComponent<InputPropsType> = ({ className, ...rest }) => {
  return <input className={`${styles.input} ${className || ''}`} {...rest} />;
};
