import axios from './axios';

export const getTechGroupsRequset = ({ params = {} } = {}) => {
  return axios({
    method: 'GET',
    url: '/api/tech-group',
    params
  });
};

export const createTechGroupRequest = ({ data = {}, params = {} } = {}) => {
  return axios({
    method: 'POST',
    url: '/api/tech-group/',
    params,
    data
  });
};

export const updateTechGroupRequest = ({ id, data = {}, params = {} } = {}) => {
  return axios({
    method: 'PUT',
    url: `/api/tech-group/${id}`,
    params,
    data
  });
};

export const deleteTechGroupRequest = (id) => {
  return axios({
    method: 'DELETE',
    url: `/api/tech-group/${id}`
  });
};
