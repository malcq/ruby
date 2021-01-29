import HttpApi from 'lib/http-api';

function onResponse({ data }) {
  return data;
}

class UsersApi extends HttpApi {
  async list() {
    return this.read('/admin/users')
      .then(onResponse);
  }

  async create(user) {
    return this.write('POST', '/admin/users', user)
      .then(onResponse);
  }

  async update(id, data) {
    return this.write('PUT', `/admin/users/${id}`, data)
      .then(onResponse);
  }

  async delete(id) {
    return this.write('DELETE', `/admin/users/${id}`)
      .then(onResponse);
  }
}

export default UsersApi;
