import * as userApi from './user';
import * as geolocationApi from './geolocation';
import * as testApi from './test';

const api = {
  userApi,
  testApi,
  geolocationApi,
};

export default api;

export type IApi = typeof api;
