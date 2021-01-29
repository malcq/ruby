import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';

import InfoIcon from '@material-ui/icons/Info';
import config from 'config';
import { updateUserRequest } from 'api/userApi';

import {
  IconButton,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  Collapse,
  Grid,
  Tooltip
} from '@material-ui/core';
import PasswordChange from './PasswordChange';
import AddRepos from './repos/AddRepos';

class EditAccount extends Component {
  constructor(props) {
    super(props);
    const {
      login,
      firstName,
      lastName,
      email,
      info,
      phone,
      DoB,
      slack_name,
      repo
    } = props.user;

    this.state = {
      login,
      newLogin: login,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || '',
      DoB: DoB ? FormatBirthDate.forInput(DoB) : '',
      slack_name: slack_name || '',
      repo: repo || [],
      openInputRepo: [],
      info: info || '',
      password: '',
      newPassword: '',
      retryPassword: '',
      error: ''
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'newPassword' && e.target.value === '') {
      this.setState({
        password: '',
        retryPassword: '',
        passwordValidation: null,
        requiredPassword: false
      });
    }
  };

  onChangeRepo = (newState) => {
    this.setState({
      repo: newState
    });
  };

  onChangeInputRepo = (newState) => {
    this.setState({
      openInputRepo: newState
    });
  };

  submit = async (e) => {
    e.preventDefault();
    if (
      this.state.newPassword !== '' &&
      this.state.newPassword !== this.state.retryPassword
    ) {
      return;
    }

    if (!changeCheck(this.props.user, this.state)) {
      this.props.close();
      return;
    }
    let { repo, openInputRepo } = this.state;
    openInputRepo = openInputRepo.filter((el) => el);
    repo = repo.concat(openInputRepo);
    this.setState({ repo });
    const newData = { ...this.state, repo };
    newData.DoB = FormatBirthDate.forServer(newData.DoB);
    delete newData.error;
    delete newData.show;
    delete newData.retryPassword;
    newData.createdAt = this.props.user.createdAt;
    if (!newData.password && !newData.newPassword) {
      delete newData.password;
      delete newData.newPassword;
    }

    try {
      const { data: res } = await updateUserRequest(newData);

      document.cookie = `${res.cookie}; domain=${config.domain};`;
      this.props.changeGlobalUser(res.user);
    } catch (err) {
      if (!err.response) {
        console.log(err);
        return;
      }
      if (err.response.data) {
        this.setState({
          error: err.response.data
        });
      }
    }
  };

  close = () => {
    const {
      login,
      firstName,
      lastName,
      email,
      info,
      phone,
      DoB,
      slack_name,
      repo
    } = this.props.user;
    this.setState({
      login,
      newLogin: login,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: phone || '',
      DoB: DoB ? FormatBirthDate.forInput(DoB) : '',
      slack_name: slack_name || '',
      repo: repo || [],
      openInputRepo: [],
      info: info || '',
      password: '',
      newPassword: '',
      retryPassword: '',
      error: ''
    });
    this.props.close();
  };

