/** @format */
import { Link } from 'react-router-dom';

import { useRoute } from '@/common/hooks/route';
import { routes } from '@/router/routes';

import styles from './styles.module.scss';

export const Navbar: React.FunctionComponent = () => {
  const route = useRoute();

  return (
    <nav className={styles.navbar}>
      <Link
        className={
          `${styles.link} ` +
          `${route.path.startsWith(routes.devices.path) ? styles.active : styles.inactive}`
        }
        to={routes.devices?.path}
      >
        Devices
      </Link>
      <Link
        className={
          `${styles.link} ` +
          `${route.path.startsWith(routes.locations.path) ? styles.active : styles.inactive}`
        }
        to={routes.locations.path}
      >
        Locations
      </Link>
      <Link
        className={
          `${styles.link} ` +
          `${route?.path.startsWith(routes.measurements.path) ? styles.active : styles.inactive}`
        }
        to={routes.measurements.path}
      >
        Measurements
      </Link>
      <Link
        className={
          `${styles.link} ` +
          `${route?.path.startsWith(routes.metrics.path) ? styles.active : styles.inactive}`
        }
        to={routes.metrics.path}
      >
        Metrics
      </Link>
    </nav>
  );
};
