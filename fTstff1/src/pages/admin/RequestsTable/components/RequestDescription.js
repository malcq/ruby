import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import {
  editRequestRequest,
  deleteRequestRequest
} from 'api/userRequestApi';

import { Button } from '@material-ui/core';
import { RequestModal } from 'ui';

class RequestDescription extends Component {
  state = {
    openModal: false
  }

  openModal = () => this.setState({ openModal: true });

  hideModal = ({ text = '', type = 'success' } = {}) => {
    if (text) toast[type](text);
    this.setState({ openModal: false });
  };

  answer = async (answerStr, comment) => {
    try {
      await editRequestRequest({
        id: this.props.request.id,
        status: answerStr,
        deniedComment: comment || null
      });
      this.props.statusChange();
    } catch (err) {
      console.log(err);
    }
  };

  deleteRequest = async () => {
    try {
      await deleteRequestRequest(this.props.request.id);
      this.hideModal({ text: 'Заявка удалена' });
      this.props.statusChange();
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { request } = this.props;
    request.from = request.users[0];
    return (
      <>
        <Button
          variant="outlined"
          style={style.modalOnButton}
          onClick={this.openModal}
        >
          {request.title}
        </Button>

        {this.state.openModal && (
          <RequestModal
            show={this.state.openModal}
            onHide={this.hideModal}
            delete={this.deleteRequest}
            data={request}
            statusChange={this.props.statusChange}
            answer={this.answer}
            editRequest={this.editRequest}
            type="admin"
          />
        )}
      </>
    );
  }
}

const style = {
  modalOnButton: {
    whiteSpace: 'inherit',
    width: '100%',
    wordBreak: 'break-all'
  }
};

RequestDescription.propTypes = {
  request: PropTypes.objectOf(PropTypes.any).isRequired,
  statusChange: PropTypes.func.isRequired
};

export default RequestDescription;
