import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/tasks';
import * as actionCreators from '../../actionCreators/tasks';
import { simpleGetAndResolve } from '../factories';

const getTasks = simpleGetAndResolve(
  (action) => 'api/v1/tasks',
  actionCreators.tasksGetDataSuccess,
  (response) => response.data.data.tasks,
);

export default function* (): Iterator<any> {
  yield takeEvery(actions.TASKS_GET_DATA, getTasks);

}