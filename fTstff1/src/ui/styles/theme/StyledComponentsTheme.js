import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';

import themes from './custom';

const StyledComponentsTheme = ({ theme, children }) => (
  <ThemeProvider theme={themes[theme]}>
    {children}
  </ThemeProvider>
);

StyledComponentsTheme.propTypes = {
  theme: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const connectFunction = connect(
  ({ global: { theme } }) => ({
    theme
  })
);

export default connectFunction(memo(StyledComponentsTheme));
