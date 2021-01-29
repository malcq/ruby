import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getModalStyle } from 'utils';

import {
  Paper,
  Modal,
  Button
} from '@material-ui/core';

class UserDeleteModal extends Component {
  deleteUser = () => {
    const { onDelete, onHide, user } = this.props;
    onDelete(user.id);
    onHide();
  };

  render() {
    const { show, onHide } = this.props;

    return (
      <StyledModal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={show}
        onClose={onHide}
      >
        <StyledPaper style={getModalStyle()}>
          <h3>Вы действительно хотите удалить пользователя?</h3>
          <div className="button-group">
            <Button className="decline-btn" onClick={this.deleteUser}>
              Удалить
            </Button>
            <Button className="accept-btn" onClick={onHide}>
              Отмена
            </Button>
          </div>
        </StyledPaper>
      </StyledModal>
    );
  }
}

const StyledModal = styled(Modal)`
  & .selectLabel {
    line-height: 38px;
  }
`;

const StyledPaper = styled(Paper)`
  position: fixed;
  padding: 20px;
  font-size: 16px;
  min-width: 400px;
  max-height: 600px;
  overflow-y: auto;

  h3 {
    text-align: center;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 405px) {
    min-width: auto;
    width: 98%;
  }
`;

UserDeleteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

UserDeleteModal.defaultProps = {};

export default UserDeleteModal;
