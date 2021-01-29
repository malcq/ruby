import { PAGINATION } from 'constants';

export default class PaginationUtils {
  static sliceByPage = (items, page) => {
    const startIndex = (page - 1) * PAGINATION.LIMIT;
    const endIndex = (startIndex + PAGINATION.LIMIT);

    return items.slice(startIndex, endIndex);
  }
}
