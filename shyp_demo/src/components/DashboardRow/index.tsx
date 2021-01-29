import React, {
  StatelessComponent
} from 'react';
import PropTypes from  'prop-types';

import { ProgressWithDays } from '../'
import './styles.scss'

import {Link} from "react-router-dom";
import getClassName from "../../utils/styling/index";

interface IDashboardRow {
  shipName: string;
  shipNumber: string;
  dateFrom: string;
  locationFrom: string;
  dateTo: string;
  locationTo: string;
  progress: number;
  sliderColor: string[];
  full: boolean;
  delayed_days: string | null;
  shipment_type: string;
  id: number;
  valid_information: boolean;
}

const DashboardRow: StatelessComponent<any> = (props: IDashboardRow) => (
    <Link to={`/shipments/${props.id}`} className="dashboard-layout__content">
      <div className="dashboard-layout__column">
        <div className="dashboard-layout__column-title">{props.shipName}</div>
        <div className="dashboard-layout__column-subtitle dashboard-layout__column-subtitle--first">{props.shipNumber}</div>
      </div>
      <div className="dashboard-layout__column">
        <div className="dashboard-layout__column-title">{props.dateFrom}</div>
        <div className="dashboard-layout__column-subtitle">{props.locationFrom}</div>
      </div>
      <div className="dashboard-layout__progress">
        <div className="dashboard-layout__progress-container">
          <ProgressWithDays
            departureIcon={props.shipment_type === 'air' ? 'plane-landing' : 'container'}
            destinationIcon={props.shipment_type === 'air' ? 'plane-lift-off' : 'container'}
            primaryColor={props.sliderColor[0]}
            secondaryColor={props.sliderColor[1]}
            progress={props.progress}
          />
        </div>
      </div>
      <div className="dashboard-layout__column">
        <div className="dashboard-layout__column-title">
          {props.dateTo}
          <span className={props.delayed_days && props.delayed_days.includes('-') ? 'green' : 'red'}>
            {props.delayed_days}
          </span>
        </div>
        <div className="dashboard-layout__column-subtitle">{props.locationTo}</div>
      </div>
      <div className={getClassName("dashboard-layout__column-mark icon",
        {"checkcircle": props.valid_information, "attention": !props.valid_information})}
      />
    </Link>
);


DashboardRow.propTypes = {
  shipName: PropTypes.string,
  shipNumber: PropTypes.string,
  dateFrom: PropTypes.string,
  locationFrom: PropTypes.string,
  dateTo: PropTypes.string,
  locationTo: PropTypes.string,
  progress: PropTypes.number,
  sliderColor: PropTypes.array,
  full: PropTypes.bool,
  delayed_days: PropTypes.string || null,
  shipment_type: PropTypes.string,
  valid_information: PropTypes.bool,
};

DashboardRow.defaultProps = {
  shipName: '',
  shipNumber: '',
  dateFrom: '',
  locationFrom: '',
  dateTo: '',
  locationTo: '',
  progress: 0,
  sliderColor: ['grey','grey'],
  delayed_days: null,
  shipment_type: '',
  valid_information: false,
};

export default DashboardRow;