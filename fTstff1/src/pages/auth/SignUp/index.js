import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _get from 'lodash/get';

import config from 'config';
import { showToast } from 'store/actions/toastActions';
import { updateUser } from 'store/global/actions';
import { createUserRequest } from 'api/userApi';

import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import RegisterForm from './components/RegisterForm';

class SignUp extends Component {
  state = {
    error: ''
  }

  submit = async (obj, img) => {
    try {
      const { data: res } = await createUserRequest(obj, img);
      document.cookie = `${res.cookie}; domain=${config.domain};`;

      this.props.changeGlobalUser(res.user);
      this.props.history.push(`/account/${obj.login}`);
    } catch (err) {
      if (err.response) {
        const errorText = _get(err, 'response.data', 'Internal server error');
        if (errorText === 'login error') {
          this.setState({
            error: errorText.split(' ')[0]
          });
          return;
        }
        this.setState({
          error: ''
        });
        this.props.showToast({
          message: _get(err, 'response.data', 'Internal server error')
        });
      }
      console.log(err);
    }
  };

  render() {
    return (
      <div style={styles.page}>
        <Typography variant="h4" className="page-title">
          Регистрация
        </Typography>
        <RegisterForm onFormSubmit={this.submit} error={this.state.error} />
      </div>
    );
  }
}

const styles = {
  page: {
    textAlign: 'center'
  }
};

SignUp.propTypes = {
  changeGlobalUser: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  showToast: PropTypes.func.isRequired
};

const connectFunction = connect(null, {
  showToast,
  changeGlobalUser: updateUser
});

export default compose(
  withRouter,
  connectFunction
)(SignUp);
