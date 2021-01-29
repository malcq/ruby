import cookie from 'react-cookies';

import {
  UPDATE_USER,
  UPDATE_SPINNER,
  UPDATE_THEME,
  UPDATE_SIDEBAR_STATUS,
  UPDATE_PAGE_TITLE
} from './actionNames';
import config from '../../config';
import { authorizeRequest } from '../../api/userApi';

export const updateUser = (data) => {
  if (data) {
    Object.keys(data).forEach((key) => {
      localStorage.setItem(key.toString(), data[key] || null);
    });
  }
  return {
    type: UPDATE_USER,
    data
  };
};

export const logOut = () => {
  localStorage.clear();
  cookie.remove(config.token_name, { path: '/', domain: config.domain });
  return (dispatch) => dispatch(updateUser(undefined));
};

export function authorize() {
  return async (dispatch) => {
    try {
      const { data: res } = await authorizeRequest();
      dispatch(updateUser(res));
    } catch (err) {
      dispatch(updateUser(undefined));
    }
  };
}


export const updateSpinner = (data) => ({
  type: UPDATE_SPINNER,
  data
});

export const updateTheme = (data) => ({
  type: UPDATE_THEME,
  data
});

export const updateSidebarStatus = (data) => ({
  type: UPDATE_SIDEBAR_STATUS,
  data
});

export const updatePageTitle = (data) => ({
  type: UPDATE_PAGE_TITLE,
  data
});
