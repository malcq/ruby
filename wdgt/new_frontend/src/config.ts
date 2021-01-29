const DEV_CONFIG = {
  apiUrl: 'http://devapp.3back.ai',
  apiUrlApp: 'https://devapp.3back.ai',
  startNewChat: true,
  //apiUrlApp: 'http://f828ec82.ngrok.io',
};

const PROD_CONFIG = {
  apiUrl: 'http://devapp.3back.ai',
  apiUrlApp: 'https://devapp.3back.ai',
  startNewChat: true,
};

function getConfig() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return DEV_CONFIG;
    default:
      return PROD_CONFIG;
  }
}

const config = getConfig();
export default config;
