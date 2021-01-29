import React from 'react';
import styled from 'styled-components';
import { Form, Field } from 'react-final-form';

import { ErrorMessage, FieldContainer } from './Common';
import SimpleInput from '../SimpleInput';
import RootPortal from '../RootPortal';
import { ContinueButton } from '../Buttons';

import {
  createRequiredValidator,
  composeValidators,
  createNameValidator,
} from '../../../utils/validators';

const requiredValidator = createRequiredValidator('Field is required');
const fullNameValidator = createNameValidator('Please enter your correct name');
const validator = composeValidators(
  requiredValidator,
  fullNameValidator,
);

export type FormValues = {
  first_name: string,
  second_name: string,
};

type Props = {
  initialValues?: FormValues,
  onSubmit: (values: FormValues) => any,
  serverError?: string | null,
  loading?: boolean,
  firstNamePlaceholder?: string,
  secondNamePlaceholder?: string,
}
const FullNameForm: React.FC<Props> = (props) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    loading
  } = props;

  function onSubmit(values: FormValues) {
    const result: FormValues = {
      first_name: values.first_name,
      second_name: values.second_name,
    };
    props.onSubmit(result);
  }

  function onContinueClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    if (formRef && formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }

  return (
    <StyledContainer>
      <Form
        onSubmit={onSubmit}
        initialValues={props.initialValues}
      >
        {({ handleSubmit, submitting, invalid,  }) => {
          return (
            <StyledForm
              onSubmit={handleSubmit}
              ref={formRef}
            >

              <Field
                name="first_name"
                validate={validator}
              >
                {({ input, meta }) => (
                  <FieldContainer>
                    <SimpleInput
                      value={input.value}
                      onChange={input.onChange}
                      name={input.name}
                      error={meta.touched && meta.error}
                      placeholder={props.firstNamePlaceholder}
                    />
                    {meta.error && meta.touched &&
                      <ErrorMessage>
                        {meta.error}
                      </ErrorMessage>
                    }
                  </FieldContainer>
                )}
              </Field>

              <Field
                name="second_name"
                validate={validator}
              >
                {({ input, meta }) => (
                  <FieldContainer>
                    <SimpleInput
                      value={input.value}
                      onChange={input.onChange}
                      name={input.name}
                      error={meta.touched && meta.error}
                      placeholder={props.secondNamePlaceholder}
                    />
                    {meta.error && meta.touched &&
                      <ErrorMessage>
                        {meta.error}
                      </ErrorMessage>
                    }
                  </FieldContainer>
                  
                )}
              </Field>
              {props.serverError && (
                <ErrorMessage>{props.serverError}</ErrorMessage>
              )}
              <RootPortal>
                <ContinueButton
                  onClick={onContinueClick}
                  disabled={loading}
                >
                  Continue
                </ContinueButton>
              </RootPortal>
            </StyledForm>
          )
        }}
      </Form>

    </StyledContainer>
  )
}

const StyledContainer = styled.div`
`;

const StyledForm = styled.form`
  margin-bottom: 81px;

  & > div {
    margin-bottom: 16px;
  }

  & > div:last-child {
    margin-bottom: 0;
  }
`;

export default FullNameForm;