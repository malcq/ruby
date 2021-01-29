import { fork } from "redux-saga/effects";
import user from "./user";
import dashboard from "./dashboard";
import countries from './countries';
import mapOverviews from './mapOverviews';
import contacts from './contacts';
import companies from './companies';
import searches from './searches';
import searchPrevious from './searchPrevious';
import searchOverview from './searchOverview';
import searchBooking from './searchBooking';
import rates from './rates';
import shipmentTrack from './shipmentTrack';
import shipmentLink from './shipmentLink';
import shipmentLayout from './shipmentLayout';
import shipmentPrice from './shipmentPrice';
import shipmentInstructions from './shipmentInstructions';
import flash from './flash';
import quotes from './quotes';
import shipments from './shipments';
import tasks from './tasks';
import shipmentOverview from './shipmentOverview'
import shipmentConversation from './shipmentConversation'
import shipmentDocs from './shipmentDocs'

export default function*(): Iterator<any> {
  yield fork(user);
  yield fork(countries);
  yield fork(mapOverviews);
  yield fork(contacts);
  yield fork(companies);
  yield fork(dashboard);
  yield fork(searches);
  yield fork(searchPrevious);
  yield fork(searchOverview);
  yield fork(searchBooking);
  yield fork(rates);
  yield fork(shipments);
  yield fork(shipmentTrack);
  yield fork(shipmentLink);
  yield fork(shipmentPrice);
  yield fork(shipmentInstructions);
  yield fork(flash);
  yield fork(quotes);
  yield fork(tasks);
  yield fork(shipmentLayout);
  yield fork(shipmentOverview);
  yield fork(shipmentConversation);
  yield fork(shipmentDocs);
}