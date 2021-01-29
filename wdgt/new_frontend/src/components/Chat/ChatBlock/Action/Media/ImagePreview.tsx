import React from 'react';

import { BaseFile } from '../../../../../models/file/BaseFile';
import Thumbnail from '../../../../UI/Thumbnail';

type Props = {
  file: BaseFile,
  onFileRemove: () => any,
  onPreviewClick: () => any;
  selected: boolean;
  loading?: boolean;
};
const ImagePreview: React.FC<Props> = (props) => {

  const { file } = props;

  const src = file.getFileSrc();
  const type = file.getFileType();
  
  return (
    <Thumbnail
      src={src}
      onClose={props.onFileRemove}
      showPlayButton={false}
      type={type}
      onPreviewClick={props.onPreviewClick}
      selected={props.selected}
      disabled={props.loading}
    />
  )
}

export default ImagePreview;
