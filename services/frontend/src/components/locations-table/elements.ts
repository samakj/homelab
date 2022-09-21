/** @format */

import styled from 'styled-components';

export const LocationsTableElement = styled.table`
  border: 1px solid ${({ theme }) => theme.colours.border.light};
  border-collapse: collapse;
`;

export const LocationsTableHeaderCellElement = styled.th`
  font-weight: normal;
  font-size: 0.75rem;
  text-transform: uppercase;
  text-align: left;
  padding: 0.5rem;
`;

export const LocationsTableCellElemnt = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colours.border.light};
  border-bottom: 1px solid ${({ theme }) => theme.colours.border.light};
  padding: 0.5rem;
`;

export const LocationsTableNameCellElement = styled(LocationsTableCellElemnt)`
  text-transform: capitalize;
`;

export const LocationTagElement = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.colours.foreground};
  color: ${({ theme }) => theme.colours.background};
  font-size: 0.675rem;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  margin: 0.125rem 0.25rem 0.125rem 0;
  font-weight: bold;

  &:last-child {
    margin-right: 0;
  }
`;
