import React from 'react';

type Props = {
  width?: string;
  height?: string;
  color?: string;
};
const ArrowTopLeftIcon: React.FC<Props> = (props) => {
  const {
    height,
    width,
    color,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      fill={color}
      viewBox="0 0 24 24"
    >
      <path d="M19,17.59L17.59,19L7,8.41V15H5V5H15V7H8.41L19,17.59Z" />
    </svg>
  )
}

ArrowTopLeftIcon.defaultProps = {
  width: "24px",
  height: "24px",
  color: "#191F25",
};

export default ArrowTopLeftIcon;
