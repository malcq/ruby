import React from 'react';
import PropTypes from 'prop-types';
import { Navbar as BNavbar } from 'reactstrap';
import './styles.css';


const Navbar = ({
  tag, styles,
  fixed, color,
  expand, dark, light,
}) => (
  <BNavbar
    tag={tag}
    className={styles}
    color={color}
    expand={expand}
    dark={dark}
    light={light}
    fixed={fixed}
  />
);

Navbar.propTypes = {
  styles: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  expand: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  light: PropTypes.bool,
  dark: PropTypes.bool,
  fixed: PropTypes.string,
  color: PropTypes.string,
};

Navbar.defaultProps = {
  styles: 'default-nav',
  tag: null,
  expand: null,
  fixed: null,
  color: null,
  dark: null,
  light: null,
};

export default Navbar;
