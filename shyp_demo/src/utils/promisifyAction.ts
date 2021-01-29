import { AnyAction, ActionCreator, Dispatch } from "redux"

declare global{
  interface IPromiseResolution{
    resolve(value: any): any,
    reject(error: any): any,
  }

  interface IPromisifiedAction extends AnyAction{
    defer: IPromiseResolution,
  }

  type IActionPromiseFactory = (...args: any[]) => Promise<any>;
}

// Wrapper for action creator, which allows resolve action inside saga
// and respond to the resolution locally
export default function(dispatch: Dispatch, createAction: ActionCreator<AnyAction>): IActionPromiseFactory {
  return (...args: any[]): Promise<any> => {

    const action: AnyAction = createAction(...args);

    return new Promise((resolve, reject) => dispatch(
        { ...action, defer: { resolve, reject } },
    ));
  };
}