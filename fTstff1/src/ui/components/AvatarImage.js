import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import config from 'config';
import defaultAvatar from 'ui/images/defaultAvatar.svg';

const AvatarImage = (props) => {
  const {
    className,
    onClick,
    size,
    src,
    isAbsolute
  } = props;

  const avatar = src
    ? isAbsolute
      ? src
      : `${config.url}${src}`
    : defaultAvatar;

  return (
    <StyledImageContainer
      className={className}
      onClick={onClick}
      size={size}
    >
      <img src={avatar} alt="avatar" />
    </StyledImageContainer>
  );
};


const StyledImageContainer = styled.div`
  border-radius: 100%;
  overflow: hidden;

  ${({ size }) => {
    let width = 38;

    switch (size) {
      case 'sm':
        width = 38;
        break;

      case 'md':
        width = 80;
        break;

      case 'lg':
        width = 300;
        break;

      default:
        width = 38;
    }

    return css`
      width: ${width}px;
      height: ${width}px;
    `;
  }}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

AvatarImage.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  isAbsolute: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOf([
    'sm',
    'md',
    'lg'
  ])
};

AvatarImage.defaultProps = {
  className: '',
  src: '',
  isAbsolute: false,
  onClick: () => null,
  size: 'md'
};

export default memo(AvatarImage);
