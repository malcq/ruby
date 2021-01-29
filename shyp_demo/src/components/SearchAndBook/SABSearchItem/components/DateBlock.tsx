import * as React from 'react';
import moment from 'moment';
import 'flag-icon-css/css/flag-icon.css';

const DateBlock: React.SFC<any> = (props) => {
  return (
    <div className={props.className}>
      <div className="departure-date__date-container">
        <div className="departure-date__date">
          {moment(props.date).format('MMM')}
        </div>
        <div className="departure-date__date departure-date__date--day">
          {moment(props.date).format('DD')}
        </div>
      </div>
      <div className="departure-date__date-text-container">
        {moment(props.date).format('MMM')} {moment(props.date).format('DD')}
      </div>
      <div className="departure-date__city-container">
        <div className="departure-date__country">
          {props.port}
          <div className="departure-date__flag">
            <span className={`flag-icon flag-icon-${props.country.split(', ')[1].toLowerCase()}`}/>
          </div>
        </div>
        <div className="departure-date__city">
          {props.country.split(', ')[0]}
        </div>
        <div className="departure-date__distance">{props.distance}</div>
      </div>
    </div>
  );
};

export default DateBlock;