import React from 'react';
import styled, { ThemeContext } from 'styled-components';
import { MediaFileType } from '../../models/file/BaseFile';

import PlayIcon from './icons/PlayIcon';
import CloseIcon from './icons/CloseIcon';
import FileIcon from './icons/FileIcon';

const PlayButton: React.FC = () => {
  return (
    <StyledPlayContainer>
      <PlayIcon />
    </StyledPlayContainer>
  );
}

const StyledPlayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 5000px;
  padding-left: 5px;
  background-color: ${props => props.theme.colorValues.white};
`;


type Props = {
  src: string;
  showPlayButton: boolean;
  onClose?: () => any,
  onPreviewClick?: () => any,
  type: MediaFileType,
  selected: boolean,
  poster?: string;
  disabled?: boolean;
}
const Thumbnail: React.FC<Props> = (props) => {
  const videoRef = React.createRef<HTMLVideoElement>();
  const [videoPlaying, setVideoPlaying] = React.useState(false);
  const theme = React.useContext(ThemeContext);


  function pauseVideo() {
    if (!videoRef || !videoRef.current) { return; }
    videoRef.current.pause();
    setVideoPlaying(false);
  }
  
  function playVideo() {
    if (!videoRef || !videoRef.current) { return; }
    videoRef.current.play();
    setVideoPlaying(true);
  }

  function toggleVideoPlayer() {
    if (videoPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }

  React.useEffect(() => {
    if (props.selected || props.disabled) {
      pauseVideo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.selected, props.disabled])

  React.useEffect(() => {
    pauseVideo();
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.type]);

  const { type } = props;

  function onPreviewClick() {
    if (!props.selected) {
      toggleVideoPlayer();
    }
    if (props.onPreviewClick) {
      props.onPreviewClick();
    }
  }

  return (
    <StyledContainer 
      selected={props.selected}
    >
      <CloseButton onClick={props.onClose}>
        <CloseIcon color="#FFFFFF" />
      </CloseButton>
      {type === MediaFileType.image && (
        <Image
          src={props.src}
        />
      )}

      {type === MediaFileType.video && (
        <Video
          autoPlay={!props.poster}
          ref={videoRef}
          poster={props.poster}
        >
          <source
            src={props.src}
          />
        </Video>
      )}

      {(type === MediaFileType.audio || type === MediaFileType.unknown) && (
        <UnknownTypeContainer>
          <FileIcon color={theme.colorValues.primary} />
          Document
        </UnknownTypeContainer>
      )}

      <Overlay
        onClick={onPreviewClick}
      >
        {props.showPlayButton && !videoPlaying &&
          <PlayButton />
        }
      </Overlay>
    </StyledContainer>
  );
};

Thumbnail.defaultProps = {
  onClose: () => null,
  showPlayButton: false,
  selected: false,
}

type StyledContainerProps = {
  selected?: boolean,
}
const StyledContainer = styled.div<StyledContainerProps>`
  width: 180px;
  height: 192px;
  border-radius: 12px;
  position: relative;
  padding-top: 12px;
  opacity: ${props => props.selected ? '0.5' : 1};
`;

const CloseButton = styled.div`
  border-radius: 1000px;
  width: 24px;
  height: 24px;
  background-color: ${props => props.theme.colorValues.black};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
  right: 8px;
  z-index: 5;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 12px;
  transition: 0.5s;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 12px;
`;

const UnknownTypeContainer = styled.div`
  width: 100%;
  height: 100%;
  ${props => props.theme.colorValues.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${props => props.theme.typography.fnCaption};
  ${props => props.theme.typography.fnMedium};
  color: ${props => props.theme.colorValues.primary};
  background-color: ${props => props.theme.colorValues.white};
  border-radius: 12px;
  & > svg {
    margin-bottom: 15px;
  }
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
`;

const Overlay = styled.div`
  cursor: ${props => props.onClick ? 'pointer' : 'unset'};
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

export default Thumbnail;
