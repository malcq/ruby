import axios from './axios';

export const getPlanTaskJobsTimeFrames = (taskJobs, planId) => {
  const taskJobIds = taskJobs.map((taskJob) => taskJob.id);
  return axios({
    method: 'GET',
    url: '/api/plan-task-jobs/getTimeFrames',
    params: { taskJobIds, planId }
  });
};

export default null;
