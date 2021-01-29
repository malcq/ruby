import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { RadioTwoPicker, SingleDate } from 'ui';
import {
  MuiPickersUtilsProvider,
  TimePicker
} from 'material-ui-pickers';
import DateFnsUtils from '@date-io/moment';

import Description from './Description';
import Warning from './Warning';

const DayOff = ({
  date,
  error,
  timeFrom,
  timeTo,
  update,
  send,
  title,
  comment,
  errorDesc,
  chosenRequest
}) => {
  const [typeOfDayOff, setTypeOfDayOff] = React.useState('dayOff');

  const handleHourFromChange = (date) => {
    if (new Date(date) > new Date(timeTo)) {
      toast.warning('Время начала не может быть больше времени конца');
      return;
    }

    const newHourFrom = new Date(date);
    update({ timeFrom: newHourFrom, type: typeOfDayOff });
  };

  const handleHourToChange = (date) => {
    if (new Date(date) < new Date(timeFrom)) {
      toast.warning('Время конца не может быть меньше времени начала');
      return;
    }

    const newHourTo = new Date(date);
    update({ timeTo: newHourTo, type: typeOfDayOff });
  };

  const changeSee = (event) => {
    setTypeOfDayOff(event.target.value);
    update({ timeFrom, timeTo, type: event.target.value });
  };

  const onDateChoose = (date) => {
    update({ date, type: typeOfDayOff });
  };

  const onSubmit = async () => {
    if (!date) {
      update({ error: true });
      return;
    }

    await send();
  };

  return (
    <StyledGrid container>
      <Grid item sm={6} xs={12} >
        <SingleDate
          onDateChoose={onDateChoose}
          disabledDays={disabledDays}
          selectedDate={date}
        />

        <Warning show={error} />
      </Grid>

      <Grid item sm={6} xs={12}>
        <Description
          submit={onSubmit}
          type={chosenRequest}
          title={title}
          comment={comment}
          error={errorDesc}
          update={update}
        />
      </Grid>

      <Grid
        item
        sm={6} xs={12}
        justify="flex-start"
        container
      >
        <RadioTwoPicker
          value={typeOfDayOff}
          onChange={changeSee}
          firstValue="dayOff"
          firstLabel="Отгул на день"
          secondValue="timeOff"
          secondLabel="Отгул в течение дня"
        />
        {typeOfDayOff === 'timeOff' && (
          <Grid
            item
            sm={12}
            justify="flex-start"
            className="timepickers-container"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <TimePicker
                ampm={false}
                margin="normal"
                label="Начало"
                value={timeFrom}
                onChange={handleHourFromChange}
                autoOk
              />

              <TimePicker
                ampm={false}
                margin="normal"
                label="Конец"
                value={timeTo}
                onChange={handleHourToChange}
                autoOk
              />
            </MuiPickersUtilsProvider>
          </Grid>
        )}
      </Grid>
    </StyledGrid>
  );
};

const StyledGrid = styled(Grid)`
  && {
    width: 80%;
    margin: 0 auto;
  }

  .timepickers-container > * {
    width: 100%;
  }
`;

const disabledDays = {
  before: new Date()
};

DayOff.propTypes = {
  send: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  date: PropTypes.any,
  error: PropTypes.bool,
  errorDesc: PropTypes.bool,
  timeFrom: PropTypes.instanceOf(Date),
  timeTo: PropTypes.instanceOf(Date),
  title: PropTypes.string,
  comment: PropTypes.string,
  chosenRequest: PropTypes.string,
};

DayOff.defaultProps = {
  date: null,
  timeFrom: null,
  timeTo: null,
  title: '',
  comment: '',
  errorDesc: false,
  error: false,
  chosenRequest: 'technical',
};

export default DayOff;
