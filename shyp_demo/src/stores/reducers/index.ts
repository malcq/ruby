import { routerReducer, RouterState } from 'react-router-redux';
import user, { initialUserState } from './user';
import countries, { initialCountriesState } from './countries';
import flash, { initialFlashState } from './flash';
import mapOverviews, { initialMapsState } from './mapOverviews';
import contacts, { initialContactsState } from './contacts';
import companies, { initialCompaniesState } from './companies';
import dashboard, { initialDashboardState } from './dashboard';
import searches, { initialSearchQuotesState } from './searches';
import rates, { initialRatesState } from './rates';
import shipmentTrack, { initialShipmentTrackState } from './shipmentTrack';
import shipmentConversation, { initialShipmentConversationState } from './shipmentConversation';
import shipmentLink, { initialShipmentLinkState } from './shipmentLink';
import shipmentPrice, { initialShipmentPriceState } from './shipmentPrice';
import shipmentInstructions, { initialShipmentInstructionsState } from './shipmentInstructions';
import quotes, { initialQuotesState } from './quotes';
import shipments, { initialShipmentsState } from './shipments';
import tasks, { initialTasksState } from './tasks';
import searchPrevious, { initialSearchPreviousState } from './searchesPrevious';
import searchOverview, { initialSearchQuoteOverviewState } from './searchOverview';
import searchBooking, { initialSearchQuoteBookingState } from './searchBooking';
import shipmentLayout, { initialShipmentLayoutState } from './shipmentLayout';
import shipmentOverview, {initialShipmentOverviewState } from './shipmentOverview';
import shipmentDocs, {initialShipmentDocsState} from './shipmentDocs';
import flags, { initialFlagsState } from './flags';
import { combineReducers } from 'redux';

declare global{
  interface IGlobalState {
    routing?: RouterState;
    user: IUserState;
    countries: ICountriesState;
    flash: IFlashState;
    mapOverviews: IMapsState;
    contacts: IContactsState;
    companies: ICompaniesState;
    dashboard: IDashboard;
    rates: IRatesState;
    shipments: IShipmentsState;
    shipmentTrack: IShipmentTrackState;
    shipmentLink: IShipmentLinkState;
    shipmentConversation: IShipmentConversationState;
    shipmentPrice: IShipmentPriceState;
    shipmentInstructions: IShipmentInstructionsState;
    quotes: IQuotesState;
    tasks: ITasksState;
    shipmentLayout: IShipmentLayoutState;
    searches: ISearch;
    searchPrevious: ISearchPrevious;
    searchOverview: ISearchOverview;
    searchBooking: ISearchBooking;
    shipmentOverview: IShipmentOverviewState;
    shipmentDocs: IShipmentDocsState;
    flags: IFlagsState;
  }
}

export const initialState = {
  routing: { location: null },
  user: initialUserState,
  countries: initialCountriesState,
  flash: initialFlashState,
  mapOverviews: initialMapsState,
  contacts: initialContactsState,
  companies: initialCompaniesState,
  dashboard: initialDashboardState,
  searches: initialSearchQuotesState,
  rates: initialRatesState,
  shipments: initialShipmentsState,
  shipmentTrack: initialShipmentTrackState,
  shipmentLink: initialShipmentLinkState,
  shipmentPrice: initialShipmentPriceState,
  shipmentLayout: initialShipmentLayoutState,
  shipmentInstructions: initialShipmentInstructionsState,
  quotes: initialQuotesState,
  tasks: initialTasksState,
  searchPrevious: initialSearchPreviousState,
  searchOverview: initialSearchQuoteOverviewState,
  searchBooking: initialSearchQuoteBookingState,
  shipmentOverview: initialShipmentOverviewState,
  shipmentConversation: initialShipmentConversationState,
  flags: initialFlagsState,
  shipmentDocs: initialShipmentDocsState,
};

export default combineReducers({
  routing: routerReducer,
  user,
  flash,
  mapOverviews,
  contacts,
  companies,
  countries,
  dashboard,
  searches,
  rates,
  shipments,
  shipmentTrack,
  shipmentLink,
  shipmentPrice,
  shipmentInstructions,
  quotes,
  tasks,
  searchPrevious,
  searchOverview,
  searchBooking,
  shipmentLayout,
  shipmentOverview,
  shipmentConversation,
  flags,
  shipmentDocs,
})