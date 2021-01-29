import { AnyAction } from 'redux';
import * as actions from '../actions/searchBooking';

export const searchQuotesBooking = (payload: any): AnyAction => ({
  type: actions.SEARCH_QUOTES_BOOKING,
  payload,
});

export const searchQuotesBookingSuccess = (payload: any): AnyAction => ({
  type: actions.SEARCH_QUOTES_BOOKING_SUCCESS,
  payload,
});

export const searchQuotesBookingReset = (): AnyAction => ({
  type: actions.SEARCH_QUOTES_BOOKING_RESET
});


