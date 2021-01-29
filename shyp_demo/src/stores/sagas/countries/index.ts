import { takeEvery } from 'redux-saga/effects';

import * as actions from '../../actions/countries';
import * as actionCreators from '../../actionCreators/countries';
import { simpleGetAndResolve } from '../factories';

const serializeCountries = ({ id, title }: any): ICountry => [ title, id ];

const getCountries = simpleGetAndResolve(
  () => 'api/v1/common/countries/',
  actionCreators.countriesGetCountriesSuccess,
  (response) => response.data.data.countries.map(serializeCountries),
);

export default function* (): Iterator<any> {
  yield takeEvery(actions.COUNTRIES_GET_COUNTRIES, getCountries)
}