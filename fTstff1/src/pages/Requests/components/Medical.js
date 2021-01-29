import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _pickBy from 'lodash/pickBy';
import _identity from 'lodash/identity';

import { Grid } from '@material-ui/core';
import { DateRange } from 'ui';
import Description from './Description';
import Warning from './Warning';

class Medical extends Component {
  onDateSend = (newDates) => {
    const { datesWeek, update } = this.props;
    if (datesWeek.from && datesWeek.to) {
      update({ datesWeek: {}, error: false });
      return;
    }
    update({ datesWeek: { ...datesWeek, ..._pickBy(newDates, _identity) } });
  }

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
      error,
      title,
      comment,
      errorDesc,
      update,
      notActiveDays
    } = this.props;
    return (
      <StyledDiv>
        <Grid container style={{ width: '80%', margin: '0 auto' }}>
          <Grid item xs={12}>
            <DateRange
              notActiveDays={notActiveDays}
              dates={dates}
              type={chosenRequest}
              sendRequest={this.onDateSend}
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

Medical.propTypes = {
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

Medical.defaultProps = {
  title: '',
  comment: '',
  errorDesc: false,
  error: false,
  chosenRequest: 'technical',
  notActiveDays: [{ before: new Date() }],
};

export default Medical;
