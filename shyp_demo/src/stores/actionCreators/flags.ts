import { AnyAction } from 'redux';
import * as actions from '../actions/flags';

export const flagsNotFound = (payload: boolean): AnyAction => ({
  type: actions.FLAGS_NOT_FOUND,
  payload,
});