  render() {
    const phoneTooltip = 'Допустимые символы: цифры, ( ) , - , + Без пробелов';
    return (
      <>
        <Collapse in={this.props.show}>
          <form onSubmit={this.submit}>
            <Grid container justify="space-between" direction="column">
              <StyledField item sm={9} xs={12}>
                <FormControl required fullWidth>
                  <TextField
                    error={this.state.error === 'login error'}
                    type="text"
                    minLength="3"
                    onChange={this.onChange}
                    label="Логин"
                    value={this.state.newLogin}
                    variant="outlined"
                    name="newLogin"
                  />
                  {this.state.error === 'login error' && (
                    <FormHelperText error>
                      Логин занят, пожалуйста, выберите другой
                    </FormHelperText>
                  )}
                </FormControl>
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <FormControl required fullWidth>
                  <TextField
                    label="Имя:"
                    variant="outlined"
                    onChange={this.onChange}
                    value={this.state.firstName}
                    name="firstName"
                    minLength="3"
                    type="text"
                  />
                </FormControl>
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <FormControl required fullWidth>
                  <TextField
                    label="Фамилия:"
                    variant="outlined"
                    onChange={this.onChange}
                    value={this.state.lastName}
                    name="lastName"
                    minLength="3"
                    type="text"
                  />
                </FormControl>
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <FormControl required fullWidth>
                  <TextField
                    label="Email:"
                    variant="outlined"
                    onChange={this.onChange}
                    value={this.state.email}
                    name="email"
                    minLength="3"
                    type="email"
                  />
                  {this.state.error === 'email error' && (
                    <FormHelperText error>
                      Некорректный адрес E-mail
                    </FormHelperText>
                  )}
                </FormControl>
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <Tooltip title={phoneTooltip} placement="top">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <FormControl required fullWidth>
                  <TextField
                    label="Телефон:"
                    variant="outlined"
                    onChange={this.onChange}
                    value={this.state.phone}
                    name="phone"
                    minLength="3"
                    type="text"
                  />
                </FormControl>
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <FormControl required fullWidth>
                  <TextField
                    label="Дата рождения:"
                    onChange={this.onChange}
                    value={this.state.DoB}
                    name="DoB"
                    InputLabelProps={{
                      shrink: true
                    }}
                    type="date"
                  />
                </FormControl>
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <FormControl fullWidth>
                  <TextField
                    error={this.state.error === 'Not found slack name'}
                    type="text"
                    minLength="3"
                    onChange={this.onChange}
                    label="Slack name"
                    value={this.state.slack_name}
                    variant="outlined"
                    name="slack_name"
                  />
                </FormControl>
                {this.state.error === 'Not found slack name' && (
                  <FormHelperText error>
                    Данный пользователь не найден в Slack
                  </FormHelperText>
                )}
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <FormControl fullWidth>
                  <AddRepos
                    repo={this.state.repo}
                    openInput={this.state.openInputRepo}
                    name="repo"
                    onChangeRepo={this.onChangeRepo}
                    onChangeInputRepo={this.onChangeInputRepo}
                  />
                </FormControl>
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <FormControl required fullWidth>
                  <TextField
                    label="Информация:"
                    variant="outlined"
                    onChange={this.onChange}
                    value={this.state.info}
                    multiline
                    rows={1}
                    autoComplete="off"
                    name="info"
                    minLength="3"
                  />
                </FormControl>
              </StyledField>

              <StyledField item sm={9} xs={12}>
                <PasswordChange
                  onChange={this.onChange}
                  error={this.state.error}
                />
                <Button
                  className="accept-btn"
                  onSubmit={this.submit}
                  variant="outlined"
                  type="submit"
                >
                  Принять
                </Button>

                <Button
                  onClick={this.close}
                  style={{ marginLeft: '10px' }}
                  className="decline-btn"
                  variant="outlined"
                >
                  Отмена
                </Button>
              </StyledField>
            </Grid>
          </form>
        </Collapse>
      </>
    );
  }
}

const StyledField = styled(Grid)`
  && {
    margin-bottom: 20px;
  }
`;

const changeCheck = (before, after) => {
  if (
    before.login === after.login &&
    before.firstName === after.firstName &&
    before.lastName === after.lastName &&
    before.email === after.email &&
    before.info === after.info &&
    before.DoB === after.DoB &&
    before.slack_name === after.slack_name &&
    before.repo === after.repo &&
    before.phone === after.phone &&
    !after.password
  ) {
    return false;
  }
  return true;
};

const FormatBirthDate = {
  forInput: (value) => {
    return moment(value).format('YYYY-MM-DD');
  },
  forServer: (value) => {
    if (!value) {
      return null;
    }
    return new Date(value);
  }
};

EditAccount.propTypes = {
  show: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  changeGlobalUser: PropTypes.func.isRequired
};

EditAccount.defaultProps = {
  show: false
};

export default EditAccount;
