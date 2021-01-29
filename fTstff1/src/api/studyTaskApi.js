import axios from './axios';

export const createTaskRequest = (data) => {
  return axios({
    method: 'POST',
    url: '/api/taskjob/',
    data
  });
};

export const getAllTasksRequest = (
  sort = ['title', 'ASC'],
  filter = { title: '' }
) => {
  return axios({
    method: 'GET',
    url: '/api/taskjob',
    params: { sort, filter }
  });
};

export const updateTaskStatusRequest = (id, data) => {
  return axios({
    method: 'PUT',
    url: `/api/plan/taskJobInPlan/${id}`,
    data
  });
};

export const updateTaskRequest = (id, data) => {
  return axios({
    method: 'PUT',
    url: `/api/taskjob/${id}`,
    data
  });
};

export const deleteTaskRequest = (id) => {
  return axios({
    method: 'DELETE',
    url: `/api/taskjob/${id}`
  });
};

export default null;
