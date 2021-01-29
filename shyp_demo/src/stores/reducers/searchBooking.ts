import { createReducer, Handlers, Reducer } from 'redux-create-reducer';
import { AnyAction } from "redux";
import * as actions from '../actions/searchBooking';

declare global{
  interface ISearchBooking{
    "id": number,
    "title": string,
    "quote_status": boolean,
    "type": string,
    loading: boolean
  }
}

export const initialSearchQuoteBookingState: ISearchBooking = {
  id: 0,
  title: '',
  quote_status: false,
  type: '',
  loading: false
};

const searchQuotesBooking: Reducer<ISearchBooking, AnyAction> = (state, { payload }) => ({
  ...payload.data.data,
  loading: false,

});

const searchQuotesBookingStart: Reducer<ISearchBooking, AnyAction> = (state, { payload }) => ({
  ...state, loading: true
});

const searchQuotesBookingReset: Reducer<ISearchBooking, AnyAction> = (state, { payload }) => (initialSearchQuoteBookingState);


const actionHandlers: Handlers<ISearchBooking> = {
  [actions.SEARCH_QUOTES_BOOKING_SUCCESS]: searchQuotesBooking,
  [actions.SEARCH_QUOTES_BOOKING]: searchQuotesBookingStart,
  [actions.SEARCH_QUOTES_BOOKING_RESET]: searchQuotesBookingReset,
};

export default createReducer(initialSearchQuoteBookingState, actionHandlers);