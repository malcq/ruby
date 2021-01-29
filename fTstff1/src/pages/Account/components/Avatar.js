import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import defaultAvatar from 'ui/images/defaultAvatar.svg';

import {
  Fade,
  Modal
} from '@material-ui/core';
import ChangeAvatar from './ChangeAvatar';

class Avatar extends Component {
  state = {
    showEdit: false,
    showModal: false
  }

  mouseOn = () => {
    this.setState({ showEdit: true });
  };

  mouseOut = () => {
    this.setState({ showEdit: false });
  };

  openModal = () => {
    this.setState({
      showModal: true
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

  render() {
    let { src } = this.props;
    if (!src) {
      src = defaultAvatar;
    }
    return (
      <AvatarContainer onMouseEnter={this.mouseOn} onMouseLeave={this.mouseOut}>
        <div onClick={this.openModal}>
          <img rounded="true" alt="avatar" src={src} />
        </div>

        <StyledModal open={this.state.showModal} onClose={this.closeModal}>
          <div className="modal-content">
            <button onClick={this.closeModal} type="button">
              ×
            </button>
            <img rounded="true" alt="avatar" src={src} />
          </div>
        </StyledModal>

        {this.props.globalUser.login === this.props.match.params.login && (
          this.props.globalUser.status !== 'registered' && (
            <Fade in={this.state.showEdit}>
              <div className="changeAvatar well">
                <ChangeAvatar />
              </div>
            </Fade>
          )
        )}
      </AvatarContainer>
    );
  }
}

const StyledModal = styled(Modal)`
  padding: 70px 0 0 0;
  text-align: center;

  & .modal-dialog,
  & .modal-content,
  & .modal-body {
    width: auto;
    padding: 0;
    border: none;
    background: transparent;
    text-align: center;
    display: inline-block;
    border: none;
    box-shadow: none;
  }

  & button {
    font-size: 50px;
    font-weight: 100;
    padding: 0;
    position: absolute;
    border: none;
    background: transparent;
    float: right;
    z-index: 1;
    line-height: 19px;
    top: -30px;
    right: -40px;
    color: #c3c3c3;
  }

  & button:hover {
    font-size: 55px;
    top: -31px;
    right: -42px;
  }

  & img {
    width: auto;
    max-width: 100%;
  }

  @media (min-width: 650px) {
    & img {
      max-width: 600px;
    }
  }

  @media (max-width: 700px) {
    & button {
      display: none;
    }
  }
`;

const AvatarContainer = styled.div`
  width: 80%;
  margin: 20px auto 10px auto;
  position: relative;
  cursor: pointer;

  & .new-year-hat {
    position: absolute;
    right: -51px;
    top: -60px;
    width: 151px;
    transform: rotate(2deg);
  }

  & img {
    width: auto;
    max-width: 100%;
    border-radius: 5%;
  }
`;

Avatar.propTypes = {
  src: PropTypes.string,
  globalUser: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired,
  match: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.objectOf(PropTypes.string)
    ])
  ).isRequired
};

Avatar.defaultProps = {
  src: defaultAvatar
};

export default withRouter(Avatar);
