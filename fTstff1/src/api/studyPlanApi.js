import axios from './axios';

export const createStudyPlanRequest = (id) => {
  return axios({
    method: 'POST',
    url: '/api/plan',
    data: { id }
  });
};

export const getStudyPlanRequest = (id, withVacation = false) => {
  const url = `/api/plan/${id}`;
  return axios({
    method: 'GET',
    params: { withVacation },
    url
  });
};

export const updateStudyPlanRequest = (id, data) => {
  return axios({
    method: 'PUT',
    url: `/api/plan/${id}`,
    data
  });
};

export default null;
