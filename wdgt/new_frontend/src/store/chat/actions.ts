import { Dispatch } from 'redux';
import { IAction, IChatBlock, ISelectedState } from '../../models/chat';

import { chatService } from '../../api/chat';
import { fileService } from '../../api/file';
import { widgetService } from '../../api/widget';
import {
  signInByHash,
  getStoredSession
} from '../../api/user';

import * as chatFactories from './factories';
import { setConfig } from '../widget/actions';

import {
  ReduxAction,
  chatActions,
} from '../types';

export function setHistory(chatBlocks: IChatBlock[]): ReduxAction {
  return {
    type: chatActions.SET_HISTORY,
    chatBlocks,
  }
}

export function addNewBlock(chatBlock: IChatBlock): ReduxAction {
  return {
    type: chatActions.ADD_BLOCK,
    chatBlock,
  }
}

export type createDummyBlockType = (dummyType: 'A' | 'B' | 'C') => any;
export const createDummyBlock: createDummyBlockType = (dummyType = 'A') => {
  return (dispatch: Dispatch) => {
    let dummyBlock;
    switch (dummyType) {
      case 'B':
        dummyBlock = chatFactories.createChatBlockDummyB();
        break;
      case 'C':
        dummyBlock = chatFactories.createChatBlockDummyC();
        break;
      case 'A':
      default:
        dummyBlock = chatFactories.createChatBlockDummyA();
        break;
    }

    return dispatch(addNewBlock(dummyBlock));
  }
}

function getBlock(state: any, blockId: string): IChatBlock {
  return state.chatStore.chatBlockEntities[blockId];
}

export function replyToBlock(
  action: IAction,
  blockId: string,
  state: ISelectedState,
) {
  return async (dispatch: Dispatch, getState: () => any, api: any): Promise<any> => {
    dispatch({
      type: chatActions.REPLY_START,
      selectedAction: action,
      blockId,
      state,
    });

    try {
      const block: IChatBlock = getBlock(getState(), blockId);
      await chatService.replyToBlock(block, action, state);
    } catch (err) {
      console.error(err.message);
      dispatch({
        type: chatActions.REPLY_ERROR,
        error: err.message,
        blockId,
      });
    }
  }
}

export type rollbackActionType = (
  action: IAction,
  blockId: string,
) => any;

export const rollbackAction: rollbackActionType = (
  action: IAction,
  blockId: string
) => {
  return async (dispatch: Dispatch, getState: () => any, api: any): Promise<any> => {
    dispatch({
      type: chatActions.ROLLBACK_START
    });
    
    try {
      const block: IChatBlock = getBlock(getState(), blockId);
      await chatService.sendRollback(block, action);
      dispatch({
        type: chatActions.ROLLBACK_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: chatActions.REPLY_ERROR,
        error: err.message
      });
    }
  };
};

export type connectChatType = (startNewChat: boolean) => any;

export const connectChat: connectChatType = (startNewChat) => {
  return async (dispatch: Dispatch, getState: () => any, api: any): Promise<void> => {
    const startTime = Date.now();

    const widgetConfig =  await widgetService.getConfig();

    if (!widgetConfig.hashcode) {
      throw new Error('INITIAL ERROR: hashcode not provided');
    }

    const session = startNewChat? await signInByHash(widgetConfig.hashcode): await getStoredSession();

    fileService.init(session);

    const blocks: IChatBlock[] = await chatService.connect(session);

    chatService.onMessage((messagesBlock: IChatBlock) => {
      dispatch(addNewBlock(messagesBlock));
    });
    dispatch(setHistory(blocks));

    const difference = Date.now() - startTime;
    if (difference < 2000) {
      setTimeout(() => dispatch(setConfig(widgetConfig)), 2000 - difference)
    } else {
      dispatch(setConfig(widgetConfig));
    }
  };
};

export type setDisableActionsType = (value: boolean) => ReduxAction;

export const setDisableActions: setDisableActionsType = (value) => {
  return {
    type: chatActions.CHANGE_DISABLE_ACTIONS,
    value,
  };
};
