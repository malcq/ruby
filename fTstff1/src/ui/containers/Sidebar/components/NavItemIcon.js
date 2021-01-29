import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import gearIcon from 'ui/containers/Sidebar/images/gear-icon.svg';

const NavItemIcon = ({ icon }) => (
  <StyledIcon
    icon={icon || gearIcon}
    className="navbar-item__icon"
  />
);

const StyledIcon = styled.i`
  mask-image: url(${({ icon }) => icon});
`;

NavItemIcon.propTypes = {
  icon: PropTypes.string
};

NavItemIcon.defaultProps = {
  icon: ''
};

export default memo(NavItemIcon);
