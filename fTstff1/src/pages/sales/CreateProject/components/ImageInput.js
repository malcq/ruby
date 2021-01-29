import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getModalStyle } from 'utils';

import {
  Paper,
  Modal,
  Button
} from '@material-ui/core';

class ImageInput extends Component {
  state = {
    show: false
  }

  click = () => {
    this.setState({
      show: true
    });
  };

  onHide = () => {
    this.setState({
      show: false
    });
  };

  deleteImage = () => {
    this.props.deleteImage(this.props.index);
    this.setState({
      show: false
    });
  };

  render() {
    const { src } = this.props;
    const { show } = this.state;
    return (
      <AddImage>
        {src && (
          <div className="image">
            <img
              src={src}
              alt="preview"
              onClick={this.click}
              className="picture"
            />
            <i
              className="fa fa-times-circle icon-absolute"
              aria-hidden="true"
              onClick={this.deleteImage}
            />
          </div>
        )}

        <StyledModal open={show} onClose={this.onHide}>
          <StyledPaper style={getModalStyle()}>
            {src ? <img src={src} alt="preview" /> : ''}
            <Button
              variant="outlined"
              className="decline-btn"
              onClick={this.deleteImage}
            >
              Удалить
            </Button>
          </StyledPaper>
        </StyledModal>
      </AddImage>
    );
  }
}

const AddImage = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;

  & input {
    display: none;
  }

  .icon-absolute {
    position: absolute;
    right: 15%;
    top: -8%;
    background: white;
    border-radius: 10px 10px 10px 10px;
    cursor: pointer;
  }

  .image:hover {
    -webkit-transform: scale(1.2);
    -ms-transform: scale(1.2);
    transform: scale(1.2);
  }

  .image {
    transition: 0.3s;
  }

  .picture {
    margin-right: 20px;
    height: 100%;
    max-height: 50px;
    width: auto;
  }

  & button {
    width: 100%;
    margin: 0 0 5px 0;
  }

  & img {
    width: 100%;
    cursor: pointer;
    margin-bottom: 25px;
  }
`;

const StyledModal = styled(Modal)`
  margin-top: 5%;
  text-align: right;

  & img {
    width: 100%;
  }

  & button {
    margin-top: 10px;
  }
`;

const StyledPaper = styled(Paper)`
  position: fixed;
  padding: 20px;
  font-size: 16px;
  min-width: 700px;
  max-height: 600px;
  overflow-y: scroll;

  @media (max-width: 701px) {
    min-width: auto;
    width: 98%;
  }
`;

ImageInput.propTypes = {
  deleteImage: PropTypes.func.isRequired,
  index: PropTypes.number,
  src: PropTypes.string
};

ImageInput.defaultProps = {
  index: 0,
  src: ''
};

export default ImageInput;
