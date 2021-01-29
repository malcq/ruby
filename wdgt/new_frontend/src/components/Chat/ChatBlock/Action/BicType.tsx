import React from 'react';
import styled, { css } from 'styled-components';
import { Form, Field } from 'react-final-form';

import {
  ErrorMessage,
  ErrorMessageContainer,
} from '../../../UI/Common';
import { Button } from '../../../UI/Buttons';
import DataTypeInput from '../../../UI/DataTypeInput';

import {
  IAction,
  ISelectedAction,
  IStateFreeText,
} from '../../../../models/chat';

import * as validators from '../../../../utils/validators';
import { getActionState } from '../../../../utils';
import { EActionStates } from '../../../../utils/constants';
import { CSSTransition } from 'react-transition-group';

type FormValues = {
  bic_number: string,
};

const bicValidator = validators.composeValidators(
  validators.createRequiredValidator('Field is required'),
  validators.createBicValidator('BIC number is not valid'),
);

const getInitialInputValue = (action: IAction, selected?: ISelectedAction): FormValues => {
  const pureValues = { bic_number: '' };

  if (!selected) { return pureValues; }

  if (action.id !== selected.actionId) { return pureValues; }

  const message = (selected.state as IStateFreeText).message;

  return {
    bic_number: message,
  };
}


type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: IStateFreeText) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
  actionDisabled: boolean;
};
const BicType: React.FC<Props> = (props) => {

  const {
    action,
    selected,
    actionDisabled,
  } = props;


  const initialValues = React.useMemo((): FormValues => {
    return getInitialInputValue(action, selected);
  }, [action, selected]);

  const [formValues, setFormValues] = React.useState<FormValues>(initialValues);

  const state = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);
  const selectedState = state === EActionStates.selected;

  function mapStateToRedux(values: FormValues): IStateFreeText {
    return {
      message: values.bic_number.trim(),
    }
  }

  async function onSubmit(values: FormValues) {
    const state = mapStateToRedux(values);
    setFormValues(prevState => values);
    try {
      await props.onActionReply(action, state);
    } catch (err) {
      console.log(err);
    }
  }

  function onActionRollback() {
    props.onRollbackAction(action);
  }

  return (
    <StyledContainer
      selectedState={selectedState}
    >
      {!selectedState && (
        <Form
          onSubmit={onSubmit}
          initialValues={formValues}
        >
          {({ handleSubmit, form }) => (
              <Field
                name="bic_number"
                validate={bicValidator}
              >
                {({ input, meta }) => {
                  return (
                    <>
                      <StyledDataTypeInput
                        value={input.value}
                        onChange={input.onChange}
                        onSend={form.submit}
                        isError={meta.touched && meta.error}
                        placeholder={action.options.placeholder}
                      />
                      <ErrorMessageContainer
                        visible={meta.touched && meta.error}
                      >
                        <ErrorMessage
                          title={meta.error}
                        >
                          {meta.error}
                        </ErrorMessage>
                      </ErrorMessageContainer>
                    </>
                  )
                }}
              </Field>
            )}
        </Form>
        )
      }

      <CSSTransition
        in={selectedState}
        classNames="my-node"
        timeout={{
          exit: 0,
          enter: 700
        }}
        unmountOnExit
      >
        <StyledButton
          outlined
          onClick={onActionRollback}
          color="selected"
          disabled={actionDisabled}
        >
          {formValues.bic_number}
        </StyledButton>
      </CSSTransition>
    </StyledContainer>
  );
}

type StyledContainerProps = {
  selectedState?: boolean;
};
const StyledContainer = styled.div<StyledContainerProps>`
  padding: 0 24px;
  display: flex;
  flex-direction: row;
  position: relative;

  ${props => props.selectedState
    ? css`
      justify-content: flex-end;
    `
    : null
  }
`;

const StyledDataTypeInput = styled(DataTypeInput)`
  flex-grow: 1;
  transition: 2000ms;
`;

const StyledButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;

  &.my-node-enter {
    max-width: 100%;
    flex-grow: 1;
  }

  &.my-node-enter-active {
    flex-grow: 0;
  }
`;

export default BicType;