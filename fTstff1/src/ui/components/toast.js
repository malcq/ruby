import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { hideToast } from 'store/actions/toastActions';
import CloseIcon from '@material-ui/icons/Close';

import {
  Snackbar,
  IconButton,
} from '@material-ui/core';

const connectFunction = connect(
  (state) => ({
    message: state.toastReducer.message,
    visible: state.toastReducer.visible
  }),
  { hideToast }
);

class Toast extends React.Component {
  timeoutId = null;

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible && this.props.visible) {
      this.initCloseTimeout();
    }
  }

  initCloseTimeout = () => {
    if (this.timeoutId) {
      return;
    }
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.props.hideToast();
    }, 3000);
  };

  onMouseEnter = () => {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  };

  render() {
    const { message, visible } = this.props;

    return (
      <Snackbar
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.initCloseTimeout}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={visible}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={message}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.props.hideToast}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

Toast.propTypes = {
  hideToast: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired
};

export default compose(connectFunction)(Toast);
