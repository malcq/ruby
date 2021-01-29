import { AnyAction } from 'redux';
import * as actions from '../actions/tasks';

export const tasksGetData = (): AnyAction => ({ type: actions.TASKS_GET_DATA });

export const tasksGetDataSuccess = (payload: any): AnyAction => ({
  type: actions.TASKS_GET_DATA_SUCCESS,
  payload,
});