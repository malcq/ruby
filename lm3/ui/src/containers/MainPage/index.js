import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, withStateHandlers, withProps } from 'recompose';
import { goBack, push } from 'react-router-redux';
import { NotificationsService } from 'services';

import { Field, reduxForm, SubmissionError } from 'redux-form';

import { Row, Col, Navbar } from 'reactstrap';

import cx from 'classnames';

import isEmpty from 'lodash/isEmpty';
import castArray from 'lodash/castArray';
import set from 'lodash/set';

import { Auth } from 'store';
import { SignIn } from 'containers/Authentication';
import Form from 'components/Form';
import Button from 'components/Button';

import { ROUTES } from 'constants';
import { PathUtils } from 'utils';

import './styles.css';

import AuthenticationContainerHOC from '../Authentication/Container';

import { validate, validateAsync } from './validation';

/* eslint-disable jsx-a11y/media-has-caption */

const formRenderer = ({
  error, submitting, pristine, handleSubmit,
}) => (
  <div>
    <div className="landing d-flex flex-column">
      <header>
        <div className="container-block my-auto d-flex align-items-center flex-column flex-sm-row">
          <h1>Lotto Mansion</h1>

          <div className="contact-us ml-sm-auto mt-sm-0 mt-3">
            <div className="form-wrapper d-flex flex-column flex-lg-row align-items-center">
              <SignIn />
            </div>
          </div>
        </div>
      </header>

      <div className="content mt-3">
        <div className="container-block mt-1 mb-1">
          <Row className="d-flex align-items-center">


            <Col sm="12" md="5">
              <div className="form-wrapper d-flex flex-column flex-lg-row align-items-center">
                <div className="form">
                  <div className="heading">
                   Sign Up
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <div className={cx('error', { show: error })}>
                      {error}
                    </div>

                    <Field
                      name="email"
                      type="email"
                      autoComplete="off"
                      placeholder="Your Email"
                      component={Form.Input}
                    />

                    <Field
                      name="firstName"
                      type="string"
                      autoComplete="off"
                      placeholder="First Name"
                      component={Form.Input}
                    />

                    <Field
                      name="phone"
                      type="string"
                      autoComplete="off"
                      placeholder="Phone"
                      component={Form.Input}
                    />

                    <Field
                      name="password"
                      type="password"
                      autoComplete="off"
                      placeholder="Password"
                      component={Form.Input}
                    />

                    <Field
                      name="passwordConfirmation"
                      type="password"
                      autoComplete="off"
                      placeholder="Confirm password"
                      component={Form.Input}
                    />

                    <div className="layout-row layout-align-end-center mt-4">
                      <Button
                        type="submit"
                        className="action-btn"
                        color="info"
                        disabled={pristine || submitting}
                        styles="primary-btn btn__sign-up"
                        text="Sign Up"
                      />
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <footer className="mt-auto pt-1 mb-2">
        <div className="container-block">
          Copyright &copy; LottoMansion 2018. All rights reserved
        </div>
      </footer>
    </div>
  </div>
);

formRenderer.propTypes = {
  error: PropTypes.string,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,

};

formRenderer.defaultProps = {
  error: null,
};

const confirmationRenderer = () => (
  <div>
    We just sent you an email.
    To verify we have the right email, please click the link in the email to activate your account
  </div>
);
const MainPage = ({
  error, submitting, pristine, handleSubmit, isConfirmationSent,
}) => {
  const Component = isConfirmationSent ? confirmationRenderer : formRenderer;
  return (
    <div className="sign-up">
      <Component
        error={error}
        submitting={submitting}
        pristine={pristine}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

MainPage.propTypes = {
  isConfirmationSent: PropTypes.bool.isRequired,
  error: PropTypes.string,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

MainPage.defaultProps = {
  error: null,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  signUp: Auth.signUp,
  pushRoute: push,
  goBackRoute: goBack,
}, dispatch);

export default compose(
  withProps({
    title: 'Sign Up',
  }),
  AuthenticationContainerHOC,
  connect(null, mapDispatchToProps),
  withStateHandlers({
    isConfirmationSent: false,
  }, {
    awaitConfirmation: () => () => ({ isConfirmationSent: true }),
  }),
  reduxForm({
    form: 'sign-up',
    asyncBlurFields: [],
    asyncValidate: values => validateAsync(values),
    onSubmit: (values, dispatch, props) => {
      const {
        phone,
        firstName,
        email,
        password,
      } = values;
      return props.signUp(firstName, phone, email, password)
        .catch(error => {
          const { details } = error;
          const errors = {};

          if (!isEmpty(details)) {
            Object.entries(details)
              .reduce((errorsAggr, [field, message]) => set(errorsAggr, field, castArray(message)), errors);
          } else {
            errors._error = error.message;
          }

          NotificationsService.error({ message: 'Bad credentials' });
          throw new SubmissionError(errors);
        });
    },
    onSubmitSuccess: (result, dispatch, props) => {
      NotificationsService.success({
        message:
            `We just sent you an email.
            To verify we have the right email, 
            please click the link in the email to activate your account`
      });
    },
  }),
)(MainPage);
