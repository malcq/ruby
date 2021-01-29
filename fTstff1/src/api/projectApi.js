import axios from './axios';

export const createProjectRequest = (project) => {
  const data = new FormData();
  for (let i = 0; i < project.images.length; i++) {
    data.append('projectIMG', project.images[i]);
  }
  for (const key in project) {
    if (key === 'images') {
      continue;
    }
    data.append(key, project[key]);
  }

  return axios({
    method: 'POST',
    url: '/api/projects',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  });
};

export const deleteProject = (id) => axios({ method: 'DELETE', url: `/api/projects/${id}` });

export const createCV = (project) => {
  return axios({
    method: 'POST',
    url: '/api/cv',
    data: project,
    responseType: 'blob'
  }).then((response) => {
    return window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/pdf' })
    );
  });
};

export const createPortfolio = (project) => {
  return axios({
    method: 'POST',
    url: '/api/portfolio',
    data: project,
    responseType: 'blob'
  }).then((response) => {
    return window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/pdf' })
    );
  });
};

export const getAllProjectsArrRequest = (
  sort = ['id', 'ASC'],
  filter = { title: '' }
) => {
  return axios({
    method: 'GET',
    url: '/api/projects/',
    params: { sort, filter }
  });
};

export const getProjectsForUserRequest = (id) => {
  return axios({
    method: 'GET',
    url: `/api/projects/${id}`
  });
};

export const updateProjectRequest = (id, newData) => {
  const data = new FormData();
  for (let i = 0; i < newData.images.length; i++) {
    if (!newData.images[i]) {
      continue;
    }
    data.append('projectIMG', newData.images[i]);
  }

  for (const key in newData) {
    if (key === 'images') {
      continue;
    }
    data.append(key, newData[key]);
  }

  return axios({
    method: 'PUT',
    url: `/api/projects/${id}`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  });
};

export default null;
