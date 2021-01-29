import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { Modal } from 'ui';

class ConfirmModal extends PureComponent {
  render() {
    const {
      open,
      onClose,
      title,
      onAccept,
      overlay
    } = this.props;

    return (
      <StyledModal
        open={open}
        onClose={onClose}
        className={overlay ? '' : 'no-overlay'}
      >
        <h2>{title}</h2>

        <Button onClick={onAccept} variant="outlined" className="accept-btn">
          Принять
        </Button>

        <Button onClick={onClose} variant="outlined" className="decline-btn">
          Отменить
        </Button>
      </StyledModal>
    );
  }
}

const StyledModal = styled(Modal)`
  &.no-overlay {
    div:first-child {
      background: transparent;
    }
  }

  .modal-content-wrapper {
    text-align: center;
  }

  h2 {
    margin-bottom: 50px;
  }

  .accept-btn {
    margin-right: 10px;
  }

  .cancel-btn {
    margin-left: 10px;
  }
`;

ConfirmModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAccept: PropTypes.func,
  title: PropTypes.string,
  overlay: PropTypes.bool
};

ConfirmModal.defaultProps = {
  open: false,
  onClose: () => null,
  onAccept: () => null,
  title: 'Вы действительно хотите удалить этот элемент?',
  overlay: true
};

export default ConfirmModal;
