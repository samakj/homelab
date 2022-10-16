/** @format */

export interface ThemeType {
  colours: {
    black: string;
    white: string;
    red: string;
    foreground: string;
    background: string;
    border: {
      light: string;
    };
    placeholder: {
      light: string;
    };
    chartLines: string[];
  };
  dimensions: {
    sidebar: {
      width: string;
    };
  };
}
