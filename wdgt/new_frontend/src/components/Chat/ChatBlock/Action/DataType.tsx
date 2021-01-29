import React from 'react';
import styled, { css } from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import {
  IAction,
  ISelectedAction,
  IStateFreeText,
  IConstantStringObject,
} from '../../../../models/chat';

import DataTypeInput from '../../../UI/DataTypeInput';
import { Button } from '../../../UI/Buttons';
import { getActionState } from '../../../../utils';
import { EActionStates, DATA_TYPE_ERROR_MESSAGES } from '../../../../utils/constants';

const getInitialInputValue = (action: IAction, selected?: ISelectedAction): string => {
  if (!selected) { return ''; }

  if (action.id !== selected.actionId) { return ''; }
  
  const message = (selected.state as IStateFreeText).message;

  return message;
}

type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: IStateFreeText) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
  actionDisabled: boolean;
};
const DataType: React.FC<Props> = (props) => {
  const { selected, action } = props;

  const initialInputValue = React.useMemo((): string => {
    return getInitialInputValue(action, selected);
  }, [action, selected])

  const [value, setValue] = React.useState(initialInputValue);
  const [isErrorMessageTextVisible, setErrorMessageTextVisible] = React.useState(false);
  const [isPristine, setPristine] = React.useState(true);

  const state = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const { regex } = action.options;

  const selectedState = state === EActionStates.selected;
  const disabled = props.actionDisabled;

  const errorMessageText = getErrorMessage(action, DATA_TYPE_ERROR_MESSAGES);

  function onInputChange(ev: React.FormEvent<HTMLInputElement>) {
    const value = ev.currentTarget.value;
    if (!isPristine) {
      const isError = isShowError(regex, value);
      if (isError !== isErrorMessageTextVisible) {
        setErrorMessageTextVisible(isError);
      }
    }
    setValue(value);
  }


  function mapStateToRedux(value: string): IStateFreeText {
    return {
      message: value,
    }
  }

  function onActionReply(value: string) {
    const isError = isShowError(regex, value);
    if (isError) {
      setErrorMessageTextVisible(isError);
      setPristine(false);
      return;
    }

    if (!value) { return; }
    const result = value.trim();
    if (!result) { return; }
    const state = mapStateToRedux(result);
    props.onActionReply(action, state);
    setPristine(true);
  }

  function onAreaClick() {
    if (selectedState && !disabled) {
      return props.onRollbackAction(action)
    }
  }

  function isShowError(regExStr: string, str: string) {
    if (!str.length) {
      return false;
    }
    return !isValidForRegEx(regExStr, str);
  }

  function isValidForRegEx(regExStr: string, str: string) {
    const regEx = new RegExp(regExStr);
    return regEx.test(str);
  }

  function getErrorMessage(action: IAction, errorMessagesByType: IConstantStringObject) {
    const { 
      data_type,
      error_message,
     } = action.options;
    const errorMessage = error_message || errorMessagesByType[data_type] || '';
    return errorMessage;
  }

  return (
    <StyledContainer
      selectedState={selectedState}
    >
      {!selectedState && (
        <>
          <StyledDataTypeInput
            value={value}
            disabled={disabled || selectedState}
            isError={isErrorMessageTextVisible}
            onChange={onInputChange}
            onSend={onActionReply}
            placeholder={action.options.title}
            onAreaClick={onAreaClick}
            autofocus
          />
          <ErrorMessageContainer
            visible={isErrorMessageTextVisible}
          >
            <ErrorMessage
              title={errorMessageText}
            >
              {errorMessageText}
            </ErrorMessage>
          </ErrorMessageContainer>
        </>
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
          onClick={onAreaClick}
          color="selected"
        >
          {value}
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

type ErrorMessageContainer = {
  visible?: boolean;
}
const ErrorMessageContainer = styled.div<ErrorMessageContainer>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 24px;
  margin-bottom: -17px;
  visibility: ${props => props.visible ? null : 'hidden' };
`;

const ErrorMessage = styled.div`
  ${props => props.theme.typography.fnRegular};
  ${props => props.theme.typography.fnInputError};
  color: ${props => props.theme.colorValues.error};
  margin: 0 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export default DataType;
