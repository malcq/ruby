import React, { memo } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { lighten } from 'polished';

import bellIcon from 'ui/images/bell.svg';

import { Tooltip } from '@material-ui/core';

const BellIcon = ({ className }) => {
  return (
    <Tooltip
      title="Скоро! Во всех мониторах Fusion!"
      disableFocusListener
      disableTouchListener
    >
      <StyledContainer
        className={className}
        isUpdated={false}
      >
        <StyledBell />
      </StyledContainer>
    </Tooltip>
  );
};

const StyledContainer = styled.div`
  position: relative;

  ::after {
    content: '';
    opacity: ${({ isUpdated }) => (isUpdated ? '1' : '0')};
    transition: 0.3s;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    background-color: ${({ theme }) => theme.colors.primary};
    position: absolute;
    top: -3px;
    right: -6px;
    animation: indicatorAnimation 2s infinite linear;
  }

  @keyframes indicatorAnimation {
    0% {
      background-color: ${({ theme }) => theme.colors.primary};
      transform: scale(1);
    }

    30% {
      transform: scale(1.2);
      background-color: ${({ theme }) => lighten(0.15, theme.colors.primary)};
    }

    60% {
      transform: scale(1);
      background-color: ${({ theme }) => theme.colors.primary};
    }

    100% {
      transform: scale(1);
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const bellAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(45deg);
  }

  50% {
    transform: rotate(-20deg);
  }

  75% {
    transform: rotate(15deg);
  }

  100% {
    transform: rotate(0deg);
  }
`;

const StyledBell = styled.i`
  display: block;
  mask-image: url(${bellIcon});
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  width: 21px;
  height: 23px;
  background-color: ${({ theme }) => theme.colors.headerColor};
  cursor: pointer;

  :hover {
    animation: ${bellAnimation} 0.8s 1 cubic-bezier(0.64, 0.06, 0.74, 0.97);
  }
`;

BellIcon.propTypes = {
  className: PropTypes.string
};

BellIcon.defaultProps = {
  className: ''
};

export default memo(BellIcon);
