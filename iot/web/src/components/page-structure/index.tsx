/** @format */
import styles from './styles.module.scss';
import {
  HeaderPropsType,
  MainPropsType,
  PageGridPropsType,
  PageStructurePropsType,
  SidebarPropsType,
} from './types';

export const PageStructure: React.FunctionComponent<PageStructurePropsType> = ({ children }) => (
  <div className={styles.pageStructure}>{children}</div>
);

export const Header: React.FunctionComponent<HeaderPropsType> = ({ children }) => (
  <div className={styles.header}>{children}</div>
);

export const Sidebar: React.FunctionComponent<SidebarPropsType> = ({ children }) => (
  <div className={styles.sidebar}>{children}</div>
);

export const Main: React.FunctionComponent<MainPropsType> = ({ children }) => (
  <div className={styles.main}>{children}</div>
);

export const PageGrid: React.FunctionComponent<PageGridPropsType> = ({ children }) => (
  <div className={styles.pageGrid}>{children}</div>
);
