import a from 'axios';
import config from '../config';

import { getTokenFromStorage } from '../utils';

const axios = a.create({
  baseURL: config.apiUrlApp,
});

axios.interceptors.request.use( async (axiosConfig) => {
  const token = await getTokenFromStorage();

  if (!token) {
    return axiosConfig;
  }

  const bearerToken = `Bearer ${token}`;
  const updatedAxiosConfig = Object.assign(
    axiosConfig,
    Object.assign(
      axiosConfig.headers,
      { Authorization: bearerToken },
    ),
  );

  return updatedAxiosConfig;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  console.debug(response);
  return response;
}, (error) => {
  return Promise.reject(error);
});
export default axios;
