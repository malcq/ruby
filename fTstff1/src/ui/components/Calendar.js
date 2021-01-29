import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import momentRu from 'moment/locale/ru';
import moment from 'moment';
import { createSelector } from 'reselect';

import { getName } from 'utils';

import BigCalendar from 'react-big-calendar';

moment.updateLocale('ru', momentRu);

const localizer = BigCalendar.momentLocalizer(moment);

const eventColors = {
  dayOff: 'rgba(236, 151, 31, 0.6)',
  medical: 'rgba(201, 48, 44, 0.6)',
  technical: 'rgba(40, 96, 144, 0.6)',
  vacation: 'rgba(68, 157, 68, 0.6)'
};

class Calendar extends Component {
  getData = createSelector(
    (element) => element,
    (element) => {
      const { globalUser } = this.props;
      const { role } = globalUser;
      const date =
        role === 'admin'
          ? element.status === 'accept'
            ? new Date(element.dateTo)
            : new Date(element.dateTo) <= new Date()
              ? new Date()
              : new Date(element.dateTo)
          : new Date(element.dateTo);
      return date;
    }
  );

  dateRequestSelector = createSelector(
    (requests) => requests,
    (requests) => {
      const { globalUser, ads } = this.props;
      const { role, id } = globalUser;
      if (role !== 'admin') {
        // eslint-disable-next-line
        requests = requests.filter((element) => {
          return element.users[0].id === id;
        });
      }
      let dates = requests.map((elem) => {
        const datesForDayOff = elem.type === 'dayOff' ? elem.dates?.sort() || [] : [];

        const dateStart = ['technical', 'common', 'documents'].includes(
          elem.type
        )
          ? this.getData(elem)
          : elem.type === 'dayOff'
            ? new Date(datesForDayOff[0])
            : new Date(elem.dateFrom);

        const dateEnd =
          elem.type === 'dayOff'
            ? new Date(datesForDayOff[datesForDayOff.length - 1])
            : ['technical', 'common', 'documents'].includes(elem.type)
              ? this.getData(elem)
              : new Date(elem.dateTo);

        return {
          id: ads.length + elem.id,
          title: `${elem.title} от ${getName(elem.users[0])}`,
          start: dateStart,
          end: dateEnd,
          desc: elem.comment,
          type: elem.type
        };
      });
      dates = dates.concat(ads);
      return dates;
    }
  );

  pickColor = (event) => {
    const backgroundColor = eventColors[event.type] || 'inherit';
    const border = event.type ? '' : '1px solid black';
    const style = {
      backgroundColor,
      color: 'black',
      border
    };
    return { style };
  };

  render() {
    const { requests, ads } = this.props;
    const dates = requests.length ? this.dateRequestSelector(requests) : ads;

    return (
      <StyledContainer>
        <BigCalendar
          events={dates}
          defaultView={BigCalendar.Views.MONTH}
          step={60}
          showMultiDayTimes
          defaultDate={new Date()}
          localizer={localizer}
          eventPropGetter={this.pickColor}
        />
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  text-align: center;
  position: relative;
  min-height: max-content;
  height: calc(100vh - 100px);

  && .rbc-day-slot .rbc-events-container {
    margin-right: 0;
  }
`;

Calendar.propTypes = {
  globalUser: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  requests: PropTypes.arrayOf(PropTypes.shape()),
  ads: PropTypes.arrayOf(PropTypes.shape())
};

Calendar.defaultProps = {
  requests: [],
  ads: []
};

export default Calendar;
