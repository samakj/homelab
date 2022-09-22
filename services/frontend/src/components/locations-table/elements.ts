/** @format */

import { transparentize } from 'polished';
import styled from 'styled-components';
import { ModalBodyElement } from '../modal/elements';

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

export const LocationsTableCellElement = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colours.border.light};
  border-bottom: 1px solid ${({ theme }) => theme.colours.border.light};
  padding: 0.5rem;
`;

export const LocationsTableNameCellElement = styled(LocationsTableCellElement)`
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

export const IconButtonContainerElement = styled.div`
  display: inline-block;
  padding: 0.5rem;
  margin-right: 0.25rem;
  transition: background-color 300ms;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: ${({ theme }) => transparentize(0.8, theme.colours.foreground)};
  }
`;

export const EditModalBodyElement = styled(ModalBodyElement)`
  display: grid;
  grid-gap: 0.5rem;
`;

export const CreateModalBodyElement = styled(ModalBodyElement)`
  display: grid;
  grid-gap: 0.5rem;
`;

export const ErrorElement = styled.pre`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colours.red};
`;
