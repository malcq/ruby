const envType = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';
const config = {
  token_name: 'token'
};

switch (envType) {
  case 'production':
    config.url = 'https://staff.fusion-team.com';
    config.crm = 'https://crm.fusion-team.com/';
    config.domain = '.fusion-team.com';
    break;

  case 'stage':
    config.url = 'https://staff.demo.fusion-team.com';
    config.crm = 'https://crm.demo.fusion-team.com/';
    config.domain = '.demo.fusion-team.com';
    config.token_name = 'token_stage';
    break;

  default:
    config.url = 'http://localhost:6800';
    config.domain = '';
    config.crm = 'http://localhost:4200';
    break;
}

export default config;
