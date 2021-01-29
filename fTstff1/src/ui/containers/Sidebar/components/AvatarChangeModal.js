import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { updateUser } from 'store/global/actions';
import { UserType } from 'utils/types';
import { sleep } from 'utils/index';
import { newAvatarRequest } from 'api/userApi';

import AvatarEditor from 'react-avatar-editor';
import Slider from 'rc-slider';
import {
  Button,
  Collapse
} from '@material-ui/core';
import {
  Modal,
  AvatarImage
} from 'ui';

const resetEditorState = () => ({
  showEditor: false,
  scale: 1,
  rotate: 0,
  position: { x: 0.5, y: 0.5 }
});

class AvatarChangeModal extends PureComponent {
  initialState = {
    isUpdateModalOpen: false,
    file: null
  }

  state = {
    ...this.initialState,
    ...resetEditorState()
  }

  componentDidMount() {
    this.imageInput = document.createElement('input');
    this.imageInput.style = 'display: none;';
    this.imageInput.type = 'file';
    this.imageInput.accept = 'image/*';
    this.imageInput.onchange = this.handleInputChange;

    document.body.append(this.imageInput);
  }

  componentWillUnmount() { this.imageInput.remove(); }

  openUpdateModal = () => { this.setState({ isUpdateModalOpen: true }); }

  closeUpdateModal = () => {
    this.props.onClose();
    this.setState({
      ...this.initialState
    });
  }

  toggleInput = () => { this.imageInput.click(); }

  handleInputChange = () => {
    const file = this.imageInput.files[0];
    this.imageInput.value = '';

    this.setState({
      file,
      isUpdateModalOpen: true
    });
  }

  openEditor = () => { this.setState({ showEditor: true }); }

  closeEditor = () => {
    this.setState({
      ...resetEditorState()
    });
  }

  turnLeft = async () => {
    for (let i = 1; i <= 10; i++) {
      // eslint-disable-next-line
      await sleep(10);
      this.setState(({ rotate }) => ({ rotate: rotate - 9 }));
    }
  };

  turnRight = async () => {
    for (let i = 1; i <= 10; i++) {
      // eslint-disable-next-line
      await sleep(10);
      this.setState(({ rotate }) => ({ rotate: rotate + 9 }));
    }
  };

  clearRotate = () => { this.setState({ rotate: 0 }); };

  scaleChange = (scale) => { console.log(scale); this.setState({ scale }); };

  rotateChange = (rotate) => { this.setState({ rotate }); };

  changeOnX = (x) => {
    this.setState(({ position: { y } }) => ({ position: { x, y } }));
  };

  changeOnY = (y) => {
    this.setState(({ position: { x } }) => ({ position: { x, y } }));
  };

  onPositionChange = (position) => { this.setState({ position }); };

  onSubmit = async () => {
    try {
      const {
        user,
        updateUser
      } = this.props;

      const canvas = this.editor.getImage();
      const img = await new Promise((res) => canvas.toBlob(res));

      const { data } = await newAvatarRequest(
        user.login,
        user.avatar,
        img
      );

      updateUser(data.user);
      this.setState({
        ...this.initialState,
        ...resetEditorState()
      });
    } catch (err) {
      console.error('Error in onSubmit function: ', err);
    }
  }

  setEditorRef = (editor) => { this.editor = editor; };

  render() {
    const {
      open,
      user,
      onClose
    } = this.props;

    const {
      file,
      showEditor,
      isUpdateModalOpen,
      scale,
      rotate,
      position
    } = this.state;

    return (
      <>
        <StyledPreviewModal
          open={open && !isUpdateModalOpen}
          onClose={onClose}
        >
          <AvatarImage
            src={user.avatar}
            className="avatar-preview"
            size="lg"
          />

          <Button
            onClick={this.toggleInput}
            color="primary"
            variant="contained"
            className="toggle-button"
          >
            Обновить
          </Button>
        </StyledPreviewModal>

        <StyledEditModal
          open={isUpdateModalOpen}
          onClose={this.closeUpdateModal}
        >
          <StyledAvatarEditor
            onPositionChange={this.onPositionChange}
            ref={this.setEditorRef}
            image={file}
            border={showEditor ? 50 : 0}
            scale={scale}
            rotate={rotate}
            position={position}
            disableBoundaryChecks
          />

          <div className="buttons-container">
            <Button
              variant="contained"
              color="primary"
              onClick={this.onSubmit}
            >
              Сохранить
            </Button>

            <Button
              variant="outlined"
              onClick={showEditor ? this.closeEditor : this.openEditor}
            >
              {showEditor ? 'Отмена' : 'Редактировать'}
            </Button>
          </div>

          <Collapse in={showEditor}>
            <div className="rotate-buttons">
              <Button onClick={this.turnLeft} variant="outlined">
                Влево
              </Button>

              <Button onClick={this.clearRotate} variant="outlined">
                Сброс
              </Button>

              <Button onClick={this.turnRight} variant="outlined">
                Вправо
              </Button>
            </div>

            <p className="slider-title">Поворот</p>
            <Slider
              value={rotate}
              min={-180}
              max={180}
              step={1}
              onChange={this.rotateChange}
            />

            <p className="slider-title">Масштаб</p>
            <Slider
              value={scale}
              min={0.2}
              max={1.8}
              step={0.01}
              onChange={this.scaleChange}
            />

            <p className="slider-title">По горизонтали</p>
            <Slider
              value={position.x}
              onChange={this.changeOnX}
              min={-1}
              max={2}
              step={0.01}
            />

            <p className="slider-title">По вертикали</p>
            <Slider
              value={position.y}
              onChange={this.changeOnY}
              min={-1}
              max={2}
              step={0.01}
            />
          </Collapse>
        </StyledEditModal>
      </>
    );
  }
}

const StyledPreviewModal = styled(Modal)`
  .avatar-preview {
    margin: 0 auto;
    height: unset;
    max-width: 100%;
  }

  .toggle-button {
    display: block;
    margin-top: 10px;
    width: 100%;
  }
`;

const StyledEditModal = styled(Modal)`
  .buttons-container {
    margin-top: 15px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 15px;
    transition: 0.3s;
  }

  .rotate-buttons {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    margin-top: 15px;
  }

  .slider-title {
    font-weight: bold;
    margin-bottom: 5px;
  }

  @media (max-width: ${({ theme }) => theme.sizes.sm}px) {
    .buttons-container {
      grid-template-columns: 1fr;
    }
  }
`;

const StyledAvatarEditor = styled(AvatarEditor)`
  width: 100% !important;
  height: unset !important;
  margin: 0 auto;
  max-width: 400px;
  display: block;
`;

AvatarChangeModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: UserType.isRequired,
  updateUser: PropTypes.func.isRequired
};

AvatarChangeModal.defaultProps = {
  open: false,
  onClose: () => null
};

const connectFunction = connect(
  ({ global: { user } }) => ({
    user
  }), { updateUser }
);

export default connectFunction(AvatarChangeModal);
