import HttpApi from 'lib/http-api';

function onResponse({ data }) {
  return data;
}

class ICOSuggestionsApi extends HttpApi {
  async list() {
    return this.read('/admin/ico-suggestions')
      .then(onResponse);
  }

  async delete(id) {
    return this.write('DELETE', `/admin/ico-suggestions/${id}`)
      .then(onResponse);
  }
}

export default ICOSuggestionsApi;
