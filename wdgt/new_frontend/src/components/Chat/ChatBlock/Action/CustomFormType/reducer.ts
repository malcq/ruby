export enum ActionTypes {
  START_UPDATE = 'START_UPDATE',
  SUCCESS_UPDATE = 'SUCCESS_UPDATE',
  ERROR_UPDATE = 'ERROR_UPDATE',
}

type Action = {
  type: ActionTypes,
  [key: string]: any,
}

export type ReducerState = {
  loading: boolean,
  errorMessage: string | undefined | null,
};
const reducer = (state: ReducerState, action: Action): ReducerState => {

  switch (action.type) {
    case ActionTypes.START_UPDATE:
      return {
        loading: true,
        errorMessage: null,
      }
    case ActionTypes.SUCCESS_UPDATE:
      return {
        loading: false,
        errorMessage: null,
      }
    case ActionTypes.ERROR_UPDATE:
      return {
        loading: false,
        errorMessage: action.errorMessage,
      }
    default:
      return state;
  }
}

export default reducer;
