const envType = process.env.NODE_ENV || 'development';

const config = {
  development: {
    currentAddress: 'http://localhost:3000',
    serverAddress: 'http://localhost:4000'
  },
  production: {
    currentAddress: 'http://localhost:3000',
    serverAddress: 'http://localhost:4000'
  }
};

export default config[envType];
