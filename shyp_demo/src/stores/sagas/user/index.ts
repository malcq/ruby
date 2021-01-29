import { takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import * as actions from '../../actions/user';
import * as actionCreators from '../../actionCreators/user';
import signIn from './signIn';
import signInSuccess from './signInSuccess';
import loadState from "./loadState";
import signOut from "./signOut";
import { simpleGetAndResolve, simplePutAndResolve, simplePostAndResolve, simpleDeleteAndResolve } from '../factories';
import { userSerializer } from '../../../utils/serializers';
import changePassword from "./changePassword";
import uploadAvatar from "./uploadAvatar";
import loadRemembered from './loadRemembered';
import forgotPassword from './forgotPassword';
import denyRoutePermission from './denyRoutePermission';

const getUserData = simpleGetAndResolve(
  () => '/api/v1/account',
  actionCreators.userGetUserDataSuccess,
  userSerializer
);

const submitUserData = simplePutAndResolve(
  () => '/api/v1/account',
  actionCreators.userGetUserDataSuccess,
  userSerializer
);

const submitProfileData = simplePutAndResolve(
  () => '/api/v1/account/profile',
  actionCreators.userGetUserDataSuccess,
  userSerializer
);

const submitNotificationData = simplePutAndResolve(
  () => '/api/v1/account/notifications',
  actionCreators.userGetUserDataSuccess,
  userSerializer
);

const subscribeToNotifications = simplePostAndResolve(
  () => '/api/v1/account/subscribe',
  actionCreators.userGetUserDataSuccess
);

const unsubscribeToNotifications = simpleDeleteAndResolve(
  () => '/api/v1/account/unsubscribe',
  actionCreators.userGetUserDataSuccess
);

export default function * (): Iterator<any> {
  yield takeEvery(actions.USER_SIGN_IN, signIn);
  yield takeEvery(actions.USER_LOAD_STATE, loadState);
  yield takeEvery(actions.USER_SIGN_OUT, signOut);
  yield takeEvery(actions.USER_SIGN_IN_SUCCESS, signInSuccess);
  yield takeEvery(actions.USER_GET_USER_DATA, getUserData);
  yield takeEvery(actions.USER_SUBMIT_USER_DATA, submitUserData);
  yield takeEvery(actions.USER_SUBMIT_PROFILE, submitProfileData);
  yield takeEvery(actions.USER_SUBMIT_NOTIFICATIONS, submitNotificationData);
  yield takeEvery(actions.USER_FORGOT_PASSWORD, forgotPassword);
  yield takeEvery(actions.USER_CHANGE_PASSWORD, changePassword);
  yield takeEvery(actions.USER_AVATAR_UPLOAD, uploadAvatar);
  yield takeEvery(actions.USER_LOAD_REMEMBERED, loadRemembered);
  yield takeEvery(actions.USER_SUBSCRIBE_TO_BROWSER_NOTIFICATIONS, subscribeToNotifications);
  yield takeEvery(actions.USER_UNSUBSCRIBE_TO_BROWSER_NOTIFICATIONS, unsubscribeToNotifications);
  yield takeEvery(LOCATION_CHANGE, denyRoutePermission)
}
