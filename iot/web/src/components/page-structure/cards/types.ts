/** @format */
import { LinkProps } from 'react-router-dom';

export interface GridCardPropsType extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

export interface LinkGridCardPropsType
  extends Pick<GridCardPropsType, 'colSpan' | 'rowSpan'>,
    LinkProps {}

export interface CreateGridCardPropsType extends Omit<LinkGridCardPropsType, 'children'> {}
