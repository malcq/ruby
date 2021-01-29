import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { Avatar } from '@material-ui/core';
import { get, trim } from 'lodash';
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import 'canvas-toBlob/canvas-toBlob.js'
import { FormLayout } from '../';
import { promisifyAction } from "../../utils";
import { flashSuccess, uploadAvatar } from "../../stores/actionCreators";
import { Logger } from '../../utils';
import './styles.scss';


interface IAccountAvatarFormProps {
  avatar?: string;
  submit: (avatar: any) => void;
  showSuccess: (message: string) => void;
  firstName?: string,
  lastName?: string,
}

interface IAccountAvatarFormState {
  [x:string]: any,
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, uploadAvatar),
  showSuccess(message: string): void { dispatch(flashSuccess(message)); }
});

const mapStateToProps = (state: IGlobalState): any => ({
  avatar: state.user.avatar,
  firstName: state.user.firstName,
  lastName: state.user.lastName,
});

const initialState = {
  avatar: null,
  newAvatar: null,
  previewAvatar: null,
  hover: false,
};

class AccountAvatarForm extends PureComponent<IAccountAvatarFormProps, IAccountAvatarFormState> {

  public static propTypes = {
    avatar: PropTypes.string,
    submit: PropTypes.func.isRequired,
    showSuccess: PropTypes.func.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  };

  public static defaultProps = {
    avatar: '',
    firstName: '',
    lastName: '',
  };

  public cropper: any;

  constructor (props, context) {
    super(props, context);
    this.state=initialState;
  }

  public render () {
    return (
      <div>
        { !this.state.avatar && (
          <Dropzone
            disableClick={true}
            style={{ position: "relative" }}
            accept="image/jpeg, image/png"
            onDrop={this.onDrop}
            onDragEnter={this.onDrag}
            onDragLeave={this.onDragOut}
          >
            <FormLayout
              label="Avatar"
              icon="person"
              buttonText="Upload a picture"
              contentClassName="account-avatar-form__content"
              hoverContentClassName="account-avatar-form__content_hovered"
              submit={this.upload}
              hover={this.state.hover}
            >
              <section className="account-avatar-form__drop-zone">
                <Avatar
                  className="account-avatar-form__avatar mui-override"
                  src={this.state.previewAvatar || this.props.avatar}
                >
                  {get(trim(this.props.firstName), 0, '')}
                  {get(trim(this.props.lastName), 0, '')}
                </Avatar>
                <div className="account-avatar-form__pointer">
                  Drag and drop a picture to here  or upload from you computer
                </div>
                <input type="file" id="selectedFile" style={{display: 'none'}} onChange={this.onDrop} accept="image/png, image/jpeg"/>
              </section>
              <footer className="account-avatar-form__note">
                Drag and drop picture above or upload it from your computer
              </footer>
            </FormLayout>
          </Dropzone>
        )}
        { this.state.avatar && (
          <div>
            <FormLayout
              label="Avatar"
              icon="person"
              buttonText="Upload Avatar"
              submit={this.submit}
              cancel={this.cancel}
              contentClassName="account-avatar-form__content"
              hoverContentClassName="account-avatar-form__content_hovered"
            >
              <div
                className="account-avatar-form__preview-container"
              >
                <img
                  src={this.state.previewAvatar}
                  alt="avatar"
                  className="account-avatar-form__preview"
                />
                <div className="account-avatar-form__pointer">
                  Preview
                </div>
              </div>
              <Cropper
                src={this.state.avatar.preview || this.state.avatar}
                ref={elem => this.cropper = elem}
                aspectRatio={1}
                className="account-avatar-form__cropper"
                guides={false}
                crop={this.onCrop}
              />
            </FormLayout>
          </div>
        )}
      </div>
    );
  }

  public componentDidMount() {
    const input = document.getElementById('selectedFile');
    this.setState({ uploadButton: input })
  }

  @bind
  private async submit(): Promise<any>{
    try {
      await this.props.submit(this.state.newAvatar);
      this.setState({
        avatar: null,
      });
      if (this.props.showSuccess) {
        this.props.showSuccess('Avatar is updated');
      }
    } catch (error) {
      Logger.error(error)
    }
  }

  @bind
  private cancel(): void{
    this.setState({
      avatar: null,
      newAvatar: null,
      previewAvatar: null,
    })
  }

  @bind
  private upload(): void{
    const input: HTMLInputElement = document.getElementById('selectedFile') as HTMLInputElement;
    input.click()
  }

  @bind
  private onDrag() {
    if(!this.state.hover) {this.setState({hover:true})}
  }

  @bind
  private onDragOut() {
    if(this.state.hover) {this.setState({hover:false})}
  }

  @bind
  private onDrop(files) {
    const input: HTMLInputElement = document.getElementById('selectedFile') as HTMLInputElement;
    if (input.files && !input.files[0]) {
      this.setState({
        avatar: files[0],
        hover: false,
      });
    } else {
      const file = input.files ? input.files[0] : null;
      const reader = new FileReader();

      reader.onloadend = () => {
        this.setState({
          avatar: reader.result,
          hover: false,
        })
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        this.setState({
          avatar: null,
          hover: false,
        })
      }
    }
  }

  @bind
  private onCrop(): void{
    if (!this.cropper) {
      return;
    }
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.cropper.getCroppedCanvas().toBlob((blob) => {
      this.setState({
        newAvatar: blob,
        previewAvatar: this.cropper.getCroppedCanvas().toDataURL(),
      });
    });
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountAvatarForm);
