import { Theme } from '../../_models/theme';
import { THEME_NAMES } from './constants';

interface Themes {
  [themeName: string]: Theme;
}

const BMWTheme: Theme = {
  'tb-color-primary': '#1C69D4',
  'tb-color-secondary': '#1C69D4',
  'tb-color-white': 'white',
  'tb-color-background': '#1C69D4',
  'tb-color-icon': 'white',
  'tb-color-icon-accent': 'black',
  'tb-opacity-background': '0.7',
  'tb-opacity-wallpaper': '1',
};

const threebackTheme: Theme = {
  'tb-color-primary': '#000',
  'tb-color-secondary': '#1C69D4',
  'tb-color-white': 'white',
  'tb-color-background': 'linear-gradient(135deg, #1A1D34 0%, rgba(36,57,205,0.61) 100%)',
  'tb-color-icon': 'white',
  'tb-color-icon-accent': 'black',
  'tb-opacity-background': '1',
  'tb-opacity-wallpaper': '0',
};

export const themes: Themes = {
  [THEME_NAMES.blue]: BMWTheme,
  [THEME_NAMES.default]: threebackTheme,
};

