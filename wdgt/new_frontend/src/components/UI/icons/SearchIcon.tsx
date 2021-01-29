import React from 'react';

type Props = {
  width?: string;
  height?: string;
  color?: string;
}
const SearchIcon: React.FC<Props> = (props) => {
  const {
    width,
    height,
    color,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      version="1.1"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-284.000000, -14.000000)">
          <g>
            <g transform="translate(280.000000, 12.000000)">
                <g transform="translate(1.000000, 0.000000)">
                  <path
                    d="M15.5,13 L14.71,13 L14.43,12.73 C15.41,11.59 16,10.11 16,8.5 C16,4.91 13.09,2 9.5,2 C5.91,2 3,4.91 3,8.5 C3,12.09 5.91,15 9.5,15 C11.11,15 12.59,14.41 13.73,13.43 L14,13.71 L14,14.5 L19,19.49 L20.49,18 L15.5,13 Z M9.5,13 C7.01,13 5,10.99 5,8.5 C5,6.01 7.01,4 9.5,4 C11.99,4 14,6.01 14,8.5 C14,10.99 11.99,13 9.5,13 Z"
                    fill={color}
                  />
                  <polygon
                    points="-1 0 23 0 23 24 -1 24"
                  />
                </g>
              </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

SearchIcon.defaultProps = {
  height: '18px',
  width: '18px',
  color: '#7F7F7F',
}

export default SearchIcon;