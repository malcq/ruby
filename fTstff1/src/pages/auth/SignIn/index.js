import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import config from 'config';
import { signInRequest } from 'api/userApi';
import { updateUser } from 'store/global/actions';

import {
  IconButton,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  InputAdornment,
  Typography
} from '@material-ui/core';

import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons';

class SignIn extends Component {
  state = {
    password: '',
    login: '',
    error: '',
    showPassword: false
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClickShowPassword = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }));
  };

  submit = async (e) => {
    e.preventDefault();
    this.setState({
      error: ''
    });
    const loginData = {
      login: this.state.login,
      password: this.state.password
    };
    try {
      const { data: res } = await signInRequest(loginData);
      document.cookie = `${res.cookie}; domain=${config.domain};`;
      this.props.changeGlobalUser(res.user);
      this.props.history.push(`/account/${loginData.login}`);
    } catch (err) {
      if (!err.response) {
        console.log(err);
        return;
      }
      const res = err.response.data;
      if (res === 'user' || res === 'password') {
        this.setState({
          error: res
        });
      }
    }
  };

  render() {
    return (
      <StyledLoginContainer>
        <Typography variant="h4" className="page-title">
          Вход
        </Typography>
        <form onSubmit={this.submit}>
          <FormControl required fullWidth>
            <TextField
              required
              type="text"
              autoFocus
              error={this.state.error === 'user'}
              value={this.state.login}
              onChange={this.onChange}
              label="Логин"
              variant="outlined"
              name="login"
            />

            <FormHelperText error>
              {this.state.error === 'user' && 'Пользователь не найден'}
            </FormHelperText>
          </FormControl>
          <br />
          <br />

          <FormControl required fullWidth>
            <TextField
              required
              error={this.state.error === 'password'}
              id="outlined-adornment-password"
              variant="outlined"
              type={this.state.showPassword ? 'text' : 'password'}
              label="Пароль"
              value={this.state.password}
              onChange={this.onChange}
              name="password"
              style={{ textAlign: 'left' }}
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

            <FormHelperText error>
              {this.state.error === 'password' && 'Неверный пароль'}
            </FormHelperText>
          </FormControl>
          <br />

          <Button color="default" type="submit" variant="outlined">
            Войти
          </Button>
          <br />
        </form>
        <Button id="register-link" component={Link} to="/register">
          Зарегистрироваться
        </Button>

        <Button
          component={Link}
          to="/password_recovery"
          className="recovery-link"
        >
          Забыли пароль?
        </Button>
      </StyledLoginContainer>
    );
  }
}

const StyledLoginContainer = styled.div`
  text-align: center;
  width: 40%;
  margin: 0 auto;
  #register-link,
  .recovery-link {
    margin-top: 10px;
  }
  input {
    text-align: left;
  }
`;

SignIn.propTypes = {
  changeGlobalUser: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

const connectFunction = connect(null, {
  changeGlobalUser: updateUser
});

export default compose(
  connectFunction,
  withRouter
)(SignIn);
