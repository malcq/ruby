import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import cornerLeftImage from 'ui/images/corner-left.svg';

const Toggler = ({ open, onClick }) => (
  <StyledToggler
    open={open}
    onClick={onClick}
    className="sidebar-toggler"
  />
);


const StyledToggler = styled.div`
  background-color: ${({ theme }) => theme.colors.sidebarContrastBackgroundColor};
  border-radius: 0 3px 3px 0;
  width: 21px;
  height: 40px;
  right: -21px;
  position: absolute;
  bottom: 71px;
  cursor: pointer;

  ::before,
  ::after {
    content: '';
    mask-image: url(${cornerLeftImage});
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: ${({ theme }) => theme.colors.headerColor};
    width: 7px;
    height: 14px;
    position: absolute;
    top: calc(50% - 7px);
    left: 5px;
    transition: 0.2s;
    transform: rotate(${({ open }) => (open ? 0 : 180)}deg);
  }

  ::after {
    left: 9px;
  }

  @media (max-width: ${({ theme }) => theme.sizes.md}px) {
    display: none;
  }
`;

Toggler.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func
};

Toggler.defaultProps = {
  open: false,
  onClick: () => null
};

export default memo(Toggler);
