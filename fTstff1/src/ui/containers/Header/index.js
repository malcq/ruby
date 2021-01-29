import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { updateSidebarStatus } from 'store/global/actions';
import themes from 'ui/styles/theme/custom';
import { UserType } from 'utils/types';

import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import {
  AvatarImage,
  Dropdown,
  Logo
} from 'ui';
import { RoleCheck } from 'utils/protector';
import StyledHeader from './components/StyledHeader';
import Hamburger from './components/Hamburger';
import BellIcon from './components/BellIcon';

class Header extends PureComponent {
  render() {
    const {
      pageTitle,
      theme,
      isSidebarOpen,
      updateSidebarStatus,
      user
    } = this.props;

    const avatarSrc = _get(user, 'avatarThumbnail') || _get(user, 'avatar') || '';
    const isUserActive = _get(user, 'status') === 'active';

    return (
      <>
        <StyledHeader
          isSidebarOpen={isSidebarOpen}
          isAuthorized={Boolean(user)}
        >
          <Hamburger
            onClick={updateSidebarStatus}
            isActive={isSidebarOpen}
            color={themes[theme].colors.sidebarLogoColor}
          />

          {!user && (
            <Logo className="large-logo" />
          )}

          <h3 className="header__page-title">
            {pageTitle}
          </h3>

          {(user && isUserActive) && (
            <>
              <nav>
                <RoleCheck forRole={['sales', 'admin']}>
                  <>
                    <Dropdown className="admin-creation-dropdown">
                      <i className="admin-dropdown-toggler" />

                      <ul>
                        {adminDropdownLinks.map(({ title, href }) => (
                          <Link to={href} key={href}>
                            <li>{title}</li>
                          </Link>
                        ))}
                      </ul>
                    </Dropdown>

                    <i className="vertical-devider vertical-devider--admin-toggler" />
                  </>
                </RoleCheck>

                <Link to="/requests">
                  <Button
                    className="request-link"
                    variant="contained"
                    color="primary"
                  >
                    Подать заявку
                  </Button>
                </Link>

                <i className="vertical-devider" />

                <BellIcon
                  className="bell-icon"
                />

                <Link
                  to={`/account/${user.login}`}
                  className="user-avatar"
                >
                  <AvatarImage
                    src={avatarSrc}
                    size="sm"
                  />
                </Link>
              </nav>
            </>
          )}
        </StyledHeader>

        <TabletPageTitle className="header__page-title">
          {pageTitle}
        </TabletPageTitle>
      </>
    );
  }
}

const TabletPageTitle = styled.h3`
  display: none;
  color: ${({ theme }) => theme.colors.headerColor};
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 18px 19px;

  @media (max-width: ${({ theme }) => theme.sizes.md}px) {
    display: block;
  }
`;

const adminDropdownLinks = [
  {
    title: 'Создать резюме',
    href: '/cv_builder'
  }, {
    title: 'Создать проект',
    href: '/createProject'
  }, {
    title: 'Создать портфолио',
    href: '/portfolio_builder'
  }
];

Header.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  updateSidebarStatus: PropTypes.func.isRequired,
  user: UserType
};

Header.defaultProps = {
  user: undefined
};

const connectFunction = connect(
  ({ global: {
    pageTitle,
    isSidebarOpen,
    theme,
    user
  } }) => ({
    pageTitle,
    isSidebarOpen,
    theme,
    user
  }), { updateSidebarStatus }
);

export default connectFunction(Header);
