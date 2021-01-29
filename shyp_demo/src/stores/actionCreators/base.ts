import { AnyAction } from 'redux';
import * as actions from '../actions/base';

export const sparSuccess = (payload: any): AnyAction => ({ type: actions.BASE_SUCCESS, payload });

export const sparError = (payload: any): AnyAction => ({ type: actions.BASE_REJECT, payload });

