import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';

import Router from 'routes';
import { updateUser, logOut, authorize } from 'store/global/actions';
import config from 'config';

import Header from 'ui/containers/Header';
import Sidebar from 'ui/containers/Sidebar';
import Toast from 'ui/components/toast';
import Toastify from 'ui/components/Toastify';

class App extends React.Component {
  state = {
    authorize: false
  }

  async componentDidMount() {
    if (!navigator.onLine) {
      const token = document.cookie.match(`(^|;) ?${config.token_name}=([^;]*)(;|$)`);
      if (token) {
        if (token[2]) {
          const decoded = jwt.decode(token[2]);
          if (decoded.login !== localStorage.login) {
            localStorage.clear();
            this.props.logOut();
          }
          const newUser = {};
          await Object.keys(localStorage).forEach((el) => {
            const value = localStorage.getItem(el);
            newUser[el] = value !== 'null' ? value : null;
          });
          this.props.changeUserData(newUser);
          this.setState({
            authorize: true
          });
        }
      }
    } else {
      await this.props.authorize();
      this.setState({
        authorize: true
      });
    }
  }

  render() {
    if (!this.state.authorize) { return null; }

    return (
      <>
        <Toast />

        <Toastify autoClose={3000} draggable newestOnTop />

        <Sidebar />

        <Header />

        <Router />
      </>
    );
  }
}

const connectFunction = connect(
  (state) => ({
    user: state.global.user
  }), {
    authorize,
    changeUserData: updateUser,
    logOut
  }
);

App.propTypes = {
  authorize: PropTypes.func.isRequired,
  changeUserData: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any)
};

App.defaultProps = {
  user: null
};
export default connectFunction(App);
