import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';

const Hamburger = ({ onClick, isActive, className, color, style, reverse }) => {
  return (
    <StyledButton
      onClick={onClick}
      className={classnames(
        className,
        'hamburger',
        `hamburger--${style}${reverse ? '-r' : ''}`, {
          'is-active': isActive
        }
      )}
      color={color}
    >
      <span className="hamburger-box">
        <span className="hamburger-inner" />
      </span>
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: flex;
  padding: 0;

  && .hamburger-inner {
    &,
    ::before,
    ::after {
      background-color: ${({ color }) => color};
    }
  }

  &&:hover {
    opacity: 1;
  }

  .hamburger-box {
    height: 22px;
  }

  .hamburger-box,
  .hamburger-inner::before,
  .hamburger-inner,
  .hamburger-inner::after {
    width: 30px;
  }

  .hamburger-inner::before,
  .hamburger-inner,
  .hamburger-inner::after {
    height: 2px;
    border-radius: 0;
  }

  .hamburger-inner {
    margin-top: -1px;

    ::before {
      /* top: -10px; */
    }

    ::after {
      
    }
  }
`;

Hamburger.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string,
  reverse: PropTypes.bool,
  style: PropTypes.oneOf([
    '3dx',
    '3dy',
    '3dxy',
    'arrow',
    'arrowalt',
    'arrowturn',
    'boring',
    'collapse',
    'elastic',
    'emphatic',
    'minus',
    'slider',
    'spin',
    'spring',
    'stand',
    'squeeze',
    'vortex',
  ])
};

Hamburger.defaultProps = {
  onClick: () => null,
  isActive: false,
  className: '',
  color: 'white',
  reverse: false,
  style: 'spin'
};

export default memo(Hamburger);
