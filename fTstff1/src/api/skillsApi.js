import axios from './axios';

export const getAllSkillsArrRequest = (sort, filter) => {
  return axios({
    method: 'GET',
    url: '/api/skills/',
    params: { sort, filter }
  });
};

export default null;
