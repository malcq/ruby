import React from 'react';

type Props = {
  width?: string;
  height?: string;
  color?: string;
};
const CloseIcon: React.FC<Props> = (props) => {
  const {
    color,
    height,
    width,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      version="1.1"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-326.000000, -298.000000)">
          <g transform="translate(323.000000, 295.000000)">
            <g>
              <polygon
                fill={color}
                points="12.6666667 4.27333333 11.7266667 3.33333333 8 7.06 4.27333333 3.33333333 3.33333333 4.27333333 7.06 8 3.33333333 11.7266667 4.27333333 12.6666667 8 8.94 11.7266667 12.6666667 12.6666667 11.7266667 8.94 8"
              />
              <polygon points="0 0 16 0 16 16 0 16" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
};

CloseIcon.defaultProps = {
  height: '10px',
  width: '10px',
  color: '#000000',
};


export default CloseIcon;
