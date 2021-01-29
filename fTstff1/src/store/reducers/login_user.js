import {
  AUTHORIZE_USER,
  UPDATE_USER
  // CLEAR_USER,
  // REGISTER_USER
} from '../actionNames';

const initialState = {
  user: null,
  loading: false,
  error: false
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_AUTHORIZE':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FAIL_AUTHORIZE':
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case AUTHORIZE_USER: {
      let user = action.data;
      if (!user) {
        user = null;
      }

      return {
        ...state,
        loading: false,
        user
      };
    }

    case UPDATE_USER:
      return { ...state, user: action.data };

    default:
      return state;
  }
};

export default user;
