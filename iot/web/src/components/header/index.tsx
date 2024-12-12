/** @format */
import { Link } from 'react-router-dom';

import { routes } from '@/router/routes';

import { Navbar } from '../navbar';
import pageStyles from '../page-structure/styles.module.scss';
import styles from './styles.module.scss';

export const Header: React.FunctionComponent = () => {
  return (
    <div className={`${pageStyles.header} ${styles.header}`}>
      <Link to={routes.home.path} className={styles.logo}>
        🏠 Homelab
      </Link>
      <Navbar />
    </div>
  );
};
