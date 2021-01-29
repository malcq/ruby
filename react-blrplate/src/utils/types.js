import PropTypes from 'prop-types';

import { userRoles } from './constants';

export const UserType = PropTypes.shape({
  fullName: PropTypes.string,
  role: PropTypes.oneOf(userRoles)
});
