import React from 'react';
import PropTypes from 'prop-types';

import { NavLink as RRNavLink } from 'react-router-dom';

import { NavLink } from 'reactstrap';

const Link = ({
  disabled, active, activeClassName, exact, to, children,
}) => (
  <NavLink
    active={active}
    disabled={disabled}
    exact={exact}
    to={to}
    activeClassName={activeClassName}
    tag={RRNavLink}
  >
    {children}
  </NavLink>
);

Link.propTypes = {
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  exact: PropTypes.bool,
  activeClassName: PropTypes.string,
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Link.defaultProps = {
  disabled: false,
  active: false,
  exact: false,
  activeClassName: 'active',
};

export default Link;
