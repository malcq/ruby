import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { UserType } from 'utils/types';
import { userRoles } from 'utils/constants';

const connectFunction = connect(
  ({ global: { user } }) => ({ user })
);

const roleCheck = (user, role) => {
  const userRole = user?.role || 'none';
  const roleRegExp = new RegExp(`^${role.join('$|^')}$`);

  return roleRegExp.test(userRole) || (role === 'any' && userRole !== 'none');
};

/**
 * @param {*} Page
 * – Component
 *
 * Optopns:
 * @param {*} role
 * Array with valid user roles
 *
 * "none" – for logout user,
 *
 * "any" – for user with any role,
 * @param {*} redirectAddress in case of validation fail
 */
const roleProtector = (Page, options) => connectFunction(memo(
  (props) => {
    const {
      role,
      redirectAddress = '/'
    } = options;
    // eslint-disable-next-line
    const { user } = props;

    const userRole = user?.role || 'none';
    const isRoleAccepted = roleCheck(user, role);

    if (!isRoleAccepted) {
      return <Redirect to={userRole === 'none' ? '/auth/sign-in' : redirectAddress} />;
    }

    return <Page {...props} />;
  }
));

const CheckComponent = ({
  user,
  children,
  forRole,
  redirect
}) => {
  const isRoleAccepted = roleCheck(user, forRole);

  if (!isRoleAccepted) {
    return redirect ? <Redirect to={redirect} /> : null;
  }

  return children;
};

CheckComponent.propTypes = {
  user: UserType,
  children: PropTypes.node.isRequired,
  forRole: PropTypes.oneOfType([
    PropTypes.oneOf([
      // No user in store
      'none',
      // User with any role
      'any',
      ...userRoles
    ]),
    PropTypes.arrayOf(PropTypes.oneOf(userRoles))
  ]).isRequired,
  redirect: PropTypes.string
};

/**
 * Wrapper with role check
 */
const RoleCheck = connectFunction(memo(CheckComponent));

export { RoleCheck };

export default roleProtector;
