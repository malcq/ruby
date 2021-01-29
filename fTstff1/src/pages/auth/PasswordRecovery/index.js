import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { showToast } from 'store/actions/toastActions';
import { restorePasswordRequest } from 'api/userApi';

import {
  Button,
  FormControl,
  TextField,
  Typography
} from '@material-ui/core';

const connectFunction = connect(
  null,
  { showToast }
);

class PasswordRecovery extends Component {
  state = {
    email: '',
    isRequested: false,
    isLoading: false,
    count: 0
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleStart = (time) => {
    this.setState({ count: time });

    this.timer = setInterval(() => {
      const newCount = this.state.count - 1;
      this.setState({ count: newCount >= 0 ? newCount : 0 });
    }, 1000);
  };

  format = (time) => {
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    minutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
    seconds = seconds.toString().length === 1 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    try {
      await restorePasswordRequest(this.state.email);
      this.setState({ isRequested: true });
      this.setState({ isLoading: false });
      this.handleStart(180);
    } catch (err) {
      if (err.response) {
        await this.props.showToast({ message: err.response.data });
        this.props.history.push('/login');
      }
    }
  };

  render() {
    const message = `Пожалуйста проверьте ваш email ${this.state.email}.`;

    return (
      <StyledDiv>
        {this.state.isLoading
          ? (
            <div className="spinner">
              <img src={`${process.env.PUBLIC_URL}/spinner.svg`} alt="" />
            </div>
          )
          : (
            <>
              {this.state.isRequested
                ? (
                  <div>
                    <Typography variant="h4" className="page-title">
                      {message}
                    </Typography>
                    <Button
                      id="resend"
                      color="default"
                      type="button"
                      variant="outlined"
                      onClick={this.onSubmit}
                      disabled={this.state.count !== 0}
                      className="Button"
                    >
                      Не пришло письмо
                  {this.format(this.state.count)}
                    </Button>
                  </div>
                )
                : (
                  <>
                    <Typography variant="h4" className="page-title">
                      Восстановление пароля
                </Typography>
                    <form onSubmit={this.onSubmit}>
                      <FormControl required fullWidth>
                        <TextField
                          required
                          value={this.state.email}
                          autoComplete="off"
                          variant="outlined"
                          error={this.state.passwordValidation}
                          type="email"
                          label="Введите корпоративный e-mail"
                          onChange={this.onChange}
                          name="email"
                        />
                      </FormControl>
                      <Button
                        color="default"
                        type="submit"
                        variant="outlined"
                        className="send-button"
                      >
                        Отправить
                  </Button>
                    </form>
                  </>
                )}
            </>
          )}
      </StyledDiv>
    );
  }
}

const StyledDiv = styled.div`
  text-align: center;
  form {
    width: 40%;
    margin: auto;
    .send-button {
      margin-top: 20px;
    }
  }
`;
PasswordRecovery.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  showToast: PropTypes.func.isRequired
};

export default compose(
  connectFunction,
  withRouter
)(PasswordRecovery);
