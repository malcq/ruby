import React from 'react';
type Props = {
  width: string;
  height: string;
  colorChecked: string;
  colorUnchecked: string;
  checked: boolean,
};
class ConfirmationIcon extends React.Component<Props> {
  static defaultProps = {
    colorChecked: '#27C46A',
    colorUnchecked: '#BFBFBF',
    height: '20px',
    width: '20px',
    checked: false,
  }

  render() {
    const {
      colorChecked,
      colorUnchecked,
      height,
      width,
      checked,
    } = this.props;
      if (checked) {
        return (
          <ConfirmationIconChecked
            color={colorChecked}
            height={height}
            width={width}
          />
        )
      }
  
      return (
        <ConfirmationIconUnchecked
          color={colorUnchecked}
          width={width}
          height={height}
        />
      );
  }
};

type CheckedProps = {
  width: string;
  height: string;
  color: string;
};
const ConfirmationIconChecked: React.FC<CheckedProps> = (props) => {
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
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          transform="translate(-321.000000, -21.000000)"
          fill={color}
        >
            <g>
              <g transform="translate(319.000000, 19.000000)">
                <path
                  d="M4.91079812,4.95774648 C6.88263897,2.98590563 9.24568263,2 12,2 C14.7543174,2 17.1095364,2.97808099 19.0657277,4.9342723 C21.021919,6.89046362 22,9.24568263 22,12 C22,14.7543174 21.021919,17.1095364 19.0657277,19.0657277 C17.1095364,21.021919 14.7543174,22 12,22 C9.24568263,22 6.89046362,21.021919 4.9342723,19.0657277 C2.97808099,17.1095364 2,14.7543174 2,12 C2,9.24568263 2.97025634,6.89828826 4.91079812,4.95774648 Z M17.2743561,7.26315789 L9.71556551,14.8555431 L6.7256439,11.8656215 L5.68421053,12.8734602 L9.71556551,16.8712206 L18.3157895,8.27099664 L17.2743561,7.26315789 Z"
                />
              </g>
            </g>
        </g>
      </g>
  </svg>
  )
};

type UncheckedProps = {
  width: string;
  height: string;
  color: string;
};
const ConfirmationIconUnchecked: React.FC<UncheckedProps> = (props) => {
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
        <g
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
            <g
              transform="translate(-321.000000, -21.000000)"
            >
                <g
                  transform="translate(319.000000, 19.000000)"
                >
                    <g>
                        <path
                          d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"
                        />
                        <path
                          d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M12,21 C7.0275,21 3,16.9725 3,12 C3,7.0275 7.0275,3 12,3 C16.9725,3 21,7.0275 21,12 C21,16.9725 16.9725,21 12,21 Z M17.2743561,7.26315789 L9.71556551,14.8555431 L6.7256439,11.8656215 L5.68421053,12.8734602 L9.71556551,16.8712206 L18.3157895,8.27099664 L17.2743561,7.26315789 Z"
                          fill={color}
                        />
                    </g>
                </g>
            </g>
        </g>
    </svg>
  )
}


export default ConfirmationIcon;