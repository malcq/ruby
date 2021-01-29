import { IChatBlock } from '../models/chat';
import { User } from '../models/user';

/**
 * Common redux interfaces
 */
export interface ReduxAction {
  type: string;
  [name: string]: any;
}

/**
 * Store interfaces
 */
export interface IChatStore {
  chatBlocks: string[];
  chatBlockEntities: {
    [id: string]: IChatBlock,
  };
  error: string | null;
  disableActions: boolean;
}

export interface IUserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export interface IWidgetStore {
  opened: boolean;
  isMobile: boolean;
  hasSession: boolean;
  initialized: boolean;
};

export interface IAppStore {
  chatStore: IChatStore;
  userStore: IUserStore;
  widgetStore: IWidgetStore;
};

/**
 * Action types
 */
export const userActions = {
  LOGIN_START: 'LOGIN_START/USER',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS/USER',
  LOGIN_FAIL: 'LOGIN_FAIL/USER',
};

export const chatActions = {
  CHOOSE_ACTION: 'CHOOSE_ACTION/CHAT',
  SET_HISTORY: 'SET_HISTORY/CHAT',
  ADD_BLOCK: 'ADD_BLOCK/CHAT',
  REPLY_START: 'REPLY_START/CHAT',
  REPLY_ERROR: 'REPLY_ERROR/CHAT',
  ROLLBACK_START: 'ROLLBACK_START/CHAT',
  ROLLBACK_SUCCESS: 'ROLLBACK_SUCCESS/CHAT',
  ROLLBACK_ERROR: 'ROLLBACK_ERROR/ERROR',
  CHANGE_DISABLE_ACTIONS: 'CHANGE_DISABLE_ACTIONS/CHAT',
};

export const widgetActions = {
  OPENED: 'OPENED/WIDGET',
  CLOSED: 'CLOSED/WIDGET',
  SET_CONFIG: 'SET_CONFIG/WIDGET',
};
