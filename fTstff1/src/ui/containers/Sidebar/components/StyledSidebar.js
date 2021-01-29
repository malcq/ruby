import styled, { css } from 'styled-components';
import { opacify } from 'polished';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import backgroundImage from '../images/background.png';

export default styled(SwipeableDrawer)`
  ${({ variant, theme }) => (variant !== 'temporary' ? '' : css`
    margin-top: 58px;

    & > div:first-of-type {
      top: 58px;
    }

    .sidebar__paper {
      border-top: 1px solid ${theme.colors.sidebarContrastBackgroundColor};
    }
  `)}

  .sidebar__paper {
    border-right: none;
    background-color: ${({ theme }) => theme.colors.navbarBackground};
    color: ${({ theme }) => theme.colors.sidebarColor};
    width: ${({ open, theme, variant }) => (
    variant === 'temporary'
      ? 'unset' : open ? `${theme.openedSidebarWidth}px`
        : `${theme.closedSidebarWidth}px`
  )};
    max-width: 375px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.05em;
    text-transform: capitalize;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    overflow: visible;
    ${({ variant }) => (variant === 'temporary' ? '' : css`
      transition: 0.3s;
    `)}
    ${({ isuser }) => (isuser === 'true' ? '' : css`
      background-image: url(${backgroundImage});
      background-position: 0 58px;
      background-size: cover;
      background-repeat: no-repeat;
    `)}

    @media (max-width: ${({ theme }) => theme.sizes.md}px) {
      position: relative;
    }
  }

  .scroll-container {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-bottom: 22px;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  header {
    background-color: ${({ theme }) => theme.colors.sidebarContrastBackgroundColor};
    min-height: 58px;
    display: flex;
    padding: 0 35px;
    transition: 0.3s;
    
    a {
      align-items: center;
      display: flex;
    }

    ${({ open }) => (open
    ? '' : css`
      padding: 0 23px;

      h1 {
        opacity: 0;
        width: 0;
        margin: 0;
        pointer-events: none;
      }
    `)}

    @media (max-width: ${({ theme }) => theme.sizes.md}px) {
      display: none;
    }
  }

  .navbar-item {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transition: 0.3s;
    padding: 10px 0 10px 34px;
    margin: 0;
    color: ${({ theme }) => theme.colors.sidebarColor};
    display: flex;
    align-items: center;

    :hover {
      background-color: ${(({ theme }) => opacify(-0.9, theme.colors.sidebarContrastBackgroundColor))};
    }

    &--opened,
    &--current-address {
      color: ${({ theme }) => theme.colors.sidebarContrastColor};
      box-shadow: inset 8px 0 ${({ theme }) => theme.colors.primary};

      .navbar-item__icon {
        background-color: ${({ theme }) => theme.colors.sidebarContrastColor};
      }
    }

    &--current-address, &--current-address:hover {
      background-color: ${({ theme }) => theme.colors.sidebarContrastBackgroundColor};
    }
  }

  ${({ open }) => (open ? '' : css`
    && .navbar-item {
      color: transparent;
      box-shadow: none;
      padding-left: 31px;

      &--current-address {
        background-color: ${({ theme }) => theme.colors.primary};
      }
    }
  `)};

  .navbar-item__icon {
    ${({ open }) => {
    const size = open ? 15 : 25;

    return css`
      width: ${size}px;
      min-width: ${size}px;
      height: ${size}px;
      min-height: ${size}px;
    `;
  }}
    transition: 0.3s;
    background-color: ${({ theme }) => theme.colors.sidebarColor};
    mask-size: contain;
    mask-position: center;
    mask-repeat: no-repeat;
    margin-right: 11px;
  }

  .logout-button {
    margin-top: 60px;
  }
`;
