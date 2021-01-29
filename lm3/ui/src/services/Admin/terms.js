import HttpApi from 'lib/http-api';

function onResponse({ data }) {
  return data;
}

class TermsApi extends HttpApi {
  async list() {
    return this.read('/admin/terms')
      .then(onResponse);
  }

  async create(data) {
    return this.write('POST', '/admin/terms', data)
      .then(onResponse);
  }

  async update(id, data) {
    return this.write('PUT', `/admin/terms/${id}`, data)
      .then(onResponse);
  }

  async delete(id) {
    return this.write('DELETE', `/admin/terms/${id}`)
      .then(onResponse);
  }

  async setActive(id) {
    return this.write('PUT', `/admin/terms/${id}/activate`)
      .then(onResponse);
  }
}

export default TermsApi;
