import { Effect } from "redux-saga";
import { call } from "redux-saga/effects";

// wrapper around call action.defer.reject. Should be yielded
const rejectAction = (action: IPromisifiedAction, error: any): any =>
  action.defer ? call([action.defer, 'reject'], error) : null;

export default rejectAction;