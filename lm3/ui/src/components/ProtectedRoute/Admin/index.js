import React from 'react';
import PropTypes from 'prop-types';

import { Route } from 'react-router-dom';

import { connect } from 'react-redux';

import NotFoundPage from 'components/NotFoundPage';

import StandardProtectedRoute from '../Standard';

/* eslint-disable react/prop-types */

const createRouteRenderer = (Component, props) => componentProps => {
  if (props.isAdmin) {
    return (
      <Component {...componentProps} />
    );
  }

  return (
    <Route component={NotFoundPage} />
  );
};

/* eslint-enable react/prop-types */

const AdminProtectedRoute = ({
  component, isAdmin, ...routeProps
}) => (
  <StandardProtectedRoute
    {...routeProps}
    component={createRouteRenderer(component, { isAdmin })}
  />
);

AdminProtectedRoute.propTypes = {
  component: Route.propTypes.component, // eslint-disable-line
  isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAdmin: state.auth.isAdmin,
});

export default connect(mapStateToProps)(AdminProtectedRoute);
