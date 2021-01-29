import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import _pickBy from 'lodash/pickBy';
import _identity from 'lodash/identity';

import { Grid } from '@material-ui/core';
import { DateRange } from 'ui';
import Description from './Description';
import Warning from './Warning';

class Vacation extends Component {
  onDateSend = (newDates) => {
    const { datesWeek, update } = this.props;
    if (datesWeek.from && datesWeek.to) {
      update({ datesWeek: {}, error: false, notActiveDays: [{ before: new Date() }] });
      return;
    }
    if (newDates.from) {
      this.selectDisabledDays(newDates.from);
    }
    update({ datesWeek: { ...datesWeek, ..._pickBy(newDates, _identity) } });
  }

  selectDisabledDays = (day) => {
    const activeDays = [moment(day)];
    for (let i = 1; i <= 7; i++) {
      activeDays.push(moment(day).add(i * 7 - 1, 'days'));
    }

    const notActiveDays = [{ before: activeDays[0].toDate() }];
    for (let i = 0; i < activeDays.length - 1; i++) {
      notActiveDays.push({
        after: activeDays[i].toDate(),
        before: activeDays[i + 1].toDate()
      });
    }
    notActiveDays.push({ after: activeDays[activeDays.length - 1].toDate() });
    this.props.update({ notActiveDays });
  };

  submit = () => {
    const { datesWeek, update } = this.props;
    if (!datesWeek) {
      update({ error: true });
      return;
    }
    this.props.send();
  };

  render() {
    const {
      datesWeek: dates,
      chosenRequest,
      notActiveDays,
      error,
      title,
      comment,
      errorDesc,
      update
    } = this.props;
    return (
      <StyledDiv>
        <Grid container style={{ width: '80%', margin: '0 auto' }}>
          <Grid item xs={12}>
            <DateRange
              dates={dates}
              type={chosenRequest}
              sendRequest={this.onDateSend}
              notActiveDays={notActiveDays}
            />

            <Warning show={error} />
          </Grid>
          <Grid item xs={12}>
            <Description
              submit={this.submit}
              type={chosenRequest}
              title={title}
              comment={comment}
              error={errorDesc}
              update={update}
            />
          </Grid>
        </Grid>
      </StyledDiv>
    );
  }
}

const StyledDiv = styled.div`
  .DayPicker-Month {
    margin-bottom: 30px !important;
  }

  @media (max-width: 725px) and (min-width: 610px) {
    .DayPicker {
      width: 315px;
    }
  }
`;

Vacation.propTypes = {
  userRole: PropTypes.string,
  send: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  datesWeek: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.bool,
  errorDesc: PropTypes.bool,
  title: PropTypes.string,
  comment: PropTypes.string,
  chosenRequest: PropTypes.string,
  notActiveDays: PropTypes.arrayOf(PropTypes.any)
};

Vacation.defaultProps = {
  title: '',
  comment: '',
  errorDesc: false,
  error: false,
  chosenRequest: 'technical',
  notActiveDays: [{ before: new Date() }],
};

export default Vacation;
