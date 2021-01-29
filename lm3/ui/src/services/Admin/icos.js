import HttpApi from 'lib/http-api';

function onResponse({ data }) {
  return data;
}

class ICOsApi extends HttpApi {
  async list() {
    return this.read('/admin/icos')
      .then(onResponse);
  }

  async create(data) {
    return this.write('POST', '/admin/icos', data)
      .then(onResponse);
  }

  async update(id, data) {
    return this.write('PUT', `/admin/icos/${id}`, data)
      .then(onResponse);
  }

  async delete(id) {
    return this.write('DELETE', `/admin/icos/${id}`)
      .then(onResponse);
  }
}

export default ICOsApi;
