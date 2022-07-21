/** @format */

import styled from 'styled-components';

export const LogsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  height: fill-available;
  padding: 0.5rem 1rem;
`;

const levelColourMap = {
  debug: 'cyan',
  info: undefined,
  warn: 'yellow',
  error: 'red',
};

export const LogLine = styled.div<{ level: string }>`
  display: grid;
  grid-template-areas: 'timestamp level message';
  grid-template-columns: 3rem 2.5rem 1fr;
  grid-gap: 0.5rem;
  color: ${({ level }) => levelColourMap[level]};
`;

export const LogLineLevel = styled.span`
  grid-area: level;
  text-transform: uppercase;
  font-size: 0.75rem;
`;
export const LogLineTimestamp = styled.span`
  grid-area: timestamp;
  font-size: 0.75rem;
`;
export const LogLineMessage = styled.span`
  grid-area: message;
  font-size: 0.75rem;
`;
