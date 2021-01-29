import React from 'react';

type Props = {
  width?: string;
  height?: string;
  color?: string;
};
const FileIcon: React.FC<Props> = (props) => {
  const { color, height, width } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 19 22"
      version="1.1"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-2.000000, -1.000000)">
          <g> 
            <polygon points="0 0 24 0 24 24 0 24"></polygon>
            <path
              d="M16,1 L4,1 C2.9,1 2,1.9 2,3 L2,17 L4,17 L4,3 L16,3 L16,1 Z M15,5 L21,11 L21,21 C21,22.1 20.1,23 19,23 L7.99,23 C6.89,23 6,22.1 6,21 L6.01,7 C6.01,5.9 6.9,5 8,5 L15,5 Z M14,12 L19.5,12 L14,6.5 L14,12 Z"
              fill={color}
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

FileIcon.defaultProps = {
  height: '24px',
  width: '24px',
  color: '#27C46A',
};

export default FileIcon;