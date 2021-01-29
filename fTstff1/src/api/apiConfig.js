import config from '../config';

export const getСookie = (name) => {
  const results = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  if (results) return unescape(results[2]);
  return null;
};

export const headers = () => {
  return {
    // 'Content-Type': 'application/vnd.api+json',
    // Accept: 'application/vnd.api+json',
    Authorization: `Bearer ${getСookie(config.token_name)}`
  };
};

export default null;
