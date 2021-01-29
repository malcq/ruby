import React from 'react';
import styled from 'styled-components';

import FullNameForm, { FormValues } from '../../../../UI/Forms/FullNameForm';
import {
  IAction,
  ISelectedAction,
  IStateFullName,
} from '../../../../../models/chat';

import reducer, { ActionTypes } from './reducer';
import { Button } from '../../../../UI/Buttons';
import { getActionState } from '../../../../../utils';
import { EActionStates } from '../../../../../utils/constants';

const getInitialValues = (action: IAction, selected?: ISelectedAction): FormValues | undefined => {
  if (!selected) { return undefined; }
  if (action.id !== selected.actionId) { return undefined; }
  const state: FormValues = (selected.state as IStateFullName);
  return state;
}

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: IStateFullName) => Promise<void>;
  onRollbackAction: (action: IAction) => void;
  actionDisabled: boolean;
};
const FullNameType: React.FC<Props> = (props) => {
  const {
    action,
    selected,
  } = props;

  const initialValues = React.useMemo((): IStateFullName | undefined => {
    const values = getInitialValues(action, selected);
    return values;
  }, [action, selected]);

  const [state, dispatch] = React.useReducer(reducer, { errorMessage: null, loading: false });
  const [formValues, setFormValues] = React.useState<FormValues | undefined>(initialValues)
  const actionState = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const selectedState = actionState === EActionStates.selected;

  const responseText = React.useMemo((): string => {
    if (!formValues) { return ''; }
    return `${formValues.first_name} ${formValues.second_name}`;
  }, [formValues]);

  const {
    first_name: firstNamePlaceholder = '',
    second_name: secondNamePlaceholder = '',
  } = action.options;

  function mapStateToRedux(values: FormValues): IStateFullName {
    return {
      first_name: values.first_name,
      second_name: values.second_name,
    };
  }

  function onActionRollback() {
    props.onRollbackAction(action);
  }

  function onActionReply(values: FormValues): Promise<void> {
    const state = mapStateToRedux(values);
    return props.onActionReply(action, state);
  }

  async function onFormSubmit(values: FormValues) {
    dispatch({ type: ActionTypes.START_UPDATE });
    setFormValues(values);
    try {
      await onActionReply(values);
      dispatch({ type: ActionTypes.SUCCESS_UPDATE });
    } catch (err) {
      dispatch({
        type: ActionTypes.ERROR_UPDATE,
        errorMessage: err.message
      });
    }
  }

  return (
    <StyledContainer>
      {!selectedState && (
        <FullNameForm
          initialValues={formValues}
          onSubmit={onFormSubmit}
          firstNamePlaceholder={firstNamePlaceholder}
          secondNamePlaceholder={secondNamePlaceholder}
          serverError={state.errorMessage}
          loading={state.loading}
        />
      )}
      {selectedState && (
        <StyledButton
          outlined
          onClick={onActionRollback}
          color="selected"
        >
          {responseText}
        </StyledButton>
      )}
    </StyledContainer>
  )

}

const StyledContainer = styled.div`
  margin: 0 24px;
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;
  align-self: flex-end;
`;

export default FullNameType;