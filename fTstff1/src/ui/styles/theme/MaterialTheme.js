import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { connect } from 'react-redux';

import themes from './material';

class Provider extends PureComponent {
  render() {
    const {
      theme,
      children
    } = this.props;

    return (
      <MuiThemeProvider theme={themes[theme]}>
        <ThemeProvider theme={themes[theme]}>
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    );
  }
}

Provider.propTypes = {
  theme: PropTypes.oneOf([
    'basic',
    'dark'
  ]).isRequired,
  children: PropTypes.node.isRequired
};

const connectFunction = connect(
  ({ global: { theme } }) => ({
    theme
  })
);

export default connectFunction(Provider);
