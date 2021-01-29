import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { Switch, Route } from 'react-router-dom';

import { Auth, User } from 'store';

import { ROUTES } from 'constants';

import Header from './Header';
import Footer from './Footer';

import './styles.css';

const Members = ({ signOut, user, isAdmin }) => (
  <div className="members d-flex flex-column">
    <Header
      user={user}
      isAdmin={isAdmin}
      onSignOut={signOut}
    />
    <main className="container" />
    <Footer />
  </div>
);

Members.propTypes = {
  user: PropTypes.shape({}),
  signOut: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

Members.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.profile,
  isAdmin: state.auth.isAdmin,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  signOut: Auth.signOut,
  fetchProfile: User.fetchProfile,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      this.props.fetchProfile();
    },
  })
)(Members);
