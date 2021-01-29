import React from 'react';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import cx from 'classnames';

import { Input, FormFeedback, Label } from 'reactstrap';

import { FORM } from 'constants';

import './styles.css';

const Checkbox = ({
  label, input, meta: { error, touched, invalid }, ...rest
}) => (
  <div className={cx('custom-form-check', { 'is-invalid': touched && invalid })}>
    <Label check>
      <Input type="checkbox" checked={!!input.value} {...input} {...rest} />
      {label}
    </Label>
    {error && <FormFeedback>{get(error, '[0]', null)}</FormFeedback>}
  </div>
);

/* eslint-disable react/require-default-props */
/* eslint-disable react/no-typos */

Checkbox.propTypes = {
  label: PropTypes.string,
  input: FORM.FIELD_PROP_TYPES.INPUT,
  meta: FORM.FIELD_PROP_TYPES.META,
};

/* eslint-enable react/require-default-props */
/* eslint-enable react/no-typos */

export default Checkbox;
