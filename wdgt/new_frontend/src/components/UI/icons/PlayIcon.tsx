import React from 'react';

type Props = {
  width?: string;
  height?: string;
  color?: string;
}
const PlayIcon: React.FC<Props> = (props) => {
  const {
    width,
    height,
    color
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 8 8"
      version="1.1"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          transform="translate(-9.000000, -8.000000)"
          fill={color}
        >
          <g>
            <polygon points="16.444558 12.0082517 9.5 16 9.5 8"></polygon>
          </g>
        </g>
      </g>
    </svg>
  );
};

PlayIcon.defaultProps = {
  height: '20px',
  width: '20px',
  color: '#7F7F7F',
}

export default PlayIcon;