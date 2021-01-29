import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Typography,
  Paper,
  Button
} from '@material-ui/core';

import {
  Modal,
} from 'ui';

import defaultThemeObject from 'ui/styles/theme/material/defaultThemeObject';

const { breakpoints: { values: { sm: mobileBreakpoint } } } = defaultThemeObject;

class WarningModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      deleteTask: props.success,
      closeModal: props.onClose
    };
  }

  onDelete = async () => {
    await this.props.success();
  }

  handleDismiss = () => {
    this.state.closeModal();
  };

  render() {
    const { open, questionText, successButtonText } = this.props;
    if (open) {
      return (
        <StyledModal open={open} onClose={this.handleDismiss} hideHeader={true}>
          <StyledPaper>
            <Typography variant="body1" gutterBottom className="extra-title">
              {questionText}
            </Typography>
            <div className="modal-buttons">
              <Button
                variant="outlined"
                className="accept-btn ctrl_button"
                onClick={this.onDelete}
              >
                {successButtonText}
              </Button>

              <Button
                variant="outlined"
                className="decline-btn ctrl_button"
                onClick={this.handleDismiss}
              >
                Отмена
            </Button>
            </div>
          </StyledPaper>
        </StyledModal>
      );
    }
    return null;
  }
}

const StyledModal = styled(Modal)`
  #modal-title {
    text-align: center;
  }

  .bottom-block {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    &.controls {
      justify-content: space-between;
    }

    input {
      text-align: left;
    }
  }

  & img {
    width: 100%;
  }
  & button {
    width: 200px;
    background: #b163ff;
    color: #fff !important;
    border: none !important;
  }

  .project-description {
    margin-bottom: 25px;

    & pre {
      color: rgba(0, 0, 0, 0.87);
      padding-left: 10px;
    }
  }

  .modal-buttons {
    margin-top: 20px;
    & .decline-btn {
      margin-left: auto;
    }
    & .close-btn {
      background-color: #000 !important;
      font-size:22px !important;
    }
  }
  .close-btn {
      background-color: #C4C4C4 !important;
      /* font-size:18px !important; */
    }
  .accept-btn {
      background-color: #B163FF !important;
      /* font-size:18px !important; */
    }

  .select {
    margin-top: 20px;
    background-color: inherit;

    label {
      margin-bottom: 7px;
      display: block;
    }
  }
  .left-col {
    justify-content: center;
    flex-direction: column;
    padding: 0 20px;
  }
`;


const StyledPaper = styled(Paper)`
  margin-top: 20px;
  padding: 50px;
  font-size: 16px;
  max-height: 600px;
  width: 100%;

  @media (max-width: ${mobileBreakpoint}px) {
    padding: 25px;
  }

  .modal-buttons {
    display: flex;
    margin-top: 60px !important;

    & .decline-btn {
      margin-left: auto;
      margin-left: 50px !important;
      background-color: #c4c4c4;
    }
  }
  .ctrl_button{
    width:50%;
    padding:10px;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
  }
  .extra-title{
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

`;

WarningModal.propTypes = {
  questionText: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  successButtonText: PropTypes.string,
};

WarningModal.defaultProps = {
  successButtonText: 'Да',
};

export default WarningModal;
