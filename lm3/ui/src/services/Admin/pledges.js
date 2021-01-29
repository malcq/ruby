import HttpApi from 'lib/http-api';

function onResponse({ data }) {
  return data;
}

class PledgesApi extends HttpApi {
  async list() {
    return this.read('/admin/pledges')
      .then(onResponse);
  }

  async update(id, data) {
    return this.write('PUT', `/admin/pledges/${id}`, data)
      .then(onResponse);
  }

  async delete(id) {
    return this.write('DELETE', `/admin/pledges/${id}`)
      .then(onResponse);
  }
}

export default PledgesApi;
