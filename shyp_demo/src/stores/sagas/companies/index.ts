import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/companies';
import * as actionCreators from '../../actionCreators/companies';
import { simpleGetAndResolve } from '../factories';


const serializeCompanies = ({ id, name }: any): ICountry => [ name, id ];

const getCompanies = simpleGetAndResolve(
  ()=>'api/v1/common/companies/',
  actionCreators.companiesGetDataSuccess,
  (response) => response.data.data.companies.map(serializeCompanies),
);

export default function* (): Iterator<any> {
  yield takeEvery(actions.COMPANIES_GET_DATA, getCompanies)
}