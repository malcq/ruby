import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Input, FormFeedback } from 'reactstrap';

import get from 'lodash/get';

import { FORM } from 'constants';

const Select = ({
  input, meta: {
    valid, touched, error, active,
  }, children, ...custom
}) => (
  <Fragment>
    <Input type="select" {...(touched && !active ? { valid, invalid: !valid } : {})} {...input} {...custom}>
      {children}
    </Input>
    {error && !active && <FormFeedback>{get(error, '[0]', null)}</FormFeedback>}
  </Fragment>
);

/* eslint-disable react/require-default-props */
/* eslint-disable react/no-typos */

Select.propTypes = {
  input: FORM.FIELD_PROP_TYPES.INPUT,
  meta: FORM.FIELD_PROP_TYPES.META,
  children: PropTypes.node,
};

/* eslint-enable react/require-default-props */
/* eslint-enable react/no-typos */

export default Select;
