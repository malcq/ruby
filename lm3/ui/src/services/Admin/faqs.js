import HttpApi from 'lib/http-api';

function onResponse({ data }) {
  return data;
}

class FAQsApi extends HttpApi {
  async list() {
    return this.read('/admin/faqs')
      .then(onResponse);
  }

  async create(data) {
    return this.write('POST', '/admin/faqs', data)
      .then(onResponse);
  }

  async update(id, data) {
    return this.write('PUT', `/admin/faqs/${id}`, data)
      .then(onResponse);
  }

  async delete(id) {
    return this.write('DELETE', `/admin/faqs/${id}`)
      .then(onResponse);
  }

  async setOrder(id, newOrder) {
    return this.write('PUT', `/admin/faqs/${id}/order`, { newOrder })
      .then(onResponse);
  }
}

export default FAQsApi;
