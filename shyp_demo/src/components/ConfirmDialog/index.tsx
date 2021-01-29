import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

import { Button } from '../';
import './styles.scss'

import React, { StatelessComponent } from 'react';
import PropTypes from 'prop-types';

interface IDialogProps{
  title?: string,
  message?: string,
  isOpen?: boolean,
  confirm?: IEventHandler,
  reject?: IEventHandler,
  onClose?: IEventHandler,
  confirmButtonText?: string,
  rejectButtonText?: string,
  isConfirmOnly?: boolean,
}

const ConfirmDialog: StatelessComponent<any> = (props: IDialogProps) => (
  <Dialog
    open={!!props.isOpen}
    keepMounted={true}
    onClose={props.onClose}
    aria-labelledby="alert-dialog-confirm-title"
    aria-describedby="alert-dialog-confirm-description"
  >
    {(props.title) &&
    <DialogTitle
      id="alert-dialog-confirm-title"
    >
      <span className="dialog__title">{props.title}</span>
    </DialogTitle>
    }
    <DialogContent>
      <DialogContentText
        id="alert-dialog-confirm-description"
        classes={{
          root: 'dialog__message mui-override'
        }}
      >
        {props.message}
      </DialogContentText>
    </DialogContent>
    <section className="dialog__actions">
      <div className="dialog__button">
        <Button onClick={props.confirm} color="mui" isFullWidth={true}>
          {props.confirmButtonText}
        </Button>
      </div>
      {(!props.isConfirmOnly) &&
      <div className="dialog__button">
        <Button onClick={props.reject} color="mui" isFullWidth={true}>
          {props.rejectButtonText}
        </Button>
      </div>
      }
    </section>
  </Dialog>
);

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  confirmButtonText: PropTypes.string,
  rejectButtonText: PropTypes.string,
  isConfirmOnly: PropTypes.bool,
  isOpen: PropTypes.bool,
  confirm: PropTypes.func,
  reject: PropTypes.func,
  onClose: PropTypes.func,
};

ConfirmDialog.defaultProps = {
  title: '',
  message: 'Are you sure',
  confirmButtonText: 'Yes',
  rejectButtonText: 'No',
  isConfirmOnly: false,
  isOpen: false,
  confirm(){ return },
  reject(){ return },
  onClose(){ return },
};

export default ConfirmDialog;