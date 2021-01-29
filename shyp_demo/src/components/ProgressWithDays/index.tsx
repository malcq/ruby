import React, { StatelessComponent } from 'react';
import PropTypes from 'prop-types';
import { sumBy, get, last } from 'lodash';

import './styles.scss';

interface IProgressRange {
  id: string,
  start: number,
  end: number,
  width: number,
  order: number,
}

interface IProps{
  startIcon?: string,
  endIcon?: string,
  progress?: number,
  daysInTransit?: number,
}

function calculateStartsAndEnds(ranges: any[]){
  const fullWidth = sumBy(ranges, 'width');
  return ranges.reduce((results: any[], range: any, order: number): any[] => {
    const start = get(last(results), 'end', 0);
    results.push({
      ...range,
      end: start + range.width/fullWidth * 100,
      start,
      order,
    });
    return results;
  }, []);
}

const progressRanges: IProgressRange[] = calculateStartsAndEnds([
  { id: 'none', width: 0 },
  { id: 'first-node', width: 5 },
  { id: 'left-edge', width: 40 },
  { id: 'middle-node', width: 10 },
  { id: 'right-edge', width: 40 },
  { id: 'right-node', width: 5 }
]);

const getCurrentRange = (progress: number): IProgressRange | undefined => progressRanges.find(
  (range: IProgressRange) => progress >= range.start && progress <= range.end,
);

const ProgressWithDays: StatelessComponent<any> = (props: IProps) => {

  const progressStatus = getCurrentRange(props.progress || 0) || progressRanges[0];

  const startActiveModifier = (progressStatus.order > 1) ? 'active' : 'passive';
  const middleActiveModifier = (progressStatus.order > 2) ? 'active' : 'passive';
  const endActiveModifier = (progressStatus.order > 4) ? 'active' : 'passive';

  return (
    <div className="ranged-progress">
      <div className="ranged-progress__timeline">
        <div
          className="ranged-progress__timeline-filled"
          style={{ width: `${props.progress}%`}}
        />
      </div>
      <i className={`
        ranged-progress__icon
        ranged-progress__icon_${props.startIcon}
        ranged-progress__icon_start
        ranged-progress__icon_${startActiveModifier}
       `}
      />
      <i className={`
        ranged-progress__icon
        ranged-progress__icon_middle
        ranged-progress__icon_${middleActiveModifier}
       `}
      >
        {props.daysInTransit || 'N/A'}
      </i>
      <i className={`
        ranged-progress__icon
        ranged-progress__icon_${props.endIcon}
        ranged-progress__icon_end
        ranged-progress__icon_${endActiveModifier}
       `}
      />
    </div>
  )
};

ProgressWithDays.propTypes = {
  startIcon: PropTypes.string,
  endIcon: PropTypes.string,
  progress: PropTypes.number,
  daysInTransit: PropTypes.number,
};

ProgressWithDays.defaultProps = {
  startIcon: 'cargo',
  endIcon: 'cargo',
  progress: 0,
  daysInTransit: 0,
};

export default ProgressWithDays;