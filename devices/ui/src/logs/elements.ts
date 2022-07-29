/** @format */
<<<<<<< HEAD

import styled from 'styled-components';
import { PageSectionTitle } from '../shared-elements';

export const LogsSectionTitle = styled(PageSectionTitle)`
  display: flex;
  justify-content: space-between;
`;

export const LogsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  max-height: calc(100% - 1.5rem);
  padding: 0.5rem 1rem;
`;

const levelColourMap = {
  debug: 'cyan',
  info: undefined,
  warn: 'yellow',
  error: 'red',
};

export const LogLine = styled.div<{ level: string; hide: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'grid')};
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
<<<<<<< HEAD
=======
>>>>>>> f347110 (fix: Start device ui with simple state view)
=======

export const LevelSelect = styled.select`
  background: none;
  border-color: transparent;
  color: white;
  outline: none;

  option {
    background-color: black;
  }
`;
>>>>>>> dadc84d (fix: Add log level filter)
