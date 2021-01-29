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
      container: 'login-page mui-override'
    }}
  >
    <Paper classes={{
      root: 'login-page__dialog mui-override'
    }}>
      <Typography
        variant="headline"
        classes={{
          root: 'login-page__title mui-override'
        }}
      >
        Forgot your password?
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
        <Typography
          variant="headline"
          classes={{
            root: 'login-page__description mui-override'
          }}
        >
          We will send you an email to reset your password.
        </Typography>
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
          className="login-links mui-override"
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
  emailField: PropTypes.node,
  passwordField: PropTypes.node,
  button: PropTypes.node,
};
LoginLayout.defaultProps = {
  emailField: '',
  passwordField: '',
  button: '',
};

export default LoginLayout;
