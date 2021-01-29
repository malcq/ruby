import React from 'react';
import styled from 'styled-components';

import logoImage from 'ui/images/logo--simple.svg';

const Logo = (props) => {
  return (
    <StyledLogo {...props}>
      <i />

      <h1>FUSION</h1>
    </StyledLogo>
  );
};

const StyledLogo = styled.div`
  display: flex;
  align-items: center;

  i {
    mask-image: url(${logoImage});
    mask-size: contain;
    mask-position: center;
    mask-repeat: no-repeat;
    width: 40px;
    min-width: 40px;
    height: 40px;
    min-height: 40px;
    background-color: ${({ theme }) => theme.colors.sidebarLogoColor};
  }

  h1 {
    color: ${({ theme }) => theme.colors.sidebarLogoColor};
    font-family: Montserrat;
    font-weight: bold;
    font-size: 21px;
    line-height: 26px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-left: 20px;
    opacity: 1;
    transition: 0.2s;
  }
`;

export default Logo;
