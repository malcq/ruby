import React from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  IOptionsMedia,
} from '../../../../../models/chat';

import IconButton from '../../../../UI/IconButton';

import PhotoIcon from '../../../../UI/icons/PhotoIcon';
import LibraryIcon from '../../../../UI/icons/LibraryIcon';
import FileIcon from '../../../../UI/icons/FileIcon';
import EditIcon from '../../../../UI/icons/EditIcon';
import { IAppStore } from '../../../../../store/types';
import { IMediaFileOptions } from '../../../../../models/file/BaseFile';
import {
  getFileTypesOptions,
  getCameraTypesOptions,
} from './utils';


type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any,
  onTextClick: () => any,
  isMobile: boolean,
  options: IOptionsMedia,
};
class TypeSelector extends React.Component<Props> {
  private cameraInputRef = React.createRef<HTMLInputElement>();
  private fileInputRef = React.createRef<HTMLInputElement>();
  private libraryInputRef = React.createRef<HTMLInputElement>();

  cameraOptions = memoize((options: IOptionsMedia): IMediaFileOptions => {
    return getCameraTypesOptions(options);
  })

  uploadFileOption = memoize((options: IOptionsMedia): IMediaFileOptions => {
    return getFileTypesOptions(options);
  })

  onCameraClick = () => {
    if (!this.cameraInputRef.current) { return; }
    this.cameraInputRef.current.click();
  }

  onLibraryClick = () => {
    if (!this.libraryInputRef.current) { return; }
    this.libraryInputRef.current.click();
  }

  onFileClick = () => {
    if (!this.fileInputRef.current) { return; }
    this.fileInputRef.current.click();
  }

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(event);
  }

  render() {
    const isVideoEnabled = this.props.options?.video?.enabled ?? true;
    const isPhotoEnabled = this.props.options?.photo?.enabled ?? true;
    const isDocumentsEnabled = this.props.options?.documents?.enabled ?? true;
    const isTextEnabled = this.props.options?.text?.enabled ?? true;

    const isUploadFileEnabled = isVideoEnabled || isPhotoEnabled || isDocumentsEnabled;
    const uploadFileOption = this.uploadFileOption(this.props.options);

    const isCameraEnabled = isVideoEnabled || isPhotoEnabled;
    const cameraOptions = this.cameraOptions(this.props.options);

    if (this.props.isMobile) {
      return (
        <>
          {isCameraEnabled && (
            <>
              <IconButton
                title={cameraOptions.title}
                onClick={this.onCameraClick}
              >
                <PhotoIcon />
              </IconButton>

              <IconButton
                  title="Library"
                  onClick={this.onLibraryClick}
                >
                  <LibraryIcon />
              </IconButton>

              <HiddenInput
                type="file"
                ref={this.cameraInputRef}
                onChange={this.onInputChange}
                name="file-camera"
                accept={cameraOptions.acceptFileTypes}
                capture
              />

              <HiddenInput
                type="file"
                onChange={this.onInputChange}
                accept={cameraOptions.acceptFileTypes}
                name="file-library"
                ref={this.libraryInputRef}
              />
            </>
          )}

          {isDocumentsEnabled && (
            <>
              <IconButton
                title="Documents"
                onClick={this.onFileClick}
              >
                <FileIcon />
              </IconButton>

              <HiddenInput
                type="file"
                name="file-any"
                onChange={this.onInputChange}
                ref={this.fileInputRef}
              />
            </>
          )}

          {isTextEnabled && (
            <IconButton
              title="Enter text"
              onClick={this.props.onTextClick}
            >
              <EditIcon />
            </IconButton>
          )}
        </>
      )
    }

    return (
      <>
        {isUploadFileEnabled && (
          <>
            <HiddenInput
              type="file"
              name="file-any"
              onChange={this.onInputChange}
              accept={uploadFileOption.acceptFileTypes}
              ref={this.fileInputRef}
            />

            <IconButton
              title="Upload file"
              onClick={this.onFileClick}
            >
              <FileIcon />
            </IconButton>
          </>
        )}

        {isTextEnabled && (
          <IconButton
            title="Enter text"
            onClick={this.props.onTextClick}
          >
            <EditIcon />
          </IconButton>
        )}
      </>
    )
  }
}

const HiddenInput = styled.input`
  display: none;
`;

const mapStateToProps = (state: IAppStore) => ({
  isMobile: state.widgetStore.isMobile,
});

const reduxConnect = connect(
  mapStateToProps,
);

export default compose(
  reduxConnect,
)(TypeSelector);
