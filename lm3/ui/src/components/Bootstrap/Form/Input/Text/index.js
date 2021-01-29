import React, { Fragment } from 'react';

import { Input, FormFeedback, FormText } from 'reactstrap';

import get from 'lodash/get';

import { FORM } from 'constants';

const Text = ({
  input,
  meta: {
    touched, valid, error, warning, active,
  },
  ...custom
}) => (
  <Fragment>
    <Input {...(touched && !active ? { valid, invalid: !valid } : {})} {...input} {...custom} />
    {error && !active && <FormFeedback>{get(error, '[0]', null)}</FormFeedback>}
    {!error && warning && !active && <FormText>{warning}</FormText>}
  </Fragment>
);

/* eslint-disable react/require-default-props */
/* eslint-disable react/no-typos */

Text.propTypes = {
  input: FORM.FIELD_PROP_TYPES.INPUT,
  meta: FORM.FIELD_PROP_TYPES.META,
};

/* eslint-enable react/require-default-props */
/* eslint-enable react/no-typos */

export default Text;
