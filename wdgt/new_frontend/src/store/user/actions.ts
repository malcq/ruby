import { ReduxAction, userActions } from '../types';
import { User } from '../../models/user';

export function startLogin(): ReduxAction {
  return {
    type: userActions.LOGIN_START,
  }
}

export function successLogin(user: User): ReduxAction {
  return {
    type: userActions.LOGIN_SUCCESS,
    user,
  }
}

export function failLogin(error: string): ReduxAction {
  return {
    type: userActions.LOGIN_START,
    error,
  }
}

export function login(): (...args: any[]) => Promise<User | string> {
  return async (dispatch, getState, api): Promise<User | string> => {
    dispatch(startLogin());
    try {
      const user: User = await api.testApi.mockedLogin();
      dispatch(successLogin(user));
      return user;
    } catch (err) {
      dispatch(failLogin(err.message));
      return err.message;
    }
  }
}
