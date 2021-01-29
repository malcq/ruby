import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/tasks';
import { AnyAction } from "redux";

declare global{
  interface ITask{
    title: string,
    text: string,
    created_ago: string,
  }

  interface ITasksState{
    list: ITask[]
  }
}
export const initialTasksState = {
  list: [],
};
const receiveList: Reducer<ITasksState, AnyAction> = (state, action) => ({
  ...state, list: action.payload,
});
export default createReducer(initialTasksState, {
  [actions.TASKS_GET_DATA_SUCCESS]: receiveList,
})