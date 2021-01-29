import { chain } from 'lodash';

const filterNullValuePairs = (pair: any[2]):boolean => pair[1] !== null;

export default <T>(obj: T): Partial<T> => chain(obj)
  .toPairs()
  .filter(filterNullValuePairs)
  .fromPairs()
  .value();