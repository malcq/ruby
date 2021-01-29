export function getApp(state) {
  return state.app;
}

export function getLoading(state) {
  return getApp(state).loading;
}

export function getError(state) {
  return getApp(state).error;
}
