import store from 'store';
import { updateUser } from 'store/global/actions';
import config from 'config';

export const getName = (user) => {
  if (!user) { return ''; }

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return fullName || user.login;
};

export const logOut = () => {
  document.cookie = `${config.token_name}=; path=/; domain=${config.domain};`;
  store.dispatch(updateUser(undefined));
};

export const sleep = (timeout) => new Promise((res) => {
  setTimeout(res, timeout);
});
