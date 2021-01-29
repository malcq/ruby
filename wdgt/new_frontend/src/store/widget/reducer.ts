import { widgetService } from '../../api/widget';
import { ReduxAction, widgetActions, IWidgetStore } from '../types';

function getInitialState(): IWidgetStore {
  return {
    opened: !widgetService.isWidget(),
    hasSession: true,
    isMobile: false,
    initialized: false,
  }
}

function open(state: IWidgetStore, action: ReduxAction): IWidgetStore {
  return {
    ...state,
    opened: true,
  }
}

function close(state: IWidgetStore, action: ReduxAction): IWidgetStore {
  return {
    ...state,
    opened: false,
  }
}

function setConfig(state: IWidgetStore, action: ReduxAction): IWidgetStore {
  const {
    isMobile = state.isMobile,
    hasSession = state.hasSession,
    initialized = true
  } = action.config;

  return {
    ...state,
    isMobile,
    initialized,
    hasSession,
  }
}

const initialState = getInitialState();

function reducer(state = initialState, action: ReduxAction): IWidgetStore {
  switch (action.type) {
    case widgetActions.OPENED:
      return open(state, action)
    case widgetActions.CLOSED:
      return close(state, action);
    case widgetActions.SET_CONFIG:
        return setConfig(state, action);
    default:
      return state;
  }
}

export default reducer;
