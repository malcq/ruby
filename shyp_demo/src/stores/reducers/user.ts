import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { AnyAction } from "redux";
import * as actions from '../actions/user';

declare global{
  interface ICredentials{
    uid?: string,
    accessToken?: string,
    clientToken?: string,
    impersonator?: string | null,
  }

  interface IUserNotification {
    id: number;
    typeId: number;
    name: string;
    group: string;
    enabled: boolean;
    order: number;
  }

  interface IUser extends ICredentials {
    isSuperUser: boolean;
    isStaff: boolean;
    isActive: boolean;
    isDummy: boolean;
    isFollowingNewShipments: boolean;
    permission: string;
    tokenType?: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    phone?: string;
    postalCode?: string;
    city?: string;
    street?: string;
    number?: string;
    vatNumber?: string;
    countryId?: number;
    id?: number;
    registrationCountryId?: number;
    avatar?: string;
    notifications: IUserNotification[];
  }

  interface IUserState extends IUser{
    loading: boolean;
  }
}

export const initialUserState: IUserState = {
  accessToken: '',
  avatar: '',
  city: '',
  clientToken: '',
  companyName: '',
  email: '',
  firstName: '',
  isActive: false,
  isDummy: false,
  isFollowingNewShipments: false,
  isStaff: false,
  isSuperUser: false,
  lastName: '',
  number: '',
  permission: 'full',
  phone: '',
  postalCode: '',
  street: '',
  tokenType: '',
  uid: '',
  username: '',
  vatNumber: '',
  notifications: [],
  loading: false,
  impersonator: null,
};

const saveReceivedUserData: Reducer<IUserState, AnyAction> = (state, { payload }) => ({
  ...state,
  ...payload,
  loading: false,
});

const resetState: Reducer<IUserState, AnyAction> = (state, action) => initialUserState;

const raiseLoadingFlag: Reducer<IUserState, AnyAction> = (state, action) => ({
  ...state,
  loading: true,
});

const actionHandlers: Handlers<IUserState> = {
  [actions.USER_SIGN_IN_SUCCESS]: saveReceivedUserData,
  [actions.USER_LOAD_STATE_SUCCESS]: saveReceivedUserData,
  [actions.USER_GET_USER_DATA_SUCCESS]: saveReceivedUserData,
  [actions.USER_SIGN_OUT]: resetState,
  [actions.USER_LOAD_STATE_FAILURE]: resetState,
  [actions.USER_LOAD_STATE]: raiseLoadingFlag,
  [actions.USER_LOAD_REMEMBERED_SUCCESS]: saveReceivedUserData,
};

export default createReducer(initialUserState, actionHandlers);