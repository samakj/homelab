/** @format */

import { transparentize } from 'polished';
import styled from 'styled-components';

export const PageStructureElement = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'header header' 'aside main';
`;

export const PageHeaderElement = styled.header`
  grid-area: header;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => transparentize(0.9, theme.colours.white)};
`;

export const PageAsideElement = styled.aside`
  grid-area: aside;
  border-right: 1px solid ${({ theme }) => transparentize(0.9, theme.colours.white)};
`;

export const PageMainElement = styled.main`
  grid-area: main;
  padding: 1rem;
`;

export const HeaderElement = styled.h1`
  width: ${({ theme }) => theme.dimensions.sidebar.width};
  text-align: center;
  margin: 0.5rem 0;
`;

export const AsideContentElement = styled.div`
  width: ${({ theme }) => theme.dimensions.sidebar.width};
`;
