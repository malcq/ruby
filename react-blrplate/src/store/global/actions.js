import {
  UPDATE_USER_IN_STORE,
  UPDATE_SPINNER_STATUS,
  UPDATE_THEME
} from './actionNames';

export const updateUserInStore = (data) => ({
  type: UPDATE_USER_IN_STORE,
  data
});

export const updateSpinnerStatus = (data) => ({
  type: UPDATE_SPINNER_STATUS,
  data
});

export const updateTheme = (data) => ({
  type: UPDATE_THEME,
  data
});

export const authorizeCheck = () => async (dispatch) => {
  try {
    // Send request to server
    dispatch(updateUserInStore(undefined));
  } catch (err) {
    dispatch(updateUserInStore(undefined));
  }
};
