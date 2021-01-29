import * as actions from '../actions/countries';
import { AnyAction } from "redux";


export const countriesGetCountries = (): AnyAction => ({
    type: actions.COUNTRIES_GET_COUNTRIES,
});

export const countriesGetCountriesSuccess = (payload: ICountry[]): AnyAction => ({
    type: actions.COUNTRIES_GET_COUNTRIES_SUCCESS,
    payload,
});
