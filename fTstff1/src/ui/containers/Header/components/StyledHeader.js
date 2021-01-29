import styled from 'styled-components';

import plusIcon from 'ui/images/plus-in-circle.svg';

export default styled.header`
  position: fixed;
  z-index: 5;
  transition: 0.3s;
  top: 0;
  right: 0;
  left: ${({ isSidebarOpen, theme }) => (isSidebarOpen ? theme.openedSidebarWidth : theme.closedSidebarWidth)}px;
  background-color: ${({ theme }) => theme.colors.navbarBackground};
  color: ${({ theme }) => theme.colors.headerColor};
  font-family: Montserrat;
  min-height: 58px;
  height: 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 23px 0 41px;

  .header__page-title {
    letter-spacing: 0.05em;
    text-transform: uppercase;
    line-height: 20px;
    font-size: 16px;
    font-weight: 600;
  }

  .hamburger {
    display: none;
  }

  nav {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .vertical-devider {
    margin-left: 23px;
    background-color: ${({ theme }) => theme.colors.sidebarContrastBackgroundColor};
    width: 1px;
    height: 100%;

    &--admin-toggler {
      margin: 0 23px 0 17px;
    }
  }

  .bell-icon {
    margin-left: 23px;
  }

  .user-avatar {
    margin-left: 34px;
    transition: 0.3s;

    :hover {
      transform: scale(1.15);
    }
  }

  .admin-dropdown-toggler {
    mask-image: url(${plusIcon});
    mask-size: contain;
    mask-position: center;
    mask-repeat: no-repeat;
    background-color: ${({ theme }) => theme.colors.headerColor};
    display: block;
    width: 27px;
    height: 27px;
    border-radius: 100%;
  }

  .large-logo {
    display: none;
    margin: 0 auto;
  }

  @media (max-width: ${({ theme }) => theme.sizes.md}px) {
    padding: 0 20px;
    left: 0;

    .header__page-title,
    .admin-creation-dropdown,
    .user-avatar,
    .vertical-devider--admin-toggler {
      display: none;
    }

    .large-logo {
      display: flex;
    }

    .hamburger {
      display: ${({ isAuthorized }) => (isAuthorized ? 'flex' : 'none')};
    }

    .request-link {
      padding: 8px 15px;
      font-size: 12px;
    }

    .vertical-devider {
      margin-left: 22px;
    }

    .bell-icon {
      margin-left: 18px;
    }
  }
`;
