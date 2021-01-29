import React, { StatelessComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Grid, SnackbarContent, Icon } from '@material-ui/core';

import './styles.scss';

const LoginLayout: StatelessComponent<any> = (props:any): ReactElement<any> =>  (
  <Grid
    container={true}
    justify="center"
    alignItems="center"
    classes={{
      container: 'login-page'
    }}
    onKeyPress={props.onKeyPress}
  >
    <Paper classes={{
      root: 'login-page__dialog mui-override'
    }}>
      {/* This hack is needed to prevent chrome from autocompleting */}
      {(!props.autoComplete) && <input name="email" style={{ display: 'none' }} />}
      <Typography
        variant="headline"
        classes={{
          root: 'login-page__title mui-override'
        }}
      >
        Welcome to Shypple
      </Typography>
      <Grid
        item={true}
        container={true}
        direction="column"
        classes={{
          container: 'login-page__input-container mui-override'
        }}
      >
        {props.emailField}
        {props.passwordField}
        {props.rememberCheckbox}
      </Grid>
      <Grid
        container={true}
        justify="space-between"
        classes={{
          container: 'login-page__button-container mui-override'
        }}
      >
        <Grid
          container={true}
          justify="flex-end"
          className="login-links mui-override"
          direction="column"
        >
          {props.forgotPass}
        </Grid>
        {props.button}
      </Grid>
      {(props.errorMessage !== '') && (
        <SnackbarContent
          className="login-page__error-message mui-override"
          message={
            <span className="login-page__error-message-container">
              <i className="login-page__error-message-icon icon info"/>
              <span>
                {props.errorMessage}
              </span>
            </span>
          }
        />)
      }
    </Paper>
  </Grid>
);

LoginLayout.propTypes = {
  emailField: PropTypes.node,
  passwordField: PropTypes.node,
  button: PropTypes.node,
  forgotPass: PropTypes.node,
  rememberCheckbox: PropTypes.node,
  errorMessage: PropTypes.string,
  autoComplete: PropTypes.bool,
  onKeyPress: PropTypes.func,
};
LoginLayout.defaultProps = {
  emailField: '',
  passwordField: '',
  button: '',
  errorMessage: '',
  rememberCheckbox: '',
  forgotPass: '',
  autoComplete: true,
  onKeyPress: () => {},
};

export default LoginLayout;
