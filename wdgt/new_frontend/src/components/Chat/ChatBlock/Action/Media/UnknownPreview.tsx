import * as React from 'react';

import { BaseFile } from '../../../../../models/file/BaseFile';
import Thumbnail from '../../../../UI/Thumbnail';

type Props = {
  file: BaseFile,
  onFileRemove: () => any,
  onPreviewClick: () => any;
  selected: boolean;
};
const UnknownPreview: React.FC<Props> = (props) => {
  const { file } = props;

  const src = file.getFileSrc();
  const fileType = file.getFileType();

  return (
    <Thumbnail
      src={src}
      type={fileType}
      onClose={props.onFileRemove}
      showPlayButton={false}
      selected={props.selected}
      onPreviewClick={props.onPreviewClick}
    />
  )
}

export default UnknownPreview;
