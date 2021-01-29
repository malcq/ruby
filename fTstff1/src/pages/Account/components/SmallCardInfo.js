import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getName } from 'utils';
import defaultAvatar from 'images/defaultAvatar.svg';
import config from 'config';

import { Link } from 'react-router-dom';
import { Phone } from '@material-ui/icons';

const getAvatar = ({ avatarThumbnail, avatar } = {}) => {
  if (!avatarThumbnail && !avatar) return defaultAvatar;
  if (avatarThumbnail) return `${config.url}${avatarThumbnail}`;
  return `${config.url}${avatar}`;
};

const SmallCardInfo = ({ user } = {}) => {
  const { phone, email } = user;
  const name = getName(user);
  const avatar = getAvatar(user);
  return (
    <StyledItem className="float-animation">
      <div className="previewlink-container">
        <StyledLink to={`/account/${user.login}`}>
          <img src={avatar} alt="preview" className="previewlink-img" />
        </StyledLink>
        <div className="info">
          {name && <h5 className="header">{name}</h5>}
          {email && <h5 className="email">{email}</h5>}
        </div>
        <div className="phone">
          <a href={`tel:${phone}`}>
            <Phone color="primary" />
          </a>
        </div>
      </div>
    </StyledItem>
  );
};

const StyledItem = styled.div`
  .previewlink-container {
    width: 100%;
    height: 125px;
    -webkit-box-shadow: 5px 5px 16px 0 rgba(0, 0, 0, 0.52);
    -moz-box-shadow: 5px 5px 16px 0 rgba(0, 0, 0, 0.52);
    box-shadow: 5px 5px 16px 0 rgba(0, 0, 0, 0.52);
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    border-radius: 5px;
    padding: 0 6px;
  }
  @media (max-width: 425px) {
    .previewlink-container {
      padding: 0;
    }
    .info .email {
      display: none;
    }
  }

  .previewlink-img {
    width: auto;
    border-radius: 5%;
    vertical-align: middle;
    height: 120px;
  }

  .header {
    font-size: 20px;
    color: black;
    margin: 0;
    word-break: break-word;
  }

  .email {
    color: black;
    opacity: 0.8;
    margin: 0;
    word-break: break-word;
  }

  .info {
    margin: 15px 10px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .phone {
    justify-content: center;
    flex-direction: column;
    display: none;
    align-items: center;
    position: relative;
  }

  @media (max-width: 1200px) {
    .phone {
      display: flex;
    }
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

SmallCardInfo.propTypes = {
  user: PropTypes.object
};

SmallCardInfo.defaultProps = {
  user: {}
};

export default SmallCardInfo;
