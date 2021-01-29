import React from 'react';
import styled from 'styled-components';

import { IAction, ISelectedAction, ISelectedState } from '../../../../models/chat';
import { Button } from '../../../UI/Buttons';
import { CommonActionLayout } from '../../Common'
import { getActionState } from '../../../../utils';
import { EActionStates } from '../../../../utils/constants';


type Props = {
  action: IAction;
  selected?: ISelectedAction;
  onActionReply: (action: IAction, state: ISelectedState) => Promise<any>;
  onRollbackAction: (action: IAction) => void;
  actionDisabled: boolean;
};
const ButtonAction: React.FC<Props> = (props) => {
  const {
    action,
    selected,
  } = props;

  const { options } = action;
  const { title } = options;

  const state = React.useMemo(() => {
    return getActionState(action, selected);
  }, [action, selected]);

  const buttonColor = React.useMemo(() => {
    if (state === EActionStates.pristine) {
      return 'primary';
    }
    return 'selected';
  }, [state]);

  function onActionClick() {
    switch (state) {
      case EActionStates.selected:
        return props.onRollbackAction(action);
      case EActionStates.pristine:
        return props.onActionReply(action, null);
      case EActionStates.notSelected:
      default:
        return;
    }
  }

  const disableButton = state === EActionStates.notSelected || props.actionDisabled;

  return (
      <StyledContainer>
        <StyledButton
          outlined
          color={buttonColor}
          disabled={disableButton}
          onClick={onActionClick}
        >
          {title}
        </StyledButton>
      </StyledContainer>
  )
}

const StyledContainer = styled(CommonActionLayout)`
  justify-content: flex-end;
  display: flex;
`;

const StyledButton = styled(Button)`
`;

export default ButtonAction;
