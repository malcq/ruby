import axios from './axios';
import { getСookie } from './apiConfig';
import config from '../config';

export const getAllTagsArrRequest = () => {
  return axios({
    method: 'GET',
    url: '/api/tag/'
  });
};

export const createTagRequest = (newTag) => {
  return axios({
    method: 'POST',
    url: '/api/tag/',
    data: {
      newTag,
      token: getСookie(config.token_name)
    }
  });
};

export default null;
