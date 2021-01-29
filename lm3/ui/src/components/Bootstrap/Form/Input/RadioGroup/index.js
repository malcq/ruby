import React from 'react';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import cx from 'classnames';

import { Input, FormFeedback, FormGroup, Label } from 'reactstrap';

import { FORM } from 'constants';

import './styles.css';

const RadioGroup = ({
  options, input, meta: {
    error, touched, invalid, active,
  }, ...rest
}) => (
  <div className={cx('custom-radio-group', { 'is-invalid': touched && !active && invalid })}>
    {options.map(option => (
      <FormGroup key={option.value} check>
        <Label check>
          <Input type="radio" value={option.value} {...input} {...rest} />
          {option.label}
        </Label>
      </FormGroup>
    ))}
    {error && !active && <FormFeedback>{get(error, '[0]', null)}</FormFeedback>}
  </div>
);

/* eslint-disable react/require-default-props */
/* eslint-disable react/no-typos */

RadioGroup.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    label: PropTypes.string,
  })),
  input: FORM.FIELD_PROP_TYPES.INPUT,
  meta: FORM.FIELD_PROP_TYPES.META,
};

/* eslint-enable react/require-default-props */
/* eslint-enable react/no-typos */

export default RadioGroup;
