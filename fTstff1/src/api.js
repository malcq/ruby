import axios from 'axios';
import config from './config';

const getСookie = (name) => {
  const results = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);

  if (results) {
    return unescape(results[2]);
  }
  return null;
};

const api = {
  registerUser: (newUser) => {
    const data = {};

    for (const key in newUser) {
      if (newUser[key] !== '') {
        data[key] = newUser[key];
      }
    }

    return axios.post(`${config.url}/api/auth/signup`, data);
  },

  signIn: (user) => {
    return axios.post(`${config.url}/api/auth/signin`, user);
  },

  authorize: () => {
    const cookie = getСookie(config.token_name);
    return axios.post(`${config.url}/api/auth/authorize`, { cookie });
  },

  editUser: (newData, newAvatar) => {
    const data = new FormData();
    if (newAvatar) {
      data.append('avatarIMG', newAvatar);
    }

    for (const key in newData) {
      data.append(key, newData[key]);
    }

    return axios.put(`${config.url}/api/users/editUser`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  newAvatar: (login, avatar, img) => {
    const data = new FormData();
    data.append('avatar', avatar);
    data.append('avatarIMG', img);

    return axios.put(`${config.url}/api/users/avatar/${login}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateTechnologyImage: async (title, img) => {
    const data = new FormData();

    data.append('image', img);

    const token = getСookie(config.token_name);
    return axios({
      method: 'PUT',
      url: `${config.url}/api/technology/image/${title}`,

      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${token}`
      },
      data
    });
  },

  adminUserChange: (id, data) => {
    const cookie = getСookie(config.token_name);
    return axios.put(`${config.url}/api/users/adminChange/${id}`, {
      ...data,
      cookie
    });
  },

  getUser: (login) => {
    return axios.get(`${config.url}/api/users/${login}`);
  },

  getUsersArr: (sort = ['id', 'ASC'], filter = { name: '' }) => {
    return axios.post(`${config.url}/api/users`, { sort, filter });
  },

  // users requests
  newRequest: (body) => {
    console.log(body);
    return axios.post(`${config.url}/api/request/`, body);
  },

  editRequest: (data) => {
    return axios.put(`${config.url}/api/request/`, data);
  },

  getUserRequests: (id) => {
    return axios.get(`${config.url}/api/request/${id}`);
  },

  getRequestsArr: (sort, filter) => {
    return axios.get(`${config.url}/api/request/`, {
      params: { sort, filter }
    });
  },

  getUserRequestStatistic: (id, dates) => {
    return axios.get(`${config.url}/api/statistics/${id}`, {
      params: { dates }
    });
  },

  getUserRequestStatisticHolidays: (id) => {
    return axios.get(`${config.url}/api/statistics/holiday/${id}`);
  },

  deleteRequest: (id) => {
    return axios.delete(`${config.url}/api/request/${id}`);
  },

  // technologies requests
  getTechnologiesArr: () => {
    return axios.get(`${config.url}/api/technology/`);
  },

  getTagsArr: () => {
    return axios.get(`${config.url}/api/tag/`);
  },

  postTag: (newTag) => {
    const token = getСookie(config.token_name);
    return axios.post(`${config.url}/api/tag/`, { newTag, token });
  },

  // projects requests
  newProject: (project) => {
    const data = new FormData();
    for (let i = 0; i < project.images.length; i++) {
      data.append('projectIMG', project.images[i].target.files[0]);
    }

    for (const key in project) {
      if (key === 'images') {
        continue;
      }
      data.append(key, project[key]);
    }

    console.log(project, data);

    return axios.post(`${config.url}/api/projects`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getProjectsArr: (sort = ['id', 'ASC'], filter = { title: '' }) => {
    return axios.get(`${config.url}/api/projects/`, {
      params: { sort, filter }
    });
  },

  getProjectsForUser: (id) => {
    return axios.get(`${config.url}/api/projects/${id}`);
  },

  editProject: (id, newData) => {
    const data = new FormData();
    for (let i = 0; i < newData.images.length; i++) {
      if (!newData.images[i]) {
        continue;
      }
      data.append('projectIMG', newData.images[i].target.files[0]);
    }

    for (const key in newData) {
      if (key === 'images') {
        continue;
      }
      data.append(key, newData[key]);
    }

    return axios.put(`${config.url}/api/projects/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Study plans
  createPlan: (id) => {
    return axios.post(`${config.url}/api/plan`, { id });
  },

  getPlan: (id) => {
    return axios.get(`${config.url}/api/plan/${id}`);
  },

  editPlan: (id, data) => {
    return axios.put(`${config.url}/api/plan/${id}`, { ...data });
  },

  changeTaskStatus: (id, data) => {
    return axios.put(`${config.url}/api/plan/taskJobInPlan/${id}`, { data });
  },

  getAllArticles: () => {
    return axios.get(`${config.url}/api/articles`);
  },

  getFilteredArticles: (filter) => {
    return axios.get(`${config.url}/api/articles`, { params: { filter } });
  },

  postNewArticle: (link, tags) => {
    const token = getСookie(config.token_name);
    return axios.post(`${config.url}/api/articles`, { link, tags, token });
  },

  deleteArticle: (id) => {
    const token = getСookie(config.token_name);
    return axios.delete(`${config.url}/api/articles/${id}`, {
      headers: { 'x-access-token': token }
    });
  },

  getAllTasks: (sort = ['title', 'ASC'], filter = { title: '' }) => {
    return axios.get(`${config.url}/api/taskjob`, { params: { sort, filter } });
  },

  createTask: (data) => {
    return axios.post(`${config.url}/api/taskjob/`, data);
  },

  editTask: (id, data) => {
    return axios.put(`${config.url}/api/taskjob/${id}`, data);
  },

  deleteTask: (id) => {
    return axios.delete(`${config.url}/api/taskjob/${id}`);
    // return axios({
    //   method: 'delete',
    //   url: `${config.url}/api/taskjob/${id}`,
    //   data: {
    //     firstName: 'Fred',
    //     lastName: 'Flintstone'
    //   }
    // });
  }
};

export default api;
