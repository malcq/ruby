// import axios from 'axios';
import axios from './axios';
import { getСookie } from './apiConfig';
import config from '../config';

export const createUserRequest = (newUser) => {
  return axios({
    method: 'POST',
    url: '/api/auth/signup',
    data: { ...newUser }
  });
};

export const signInRequest = (user) => {
  return axios({
    method: 'POST',
    url: '/api/auth/signin',
    data: { ...user }
  });
};

export const passwordReset = (newPass, token) => {
  return axios({
    method: 'POST',
    url: `/api/auth/reset/${token}`,
    data: { newPass }
  });
};

export const authorizeRequest = () => {
  const cookie = getСookie(config.token_name);
  if (!cookie) { throw new Error('No token'); }

  return axios({
    method: 'POST',
    url: '/api/auth/authorize',
    data: { cookie }
  });
};

export const updateUserRequest = (newData, newAvatar) => {
  const data = new FormData();
  if (newAvatar) {
    data.append('avatarIMG', newAvatar);
  }

  for (const key in newData) {
    data.append(key, newData[key]);
  }

  return axios({
    method: 'PUT',
    url: '/api/users/editUser',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  });
};

export const restorePasswordRequest = (email) => {
  return axios({
    method: 'POST',
    url: '/api/auth/password_restore',
    data: { email }
  });
};

export const newAvatarRequest = (login, avatar, img) => {
  const data = new FormData();
  data.append('avatar', avatar);
  data.append('avatarIMG', img);

  return axios({
    method: 'PUT',
    url: `/api/users/avatar/${login}`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  });
};

export const updateUserByAdminRequest = (id, data) => {
  return axios({
    method: 'PUT',
    url: `/api/users/adminChange/${id}`,
    data: {
      ...data,
      cookie: getСookie(config.token_name)
    }
  });
};

export const getUserRequest = (login) => {
  return axios({
    method: 'GET',
    url: `/api/users/${login}`
  });
};

export const getAllUsersRequest = (sort = ['id', 'ASC'], filter = { name: '' }) => {
  return axios({
    method: 'POST',
    url: '/api/users',
    data: { sort, filter }
  });
};

export const deleteUserRequest = (id) => {
  return axios({
    method: 'DELETE',
    url: `/api/users/${id}`
  });
};

export default null;
