/** @format */

import styled from 'styled-components';

export const LayoutGridElement = styled.div`
  display: grid;
  height: 100%;
  overflow: hidden;
  grid-template-rows: auto 1fr;
  grid-row-gap: 1rem;
`;

export const FiltersContainerElement = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 16rem);
  grid-gap: 1rem;
`;

export const ChartContainerElement = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;

  svg {
    display: block;
  }
`;

export const DateHeaderElement = styled.div`
  grid-column: span 2;
  margin-bottom: 0.25rem;
  width: fill-available;
  text-align: center;
  font-weight: bold;
`;

export const PointValueTooltip = styled.div<{ position: 'above' | 'below' }>`
  position: absolute;
  padding: 0.125rem;
  transform: translate(-50%, ${({ position }) => (position == 'above' ? '-125%' : '25%')});
  font-size: 0.75rem;
`;

export const MainTooltip = styled.div`
  position: absolute;
  border: 1px solid ${({ theme }) => theme.colours.border.light};
  background: ${({ theme }) => theme.colours.background};
  padding: 0.5rem;
  font-size: 0.75rem;
  display: grid;
  grid-template-columns: auto auto;
  grid-row-gap: 0.25rem;
  grid-column-gap: 0.375rem;
`;

export const LocationHeaderElement = styled.div`
  display: flex;
  align-items: center;
  grid-column: span 2;
  font-weight: bold;
  text-transform: capitalize;
`;

export const MetricELement = styled.div`
  padding-left: 0.25rem;
`;

export const LocationLabelElement = styled.div`
  display: flex;
  align-items: center;
`;

export const LocationColourElement = styled.div`
  height: 0.5rem;
  width: 0.5rem;
  margin-right: 0.25rem;
`;
