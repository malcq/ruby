import axios from './axios';

export const getAllTechnologiesArrRequest = ({ params = {} } = {}) => {
  return axios({
    method: 'GET',
    url: '/api/technology/',
    params
  });
};

export const createTechnologyRequest = ({ data = {}, params = '' } = {}) => {
  return axios({
    method: 'POST',
    url: '/api/technology/',
    params,
    data
  });
};

export const updateTechRequest = ({ id, data = {}, params = '' } = {}) => {
  return axios({
    method: 'PUT',
    url: `/api/technology/${id}`,
    params,
    data
  });
};

export const deleteTechRequest = (id) => {
  return axios({
    method: 'DELETE',
    url: `/api/technology/${id}`
  });
};
