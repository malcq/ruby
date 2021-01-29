import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Route } from 'react-router-dom';

import roleCheck from 'utils/protector';
import { userRoles } from 'utils/constants';

class ProtectedRoute extends PureComponent {
  render() {
    const {
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
  // route props
  path: PropTypes.string,
  exact: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  component: PropTypes.any,
  children: PropTypes.node,

  // protector props
  role: PropTypes.arrayOf(PropTypes.oneOf([
    // No user in store
    'none',
    // User with any role
    'any',
    ...userRoles
  ])),
  redirectAddress: PropTypes.string
};

ProtectedRoute.defaultProps = {
  // route props
  path: '/',
  exact: false,
  component: () => null,
  children: undefined,

  // protector props
  role: undefined,
  redirectAddress: undefined
};

export default ProtectedRoute;
