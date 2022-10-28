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

const hueRanges = [
  [48, 64],
  [160, 320],
];
const luminanceRange = [40, 70];
const generateLineColours = (count: number, luminanceCount: number): string[] => {
  const luminanceStep = (luminanceRange[1] - luminanceRange[0]) / (luminanceCount - 1);
  const hueCount = Math.ceil(count / luminanceCount);
  const hueStep = hueRanges.reduce((acc, range) => acc + range[1] - range[0], 0) / hueCount;
  const colours: string[] = [];

  for (let luminanceIndex = 0; luminanceIndex < luminanceCount; luminanceIndex += 1) {
    for (let hueIndex = 0; hueIndex < hueCount; hueIndex += 1) {
      let hue = hueRanges[0][0];
      let hueOffset = hueIndex * hueStep;

      for (const range of hueRanges) {
        hue = range[0] + hueOffset;
        if (hue < range[1]) break;
        hueOffset = hue - range[1];
      }

      colours.push(
        `hsl(
          ${hue + (hueStep * luminanceIndex) / luminanceCount}deg, 
          100%, 
          ${luminanceRange[0] + luminanceIndex * luminanceStep}%
        )`.replace(/\s/g, '')
      );
    }
  }

  return colours;
};

theme.colours.chartLines = generateLineColours(24, 3);

export { theme };
