import HttpApi from 'lib/http-api';

function onResponse({ data }) {
  return data;
}

class UserApi extends HttpApi {
  async checkUniqueness(field, value) {
    return this.read('/user/check-uniqueness', { field, value })
      .then(onResponse);
  }

  async profile() {
    return this.read('/user/profile')
      .then(onResponse);
  }

  async changePassword(currentPassword, newPassword) {
    return this.write('PUT', '/user/change-password', { currentPassword, newPassword })
      .then(onResponse);
  }

  async setupTwoFactor() {
    return this.write('PUT', '/user/two-factor-setup')
      .then(onResponse);
  }

  async enableTwoFactor(token) {
    return this.write('PUT', '/user/two-factor-enable', { token })
      .then(onResponse);
  }

  async disableTwoFactor(token) {
    return this.write('PUT', '/user/two-factor-disable', { token })
      .then(onResponse);
  }
}

export default UserApi;
