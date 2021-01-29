import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { AnyAction } from "redux";
import * as actions from '../actions';
import { FLASH_EXPIRATION_INTERVAL } from '../../config/constants';

declare global{
  interface IFlash {
    open: boolean;
    message: string;
    classes: string;
    duration?: number | null;
  }

  type IFlashState = IFlash;
}

export const initialFlashState: IFlashState = {
  open: false,
  message: '',
  classes: '',
  duration: FLASH_EXPIRATION_INTERVAL,
};

const showNotificationUpdated: Reducer<IFlashState, AnyAction> = (state) => ({
  ...state,
  open: true,
  message: 'Updated',
  classes: 'bg-green'
});

const userSignInSuccess: Reducer<IFlashState, AnyAction> = (state) => ({
  ...state,
  open: true,
  message: 'Signed in successfully.',
  classes: 'bg-green'
});

const userForgotSuccess: Reducer<IFlashState, AnyAction> = (state, action) => ({
  ...state,
  open: true,
  message: 'When the provided email address belongs to a Shypple account, an email with a reset link has been sent to that address',
  classes: 'bg-green',
  duration: 8000, // 8 sec
});

const userSignOut: Reducer<IFlashState, AnyAction> = (state) => ({
  ...state,
  open: true,
  message: 'Signed out successfully.',
  classes:'bg-green'
});

const baseSuccess: Reducer<IFlashState, AnyAction> = (state, action) => ({
  ...state,
  open: true,
  message: action.payload.data.message,
  classes: 'bg-green'
});
const baseReject: Reducer<IFlashState, AnyAction> = (state, action) => ({
  ...state,
  open: true,
  message: action.payload.data.message,
  classes: 'bg-red'
});

const contactAdded: Reducer<IFlashState, AnyAction> = (state, action) => ({
  ...state,
  open: true,
  message: `Contact "${action.payload.name}" added`,
  classes: 'bg-green'
});

const contactUpdated: Reducer<IFlashState, AnyAction> = (state, action) => ({
  ...state,
  open: true,
  message: `Contact "${action.payload.name}" updated`,
  classes: 'bg-green'
});

const showSuccess: Reducer<IFlashState, AnyAction> = (state, action) => ({
  ...state,
  open: true,
  message: action.payload,
  duration: action.duration || initialFlashState.duration,
  classes: 'bg-green'
});

const showError: Reducer<IFlashState, AnyAction> = (state, action) => ({
  ...state,
  open: true,
  message: action.payload,
  duration: action.duration || initialFlashState.duration,
  classes: 'bg-red'
});

const flashReset: Reducer<IFlashState, AnyAction> = (state, action) => ({
  ...state,
  open: false,
  duration: initialFlashState.duration,
});

const actionHandlers: Handlers<IFlashState> = {
  [actions.USER_SIGN_IN_SUCCESS]: userSignInSuccess,
  [actions.USER_FORGOT_PASSWORD_SUCCESS]: userForgotSuccess,
  [actions.USER_SIGN_OUT]: userSignOut,
  [actions.BASE_SUCCESS]: baseSuccess,
  [actions.BASE_REJECT]: baseReject,
  [actions.CONTACTS_ADD_CONTACT_SUCCESS]: contactAdded,
  [actions.CONTACTS_PUT_CONTACT_SUCCESS]: contactUpdated,
  [actions.FLASH_SUCCESS]: showSuccess,
  [actions.FLASH_ERROR]: showError,
  [actions.FLASH_RESET]: flashReset,
  [actions.SHOW_NOTIFICATION_UPDATED]: showNotificationUpdated,
};

export default createReducer(initialFlashState, actionHandlers);