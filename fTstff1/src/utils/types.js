import PropTypes from 'prop-types';

import {
  userRoles,
  userStatuses
} from './constants';

export const UserType = PropTypes.shape({
  id: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  login: PropTypes.string,
  info: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.oneOf(userRoles),
  avatar: PropTypes.string,
  avatarThumbnail: PropTypes.string,
  status: PropTypes.oneOf(userStatuses),
  DoB: PropTypes.instanceOf(Date),
  slack_name: PropTypes.string,
  resetPasswordToken: PropTypes.string,
  resetPasswordExpires: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  slack_conversational_id: PropTypes.string,
  slack_conversational_crm_id: PropTypes.string,
  repo: PropTypes.arrayOf(PropTypes.string)
});
