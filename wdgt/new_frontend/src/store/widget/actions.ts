import { ReduxAction, widgetActions, IWidgetStore } from '../types';

export function openWidgetState(): ReduxAction {
  return {
    type: widgetActions.OPENED,
  }
}

export function closeWidgetState(): ReduxAction {
  return {
    type: widgetActions.CLOSED,
  }
}

export function openWidget(): (...args: any[]) => Promise<void> {
  return async (dispatch, getState, api): Promise<void> => {
    dispatch(openWidgetState());
  }
}


export function closeWidget(): (...args: any[]) => Promise<void> {
  return async (dispatch, getState, api): Promise<void> => {
    dispatch(closeWidgetState());
  }
}

export function setConfig(config: Partial<IWidgetStore>): ReduxAction {
  return {
    type: widgetActions.SET_CONFIG,
    config,
  }
}

