/** @format */

import 'styled-components';
import { ThemeType } from './style/theme';

declare var process: {
  env: {
    ENVIRONMENT: 'dev' | 'prod';
    HOSTNAME: string;
    IP_ADDRESS: string;
  };
};

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
