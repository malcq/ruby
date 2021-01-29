import { get, pick } from 'lodash';

export default (response: any): any => ({
  ...get(response.data, 'data'),
  ...pick(response.data, ['timestamp', 'message']),
})