import React from 'react';


type Props = {
  width?: string;
  height?: string;
  color?: string;
}
const LibraryIcon: React.FC<Props> = (props) => {
  const {
    color,
    height,
    width,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      version="1.1"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-2.000000, -2.000000)">
          <g>
            <polygon points="0 0 24 0 24 24 0 24"></polygon>
            <path
              d="M22,16 L22,4 C22,2.9 21.1,2 20,2 L8,2 C6.9,2 6,2.9 6,4 L6,16 C6,17.1 6.9,18 8,18 L20,18 C21.1,18 22,17.1 22,16 Z M11,12 L13.03,14.71 L16,11 L20,16 L8,16 L11,12 Z M2,6 L2,20 C2,21.1 2.9,22 4,22 L18,22 L18,20 L4,20 L4,6 L2,6 Z"
              fill={color}
            ></path>
          </g>
        </g>
      </g>
    </svg>
  )
};

LibraryIcon.defaultProps = {
  height: '24px',
  width: '24px',
  color: '#27C46A',
};

export default LibraryIcon;
