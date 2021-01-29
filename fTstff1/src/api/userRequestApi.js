// import axios from 'axios';
import axios from './axios';

export const newRequestRequest = (body) => {
  return axios({
    method: 'POST',
    url: '/api/request/',
    data: body
  });
};

export const editRequestRequest = (data) => {
  return axios({
    method: 'PUT',
    url: '/api/request/',
    data
  });
};

export const getUserRequestsRequest = (id, { status } = {}) => {
  return axios({
    method: 'GET',
    url: `/api/request/${id}`,
    params: { status }
  });
};

export const getAllRequestsArrRequest = (sort, filter) => {
  return axios({
    method: 'GET',
    url: '/api/request/',
    params: { sort, filter }
  });
};

export const getUserRequestStatisticRequest = (id, { dates, status } = {}) => {
  return axios({
    method: 'GET',
    url: `/api/statistics/${id}`,
    params: { dates, status }
  });
};

export const getUserRequestStatisticHolidays = (id, { dates, status } = {}) => {
  return axios({
    method: 'GET',
    url: `/api/statistics/holiday/${id}`,
    params: { dates, status }
  });
};

export const deleteRequestRequest = (id) => {
  return axios({
    method: 'DELETE',
    url: `/api/request/${id}`
  });
};

export default null;
