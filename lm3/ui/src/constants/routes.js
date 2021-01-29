const adminBasePath = '/admin';
const membersBasePath = '/members';

export default {
  MAIN: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  CONFIRM_EMAIL: '/confirm-email/:token?',
  RESET_PASSWORD: '/reset-password/:token?',

  ADMIN_PANEL: {
    DASHBOARD: adminBasePath,
    USERS: {
      INDEX: `${adminBasePath}/users`,
      VIEW: `${adminBasePath}/users/:id`,
      CREATE: `${adminBasePath}/users/create`,
      EDIT: `${adminBasePath}/users/:id/edit`,
    },
  },

  MEMBERS: {
    BASE: membersBasePath,
  },
  NOT_FOUND: '',
};
