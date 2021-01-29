import { css, DefaultTheme } from 'styled-components';

import {
  colors,
  fontFamily,
  fontWeight,
  zIndex,
} from './constants';


/*
* Default Theme (Mobile)
*/
export const themeDefaultMobile: DefaultTheme = {
  fontFamily: fontFamily.primary,
  fontColor: colors.black,
  bgColor: colors.white,
  typography: {
    fnBold: css`
      font-family: ${fontFamily.primary};
      font-weight: ${fontWeight.bold};
      font-style: normal;
    `,
    fnMedium: css`
      font-family: ${fontFamily.primary};
      font-weight: ${fontWeight.medium};
      font-style: normal;
    `,
    fnRegular: css`
      font-family: ${fontFamily.primary};
      font-weight: ${fontWeight.regular};
      font-style: normal;
    `,
    fnLight: css`
      font-family: ${fontFamily.primary};
      font-weight: ${fontWeight.light};
      font-style: normal;
    `,
    fnTitle: css`
      font-size: 20px;
      letter-spacing: 0px;
      line-height: 24px;
    `,
    fnBody: css`
      font-size: 14px;
      letter-spacing: 0.2px;
      line-height: 20px;
    `,
    fnCaption: css`
      font-size: 13px;
      letter-spacing: 0px;
      line-height: 17px;
    `,
    fnInputError: css`
      font-size: 11px;
      letter-spacing: 0px;
      line-height: 14px;
    `,
    fnLabel: css`
      font-size: 10px;
      letter-spacing: 0.3px;
    `,
  },
  fontWeightValues: fontWeight,
  fontFamilyValues: fontFamily,
  colorValues: colors,
  distances: {
    actionDistance: "10px",
    messageActionDistance: "30px",
    avatarTop: "70px",
    clickableAreaHeightWithAvatar: "170px",
  },
  /*
    List of global z-indexes to beware in the future.
    Please, don't add z-indexes for small components here,
    just try to keep them smaller than next values.
  */
  zIndex,
}


/*
* Default Theme (Desktop)
*/
export const themeDefaultDesktop: DefaultTheme = {
  fontFamily: fontFamily.primary,
  fontColor: colors.black,
  bgColor: colors.white,
  typography: {
    fnBold: css`
      font-family: ${fontFamily.primary};
      font-weight: ${fontWeight.bold};
      font-style: normal;
    `,
    fnMedium: css`
      font-family: ${fontFamily.primary};
      font-weight: ${fontWeight.medium};
      font-style: normal;
    `,
    fnRegular: css`
      font-family: ${fontFamily.primary};
      font-weight: ${fontWeight.regular};
      font-style: normal;
    `,
    fnLight: css`
      font-family: ${fontFamily.primary};
      font-weight: ${fontWeight.light};
      font-style: normal;
    `,
    fnTitle: css`
      font-size: 20px;
      letter-spacing: 0px;
      line-height: 24px;
    `,
    fnBody: css`
      font-size: 14px;
      letter-spacing: 0.2px;
      line-height: 20px;
    `,
    fnCaption: css`
      font-size: 13px;
      letter-spacing: 0px;
      line-height: 17px;
    `,
    fnInputError: css`
      font-size: 11px;
      letter-spacing: 0px;
      line-height: 14px;
    `,
    fnLabel: css`
      font-size: 10px;
      letter-spacing: 0.3px;
    `,
  },
  fontWeightValues: fontWeight,
  fontFamilyValues: fontFamily,
  colorValues: colors,
  distances: {
    actionDistance: "10px",
    messageActionDistance: "30px",
    avatarTop: "40px",
    clickableAreaHeightWithAvatar: "130px",
  },
  /*
    List of global z-indexes to beware in the future.
    Please, don't add z-indexes for small components here,
    just try to keep them smaller than next values.
  */
  zIndex,
};
