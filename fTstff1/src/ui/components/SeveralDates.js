import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DayPicker, { DateUtils } from 'react-day-picker';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
      dataFromProps: false,
    };
  }

  componentDidMount() {
    const { dates } = this.props;
    this.setState({ dataFromProps: !!dates });
  }

  changeDates = (selected, day, selectedDays = this.state.selectedDays) => {
    if (selected) {
      const selectedIndex = selectedDays.findIndex(
        (selectedDay) => DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
      return selectedDays;
    }
    selectedDays.push(day);
    return selectedDays;
  };

  handleDayClick = (day, { selected }) => {
    const { dates } = this.props;
    if (dates) {
      const newDates = this.changeDates(selected, day, dates);
      this.props.onDateChoose(newDates);
      return;
    }
    const selectedDays = this.changeDates(selected, day);
    this.props.onDateChoose(selectedDays);
    this.setState({ selectedDays });
  };

  render() {
    const day = this.props.userRole === 'admin' ? {} : { before: new Date() };
    const { dates } = this.props;
    const { selectedDays, dataFromProps } = this.state;
    const currentDates = dataFromProps ? dates : selectedDays;
    return (
      <>
        <StyledDayPicker
          firstDayOfWeek={1}
          selectedDays={currentDates}
          onDayClick={this.handleDayClick}
          disabledDays={day}
        />
      </>
    );
  }
}

const StyledDayPicker = styled(DayPicker)`
  && {
    display: block;
    margin: 30px auto 0 auto;
    max-width: 313px;
  }
  .DayPicker-NavButton {
    margin-top: 0;
    top: 0 !important;
    width: 1.3em !important;
    height: 1.3em !important;
  }
  && .DayPicker-Month {
    width: 250px;
    max-width: 80%;
    font-size: 15px;
    margin: 0 20px 0px 20px;
  }
`;

DatePicker.propTypes = {
  onDateChoose: PropTypes.func.isRequired,
  userRole: PropTypes.string,
  dates: PropTypes.arrayOf(PropTypes.any),
};
DatePicker.defaultProps = {
  userRole: 'user',
  dates: null,
};

export default DatePicker;
