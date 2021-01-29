import axios from './axios';

export default class ApiClass {
  constructor(path) {
    this.path = path;
  }

  getOne({
    id,
    params,
    headers,
    spinner
  } = {}) {
    return axios({
      method: 'GET',
      url: `${this.path}/${id}`,
      params,
      headers,
      spinner
    });
  }

  search({
    params,
    headers,
    spinner
  } = {}) {
    return axios({
      method: 'GET',
      url: `${this.path}/search`,
      params,
      headers,
      spinner
    });
  }

  create({
    data,
    params,
    headers,
    spinner
  } = {}) {
    return axios({
      method: 'POST',
      url: `${this.path}/create`,
      data,
      params,
      headers,
      spinner
    });
  }

  update({
    id,
    data,
    params,
    headers,
    spinner
  } = {}) {
    return axios({
      method: 'PATCH',
      url: `${this.path}/${id}`,
      data,
      params,
      headers,
      spinner
    });
  }

  delete({
    id,
    params,
    headers,
    spinner
  } = {}) {
    return axios({
      method: 'DELETE',
      url: `${this.path}/${id}`,
      params,
      headers,
      spinner
    });
  }
}
