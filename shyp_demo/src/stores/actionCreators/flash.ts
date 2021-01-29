import { AnyAction } from 'redux';
import * as actions from '../actions/flash';

export const flashError = (payload: string, duration?: number): AnyAction => ({
  type: actions.FLASH_ERROR,
  payload,
  duration,
});

export const flashSuccess = (payload: string, duration?: number): AnyAction => ({
  type: actions.FLASH_SUCCESS,
  payload,
  duration,
});

export const flashReset = (): AnyAction => ({
  type: actions.FLASH_RESET,
});

export const showNotificationUpdated = (): AnyAction => ({
  type: actions.SHOW_NOTIFICATION_UPDATED,
});
