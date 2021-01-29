import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Field } from 'redux-form';

import map from 'lodash/map';

import {
  FormGroup,
  Label,
  Button,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';

import FormContainerHOC from 'containers/AdminPanel/Containers/Form';

import { Form } from 'components/Bootstrap';
import CustomForm from 'components/Form';

import { SHAPES } from 'constants';

import { validate, validateAsync } from './validation';

const UsersForm = ({
  submitting, pristine, countries,
}) => (
  <Fragment>
    <FormGroup>
      <Label for="username">Username</Label>
      <Field
        id="username"
        name="username"
        type="text"
        component={Form.TextInput}
      />
    </FormGroup>

    <FormGroup>
      <Label for="firstName">First name</Label>
      <Field
        id="firstName"
        name="firstName"
        type="text"
        component={Form.TextInput}
      />
    </FormGroup>

    <FormGroup>
      <Label for="lastName">Last name</Label>
      <Field
        id="lastName"
        name="lastName"
        type="text"
        component={Form.TextInput}
      />
    </FormGroup>

    <FormGroup>
      <Label for="email">Email</Label>
      <Field
        id="email"
        name="email"
        type="email"
        component={Form.TextInput}
      />
    </FormGroup>

    <FormGroup>
      <Label for="password">Password</Label>
      <Field
        id="password"
        name="password"
        type="password"
        component={Form.TextInput}
      />
    </FormGroup>

    <FormGroup>
      <Label for="passwordConfirmation">Password confirmation</Label>
      <Field
        id="passwordConfirmation"
        name="passwordConfirmation"
        type="password"
        component={Form.TextInput}
      />
    </FormGroup>

    <Button
      type="submit"
      className="ml-auto"
      disabled={pristine || submitting}
    >
      Save
    </Button>
  </Fragment>
);

UsersForm.propTypes = {
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  countries: PropTypes.objectOf(PropTypes.shape(SHAPES.COUNTRY)),
};

UsersForm.defaultProps = {
  countries: {},
};

export default compose(
  withProps(({
    postSubmitSuccess, validationRules, user, formName,
  }) => ({
    postSubmitSuccess,
    asyncBlurFields: ['phone', 'phoneCode'],
    validate: values => validate(values, validationRules),
    asyncValidate: values => validateAsync(values),
    fields: ['firstName', 'lastName', 'email', 'phoneCode', 'phone', 'role', 'username'],
    entity: user,
    form: formName,
  })),
  FormContainerHOC,
)(UsersForm);
