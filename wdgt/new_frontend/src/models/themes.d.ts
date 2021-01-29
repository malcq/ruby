import { css } from 'styled-components';

interface ThemeColors {
  primary: string;
  secondary: string;
  error: string;
  white: string;
  black: string;
  mineShaft: string;
  grey: string;
  lightgrey: string;
  athensgrey: string;
  red: string;
}

interface FontWeight {
  bold: number;
  medium: number;
  regular: number;
  light: number;
}

interface FontFamily {
  primary: string;
  secondary: string;
}

interface ZIndexes {
  [name: string]: number;
}

interface IDistances {
  actionDistance: string;
  messageActionDistance: string;
  avatarTop: string;
  clickableAreaHeightWithAvatar: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    fontFamily: string,
    fontColor: string,
    bgColor: string,
    typography: {
      fnBold: SimpleInterpolation,
      fnMedium: SimpleInterpolation,
      fnRegular: SimpleInterpolation,
      fnLight: SimpleInterpolation,
      fnTitle: SimpleInterpolation,
      fnBody: SimpleInterpolation,
      fnCaption: SimpleInterpolation,
      fnInputError: SimpleInterpolation,
      fnLabel: SimpleInterpolation,
    },
    fontWeightValues: FontWeight,
    fontFamilyValues: FontFamily,
    colorValues: ThemeColors,
    zIndex: ZIndexes,
    distances: IDistances,
  }
}