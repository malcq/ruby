/* tslint: disable */

import axios from 'axios';
import { requestTimeout, baseURL } from '../config/local.json';

export default axios.create({
  timeout: requestTimeout,
  baseURL,
});