import { createReducer, Reducer } from 'redux-create-reducer';

import * as actions from '../actions/mapOverviews';
import { AnyAction } from "redux";

declare global{
  interface IMap{
    id: number,
    name: string,
  }

  interface IMapsState{
    list: IMap[]
  }
}
export const initialMapsState = {
    list: [],
};
const receiveList: Reducer<IMapsState, AnyAction> = (state, action) => ({
    ...state, list: action.payload,
});
export default createReducer(initialMapsState, {
    [actions.MAP_OVERVIEWS_GET_DATA_SUCCESS]: receiveList,
})