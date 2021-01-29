import Store from 'lib/store';

import Auth from './auth';
import User from './user';
import Notifications from './notifications';
import AdminUsers from './Admin/users';

import AdminAppSettings from './Admin/appSettings';

const StoreService = new Store();

const AuthService = new Auth(StoreService);
const UserService = new User(StoreService);
const NotificationsService = new Notifications();
const AdminUsersService = new AdminUsers(StoreService);

const AdminAppSettingsService = new AdminAppSettings(StoreService);
export {
  StoreService,

  AuthService,
  UserService,
  AdminUsersService,

  NotificationsService,
  AdminAppSettingsService
};
