import React from 'react';

type Props = {
  width?: string;
  height?: string;
  color?: string;
  className?: string;
};
const CallIcon: React.FC<Props> = (props) => {
  const {
    height,
    width,
    color,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      version="1.1"
      className={props.className}
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g transform="translate(-203.000000, -595.000000)">
          <g transform="translate(201.000000, 593.000000)">
            <g>
              <polygon points="0 0 20 0 20 20 0 20" />
              <path
                d="M5.51666667,8.99166667 C6.71666667,11.35 8.65,13.275 11.0083333,14.4833333 L12.8416667,12.65 C13.0666667,12.425 13.4,12.35 13.6916667,12.45 C14.625,12.7583333 15.6333333,12.925 16.6666667,12.925 C17.125,12.925 17.5,13.3 17.5,13.7583333 L17.5,16.6666667 C17.5,17.125 17.125,17.5 16.6666667,17.5 C8.84166667,17.5 2.5,11.1583333 2.5,3.33333333 C2.5,2.875 2.875,2.5 3.33333333,2.5 L6.25,2.5 C6.70833333,2.5 7.08333333,2.875 7.08333333,3.33333333 C7.08333333,4.375 7.25,5.375 7.55833333,6.30833333 C7.65,6.6 7.58333333,6.925 7.35,7.15833333 L5.51666667,8.99166667 Z"
                fill={color}
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
};
CallIcon.defaultProps = {
  height: '18px',
  width: '18px',
  color: '#FFFFFF',
};


const CallIconOutlined: React.FC<Props> = (props) => {
  const {
    color,
    height,
    width,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      version="1.1"
      className={props.className}
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g transform="translate(-203.000000, -531.000000)">
          <g transform="translate(201.000000, 529.000000)">
            <g>
                <path
                  d="M5.51666667,8.99166667 C6.71666667,11.35 8.65,13.275 11.0083333,14.4833333 L12.8416667,12.65 C13.0666667,12.425 13.4,12.35 13.6916667,12.45 C14.625,12.7583333 15.6333333,12.925 16.6666667,12.925 C17.125,12.925 17.5,13.3 17.5,13.7583333 L17.5,16.6666667 C17.5,17.125 17.125,17.5 16.6666667,17.5 C8.84166667,17.5 2.5,11.1583333 2.5,3.33333333 C2.5,2.875 2.875,2.5 3.33333333,2.5 L6.25,2.5 C6.70833333,2.5 7.08333333,2.875 7.08333333,3.33333333 C7.08333333,4.375 7.25,5.375 7.55833333,6.30833333 C7.65,6.6 7.58333333,6.925 7.35,7.15833333 L5.51666667,8.99166667 Z M16.8,3.075 L16.2083333,2.49166667 L10.8333333,7.74166667 L10.8333333,4.16666667 L10,4.16666667 L10,9.16666667 L15,9.16666667 L15,8.33333333 L11.5416667,8.33333333 L16.8,3.075 Z"
                  fill={color}
                ></path>
                <polygon
                  points="0 0 20 0 20 20 0 20"
                />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

CallIconOutlined.defaultProps = {
  height: '18px',
  width: '18px',
  color: '#27C46A',
}


export {
  CallIcon,
  CallIconOutlined,
}
