import * as React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import styled from 'styled-components';
import { compose, AnyAction } from 'redux';
import { connect } from 'react-redux';

import Chat from '../components/Chat';

import { IAction, ISelectedState } from '../models/chat';

import * as chatActions from '../store/chat/actions';

type Props = {
  replyToBlock: (
    action: IAction,
    blockId: string,
    state: ISelectedState,
  ) => Promise<any>;
  rollbackAction: chatActions.rollbackActionType,
  disableActions: chatActions.setDisableActionsType,
}

const ChatContainer: React.FC<Props> = (props) => {
  function onActionReply(action: IAction, blockId: string, state: ISelectedState) {
    props.disableActions(true);
    return props.replyToBlock(action, blockId, state);
  }
  
  function onRollbackAction(action: IAction, blockId: string) {
    props.disableActions(true);
    props.rollbackAction(action, blockId);
  }

  return (
    <StyledContainer>
      <Chat
        setActionDisable={props.disableActions}
        onActionReply={onActionReply}
        onRollbackAction={onRollbackAction}
      />
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  height: 100%;
`;

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    replyToBlock: (
      action: IAction,
      blockId: string,
      state: ISelectedState,
    ) => dispatch(chatActions.replyToBlock(action, blockId, state)),
    rollbackAction: (
      action: IAction,
      blockId: string,
    ) => dispatch(chatActions.rollbackAction(action, blockId)),
    disableActions: (
      value: boolean
    ) => dispatch(chatActions.setDisableActions(value)),
  }
}

const reduxConnect = connect(
  undefined,
  mapDispatchToProps
)

export default compose(
  reduxConnect,
)(ChatContainer);
