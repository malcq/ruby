import React from 'react';
import styled, { css } from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import {
  IAction,
  ISelectedAction,
  IStateFreeText,
} from '../../../../models/chat';

import AutoresizeInput from '../../../UI/AutoresizeInput';
import { Button } from '../../../UI/Buttons';
import { getActionState } from '../../../../utils';
import { EActionStates } from '../../../../utils/constants';

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
const FreeText: React.FC<Props> = (props) => {
  const { selected, action } = props;

  const initialInputValue = React.useMemo((): string => {
    return getInitialInputValue(action, selected);
  }, [action, selected])

  const [value, setValue] = React.useState(initialInputValue);

  const state = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const selectedState = state === EActionStates.selected;
  const disabled = props.actionDisabled;

  function onInputChange(ev: React.FormEvent<HTMLInputElement>) {
    const value = ev.currentTarget.value;
    setValue(value);
  }


  function mapStateToRedux(value: string): IStateFreeText {
    return {
      message: value,
    }
  }

  function onActionReply(value: string) {
    if (!value) { return; }
    const result = value.trim();
    if (!result) { return; }
    const state = mapStateToRedux(result);
    props.onActionReply(action, state);
  }

  function onAreaClick() {
    if (selectedState && !disabled) {
      return props.onRollbackAction(action)
    }
  }

  return (
    <StyledContainer
      selectedState={selectedState}
    >
      {!selectedState && (
        <StyledAutoresizeInput
          maxRows={7}
          value={value}
          disabled={disabled || selectedState}
          onChange={onInputChange}
          onSend={onActionReply}
          placeholder={action.options.title}
          onAreaClick={onAreaClick}
          autofocus
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

  ${props => props.selectedState
    ? css`
      justify-content: flex-end;
    `
    : null
  }

`;

const StyledAutoresizeInput = styled(AutoresizeInput)`
  flex-grow: 1;
  transition: width 2000ms;
`;

const StyledButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;
  /* max-width: 160px; */

  &.my-node-enter {
    max-width: 100%;
    flex-grow: 1;
  }

  &.my-node-enter-active {
    flex-grow: 0;
  }
`;

export default FreeText;
