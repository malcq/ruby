import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';

import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons';
import { passwordReset } from 'api/userApi';
import { passwordIdentityMUI } from 'utils';
import { showToast } from 'store/actions/toastActions';

import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@material-ui/core';

const connectFunction = connect(
  null,
  { showToast }
);

class PasswordReset extends Component {
  state = {
    password: '',
    retryPassword: '',
    showPassword: false
  }

  handleClickShowPassword = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }));
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === 'retryPassword') {
      const { password } = this.state;
      this.setState({
        passwordValidation: passwordIdentityMUI(password, e.target.value)
      });
    }
    if (e.target.name === 'password') {
      const { retryPassword } = this.state;
      this.setState({
        passwordValidation: passwordIdentityMUI(e.target.value, retryPassword)
      });
    }
  };

  submit = async (e) => {
    e.preventDefault();
    try {
      const response = await passwordReset(
        this.state.password,
        this.props.match.params.token
      );
      if (response.status === 200) {
        await this.props.showToast({ message: response.data });
        this.props.history.push('/login');
      }
    } catch (err) {
      if (err.response) {
        const res = err.response.data;
        await this.props.showToast({
          message: res || 'Error! Please try again later!'
        });
        return;
      }
      console.log(err);
    }
  };

  render() {
    return (
      <StyledDiv>
        <Typography variant="h4" className="page-title">
          Задайте новый пароль
        </Typography>
        <form onSubmit={this.submit}>
          <NameInput>
            <FormControl required fullWidth>
              <TextField
                required
                variant="outlined"
                autoComplete="off"
                minLength="3"
                type={this.state.showPassword ? 'text' : 'password'}
                label="Пароль"
                onChange={this.onChange}
                name="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {this.state.showPassword
                          ? (
                            <VisibilityOff />
                          )
                          : (
                            <Visibility />
                          )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </NameInput>

          <NameInput>
            <FormControl required fullWidth>
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                error={this.state.passwordValidation}
                minLength="3"
                type={this.state.showPassword ? 'text' : 'password'}
                label="Подтверждение пароля"
                onChange={this.onChange}
                name="retryPassword"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {this.state.showPassword
                          ? (
                            <VisibilityOff />
                          )
                          : (
                            <Visibility />
                          )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </NameInput>

          <Button
            color="default"
            type="submit"
            variant="outlined"
            disabled={this.state.password !== this.state.retryPassword}
            className="Button"
          >
            Сменить пароль
          </Button>
        </form>
      </StyledDiv>
    );
  }
}

const StyledDiv = styled.div`
  text-align: center;
  form {
    width: 40%;
    margin: auto;
  }
  .Button {
    margin: 20px, 0;
  }
`;

const NameInput = styled.div`
  margin-bottom: 20px;
`;

PasswordReset.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  showToast: PropTypes.func.isRequired
};

export default compose(
  connectFunction,
  withRouter
)(PasswordReset);
