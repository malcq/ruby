import * as actions from '../actions/companies';
import { AnyAction } from 'redux';

export const companiesGetData = (): AnyAction => ({
    type: actions.COMPANIES_GET_DATA,
});

export const companiesGetDataSuccess = (payload: any): AnyAction => ({
    type: actions.COMPANIES_GET_DATA_SUCCESS,
    payload,
});
