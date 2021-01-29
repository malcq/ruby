import React from 'react';
import styled, { css } from 'styled-components';

import {
  IAction,
  ISelectedAction,
  IStateCustomForm,
  IOptionsCustomForm,
} from '../../../../../models/chat';

import reducer, { ActionTypes } from './reducer';
import { formMock } from './mock';

import MultilineForm from '../../../../UI/Forms/CustomForm/MultilineForm';
import OnelineForm from '../../../../UI/Forms/CustomForm/OneLineForm';


import { getActionState } from '../../../../../utils';
import { EActionStates } from '../../../../../utils/constants';
import { Button } from '../../../../UI/Buttons';
import CSSTransition from 'react-transition-group/CSSTransition';

type FormValues = {
  [data_type: string]: string,
};

enum EFormType {
  multiline = 'multiline',
  oneline = 'oneline',
  none = 'none',
};

const getInitialValues = (action: IAction, selected?: ISelectedAction): FormValues | undefined => {
  if (!selected) { return undefined; }
  if (action.id !== selected.actionId) { return undefined; }
  const state: FormValues = (selected.state as IStateCustomForm);
  return state;
  // return {
  //   email: 'test@from.parent',
  //   list: 'item 1',
  // }
}

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: IStateCustomForm) => Promise<void>;
  onRollbackAction: (action: IAction) => void;
  actionDisabled: boolean;
};
const CustomFormType: React.FC<Props> = (props) => {
  const {
    action,
    selected,
  } = props;
  const actionOptions = action.options as IOptionsCustomForm;

  const initialValues = React.useMemo((): FormValues => {
    return getInitialValues(action, selected) ?? {};
  }, [action, selected]);
  
  const formType: EFormType = React.useMemo((): EFormType => {
    const fields = actionOptions.fields;
    if (fields.length <= 0) { return EFormType.none; }
    if (fields.length === 1) { return EFormType.oneline; }
    return EFormType.multiline;
  }, [actionOptions.fields]);


  const [formValues, setFormValues] = React.useState<FormValues>(initialValues)
  const [store, dispatch] = React.useReducer(reducer, { errorMessage: null, loading: false });

  const actionState = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const selectedState = actionState === EActionStates.selected;

  const responseText = React.useMemo((): string => {
    return Object.values(formValues).join(' ');
  }, [formValues]);

  function mapStateToRedux(values: FormValues): IStateCustomForm {
    return values;
  }

  function onActionRollback() {
    props.onRollbackAction(action);
  }

  function onActionReply(values: FormValues) {
    const state = mapStateToRedux(values);
    return props.onActionReply(action, state);
    // return Promise.resolve();
  }

  async function onFormSubmit(values: FormValues) {
    dispatch({type: ActionTypes.START_UPDATE });
    setFormValues(values);
    try {
      await onActionReply(values);
      dispatch({ type: ActionTypes.SUCCESS_UPDATE });
    } catch (err) {
      dispatch({
        type: ActionTypes.ERROR_UPDATE,
        errorMessage: err.message,
      })
    }
  }

  if (formType === EFormType.none) { return null; }

  if (formType === EFormType.oneline) {
    return (
      <StyledOnelineContainer
        selectedState={selectedState}
      >
        {!selectedState && (
          <OnelineForm
            initialValues={formValues}
            onSubmit={onFormSubmit}
            field={actionOptions.fields[0]}
            loading={store.loading}
            serverError={store.errorMessage}
          />
        )}
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
            disabled={props.actionDisabled}
          >
            {responseText}
          </StyledButton>
        </CSSTransition>
      </StyledOnelineContainer>
    );
  }

  return (
    <StyledContainer>
      {!selectedState &&
        <MultilineForm
          onSubmit={onFormSubmit}
          fields={actionOptions.fields}
          initialValues={formValues}
          loading={store.loading}
          serverError={store.errorMessage}
        />
      }
      {selectedState && (
        <StyledMultilineButton
          outlined
          onClick={onActionRollback}
          color="selected"
          disabled={props.actionDisabled}
        >
          {responseText}
        </StyledMultilineButton>
      )}
    </StyledContainer>
  )
}


const StyledContainer = styled.div`
  margin: 0 24px;
  display: flex;
  flex-direction: column;
`;

const StyledMultilineButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;
  align-self: flex-end;
`;

type StyledOnelineContainerProps = {
  selectedState?: boolean;
};
const StyledOnelineContainer = styled.div<StyledOnelineContainerProps>`
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


export default CustomFormType;
