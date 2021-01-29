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
const VideoPreview: React.FC<Props> = (props) => {

  const { file } = props;

  const src = file.getFileSrc();
  const fileType = file.getFileType();

  const thumbSrc = file.getThumbSrc();
  const thumbType = file.getThumbType();
  
  const poster: string | undefined = React.useMemo(() => {
    if (thumbType !== fileType && thumbSrc) {
      return thumbSrc;
    }

    return undefined;
  }, [thumbSrc, thumbType, fileType])

  return (
    <Thumbnail
      src={src}
      type={fileType}
      onClose={props.onFileRemove}
      showPlayButton={true}
      selected={props.selected}
      onPreviewClick={props.onPreviewClick}
      poster={poster}
      disabled={props.loading}
    />
  )
}

export default VideoPreview;
