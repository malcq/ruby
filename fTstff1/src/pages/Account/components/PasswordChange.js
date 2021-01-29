import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons';
import { passwordIdentityMUI } from 'utils';

import {
  Collapse,
  IconButton,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  InputAdornment,
  Grid
} from '@material-ui/core';

class PasswordChange extends Component {
  state = {
    password: '',
    newPassword: '',
    retryPassword: '',
    passwordValidation: null,
    changePasswordOpen: false,
    requiredPassword: false,
    showPassword: false
  }

  onChange = (e) => {
    this.props.onChange(e);

    const { name, value } = e.target;
    const { newPassword, retryPassword } = this.state;

    this.setState({
      [name]: value
    });

    if (name === 'newPassword') {
      if (value === '') {
        this.setState({
          password: '',
          retryPassword: '',
          passwordValidation: null,
          requiredPassword: false
        });
        return;
      }
      this.setState({
        requiredPassword: true,
        passwordValidation: passwordIdentityMUI(value, retryPassword)
      });
      return;
    }

    if (name === 'retryPassword') {
      this.setState({
        passwordValidation: passwordIdentityMUI(newPassword, value)
      });
    }
  };

  open = () => {
    const { changePasswordOpen } = this.state;
    this.setState({
      changePasswordOpen: !changePasswordOpen
    });
  };

  handleClickShowPassword = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }));
  };

  render() {
    return (
      <>
        <Button style={style.openButton} onClick={this.open} variant="outlined">
          Сменить пароль
        </Button>
        <br />

        <Collapse in={this.state.changePasswordOpen}>
          <div style={{ marginBottom: '20px' }}>
            <Grid container justify="space-between">
              {this.state.changePasswordOpen && (
                <FormControl>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    minLength="3"
                    type={this.state.showPassword ? 'text' : 'password'}
                    label="Новый пароль:"
                    onChange={this.onChange}
                    name="newPassword"
                    value={this.state.newPassword}
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
              )}

              <FormControl required={this.state.newPassword !== ''}>
                <TextField
                  required={this.state.newPassword !== ''}
                  variant="outlined"
                  value={this.state.retryPassword}
                  autoComplete="off"
                  error={this.state.passwordValidation}
                  minLength="3"
                  type={this.state.showPassword ? 'text' : 'password'}
                  label="Подтверждение пароля:"
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
            </Grid>

            {this.state.newPassword !== '' && (
              <FormControl required={this.state.newPassword !== ''}>
                <TextField
                  required={this.state.requiredPassword}
                  variant="outlined"
                  value={this.state.password}
                  autoComplete="off"
                  minLength="3"
                  type={this.state.showPassword ? 'text' : 'password'}
                  label="Текущий пароль:"
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
                <FormHelperText error>
                  {this.props.error === 'wrong password' && 'Неверный пароль'}
                </FormHelperText>
              </FormControl>
            )}
          </div>
        </Collapse>
      </>
    );
  }
}

const style = {
  openButton: {
    margin: '10px 0 20px 0'
  }
};

PasswordChange.propTypes = {
  onChange: PropTypes.func,
  error: PropTypes.string
};

PasswordChange.defaultProps = {
  onChange: () => null,
  error: ''
};

export default PasswordChange;
