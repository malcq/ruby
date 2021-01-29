import {
  UPDATE_USER,
  UPDATE_SPINNER,
  UPDATE_THEME,
  UPDATE_SIDEBAR_STATUS,
  UPDATE_PAGE_TITLE
} from './actionNames';

const initialStore = {
  user: undefined,
  spinner: false,
  theme: 'basic',
  isSidebarOpen: false,
  pageTitle: 'Добро пожаловать!'
};

export default (
  store = initialStore,
  { type, data } = {}
) => {
  switch (type) {
    case 'AUTHORIZE_USER':
    case UPDATE_USER:
      return {
        ...store,
        user: data
      };

    case UPDATE_SPINNER:
      return {
        ...store,
        spinner: typeof data === 'boolean' ? data : !store.spinner
      };

    case UPDATE_THEME:
      return {
        ...store,
        theme: data
      };

    case UPDATE_SIDEBAR_STATUS:
      return {
        ...store,
        isSidebarOpen: typeof data === 'boolean' ? data : !store.isSidebarOpen
      };

    case UPDATE_PAGE_TITLE:
      return {
        ...store,
        pageTitle: data
      };

    default:
      return store;
  }
};
