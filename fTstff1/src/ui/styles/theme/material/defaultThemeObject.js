/* eslint-disable */
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export default {
  breakpoints: {
    keys: [
      'xs',
      'sm',
      'md',
      'lg',
      'xl'
    ],
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },
  direction: 'ltr',
  mixins: {
    toolbar: {
      minHeight: 56,
      // backgroundColor: '#e5e5e5',
      '@media (min-width:0px) and (orientation: landscape)': {
        minHeight: 48
      },
      '@media (min-width:600px)': {
        minHeight: 58
      }
    }
  },
  overrides: {
    // old settings
    // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    MuiMenuItem: {
      // Name of the component ⚛️ / style sheet
      root: {
        // Name of the rule
        textDecoration: 'none', // Some CSS
        '&.accept-btn': {
          '&:hover': {
            backgroundColor: '#a5d6a7'
          }
        },
        '&.decline-btn': {
          '&:hover': {
            backgroundColor: '#ea8f8f'
          }
        }
      }
    },
    MuiButton: {
      root: {
        padding: "10px 26px",
        // textTransform: 'none',
        '&.accept-btn': {
          '&:hover': {
            backgroundColor: '#a5d6a7'
          }
        },
        '&.decline-btn': {
          '&:hover': {
            backgroundColor: '#ea8f8f'
          }
        }
      }
    },
    MuiTypography: {
      root: {
        '&.page-title': {
          margin: '30px 0',
          textAlign: 'center'
        }
      }
    },
    MuiToggleButtonGroup: {
      root: {
        '&.modal-buttongroup': {
          width: 'fit-content',
          height: 'fit-content'
        }
      }
    },
    MuiPaper: {
      root: {
        '&.modal-buttongroup': {
          width: 'fit-content',
          height: 'fit-content'
        }
      }
    },
    MuiToggleButton: {
      root: {
        // textTransform: 'none',
        color: '#101010',
        '&.accept-btn': {
          color: '#101010',
          '&:hover': {
            backgroundColor: '#a5d6a7'
          }
        },
        '&.decline-btn': {
          color: '#101010',
          '&:hover': {
            backgroundColor: '#ea8f8f'
          }
        },
        '&.request-picker': {
          color: '#101010',
          '&:hover': {
            '&.med-btn': {
              backgroundColor: 'rgba(201, 48, 44, 0.6)'
            },
            '&.dayoff-btn': {
              backgroundColor: 'rgba(236, 151, 31, 0.6)'
            },
            '&.vac-btn': {
              backgroundColor: 'rgba(68, 157, 68, 0.6)'
            },
            '&.tech-btn': {
              backgroundColor: 'rgba(40, 96, 144, 0.6)'
            },
            '&.documents-btn': {
              backgroundColor: 'rgba(6, 249, 200, 0.6)'
            },
            '&.common-btn': {
              backgroundColor: 'rgba(255,153,255, 0.6)'
            }
          }
        },
        '&$selected': {
          '&.request-picker': {
            color: '#fff',
            '&.tech-btn': {
              backgroundColor: '#286090'
            },
            '&.dayoff-btn': {
              backgroundColor: '#ec971f'
            },
            '&.vac-btn': {
              backgroundColor: '#449d44'
            },
            '&.med-btn': {
              backgroundColor: '#c9302c'
            },
            '&.documents-btn': {
              backgroundColor: '#33ccad'
            },
            '&.common-btn': {
              backgroundColor: '#F5A3F5'
            }
          }
        }
      }
    }
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // old settings
  },
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    type: 'light',
    primary: {
      main: '#302B34',
      light: 'rgb(71, 145, 219)',
      dark: 'rgb(17, 82, 147)',
      contrastText: '#fff'
    },
    secondary: {
      main: 'rgb(220, 0, 78)',
      light: 'rgb(227, 51, 113)',
      dark: 'rgb(154, 0, 54)',
      contrastText: '#fff'
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)'
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {
      paper: '#fff',
      default: '#FAFAFA'
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(0, 0, 0, 0.14)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)'
    }
  },
  props: {
  },
  shadows: [
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    // '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
    // '0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)',
    // '0px 1px 8px 0px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 3px 3px -2px rgba(0,0,0,0.12)',
    // '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    // '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    // '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    // '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    // '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    // '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    // '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    // '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    // '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    // '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    // '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    // '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    // '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    // '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    // '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    // '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    // '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    // '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    // '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    // '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    // '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
  ],
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true,
    htmlFontSize: 16,
    // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    fontFamily: '\'Noto Sans\', sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 300,
      fontSize: '6rem',
      lineHeight: 1,
      letterSpacing: '-0.01562em'
    },
    h2: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 300,
      fontSize: '3.75rem',
      lineHeight: 1,
      letterSpacing: '-0.00833em'
    },
    h3: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 400,
      fontSize: '3rem',
      lineHeight: 1.04,
      letterSpacing: '0em'
    },
    h4: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 400,
      fontSize: '2.125rem',
      lineHeight: 1.17,
      letterSpacing: '0.00735em'
    },
    h5: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.33,
      letterSpacing: '0em'
    },
    h6: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.6,
      letterSpacing: '0.0075em'
    },
    subtitle1: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em'
    },
    subtitle2: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em'
    },
    body1: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em'
    },
    body2: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em'
    },
    button: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 'bold',
      fontSize: '1rem',
      lineHeight: '19x',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    },
    caption: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em'
    },
    overline: {
      // "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '\'Noto Sans\', sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase'
    }
  },
  shape: {
    borderRadius: 0
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  zIndex: {
    mobileStepper: 1,
    appBar: 1,
    drawer: 10,
    modal: 50,
    snackbar: 1,
    tooltip: 10
  }
};
