import axios from './axios';
import { getСookie } from './apiConfig';
import config from '../config';

export const getAllArticlesRequest = () => {
  return axios({
    method: 'GET',
    url: '/api/articles'
  });
};

export const getFilteredArticlesRequest = (filter) => {
  return axios({
    method: 'GET',
    url: '/api/articles',
    params: { filter }
  });
};

export const createNewArticleRequest = (link, tags) => {
  return axios({
    method: 'POST',
    url: '/api/articles',
    data: {
      link,
      tags,
      token: getСookie(config.token_name)
    }
  });
};

export const deleteArticleRequest = (id) => {
  return axios({
    method: 'DELETE',
    url: `/api/articles/${id}`,
    headers: {
      'x-access-token': getСookie(config.token_name)
    }
  });
};

export default null;
