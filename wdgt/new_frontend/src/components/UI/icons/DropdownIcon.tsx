import React from 'react';

type Props = {
  width?: string;
  height?: string;
  color?: string;
};
const DropdownIcon: React.FC<Props> = (props) => {
  const {
    color,
    height,
    width,
  } = props;

  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 10 5"
    >
      <g
        fill="none"
        fillRule="evenodd"
        transform="translate(-7 -10)"
      >
        <path
          d="m7 10 5 5 5-5z"
          fill={color}
        />
        <path d="m0 0h24v24h-24z"/>
      </g>
    </svg>
  )
};

DropdownIcon.defaultProps = {
  height: '5px',
  width: '10px',
  color: '#7f7f7f',
};

export default DropdownIcon;
