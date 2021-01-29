import { parse } from 'querystring';

export default (query: string) => parse(`${query}`.replace('\?',''))