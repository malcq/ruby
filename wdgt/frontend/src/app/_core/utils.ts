/**
 * Equivalent to lodash.get function
 * @param obj
 * @param path
 * @param defaultValue
 */
export const get = (obj: object, path: string, defaultValue?: any) => {
  return path
    .split('.')
    .reduce((a, c) => (a && a[c] ? a[c] : (defaultValue || null)), obj);
};
