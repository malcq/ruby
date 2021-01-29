import { createMuiTheme } from '@material-ui/core/styles';
import { darken } from 'polished';

import defaultThemeObject from './defaultThemeObject';

const primaryColor = '#B163FF';

export default createMuiTheme({
  // try to fix later
  ...defaultThemeObject,
  palette: {
    ...defaultThemeObject.palette,
    primary: {
      ...defaultThemeObject.palette.primary,
      light: 'rgb(71, 145, 219)',
      // dark: 'rgb(17, 82, 147)',
      dark: darken(0.07, primaryColor),
      // main: '#101010',
      main: primaryColor,
      contrastText: '#ffffff'
    },
    secondary: { main: '#ffffff' },
    error: { main: '#f44336' },
    accept: { main: 'lime' }
  }
});
