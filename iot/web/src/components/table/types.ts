/** @format */

export interface TablePropsType extends React.HTMLProps<HTMLTableElement> {
  children: React.ReactNode;
}

export interface THeadPropsType extends React.HTMLProps<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TBodyPropsType extends React.HTMLProps<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TRPropsType extends React.HTMLProps<HTMLTableRowElement> {
  children: React.ReactNode;
}

export interface THPropsType extends React.HTMLProps<HTMLTableCellElement> {
  children: React.ReactNode;
  left?: boolean;
  center?: boolean;
  right?: boolean;
}

export interface TDPropsType extends React.HTMLProps<HTMLTableCellElement> {
  children: React.ReactNode;
  left?: boolean;
  center?: boolean;
  right?: boolean;
}
