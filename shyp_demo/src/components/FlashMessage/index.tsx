import React, { Component } from 'react';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { flashReset } from "../../stores/actionCreators";
import { FLASH_EXPIRATION_INTERVAL } from '../../config/constants';

interface IFlashProps {
  open: boolean;
  message: string;
  classes: string;
  duration: number;
  reset: () => void;
}
const mapStateToProps = (state: IGlobalState): any => ({
  open: state.flash.open || false,
  message: state.flash.message  || '',
  classes: state.flash.classes || '',
  duration: state.flash.duration,
});
const mapDispatchToProps = (dispatch: Dispatch): any => ({
  reset(){ dispatch(flashReset()); },
});


class FlashMessage extends Component<IFlashProps,any> {

  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      message: props.message,
      classes: props.classes,
    }
  }

  public render() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={this.props.open}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        autoHideDuration={this.props.duration}
        onClose={this.handleClose}
      >
        <SnackbarContent
          className={this.props.classes}
          message={
            <span id="message-id">{this.props.message}</span>
          }
        />
      </Snackbar>
    );
  }

  private handleClose = () => {
    this.props.reset();
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage)