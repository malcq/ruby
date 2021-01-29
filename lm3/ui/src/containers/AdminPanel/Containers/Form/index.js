import React from 'react';
import PropTypes from 'prop-types';

import { compose, lifecycle, withProps } from 'recompose';
import { reduxForm } from 'redux-form';

import noop from 'lodash/noop';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { Card, CardBody } from 'reactstrap';

import { NotificationsService } from 'services';

import { Form } from 'components/Bootstrap';

import { ReactUtils, FormUtils } from 'utils';

/**
 * FormContainerHOC
 *
 * Incapsulates common logic for Admin Forms
 *
 * @param   {React.Component}   WrappedComponent  Form component
 * @returns {React.Component}                     Extended Form component
 */
const FormContainerHOC = WrappedComponent => {
  const FormContaner = ({
    handleSubmit, ...props
  }) => (
    <Form onSubmit={handleSubmit}>
      <Card>
        <CardBody className="d-flex flex-column">
          <WrappedComponent {...props} />
        </CardBody>
      </Card>
    </Form>
  );

  FormContaner.propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
  };

  FormContaner.defaultProps = {
    error: null,
  };

  FormContaner.displayName = `FormContaner(${ReactUtils.getDisplayName(WrappedComponent)})`;

  return compose(
    withProps(props => ({
      postSubmitSuccess: props.postSubmitSuccess || noop,
      postSubmitFail: props.postSubmitFail || noop,
    })),
    reduxForm({
      enableReinitialize: true,
      keepDirtyOnReinitialize: true,
      validate: (values, props) => props.validate(values),
      onSubmit: (values, dispatch, props) =>
        props.onFormSubmit(values)
          .catch(FormUtils.handleSubmissionError),
      onSubmitSuccess: (result, dispatch, props) => props.postSubmitSuccess(result),
      onSubmitFail: (errors, dispatch, submitError, props) => {
        const { _error } = errors;

        if (_error) {
          NotificationsService.error({ message: _error });
        }

        props.postSubmitFail(errors, submitError);
      },
    }),
    lifecycle({
      componentDidMount() {
        const { entity, fields, initialize } = this.props;

        reinitializeForm(entity, fields, initialize);
      },
      componentWillReceiveProps(next) {
        const { entity: nextEntity } = next;
        const { entity, fields, initialize } = this.props;

        if (!isEqual(entity, nextEntity)) {
          reinitializeForm(nextEntity, fields, initialize);
        }
      },
    }),
  )(FormContaner);
};

/**
 * Picks necessary fields from the entity object and initializes redux form.
 *
 * @param   {Object|undefined}  entity      The object with initial values
 * @param   {Array}             fields      The array of fileds to pick from entity
 * @param   {Function}          initialize  The redux form initialize function
 * @returns {undefined}
 */
function reinitializeForm(entity, fields, initialize) {
  if (!entity) {
    return {};
  }

  return initialize(pick(entity, fields));
}

export default FormContainerHOC;
