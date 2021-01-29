import { Effect } from "redux-saga";
import { call } from "redux-saga/effects";

// wrapper around action.defer.resolve. Should be yielded
const resolveAction = (action: IPromisifiedAction, value?: any): any =>
  action.defer ? call([action.defer, 'resolve'], value) : null;

export default resolveAction;