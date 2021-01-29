import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { passwordIdentityMUI } from 'utils';
import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons';

import {
  IconButton,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  InputAdornment
} from '@material-ui/core';

class RegisterForm extends Component {
  state = {
    login: '',
    email: '',
    password: '',
    retryPassword: '',
    passwordValidation: null,
    showPassword: false
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === 'retryPassword') {
      const { password } = this.state;
      this.setState({
        passwordValidation: passwordIdentityMUI(password, e.target.value)
      });
    }
    if (e.target.name === 'newPassword') {
      const { retryPassword } = this.state;
      this.setState({
        passwordValidation: passwordIdentityMUI(e.target.value, retryPassword)
      });
    }
  }

  handleClickShowPassword = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.password !== this.state.retryPassword) {
      return;
    }
    const user = { ...this.state };
    delete user.retryPassword;
    delete user.passwordValidation;

    this.props.onFormSubmit(user);
  }

  render() {
    return (
      <StyledRegister>
        <form onSubmit={this.handleSubmit}>
          <NameInput>
            <FormControl required fullWidth>
              <TextField
                required
                autoComplete="off"
                error={this.props.error === 'login'}
                autoFocus
                type="text"
                minLength="3"
                onChange={this.onChange}
                label="Логин"
                variant="outlined"
                name="login"
              />

              <FormHelperText error>
                {this.props.error === 'login' &&
                  'Логин занят, пожалуйста, выберите другой'}
              </FormHelperText>
            </FormControl>
          </NameInput>
          <NameInput>
            <FormControl fullWidth>
              <TextField
                autoComplete="off"
                type="email"
                error={this.props.error === 'email'}
                minLength="3"
                required
                onChange={this.onChange}
                label="Email"
                variant="outlined"
                name="email"
                placeholder="Email"
              />

              <FormHelperText error>
                {this.props.error === 'email' && 'Не корректный email'}
              </FormHelperText>
            </FormControl>
          </NameInput>

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
            style={{ margin: '20px 0' }}
            color="default"
            type="submit"
            variant="outlined"
          >
            Зарегистрироваться
          </Button>
        </form>
      </StyledRegister>
    );
  }
}

const StyledRegister = styled.div`
  width: 40%;
  margin: 0 auto;

  button span {
    margin: auto;
  }

  input {
    text-align: left;
  }
  p {
    margin: 5px 0;
    min-height: auto;
  }
`;

const NameInput = styled.div`
  margin-bottom: 20px;
`;

RegisterForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired
};

export default RegisterForm;
