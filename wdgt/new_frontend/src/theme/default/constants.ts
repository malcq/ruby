import {
  ThemeColors,
  FontFamily,
  FontWeight,
  ZIndexes
} from '../../models/themes';

/*
* Font variables
*/
export const fontFamily: FontFamily = {
  primary: 'Helvetica Neue',
  secondary: 'Helvetica Neue',
};

export const fontWeight: FontWeight = {
  bold: 600,
  medium: 500,
  regular: 400,
  light: 200,
};

/*
* Font variables
*/
export const colors: ThemeColors = {
  primary: '#27C46A',
  secondary: '#0172B1',
  error: '#B91717',
  white: '#FFFFFF',
  black: '#191F25',
  mineShaft: '#333333',
  grey: '#7F7F7F',
  lightgrey: '#BFBFBF',
  athensgrey: '#F2F2F3',
  red: '#C81919',
};

export const zIndex: ZIndexes = {
  header: 10100,
  sidebar: 10001,
  arrows: 10000,
  selectedNode: 9999,
  toastify: 11000,
  modalWindow: 12000,
};
