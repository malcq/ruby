import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import arrow from 'ui/images/arrow.png';

import DayPicker from 'react-day-picker';

function Navbar({
  onPreviousClick,
  onNextClick,
  className,
}) {
  const styleLeft = {
    backgroundImage: `url(${arrow})`,
    cursor: 'pointer',
    padding: '10px',
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat',
  };
  const styleRight = {
    padding: '10px',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    backgroundImage: `url(${arrow})`,
    transform: 'rotate(180deg)',
  };
  const navContainer = {
    display: 'flex',
    position: 'relative',
    top: '0',
    width: '270px',
    justifyContent: 'space-between',
  };
  return (
    <div className={className} style={navContainer}>
      <span style={styleLeft} onClick={() => onPreviousClick()} />
      <span style={styleRight} onClick={() => onNextClick()} />
    </div>
  );
}
const DatePicker = ({ disabledDays, selectedDate, onDateChoose } = {}) => (

  <StyledDayPicker
    firstDayOfWeek={1}
    selectedDays={selectedDate || new Date()}
    onDayClick={onDateChoose}
    initialMonth={selectedDate || new Date()}
    disabledDays={disabledDays}
    modifiers={modifiers}
    modifiersStyles={modifiersStyles}
    navbarElement={<Navbar />}
  />
);

const modifiers = {
  saturdays: { daysOfWeek: [6] },
  sundays: { daysOfWeek: [0] },
  months: { daysWeek: [1] },
};

const modifiersStyles = {
  saturdays: {
    color: '#FF0000',
  },
  sundays: {
    color: '#FF0000',
  },
  months: {
    color: '#FF0000',
  },
};

const StyledDayPicker = styled(DayPicker)`
  && {
    /* display: block; */
    /* margin: 20px auto 0 auto; */
    /* max-width: 313px; */
  }
  && .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside){
    background-color: #b163ff;
    font-weight: bold;
    padding: 0 !important;
    color: #fff !important;
  }

  && .DayPicker-Day--disabled {
    color: inherit;
    opacity: 0.3;
  }

  && {
    /* margin: 8px 0px 0 27px; */
  }

  && .DayPicker-Day--today {
    color: #B163FF;
    font-size: 16px;
  }

  && .DayPicker-Day {
    display: block;
  }

  && .DayPicker-Month {
    font-family: Montserrat;
    margin: 0;
    font-size: 15px;
    margin-top: -14px;
    line-height: 128.91%;
    border-collapse: unset;
    /* max-width: 80%; */
    /* border-spacing: 4px 6px; */
    /* margin: 0 20px 0 20px; */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  && .DayPicker-Day {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    /* padding: 11px; */
  }

  && .DayPicker-Weekday {
    padding: 0;
    padding-bottom: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  && .DayPicker-Weekdays {
    display: block;
    margin-top: 0;
  }

  && .DayPicker-Body {
    display: block;
  }

  && .DayPicker-Week,
  && .DayPicker-WeekdaysRow {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    height: 40px;
    grid-gap: 6px;
  }
  /* && .DayPicker-WeekdaysRow {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    height: 40px;
    grid-gap: 6px;
  } */
  @media (max-width: 425px) {
    && .DayPicker-WeekdaysRow,
    && .DayPicker-Week {
      grid-template-columns: repeat(7, 30px);
      height: 30px;
    }
    && {
      display: block;
    }

    && .DayPicker-Day {
      padding: 2px;
    }
  }

  && .DayPicker-wrapper {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  && .DayPicker-Caption {
    margin-bottom: 32px;
    text-align: center;
    line-height: 20px;
    display: block;
    padding: 0;
  }

  && .DayPicker-NavButton--prev {
  background-image: url(${arrow});
  }

  && .DayPicker-NavButton--next {
  background-image: url(${arrow});
  transform: rotate(180deg);
  }

  && .DayPicker-NavButton {
    margin-top: 0;
    top: 0;
    width: 1.3em;
    height: 1.3em;
  }

  && .DayPicker-Weekday:nth-child(n+6) {
    color: #FF0000;
  }

  .DayPicker-Caption > div {
    font-weight: bold;
  }
`;

Navbar.propTypes = {
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func,
  className: PropTypes.string,
};

DatePicker.propTypes = {
  onDateChoose: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  disabledDays: PropTypes.shape(),
};

DatePicker.defaultProps = {
  selectedDate: new Date(),
  disabledDays: {},
  onPreviousClick: () => null,
  onNextClick: () => null,
  className: '',
};

export default DatePicker;
