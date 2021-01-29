import React, { StatelessComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const FIRST_NODE_THRESHOLD = 33;
const SECOND_NODE_THRESHOLD = 66;

interface IShipmentProgressProps{
  departureIcon?: string,
  destinationIcon?: string,
  primaryColor?: string,
  secondaryColor?: string,
  progress?: number,
}

const ShipmentProgress: StatelessComponent<any> = (props: IShipmentProgressProps) => {
  const progress = props.progress || 0;
  const progressLinePercent = (progress <= SECOND_NODE_THRESHOLD)
      ? `${(progress - FIRST_NODE_THRESHOLD) / FIRST_NODE_THRESHOLD * 100}%`
      : '100%';

  const firstNodeColor = (progress > FIRST_NODE_THRESHOLD) ? props.primaryColor : props.secondaryColor;
  const secondNodeColor = (progress > SECOND_NODE_THRESHOLD) ? props.primaryColor : props.secondaryColor;
  const firstIconCircle = (progress !== 0 && progress !== 100) ? ' icon-circled ' : ' ';
  return (
    <div className="shipment-progress">
      <div
        className={`shipment-progress__edge icon
          ${props.destinationIcon}
          ${firstIconCircle}
          ${firstIconCircle}--${secondNodeColor}
          ${firstNodeColor}
        `}
      />
      <div className={`shipment-progress__bg ${props.secondaryColor}`}>
        {(progress > FIRST_NODE_THRESHOLD) && (
          <div>
            <div
              className={`shipment-progress__fill ${props.primaryColor}`}
              style={{ width: progressLinePercent, }}
            />
            {(progress <= SECOND_NODE_THRESHOLD) && (
              <div
                className='shipment-progress__thumb'
                style={{ left: progressLinePercent }}
              />
            )}
          </div>
        )}
      </div>
      <div
        className={`shipment-progress__edge icon hrevert ${props.departureIcon} ${secondNodeColor}`}
      />
    </div>
  )
};

ShipmentProgress.propTypes = {
};

ShipmentProgress.defaultProps = {
  departureIcon: 'none',
  destinationIcon: 'none',
  primaryColor: '',
  secondaryColor: '',
  progress: 0,
};

export default ShipmentProgress;