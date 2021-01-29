import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import exitButton from 'ui/images/exit.png';

import {
  Modal,
  Paper,
  Button,
} from '@material-ui/core';

class CustomModal extends PureComponent {
  render() {
    const { onClose, open, children, className, title, hideHeader } = this.props;
    return (
      <StyledModal
        open={open}
        onClose={onClose}
        className={className}
        BackdropProps={BackdropProps}
      >
        <StyledPaper className="modal-papper">
          {!hideHeader &&
            <header>
              {title}

              <Button
                className="exit-btn"
                onClick={onClose}
              >
                <img src={exitButton} className="exit-btn-img" alt="cross"></img>
              </Button>
            </header>}

          <div className="modal-content-wrapper">{children}</div>
        </StyledPaper>
      </StyledModal>
    );
  }
}

const BackdropProps = { className: 'modal__backdrop' };

const StyledModal = styled(Modal)`
  && {
    text-align: center;
    padding: 100px 15px 100px;
    overflow: auto;
  }

  .modal__backdrop {
    z-index: 1;
  }

  .modal-papper {
    z-index: 2;
    position: relative;
  }

  ::before {
    display: inline-block;
    vertical-align: middle;
    content: '';
    width: 0;
    height: 100%;

    @media (max-width: 425px) {
      display: none;
    }
  }

  > div:first-child {
    /* Use to set overlay color */
    /* background-color: #18031b4d; */
  }

  header {
    background: #F9F8FB;
    padding: 17.5px 49px;
    align-items: center;
    position: relative;
    font-weight: 600;
    font-size: 16px;
    text-transform: uppercase;
  }
  .exit-btn {
    background: none;
    position: absolute;
    right: 21px;
    top: 14px;
    padding: 0;
    min-width: 0;
    }
    /* .modal-papper {
      width: 61.5%;
    } */

`;

const StyledPaper = styled(Paper)`
  display: inline-block;
  background: transparent;
  overflow: visible;
  margin: 0;
  max-height: unset;
  vertical-align: middle;
  max-width: 100%;
  position: relative;
    
  .modal-content-wrapper {
    background: white;
    border-radius: 4px;
    padding: 0;
    font-size: 16px;
    text-align: left;
    padding: 30px 44px;
  }

  @media (max-width: 860px) {
     && .modal-content-wrapper {
      padding: 20px 22px 40px 19px;
     }
  }
  @media (max-width: 450px) {
     && .modal-content-wrapper {
      padding: 30px 0;
     }
  }
`;

CustomModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  hideHeader: PropTypes.bool,
};

CustomModal.defaultProps = {
  onClose: () => null,
  open: false,
  children: '',
  className: '',
  title: '',
  hideHeader: false,
};

export default CustomModal;
