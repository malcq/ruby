import React, { StatelessComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

import './styles.scss'

interface IDateBoxProps{
  date?: string | null,
}

const DateBox: StatelessComponent<any> = (props: IDateBoxProps) => {
  const date = props.date ? moment(props.date, 'YYYY-MM-DD') : '';
  return (
    <div className="date-box">
      <div className="date-box__field">
        {date ? date.format('MMM') : 'N/A'}
      </div>
      <div className="date-box__field">
        {date ? date.format('D') : 'N/A'}
      </div>
    </div>
  )
};

DateBox.propTypes = {
  date: PropTypes.string,
};

DateBox.defaultProps = {
  date: '',
};

export default DateBox;