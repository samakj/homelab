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

  svg {
    display: block;
  }
`;

export const DateTooltip = styled.div`
  position: absolute;
  border: 1px solid ${({ theme }) => theme.colours.border.light};
  background: ${({ theme }) => theme.colours.background};
  padding: 0.125rem;
  transform: translateX(-50%);
  font-size: 0.75rem;
`;

export const PointValueTooltip = styled.div<{position: 'above' | 'below'}>`
  position: absolute;
  padding: 0.125rem;
  transform: translate(-50%, ${({position}) => position == 'above' ? '-125%' : '25%'});
  font-size: 0.75rem;
`;
