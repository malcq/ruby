import HttpApi from 'lib/http-api';

function onResponse({ data }) {
  return data;
}

class AppSettingsApi extends HttpApi {
  fetch() {
    return this.read('/admin/app-settings')
      .then(onResponse);
  }

  update(type, data) {
    return this.write('PUT', '/admin/app-settings', { type, data })
      .then(onResponse);
  }
}

export default AppSettingsApi;
