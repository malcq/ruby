import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import config from 'config';
import { newAvatarRequest } from 'api/userApi';
import { updateUser } from 'store/global/actions';


import {
  Button,
  Modal,
  Grid
} from '@material-ui/core';
import AvatarEditor from 'react-avatar-editor';
import Slider from 'rc-slider';

const connectFunction = connect(
  (state) => ({
    user: state.global.user
  }),
  { changeUserData: updateUser }
);

class ChangeAvatar extends Component {
  state = {
    image: null,
    showModal: false,
    scale: 1,
    borderRadius: 0,
    rotate: 0,
    position: { x: 0.5, y: 0.5 }
  }

  loadFile = async () => {
    if (!this.inputFile.files[0]) {
      return;
    }
    this.setState({
      image: this.inputFile.files[0],
      showModal: true
    });
  };

  activateInput = () => {
    this.inputFile.click();
  };

  hideModal = () => {
    this.setState({
      showModal: false,
      image: null,
      scale: 1,
      borderRadius: 0,
      rotate: 0,
      position: { x: 0.5, y: 0.5 }
    });
  };

  scaleChange = (scale) => {
    this.setState({
      scale
    });
  };

  radiusChange = (borderRadius) => {
    this.setState({
      borderRadius
    });
  };

  turnLeft = () => {
    for (let i = 1; i <= 10; i++) {
      setTimeout(() => {
        const { rotate } = this.state;
        this.setState({
          rotate: rotate - 9
        });
      }, 20);
    }
  };

  turnRight = () => {
    for (let i = 1; i <= 10; i++) {
      setTimeout(() => {
        const { rotate } = this.state;
        this.setState({
          rotate: rotate + 9
        });
      }, 20);
    }
  };

  rotateChange = (rotate) => {
    this.setState({
      rotate
    });
  };

  clearRotate = () => {
    this.setState({
      rotate: 0
    });
  };

  onPositionChange = (position) => {
    this.setState({
      position
    });
  };

  changeOnX = (x) => {
    const { position } = this.state;
    this.setState({
      position: { x, y: position.y }
    });
  };

  changeOnY = (y) => {
    const { position } = this.state;
    this.setState({
      position: { x: position.x, y }
    });
  };

  onImageChange = () => { };

  submit = async () => {
    const canvas = this.editor.getImage();
    canvas.toBlob(async (img) => {
      try {
        const { data: res } = await newAvatarRequest(
          this.props.user.login,
          this.props.user.avatar,
          img
        );

        this.setState({
          showModal: false,
          image: null,
          scale: 1,
          borderRadius: 0,
          rotate: 0,
          position: { x: 0.5, y: 0.5 }
        });

        document.cookie = `${res.cookie}; domain=${config.domain};`;
        this.props.changeUserData(res.user);
      } catch (err) {
        console.log(err);
      }
    });
  };

  setEditorRef = (editor) => {
    this.editor = editor;
  };

  setInputRef = (input) => {
    this.inputFile = input;
  };

  render() {
    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <input
            ref={this.setInputRef}
            style={style.hiddenInput}
            onChange={this.loadFile}
            accept="image/*"
            name="avatar"
            type="file"
            id="avatar"
          />
          <Button variant="contained" onClick={this.activateInput}>
            Выбрать новый аватар
          </Button>
        </Grid>
        <Modal
          open={this.state.showModal}
          onClose={this.hideModal}
          style={{ display: 'flex' }}
        >
          <Grid
            container
            alignItems="center"
            alignContent="center"
            justify="center"
          >
            <StyledModal>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <AvatarEditor
                    onImageChange={this.onImageChange}
                    onPositionChange={this.onPositionChange}
                    ref={this.setEditorRef}
                    image={this.state.image}
                    border={50}
                    width={165}
                    height={165}
                    borderRadius={this.state.borderRadius}
                    scale={this.state.scale}
                    rotate={this.state.rotate}
                    position={this.state.position}
                  />

                  <br />
                  <Button onClick={this.turnLeft} variant="contained">
                    Влево
                  </Button>

                  <Button onClick={this.clearRotate} variant="contained">
                    Сброс
                  </Button>

                  <Button onClick={this.turnRight} variant="contained">
                    Вправо
                  </Button>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Grid item xs={12}>
                    <p>
                      <b>Масштаб</b>
                    </p>
                    <Slider
                      value={this.state.scale}
                      min={0.2}
                      max={1.8}
                      step={0.01}
                      onChange={this.scaleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <p>
                      <b>Поворот</b>
                    </p>
                    <Slider
                      value={this.state.rotate}
                      min={-180}
                      max={180}
                      step={1}
                      onChange={this.rotateChange}
                    />
                  </Grid>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Grid item xs={12}>
                    <p>
                      <b>По горизонтали</b>
                    </p>
                    <Slider
                      value={this.state.position.x}
                      onChange={this.changeOnX}
                      min={-1}
                      max={2}
                      step={0.01}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <p>
                      <b>По вертикали</b>
                    </p>
                    <Slider
                      value={this.state.position.y}
                      onChange={this.changeOnY}
                      min={-1}
                      max={2}
                      step={0.01}
                    />
                  </Grid>
                </Grid>
                <Grid container justify="space-around">
                  <Button
                    onClick={this.submit}
                    variant="outlined"
                    className="accept-btn"
                  >
                    Принять
                  </Button>

                  <Button
                    onClick={this.hideModal}
                    variant="outlined"
                    className="decline-btn"
                  >
                    Отмена
                  </Button>
                </Grid>
              </Grid>
            </StyledModal>
          </Grid>
        </Modal>
      </Grid>
    );
  }
}

const style = {
  hiddenInput: {
    display: 'none'
  }
};

const sliderColor = 'rgb(34, 34, 34)';

const StyledModal = styled.div`
  text-align: center;
  max-width: 50%;
  background-color: white;
  border-radius: 5px;
  padding: 4px;

  & canvas {
    margin-bottom: 10px;
  }

  & p {
    margin-top: 20px;
  }

  & .rc-slider-track {
    background-color: ${sliderColor};
  }

  & .rc-slider-handle {
    border-color: ${sliderColor};
    background-color: ${sliderColor};
  }

  & .rc-slider-handle:active {
    border-color: ${sliderColor};
    box-shadow: 0 0 5px ${sliderColor};
  }

  & .rc-slider-handle:hover {
    border-color: ${sliderColor};
  }

  & .rc-slider-handle:focus {
    border-color: ${sliderColor};
  }

  & .btn-group .btn {
    width: 90px;
  }

  & .modal-body {
    padding-bottom: 66px;
    text-align: center;
  }

  & .accept-btn {
    margin: 20px 0;
  }

  & .decline-btn {
    margin: 20px 0;
  }

  @media (max-width: 560px) {
    & {
      max-width: 95%;
    }
  }
  @media (max-width: 290px) {
    & {
      max-width: 100%;
    }
  }
`;

ChangeAvatar.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  changeUserData: PropTypes.func.isRequired
};

export default compose(
  withRouter,
  connectFunction
)(ChangeAvatar);
