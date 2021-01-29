import React from 'react';
import PropTypes from 'prop-types';

import { Form as BForm } from 'reactstrap';

import noop from 'lodash/noop';

import {
  TextInput,
  SelectInput,
  Checkbox,
  RadioGroup,
  MaskedInput,
} from './Input';

import DateTimePicker from './DateTimePicker';

const Form = ({ className, children, onSubmit }) => (
  <BForm className={className} onSubmit={onSubmit}>
    {children}
  </BForm>
);

Form.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
};

Form.defaultProps = {
  className: '',
  children: null,
  onSubmit: noop,
};

Form.TextInput = TextInput;
Form.SelectInput = SelectInput;
Form.Checkbox = Checkbox;
Form.RadioGroup = RadioGroup;
Form.MaskedInput = MaskedInput;
Form.DateTimePicker = DateTimePicker;

export default Form;
