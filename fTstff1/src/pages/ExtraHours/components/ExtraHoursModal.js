import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
} from 'ui';
import Form from './Form';

class ExtraHoursModal extends Component {
  render() {
    const {
      open,
      onClose,
      submitForm,
      data,
    } = this.props;
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={data.id ? 'Обновить переработку' : 'Добавить переработку'}
      >
        <Form
          onClose={onClose}
          submitForm={submitForm}
          data={data}
        />
      </Modal>
    );
  }
}

ExtraHoursModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({
    author: PropTypes.object,
    date: PropTypes.object,
    description: PropTypes.string,
    end: PropTypes.string,
    id: PropTypes.number,
    project_id: PropTypes.number,
    range: PropTypes.string,
    start: PropTypes.string,
    user: PropTypes.object,
    user_id: PropTypes.number,
  }),
  onClose: PropTypes.func,
  submitForm: PropTypes.func,
};

ExtraHoursModal.defaultProps = {
  open: false,
  data: {},
  onClose: () => null,
  submitForm: () => null,
};

export default ExtraHoursModal;
