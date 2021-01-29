import React from 'react';
import uuid from 'uuid/v4';

type Props = {
  width?: string;
  height?: string;
  color?: string;
};
const EditIcon: React.FC<Props> = (props) => {
  const { color, height, width } = props;

  const [ids] = React.useState({
    pathId: `svg-${uuid()}`,
    maskId: `svg-${uuid()}`,
  })

  return (
    <svg
      height={height}
      viewBox="0 0 16 16"
      width={width}
    >
      <defs>
        <path
          id={ids.pathId}
          d="m13.78125 3.13541667-1.421875 1.421875-2.91666667-2.91666667 1.42187497-1.421875c.1458341-.14583406.3281239-.21875.546875-.21875s.401041.07291594.546875.21875l1.8229167 1.82291667c.1458341.14583406.21875.3281239.21875.546875 0 .21875109-.0729159.40104093-.21875.546875zm-13.78125 7.94791663 8.60416667-8.60416663 2.91666663 2.91666666-8.60416663 8.60416667h-2.91666667z"
        />
        <mask
          id={ids.maskId}
          fill="#fff"
        >
          <use
            fill="#fff"
            fillRule="evenodd"
            xlinkHref={`#${ids.pathId}`}
          />
        </mask>
      </defs>
      <g
        fill="none"
        fillRule="evenodd"
        transform="translate(1 1)"
      >
        <use
          fill={color}
          xlinkHref={`#${ids.pathId}`}
        />
        <g mask={`url(#${ids.maskId})`}>
          <g transform="translate(-26.444444 -34)">
            <path d="m0 0h67v86h-67z" fill={color} fillRule="evenodd"/>
            <path d="m0 0h67v86h-67z" fill="none" stroke={color}/>
          </g>
        </g>
      </g>
    </svg>
  )
}

EditIcon.defaultProps = {
  height: '24px',
  width: '24px',
  color: '#27C46A',
};

export default EditIcon;