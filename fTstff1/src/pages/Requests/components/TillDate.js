import React from 'react';
import PropTypes from 'prop-types';

import {
  Grid,
  Typography
} from '@material-ui/core';
import { SingleDate } from 'ui';
import Description from './Description';
import Warning from './Warning';

const TillDate = (props) => {
  const {
    date,
    error,
    update,
    send,
    title,
    comment,
    errorDesc,
    chosenRequest
  } = props;

  const onDateChoose = (date) => update({ date });

  const onSubmit = () => {
    if (!date) {
      update({ error: true });
      return;
    }
    send();
  };

  return <>
    <Grid container style={{ width: '80%', margin: '0 auto' }}>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          style={{
            textAlign: 'center',
            marginTop: '30px',
            marginBottom: '30px'
          }}
        >
          До какого числа необходимо выполнить заявку
        </Typography>
      </Grid>
      <Grid item sm={6} xs={12}>
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
    </Grid>
  </>;
};

const disabledDays = {
  before: new Date()
};

TillDate.propTypes = {
  send: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  error: PropTypes.bool,
  errorDesc: PropTypes.bool,
  title: PropTypes.string,
  comment: PropTypes.string,
  chosenRequest: PropTypes.string,
};

TillDate.defaultProps = {
  date: new Date(),
  title: '',
  comment: '',
  errorDesc: false,
  error: false,
  chosenRequest: 'technical',
};

export default TillDate;
