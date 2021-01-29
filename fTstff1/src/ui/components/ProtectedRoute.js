import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import roleCheck from 'utils/protector';
import { userRoles } from 'utils/constants';
import { updatePageTitle } from 'store/global/actions';

import { Route } from 'react-router-dom';

class ProtectedRoute extends PureComponent {
  render() {
    const {
      pageTitle,
      updatePageTitle,

      path,
      exact,
      component,
      children,

      role,
      redirectAddress
    } = this.props;

    const wrappedComponent = role
      ? roleCheck(component, {
        role,
        redirectAddress
      })
      : component;

    updatePageTitle(pageTitle);

    return (
      <Route
        path={path}
        exact={exact}
        component={wrappedComponent}
      >
        {children}
      </Route>
    );
  }
}

ProtectedRoute.propTypes = {
  updatePageTitle: PropTypes.func.isRequired,
  pageTitle: PropTypes.string,

  // route props
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  exact: PropTypes.bool,
  component: PropTypes.any,
  children: PropTypes.node,

  // protector props
  role: PropTypes.oneOfType([
    PropTypes.oneOf([
      // No user in store
      'none',
      // User with any role
      'any',
      ...userRoles
    ]),
    PropTypes.arrayOf(PropTypes.oneOf(userRoles))
  ]),
  redirectAddress: PropTypes.string
};

ProtectedRoute.defaultProps = {
  pageTitle: 'Добро пожаловать',

  // route props
  path: '/',
  exact: false,
  component: () => null,
  children: undefined,

  // protector props
  role: undefined,
  redirectAddress: undefined
};

const connectFunction = connect(null, {
  updatePageTitle
});

export default connectFunction(ProtectedRoute);
