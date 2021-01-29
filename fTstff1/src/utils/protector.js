import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import SignIn from 'pages/auth/SignIn';

import { updatePageTitle } from 'store/global/actions';

import { UserType } from './types';
import { userRoles } from './constants';

const connectFunction = connect(
  ({ global: { user } }) => ({
    user
  }), { updatePageTitle }
);

const roleCheck = (user, role) => {
  const userRole = _get(user, 'role', 'none');
  const roleRegExp = new RegExp(`^${Array.isArray(role) ? role.join('$|^') : role}$`);

  return roleRegExp.test(userRole) || (role === 'any' && userRole !== 'none');
};

/**
 * @param {*} Page
 * – Component
 *
 * Optopns:
 * @param {*} role
 * "none" – for logout user,
 * "any" – for user with any role,
 * any of valid user role value
 * or array woth valid user roles
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

    const userRole = _get(user, 'role', 'none');
    const isRoleAccepted = roleCheck(user, role);

    if (!isRoleAccepted) {
      if (userRole === 'none') {
        // eslint-disable-next-line
        props.updatePageTitle('Вход');

        return <SignIn />;
      }

      return <Redirect to={redirectAddress} />;
      // return <Redirect to={userRole === 'none' ? '/login' : redirectAddress} />;
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

const RoleCheck = connectFunction(memo(CheckComponent));

export { RoleCheck };


export default roleProtector;
