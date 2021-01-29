import download from 'downloadjs';
import moment from 'moment';

import { Logger } from '../../../utils';

import { authorizedRequest, resolveAction, rejectAction } from '../wrappers';


export default function * (action: IPromisifiedAction): Iterator<any> {
  try{
    const response = yield authorizedRequest({
      responseType: 'blob',
      method: 'GET',
      url: '/api/v1/shipments.xlsx',
      params: action.payload || null,
    });
    Logger.log(response.headers);
    const curDate = moment().format('MMMM DD, YYYY HH-MM');
    download(response.data, `shypple-shipments-${curDate}.xlsx`, 'application/excel');
    yield resolveAction(action)
  } catch(error) {
    yield Logger.sagaError(error, 'store::shipments::downloadExcel');
    yield rejectAction(action, error)
  }
}