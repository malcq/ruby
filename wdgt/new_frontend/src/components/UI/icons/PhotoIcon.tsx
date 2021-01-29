import React from 'react';

type Props = {
  width?: string;
  height?: string;
  color?: string;
}
const PhotoIcon: React.FC<Props> = (props) => {
  const { width, height, color } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 18"
      version="1.1"
    >
      <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Elements-/-Fab-/Default" transform="translate(-18.000000, -19.000000)">
              <g id="Elements-/-FAB">
                  <g id="ic-/-camera" transform="translate(16.000000, 16.000000)">
                      <g id="baseline-photo_camera-24px">
                          <path
                            d="M12,16.2 C10.2326888,16.2 8.8,14.7673112 8.8,13 C8.8,11.2326888 10.2326888,9.8 12,9.8 C13.7673112,9.8 15.2,11.2326888 15.2,13 C15.2,14.7673112 13.7673112,16.2 12,16.2 Z M9,3 L15,3 L16.83,5 L20,5 C21.1,5 22,5.9 22,7 L22,19 C22,20.1 21.1,21 20,21 L4,21 C2.9,21 2,20.1 2,19 L2,7 C2,5.9 2.9,5 4,5 L7.17,5 L9,3 Z M12,18 C14.76,18 17,15.76 17,13 C17,10.24 14.76,8 12,8 C9.24,8 7,10.24 7,13 C7,15.76 9.24,18 12,18 Z"
                            id="Combined-Shape"
                            fill={color}
                          ></path>
                          <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                      </g>
                  </g>
              </g>
          </g>
      </g>
  </svg>
  )
}

PhotoIcon.defaultProps = {
  height: '24px',
  width: '24px',
  color: '#27C46A',
}

export default PhotoIcon;
