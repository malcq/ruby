import {
  ReduxAction,
  userActions,
  IUserStore
} from '../types';

function getInitialState(): IUserStore {
  return {
    user: null,
    error: null,
    loading: false,
  }
}

function loginStart(state: IUserStore, action: ReduxAction): IUserStore {
  return {
    ...state,
    error: null,
    loading: true,
  }
}

function loginSuccess(state: IUserStore, action: ReduxAction): IUserStore {
  const { user } = action;
  return {
    ...state,
    error: null,
    loading: false,
    user,
  }
}

function loginFail(state: IUserStore, action: ReduxAction): IUserStore {
  return {
    ...state,
    error: action.error,
    loading: false,
  }
}

const initialState = getInitialState();

function reducer(state = initialState, action: ReduxAction): IUserStore {
  switch (action.type) {
    case userActions.LOGIN_START:
      return loginStart(state, action)
    case userActions.LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case userActions.LOGIN_FAIL:
      return loginFail(state, action);
    default:
      return state;
  }
}

export default reducer;
