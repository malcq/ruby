import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';

import Dropzone from 'react-dropzone';
import { Typography } from '@material-ui/core';
import config from 'config';

import ImageInput from './ImageInput';

class ImagesDownload extends Component {
  onDrop = (acceptedFiles) => {
    const { length } = this.props.imagesSrc;
    acceptedFiles.forEach((item, i) => {
      const imageSrc = URL.createObjectURL(item);
      this.addImage(length + i, item, imageSrc);
    });
  };

  addImage = (index, image, src) => {
    const { images, imagesSrc } = this.props;
    images[index] = image;
    imagesSrc[index] = src;
    this.props.addImage(images, imagesSrc);
  };

  deleteImage = (index) => {
    let { images, imagesSrc } = this.props;
    images = [...images];
    imagesSrc = [...imagesSrc];
    images.splice(index, 1);
    imagesSrc.splice(index, 1);
    this.props.addImage(images, imagesSrc);
  };

  renderInputs = () => {
    const { imagesSrc } = this.props;
    if (!imagesSrc.length) {
      return (
        <ImageInput addImage={this.addImage} deleteImage={this.deleteImage} />
      );
    }

    return imagesSrc.map((image, index) => {
      return (
        <div key={image} className="image">
          <ImageInput
            addImage={this.addImage}
            deleteImage={this.deleteImage}
            index={index}
            src={`${/^\/public\//.test(image) ? config.url : ''}${image}`}
          />
        </div>
      );
    });
  };

  render() {
    return (
      <StyledFormGroup className={this.props.style.box}>
        <Typography variant="h6" >
          Изображения:
        </Typography>

        <div className={`${this.props.style.imagesBox} imagesBox`}>
          {this.renderInputs()}
        </div>
        <div className="parent">
          <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => {
              return (
                <div
                  {...getRootProps()}
                  className={classNames('dropzone', {
                    'dropzone--isActive': isDragActive
                  })}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="child">Drop files here...</p>
                  ) : (
                    <p>
                      Try dropping some files here, or click to select files to
                      upload.
                    </p>
                  )}
                </div>
              );
            }}
          </Dropzone>
        </div>
      </StyledFormGroup>
    );
  }
}

const StyledFormGroup = styled.div`
  margin: 0 0 20px 0;

  & label {
    line-height: 34px;
    margin: 0;
    text-align: right;
  }

  .parent {
    border: 2px dashed #888;
    width: 100%;
    text-align: center;
  }

  .child {
    margin: 20px;
    border: 2px dashed #ccc;
    text-align: center;
  }

  & .imagesBox {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .image {
    height: 100%;
    max-height: 50px;
    width: auto;
    margin-bottom: 25px;
  }
`;

ImagesDownload.propTypes = {
  imagesSrc: PropTypes.arrayOf(PropTypes.any),
  images: PropTypes.arrayOf(PropTypes.any),
  addImage: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.string)
};

ImagesDownload.defaultProps = {
  addImage: () => null,
  images: [],
  imagesSrc: [],
  style: {
    box: '',
    label: '',
    imagesBox: ''
  }
};

export default ImagesDownload;
