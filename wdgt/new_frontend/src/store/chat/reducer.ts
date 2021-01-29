import { IChatBlock } from '../../models/chat';
import {
  ReduxAction,
  IChatStore,
  chatActions,
} from '../types';

const getInitialState = (): IChatStore => {
  return {
    chatBlocks: [],
    chatBlockEntities: {},
    error: null,
    disableActions: false,
  }
};

function addChatBlock(state: IChatStore, action: ReduxAction): IChatStore {
  const chatBlock: IChatBlock = action.chatBlock;

  const newChatBlocks = [...state.chatBlocks, chatBlock.id];
  const newChatBlockEntities = {
    ...state.chatBlockEntities,
    [chatBlock.id]: chatBlock
  };

  return {
    ...state,
    chatBlockEntities: newChatBlockEntities,
    chatBlocks: newChatBlocks,
  }
}

function setHistory(state: IChatStore, action: ReduxAction): IChatStore {
  const chatBlocks: IChatBlock[] = action.chatBlocks;

  const newChatBlockEntities: any = {};
  const newChatBlocks = chatBlocks.map((chatBlock: IChatBlock) => {
    newChatBlockEntities[chatBlock.id] = chatBlock;
    return chatBlock.id;
  });

  return {
    ...state,
    chatBlockEntities: newChatBlockEntities,
    chatBlocks: newChatBlocks,
  }
}

function replyStart(state: IChatStore, action: ReduxAction): IChatStore {
  // Before response, we will mark buttons as selected
  
  const { selectedAction, blockId, state: actionState } = action;

  const updatedBlock = { ...state.chatBlockEntities[blockId] };
  updatedBlock.selected = {
    actionId: selectedAction.id,
    state: actionState,
  };

  return {
    ...state,
    chatBlockEntities: {
      ...state.chatBlockEntities,
      [blockId]: updatedBlock,
    }
  }
}

function replyError(state: IChatStore, action: ReduxAction): IChatStore {
  // if something goes wrong, we should rollback selected action to pristine state

  const { blockId, error } = action;

  const updatedBlockEntities = {
    ...state.chatBlockEntities,
    [blockId]: {
      ...state.chatBlockEntities,
      selected: undefined,
    }
  };

  return {
    ...state,
    error,
    chatBlockEntities: updatedBlockEntities,
  }
}

function rollbackStart(state: IChatStore, action: ReduxAction): IChatStore {
  return {
    ...state,
  }
}

function rollbackSuccess(state: IChatStore, action: ReduxAction): IChatStore {
  const newChatBlocks = state.chatBlocks.slice(0, state.chatBlocks.length - 1);
  const newLastBlock = {
    ...state.chatBlockEntities[
      newChatBlocks[newChatBlocks.length - 1]
    ]
  };
  newLastBlock.selected = undefined;

  return {
    ...state,
    chatBlocks: newChatBlocks,
    chatBlockEntities: {
      ...state.chatBlockEntities,
      [newLastBlock.id]: newLastBlock
    }
  }
}

function changeDisableActions(state: IChatStore, action: ReduxAction): IChatStore {
  const { value = false } = action;

  if (state.disableActions === value) { return state; }

  return {
    ...state,
    disableActions: value,
  }
}

const initialState = getInitialState();

const reducer = (state = initialState, action: ReduxAction): IChatStore => {
  switch (action.type) {
    case chatActions.SET_HISTORY:
      return setHistory(state, action);
    case chatActions.ADD_BLOCK:
      return addChatBlock(state, action);
    case chatActions.REPLY_START:
      return replyStart(state, action);
    case chatActions.REPLY_ERROR:
      return replyError(state, action);
    case chatActions.ROLLBACK_START:
      return rollbackStart(state, action);
    case chatActions.ROLLBACK_SUCCESS:
      return rollbackSuccess(state, action);
    case chatActions.CHANGE_DISABLE_ACTIONS:
      return changeDisableActions(state, action);
    case chatActions.ROLLBACK_ERROR:
    default:
      return state;
  }
}

export default reducer;
