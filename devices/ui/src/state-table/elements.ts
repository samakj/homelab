/** @format */

import styled from 'styled-components';
import { PageSectionTitle } from '../shared-elements';

export const DeviceStateSectionTitle = styled(PageSectionTitle)`
  display: flex;
  justify-content: space-between;
`

export const DeviceStateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 12rem);
  grid-gap: 1rem;
  padding: 1rem;
`;

export const DeviceStateGridItem = styled.div`
  display: grid;
  width: 100%;
  min-height: 6rem;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr auto auto;
  grid-template-areas: 'tags' 'value' 'metric' 'timestamp';
  grid-gap: 0.25rem;
`;

export const DeviceStateGridItemTags = styled.span`
  grid-area: tags;
  font-weight: bold;
  text-transform: capitalize;
`;
export const DeviceStateGridItemValue = styled.span`
  grid-area: value;
  font-size: 2rem;
`;
export const DeviceStateGridItemMetric = styled.span`
  grid-area: metric;
  font-size: 0.75rem;
`;
export const DeviceStateGridItemTimestamp = styled.span`
  grid-area: timestamp;
  font-size: 0.75rem;
`;
