/** @format */

import { transparentize } from 'polished';
import { ThemeType } from './types';

const theme = {
  colours: {
    black: '#000',
    white: '#fff',
    red: '#f00',
  },
  dimensions: {
    sidebar: {
      width: '16rem',
    },
  },
} as ThemeType;

theme.colours.foreground = theme.colours.white;
theme.colours.background = theme.colours.black;
theme.colours.border = {
  light: transparentize(0.9, theme.colours.foreground),
};
theme.colours.placeholder = {
  light: transparentize(0.9, theme.colours.foreground),
};

const GENERATE_COLOURS_SEED = 360 * Math.random();
const generateLineColours = (count: number): string[] =>
  Array(count)
    .fill(null)
    .map((_, index) => `hsl(${GENERATE_COLOURS_SEED + (index * 360) / count}, 100%, 50%)`);

theme.colours.chartLines = generateLineColours(10);

export { theme };
