import React from 'react';
import PropTypes from 'prop-types';
import { Button as ZButton } from 'reactstrap';
import './styles.css';

const Button = ({
  color, styles, text, onClick, size
}) => (
  <ZButton
    color={color}
    className={styles}
    onClick={onClick}
    tag={ZButton}
    size={size}
  >
    {text}
  </ZButton>
);

Button.propTypes = {
  styles: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.string,
};

Button.defaultProps = {
  styles: 'default-btn',
  text: '',
  onClick: () => {},
  color: null,
  size: '',
};

export default Button;
