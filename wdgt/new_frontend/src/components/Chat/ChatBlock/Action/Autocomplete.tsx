import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styled, { css } from 'styled-components';

import { Button } from '../../../UI/Buttons';

import {
  IAction,
  ISelectedAction,
  IStateFreeText,
} from '../../../../models/chat';

import SearchSuggest from '../../../UI/SearchSuggest';

import { IOption } from '../../../../models/select';
import { EActionStates } from '../../../../utils/constants';
import { getActionState } from '../../../../utils';

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
};
const Autocomplete: React.FC<Props> = (props) => {
  const {
    action,
    selected,
  } = props;

  const { options } = action;
  const selectItems: IOption[] = options.values;

  const [searchValue, setSearchValue] = React.useState(
    getInitialInputValue(action, selected),
  );
  
  const state = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const selectedState = state === EActionStates.selected;

  function mapStateToRedux(value: string) {
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
    setSearchValue(value);
  }

  function onRollbackAction() {
    props.onRollbackAction(action);
  }

  return (
    <StyledContainer selectedState={selectedState}>
      {!selectedState && (
        <SearchSuggest
          initialValue={searchValue}
          onConfirm={onActionReply}
          values={selectItems}
          placeholder={action.options.title}
          searchId={options.searchId}
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
          onClick={onRollbackAction}
          color="selected"
        >
          {searchValue}
        </StyledButton>
      </CSSTransition>
    </StyledContainer>
  )
}

type StyledContainerProps = {
  selectedState?: boolean;
};
const StyledContainer = styled.div<StyledContainerProps>`
  display: flex;
  
  ${props => props.selectedState
    ? css`
      flex-direction: row;
      justify-content: flex-end;
    `
    : css`
      flex-direction: column;
    `
  }
`;

const StyledButton = styled(Button)`
  white-space: pre-wrap;
  text-align: left;
  transition: 0.7s;
  width: auto;
  margin: 0 24px 0 24px;

  &.my-node-enter {
    max-width: 100%;
    flex-grow: 1;
  }

  &.my-node-enter-active {
    flex-grow: 0;
  }
`;

export default Autocomplete;
