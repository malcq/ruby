import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

import { UserType } from 'utils/types';
import { logOut } from 'utils/index';
import { updateSidebarStatus } from 'store/global/actions';
import themes from 'ui/styles/theme/custom';
import logoutIcon from 'ui/containers/Sidebar/images/logout-icon.svg';
import { Logo } from 'ui';

import { Link } from 'react-router-dom';
import StyledSidebar from './components/StyledSidebar';
import Toggler from './components/Toggler';
import UserInfo from './components/UserInfo';
import NavLinks from './components/NavLinks';
import NavItemIcon from './components/NavItemIcon';

class Sidebar extends PureComponent {
  isMobileCheck = () => {
    const mdSize = themes[this.props.theme].sizes.md;
    return window.outerWidth <= mdSize || window.innerWidth <= mdSize;
  }

  state = {
    isMobile: this.isMobileCheck()
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const isMobile = this.isMobileCheck();

    if (isMobile !== this.state.isMobile) {
      this.setState({ isMobile });
    }
  }

  render() {
    const { isMobile } = this.state;
    const {
      isSidebarOpen,
      updateSidebarStatus,
      user
    } = this.props;

    return (
      <>
        <StyledSidebar
          variant={isMobile ? 'temporary' : 'permanent'}
          classes={sidebarClasses}
          open={((user || !isMobile) && isSidebarOpen) || !user}
          onClose={updateSidebarStatus}
          onOpen={updateSidebarStatus}
          hysteresis={0.05}
          isuser={`${Boolean(user)}`}
        >
          <header>
            <Link to="/">
              <Logo />
            </Link>
          </header>


          {user && (
            <>
              <Toggler
                open={isSidebarOpen}
                onClick={updateSidebarStatus}
              />

              <div className="scroll-container">
                <UserInfo />

                <NavLinks />

                <p
                  className="logout-button navbar-item"
                  onClick={logOut}
                >
                  <NavItemIcon icon={logoutIcon} />

                  Выход
                </p>
              </div>
            </>
          )}
        </StyledSidebar>

        <GlobalPadding open={isSidebarOpen} />
      </>
    );
  }
}

const sidebarClasses = { paper: 'sidebar__paper' };

const GlobalPadding = createGlobalStyle`
  #root {
    padding-top: 58px;
  }

  @media (min-width: ${({ theme }) => (theme.sizes.md + 1)}px) {
    #root {
      transition: 0.3s;
      padding-left: ${({ open, theme }) => (open ? theme.openedSidebarWidth : theme.closedSidebarWidth)}px;
    }
  }
`;

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  updateSidebarStatus: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  user: UserType
};

Sidebar.defaultProps = {
  user: undefined
};

const connectFunction = connect(
  ({ global: {
    isSidebarOpen,
    theme,
    user
  } }) => ({
    isSidebarOpen,
    theme,
    user
  }), { updateSidebarStatus }
);

export default connectFunction(Sidebar);
