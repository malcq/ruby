import React from 'react';
import styled from 'styled-components';
import { Form, Field } from 'react-final-form';

import {
  ErrorMessage,
  ErrorMessageContainer,
} from '../../../UI/Common';
import { ICustomFormField } from '../../../../models/custom-form';
import { DynamicFormValues, getValidatorByField } from './utils';
import DataTypeInput from '../../DataTypeInput';


type Props = {
  field: ICustomFormField,
  loading?: boolean,
  onSubmit: (values: DynamicFormValues) => any,
  initialValues?: {
    [data_type: string]: string,
  },
  serverError?: string | null,
}
const OneLineForm: React.FC<Props> = (props) => {

  const validator = React.useMemo(() => {
    return getValidatorByField(props.field);
  }, [props.field]);

  function onSubmit(values: DynamicFormValues) {
    return props.onSubmit(values);
  }

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={props.initialValues}
    >
      {({ handleSubmit, form }) => (
          <Field
            name={props.field.data_type}
            validate={validator}
          >
            {({ input, meta }) => {
              return (
                <>
                  <StyledDataTypeInput
                    value={input.value}
                    onChange={input.onChange}
                    onSend={form.submit}
                    isError={meta.touched && meta.error}
                    placeholder={props.field.placeholder}
                  />
                  <ErrorMessageContainer
                    visible={meta.touched && meta.error}
                  >
                    <ErrorMessage
                      title={meta.error}
                    >
                      {meta.error}
                    </ErrorMessage>
                    {props.serverError &&
                      <ErrorMessage
                        title={props.serverError}
                      >
                        {props.serverError}
                      </ErrorMessage>
                    }
                  </ErrorMessageContainer>
                </>
              )
            }}
          </Field>
        )}
    </Form>
  );
}


const StyledDataTypeInput = styled(DataTypeInput)`
  flex-grow: 1;
  transition: 2000ms;
`;


export default OneLineForm;
