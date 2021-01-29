import React, { StatelessComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

interface IProgressLineProps{
  percent: number;
}

const ProgressLine: StatelessComponent<any> = (props: IProgressLineProps) => (
  <div className="progress-line">
    <div className="progress-line__line">
      <div className="progress-line__guide" />
      <div
        className="progress-line__completed"
        style={{ width: `${props.percent}%`}}
      />
    </div>
  </div>
);

ProgressLine.propTypes = {
  percent: PropTypes.number,
};

ProgressLine.defaultProps = {
  percent: 0,
};

export default ProgressLine;