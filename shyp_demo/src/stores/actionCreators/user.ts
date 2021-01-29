import { AnyAction } from 'redux';
import * as actions from '../actions/user';

export const userLoadState = (location?: any):AnyAction => ({
  type: actions.USER_LOAD_STATE,
  location,
});

export const userSignIn = (
  email: string,
  password: string,
  isRemembered: boolean = false,
): AnyAction => ({
  type: actions.USER_SIGN_IN,
  payload: { email, password, isRemembered }
});

export const userSignInSuccess = (payload: IUser): AnyAction => ({ type: actions.USER_SIGN_IN_SUCCESS, payload });

export const userLoadStateSuccess = (payload: IUser): AnyAction => ({ type: actions.USER_LOAD_STATE_SUCCESS, payload });

export const userSignOut = (): AnyAction => ({ type: actions.USER_SIGN_OUT });

export const userStoreState = (): AnyAction => ({ type: actions.USER_STORE_STATE });

export const userGetUserData = (): AnyAction => ({ type: actions.USER_GET_USER_DATA });

export const userLoadStateFailure = (): AnyAction => ({
  type: actions.USER_LOAD_STATE_FAILURE,
});

export const userGetUserDataSuccess = (payload: IUser): AnyAction => ({
  type: actions.USER_GET_USER_DATA_SUCCESS,
  payload,
});

export const userSubmitUserData = (payload: any): AnyAction => ({
  type: actions.USER_SUBMIT_USER_DATA,
  payload,
});

export const userSubmitProfile = (payload: any): AnyAction => ({
  type: actions.USER_SUBMIT_PROFILE,
  payload,
});

export const userSubmitNotifications = (payload: any): AnyAction => ({
  type: actions.USER_SUBMIT_NOTIFICATIONS,
  payload,
});

export const userForgotPassword = (payload: any): AnyAction => ({
  type: actions.USER_FORGOT_PASSWORD,
  payload,
});

export const userForgotPasswordSuccess = (): AnyAction => ({
  type: actions.USER_FORGOT_PASSWORD_SUCCESS,
});

export const userChangePassword = (payload: any): AnyAction => ({
    type: actions.USER_CHANGE_PASSWORD,
    payload,
});

export const userLoadRemembered = (payload: any): AnyAction => ({
  type: actions.USER_LOAD_REMEMBERED,
  payload,
});

export const userLoadRememberedSuccess = (payload: any): AnyAction => ({
  type: actions.USER_LOAD_REMEMBERED_SUCCESS,
  payload,
});

export const userSubscribeToBrowserNotifications = (payload: any): AnyAction => ({
  type: actions.USER_SUBSCRIBE_TO_BROWSER_NOTIFICATIONS,
  payload,
});

export const userUnubscribeToBrowserNotifications = (payload: any): AnyAction => ({
  type: actions.USER_UNSUBSCRIBE_TO_BROWSER_NOTIFICATIONS,
  payload,
});


export const uploadAvatar = (avatar: any): AnyAction => ({ type: actions.USER_AVATAR_UPLOAD, payload: { avatar } });