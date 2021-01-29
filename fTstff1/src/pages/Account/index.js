import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { getUserRequest } from 'api/userApi';
import { updateUser } from 'store/global/actions';

import {
  Grid,
  Typography
} from '@material-ui/core';
import User from './components/User';
import Information from './components/Information';

class Account extends Component {
  state = {
    currentUser: null,
    changeUser: false
  }

  async componentDidMount() {
    this.checkUser();
  }

  checkUser = async () => {
    const login = this.props.match.params.login;

    if (!login) {
      this.props.history.push(`/account/${this.props.globalUser.login}`);
      return;
    }

    if (login === this.props.globalUser.login) {
      this.setState({
        currentUser: { ...this.props.globalUser }
      });
      return;
    }
    if (this.props.globalUser.status === 'registered') {
      this.props.history.push(`/account/${this.props.globalUser.login}`);
      this.setState({
        currentUser: { ...this.props.globalUser }
      });
      return;
    }
    try {
      const { data: user } = await getUserRequest(login);
      if (!user) {
        this.props.history.push(`/account/${this.props.globalUser.login}`);
        this.setState({
          currentUser: { ...this.props.globalUser }
        });
        return;
      }

      this.setState({
        currentUser: { ...user }
      });
    } catch (err) {
      console.log(err);
      this.props.history.push(`/account/${this.props.globalUser.login}`);
      this.setState({
        currentUser: { ...this.props.globalUser }
      });
    }
  };

  getUser = () => {
    let user;
    if (this.props.match.params.login === this.props.globalUser.login) {
      user = this.props.globalUser;
    } else {
      user = this.state.currentUser;
    }
    return user;
  };

  render() {
    if (this.state.currentUser === null) {
      return null;
    }

    return (
      <StyledContainer>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography variant="h4" className="page-title">
              Информация о сотруднике
            </Typography>
          </Grid>
          <Grid item md={3} style={{ textAlign: 'center' }}>
            <User globalUser={this.props.globalUser} user={this.getUser()} />
          </Grid>
          <Grid item md={9} xs={12}>
            <StyledInformationCase>
              <Information
                changeGlobalUser={this.props.changeGlobalUser}
                globalUser={this.props.globalUser}
                user={this.getUser()}
                match={this.props.match}
                changeUser={this.state.changeUser}
              />
            </StyledInformationCase>
          </Grid>
        </Grid>
      </StyledContainer>
    );
  }
}

const StyledInformationCase = styled.div`
  & * {
    font-size: 17px;
  }

  & ul {
    list-style: none;
    padding-left: 0px;
  }

  & input {
    padding-left: 10px;
    text-align: left;
  }

  & textarea {
    min-width: 100%;
    max-width: 100%;
    min-height: 34px;
  }

  & .help-block {
    margin-left: 15px;
  }

  & .password span {
    margin-left: 2px;
  }
`;

const StyledContainer = styled.div`
  padding: 12px;
  max-width: 1100px;
  margin: 0 auto;
`;

Account.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  globalUser: PropTypes.objectOf(PropTypes.any).isRequired,
  changeGlobalUser: PropTypes.func.isRequired
};

const connectFunction = connect(
  ({ global: { user } }) => ({
    globalUser: user
  }), {
    changeGlobalUser: updateUser
  }
);

export default compose(
  withRouter,
  connectFunction
)(Account);
