import React from 'react';

import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';
import UnknownPreview from './UnknownPreview';

import { BaseFile, MediaFileType } from '../../../../../models/file/BaseFile';

type Props = {
  file: BaseFile,
  onFileRemove: (file: BaseFile) => any,
  selected: boolean,
  onPreviewClick: (file: BaseFile) => any;
  loading: boolean;
};
const Preview: React.FC<Props> = (props) => {
  const { file } = props;

  function onFileRemove() {
    if (!props.loading) {
      props.onFileRemove(file);
    }
  }

  function onPreviewClick() {
    props.onPreviewClick(file)
  }

  switch (file.fileType) {
    case MediaFileType.image:
      return (
        <ImagePreview
          file={file}
          onFileRemove={onFileRemove}
          onPreviewClick={onPreviewClick}
          selected={props.selected}
          loading={props.loading}
        />
      )
    case MediaFileType.video:
      return (
        <VideoPreview
          file={file}
          onFileRemove={onFileRemove}
          selected={props.selected}
          onPreviewClick={onPreviewClick}
          loading={props.loading}
        />
      );
    case MediaFileType.audio:
    case MediaFileType.unknown:
      return (
        <UnknownPreview
          file={file}
          onFileRemove={onFileRemove}
          selected={props.selected}
          onPreviewClick={onPreviewClick}
        />
      );
    default:
      return null;
  }


}

export default Preview;
