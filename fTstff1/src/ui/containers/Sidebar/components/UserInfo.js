import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { UserType } from 'utils/types';
import { getName } from 'utils';
import { userRoleNames } from 'utils/constants';
import { updateUser } from 'store/global/actions';
import adminIcon from 'ui/containers/Sidebar/images/admin-label.svg';

import { AvatarImage } from 'ui';
import AvatarChangeModal from './AvatarChangeModal';

class UserInfo extends PureComponent {
  state = {
    avatarChangeModal: false
  }

  toggleModal = () => {
    this.setState(({ avatarChangeModal }) => ({ avatarChangeModal: !avatarChangeModal }));
  }

  initEdit = (ev) => {
    ev.nativeEvent.stopImmediatePropagation();
    this.toggleModal();
  }

  render() {
    const {
      location: { pathname },
      user,
      isSidebarOpen
    } = this.props;

    const userProfileLink = `/account/${user.login}`;
    const isEditable = new RegExp(`^${userProfileLink}`).test(pathname);

    return (
      <StyledUserInfo isSidebarOpen={isSidebarOpen}>
        <Link to={userProfileLink}>
          <AvatarImage
            src={user.avatarThumbnail || user.avatar}
          />

          <AvatarChangeModal
            open={this.state.avatarChangeModal}
            onClose={this.toggleModal}
          />

          {isEditable && (
            <i
              className="plus-icon"
              onClick={this.initEdit}
            />
          )}
        </Link>

        <p className="user-name">{getName(user)}</p>

        <p className="user-role">
          {user.role === 'admin' && (
            <img src={adminIcon} alt="admin-icon" />
          )}

          {userRoleNames[user.role]}
        </p>
      </StyledUserInfo>
    );
  }
}

const StyledUserInfo = styled.div`
  margin: 40px 0 68px 0;
  padding-left: 50px;
  transition: 0.3s;
  overflow: hidden;
  width: 100%;
  min-height: min-content;

  > a {
    position: relative;
    display: inline-block;
  }

  .plus-icon {
    cursor: pointer;
    position: absolute;
    bottom: 3px;
    right: 1px;
    width: 14px;
    height: 14px;
    border: 4px solid ${({ theme }) => theme.colors.navbarBackground};
    border-radius: 100%;
    background-color: ${({ theme }) => theme.colors.primary};
    box-sizing: content-box;

    ::before {
      content: '+';
      color: white;
      position: absolute;
      top: calc(50% - 6px);
      left: calc(50% - 5px);
      line-height: 10px;
      font-style: normal;
      font-size: 18px;
      font-weight: 100;
    }
  }

  > p {
    white-space: nowrap;
  }

  .user-name {
    margin: 25px 0 0;
    font-family: Montserrat;
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 0.05em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.sidebarContrastColor};
  }

  .user-role {
    display: flex;
    align-items: center;
    margin: 4px 0 0;
    font-family: Montserrat;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.05em;
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.primary};

    img {
      margin-right: 10px;
    }
  }

  @media (min-width: ${({ theme }) => (theme.sizes.md + 1)}px) {
    ${({ isSidebarOpen }) => (isSidebarOpen ? '' : css`
      margin-bottom: 0;
      width: 0;
    `)}
  }

  @media (max-width: ${({ theme }) => theme.sizes.md}px) {
    margin-bottom: 56px;
    display: flex;

    .user-name,
    .user-role {
      display: none;
    }
  }
`;

UserInfo.propTypes = {
  updateUser: PropTypes.func.isRequired,
  user: UserType.isRequired,
  location: PropTypes.object.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired
};

UserInfo.defaultProps = {
};

const connectFunction = connect(
  ({ global: { user, isSidebarOpen } }) => ({
    user,
    isSidebarOpen
  }), { updateUser }
);

export default withRouter(connectFunction(UserInfo));
