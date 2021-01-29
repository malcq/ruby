import React from 'react';
import styled from 'styled-components';
import { Form, Field } from 'react-final-form';
import { ICustomFormField } from '../../../../models/custom-form';


import SimpleInput from '../../SimpleInput';
import { ErrorMessage, FieldContainer } from '../Common';
import RootPortal from '../../RootPortal';
import { ContinueButton } from '../../Buttons';

import { prepareValidators, DynamicFormValues } from './utils';


type Props = {
  fields: ICustomFormField[],
  loading?: boolean,
  onSubmit: (values: DynamicFormValues) => any,
  initialValues?: {
    [data_type: string]: string,
  },
  serverError?: string | null,
};
const CustomForm: React.FC<Props> = (props) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const validators = React.useMemo(() => {
    return prepareValidators(props.fields)
  }, [props.fields]);


  function onSubmit(values: DynamicFormValues) {
    return props.onSubmit(values);
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
        initialValues={props.initialValues}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => {
          return (
            <StyledForm
              onSubmit={handleSubmit}
              ref={formRef}
            >
              {props.fields.map((field) => {
                return (
                  <Field
                    name={field.data_type}
                    validate={validators[field.data_type]}
                    key={field.data_type}
                  >
                    {({ input, meta }) => (
                      <FieldContainer>
                        <SimpleInput
                          value={input.value}
                          onChange={input.onChange}
                          name={input.name}
                          error={meta.error && meta.touched}
                          placeholder={field.placeholder}
                        />
                        {meta.error && meta.touched &&
                          <ErrorMessage>
                            {meta.error}
                          </ErrorMessage>
                        }
                      </FieldContainer>
                    )}
                  </Field>
                )
              })}
              <HiddenSubmitButton
                type="submit"
              >
                Submit
              </HiddenSubmitButton>
              {props.serverError && (
                <ErrorMessage>{props.serverError}</ErrorMessage>
              )}
              <RootPortal>
                <ContinueButton
                  onClick={onContinueClick}
                  disabled={props.loading}
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

const HiddenSubmitButton = styled.button`
  display: none;
`;

export default CustomForm;

