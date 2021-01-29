import axios from 'axios';

import config from 'config';
import store from 'store';
import { updateSpinnerStatus } from 'store/global/actions';

const getDefaultHeaders = () => ({
  // eslint-disable-next-line object-curly-newline
  Authorization: `Bearer ${'Put your token here'}`
});

export default async ({
  method = 'GET',
  baseUrl = config.serverAddress,
  url = '',
  params = {},
  headers = {},
  data = {},
  spinner = false
}) => {
  try {
    if (spinner) {
      store.dispatch(updateSpinnerStatus(true));
    }

    const { data: res } = await axios({
      method,
      url: `${baseUrl}${url}`,
      params,
      headers: {
        ...getDefaultHeaders(),
        ...headers
      },
      data
    });

    return res;
    // eslint-disable-next-line no-useless-catch
  } catch (err) {
    throw (err);
  } finally {
    if (spinner) {
      store.dispatch(updateSpinnerStatus(false));
    }
  }
};
