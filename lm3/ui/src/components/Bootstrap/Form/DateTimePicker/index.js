import React, { Fragment } from 'react';

import { FormFeedback } from 'reactstrap';

import cx from 'classnames';

import get from 'lodash/get';

import DateTimePicker from 'components/DateTimePicker';

import { FORM } from 'constants';

import './styles.css';

const FormDateTimePicker = ({
  input, meta: {
    error, touched, valid, active,
  }, ...rest
}) => (
  <Fragment>
    <DateTimePicker
      {...input}
      {...rest}
      className={cx('datetime-picker', {
        'is-valid': touched && !active && valid,
        'is-invalid': touched && !active && !valid,
      })}
      inputClassName={cx('form-control', {
        'is-valid': touched && !active && valid,
        'is-invalid': touched && !active && !valid,
      })}
    />
    {error && !active && <FormFeedback>{get(error, '[0]', null)}</FormFeedback>}
  </Fragment>
);

/* eslint-disable react/require-default-props */
/* eslint-disable react/no-typos */

FormDateTimePicker.propTypes = {
  input: FORM.FIELD_PROP_TYPES.INPUT,
  meta: FORM.FIELD_PROP_TYPES.META,
};

/* eslint-enable react/require-default-props */
/* eslint-enable react/no-typos */

export default FormDateTimePicker;
