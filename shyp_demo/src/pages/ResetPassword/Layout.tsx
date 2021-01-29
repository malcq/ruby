import React, { StatelessComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Grid, Snackbar } from '@material-ui/core';

import './styles.scss';

const LoginLayout: StatelessComponent<any> = (props:any): ReactElement<any> =>  (
  <Grid
    container={true}
    justify="center"
    alignItems="center"
    classes={{
      container: 'change-password-page'
    }}
  >
    <Paper classes={{
      root: 'change-password-page__dialog mui-override'
    }}>
      <Typography
        variant="headline"
        classes={{
          root: 'change-password-page__title mui-override'
        }}
      >
        {props.title}
      </Typography>
      <Typography
        variant="headline"
        classes={{
          root: 'change-password-page__description mui-override'
        }}
      >
        A new password must be at least 6 characters including at least 1 number.
      </Typography>
      <Grid
        item={true}
        container={true}
        direction="column"
        classes={{
          container: 'change-password-page__input-container mui-override'
        }}
      >
        <input
          name="email"
          id="email"
          className="change-password-page__input_hidden"
          value={props.email}
        />
        {props.passwordField}
        {props.confirmPasswordField}
      </Grid>
      <Grid
        container={true}
        justify="space-between"
        classes={{
          container: 'change-password-page__button-container mui-override'
        }}
      >
        <Grid
          container={true}
          className="change-password-page__login-links mui-override"
          direction="column"
          justify="flex-end"
        >
          {props.back}
        </Grid>
        {props.button}
      </Grid>
    </Paper>
  </Grid>
);

LoginLayout.propTypes = {
  confirmPasswordField: PropTypes.node,
  passwordField: PropTypes.node,
  button: PropTypes.node,
  email: PropTypes.string,
  title: PropTypes.string,
};
LoginLayout.defaultProps = {
  confirmPasswordField: '',
  passwordField: '',
  button: '',
  email: '',
  title: '',
};

export default LoginLayout;
