import React, { Fragment, PureComponent } from 'react';
import bind from 'autobind-decorator';
import { connect } from 'react-redux';
import { xor, chain, entries, values, has, get } from 'lodash';
import moment from 'moment';
import { delay } from 'redux-saga';

import {
  IconedButton,
  Checkbox,
  Button,
  Paper,
  MultiSelector,
  SelectorButton,
  DateRangeSelector,
  Shipment,
  LoadableContainer,
} from '../../components';
import { baseURL } from '../../config/local.json';
import {
  shipmentsGetData,
  shipmentsGetDataAndFilters,
  shipmentsDownloadExcel
} from '../../stores/actionCreators';
import { Dispatch } from 'redux';
import { promisifyAction, Logger } from '../../utils';
import { SEARCH_REQUEST_DELAY } from '../../config/constants';
import groups from './groups';
import './styles.scss';

interface IShipmentsState {
  search: string;
  showDelivered: boolean;
  showAllFilters: boolean;
  filters: { [x: string]: string[] };
  sortBy: string,
  groupBy: string,
  busy: boolean,
  arrivalDateStart: string | null,
  arrivalDateEnd: string | null,
  departureDateStart: string | null,
  departureDateEnd: string | null,
  searchDelayId: number,
}

interface IShipmentsProps {
  shipments: IDetailedShipment[];
  filterOptions: { [x: string]: Array<Array<string | number>> };
  getData: IActionPromiseFactory;
  getDataWithFilters: IActionPromiseFactory;
  downloadExcel: IActionPromiseFactory;
}

const toUnixDate = (date: string): number | null => date ? moment(date).unix() : null;

const noDelivered = (shipment: IDetailedShipment): boolean => shipment.status !== 'delivered';

const initialFilters = {
  search: '',
  showDelivered: false,
  filters: {
    consignees: [],
    shippers: [],
    notifyParties: [],
    contacts: [],
    pods: [],
    pols: [],
    carriers: [],
    statuses: [],
    types: [],
  },
  sortBy: 'newest',
  groupBy: 'status',
  arrivalDateStart: null,
  arrivalDateEnd: null,
  departureDateStart:  null,
  departureDateEnd: null,
};

const initialState = {
  ...initialFilters,
  showAllFilters: false,
  busy: false,
  searchDelayId: 0,
};

const mapStateToProps = (state: IGlobalState): any => ({
  shipments: state.shipments.list,
  filterOptions: state.shipments.filterOptions,
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  getData: promisifyAction(dispatch, shipmentsGetData),
  getDataWithFilters: promisifyAction(dispatch, shipmentsGetDataAndFilters),
  downloadExcel: promisifyAction(dispatch, shipmentsDownloadExcel)
});



const isNotEmptyList = (list: any[]): boolean => list && list.length > 0;

class Shipments extends PureComponent<IShipmentsProps, IShipmentsState> {

  public static defaultProps = {
    shipments: [],
    filterOptions: {
      consignees: [],
      shippers: [],
      notify_parties: [],
      contacts: [],
      pods: [],
      pols: [],
      carriers: [],
      statuses: [],
      types: [],
    },
  };

  public readonly state = initialState;

  public async componentDidMount(): Promise<any> {
    await this.search({}, this.props.getDataWithFilters)
  }

  public render() {
    const { search, showDelivered, showAllFilters, busy } = this.state;
    const filterHiddenClass = showAllFilters ? '' : 'shipments-page__filters-group_hidden';
    const count = this.props.shipments.length || 0;
    let shipments: IDetailedShipment[] = this.props.shipments || [];
    if (this.props.shipments && !showDelivered) {
      shipments = this.props.shipments.filter(noDelivered);
    }
    return (
      <article className="shipments-page">
        <header className="shipments-page__header">
          <div className="shipments-page__header-left-group">
            Shipments
            <div className="shipments-page__search">
              <label
                className="shipments-page__search-input"
                htmlFor="shipments-page__search-input-element"
              >
                <i className="shipments-page__search-icon icon search" />
                <input
                  type="search"
                  id="shipments-page__search-input-element"
                  className="shipments-page__search-input-element"
                  value={search}
                  onChange={this.changeSearch}
                  placeholder={`Search in ${count} results`}
                />
              </label>
            </div>
            <label className="shipments-page__check-container">
              <Checkbox
                checked={showDelivered}
                className="shipments-page__check"
                onChange={this.switchShowDelivered}
              />
              Show delivered
            </label>
          </div>
          <div className="shipments-page__button-group">
            {this.filtersAreChanged() && <Button
              className="shipments-page__button shipments-page__button_reset"
              color="green"
              onClick={this.resetFilters}
            >
              Reset filters
            </Button>}
            <IconedButton
              className="shipments-page__button shipments-page__button_export"
              icon="download"
              iconPosition="right"
              title="Export"
              onClick={this.downloadExcel}
            />
          </div>
        </header>
        <Paper
          className="shipments-page__content"
        >
          <header className="shipments-page__filters">
            <div
              className={`shipments-page__filters-group shipments-page__filters-group_left ${filterHiddenClass}`}
            >
              <DateRangeSelector
                className="shipments-page__filters-button"
                title="Departure Date"
                initialRangeStart={this.state.departureDateStart || undefined}
                initialRangeEnd={this.state.departureDateEnd || undefined}
                onSubmit={this.setDepartureDate}
                onCancel={this.resetDepartureDate}
              />
              <DateRangeSelector
                className="shipments-page__filters-button"
                title="Arrival Date"
                initialRangeStart={this.state.arrivalDateStart || undefined}
                initialRangeEnd={this.state.arrivalDateEnd || undefined}
                onSubmit={this.setArrivalDate}
                onCancel={this.resetArrivalDate}
              />
              <MultiSelector
                className="shipments-page__filters-button"
                title="Shipper"
                fieldName="shippers"
                options={this.props.filterOptions.shippers}
                pickedOptionIds={this.state.filters.shippers}
                onPickOption={this.pickFilterOption}
                onCancel={this.resetFiltersOfType}
              />
              <MultiSelector
                className="shipments-page__filters-button"
                title="Contact"
                fieldName="contacts"
                options={this.props.filterOptions.contacts}
                pickedOptionIds={this.state.filters.contacts}
                onPickOption={this.pickFilterOption}
                onCancel={this.resetFiltersOfType}
              />
              <MultiSelector
                className="shipments-page__filters-button"
                title="Consignee"
                fieldName="consignees"
                options={this.props.filterOptions.consignees}
                pickedOptionIds={this.state.filters.consignees}
                onPickOption={this.pickFilterOption}
                onCancel={this.resetFiltersOfType}
              />
              <MultiSelector
                className="shipments-page__filters-button"
                title="Types"
                fieldName="types"
                options={this.props.filterOptions.types}
                pickedOptionIds={this.state.filters.types}
                onPickOption={this.pickFilterOption}
                onCancel={this.resetFiltersOfType}
              />
              <MultiSelector
                className="shipments-page__filters-button"
                title="Status"
                fieldName="statuses"
                options={this.props.filterOptions.statuses}
                pickedOptionIds={this.state.filters.statuses}
                onPickOption={this.pickFilterOption}
                onCancel={this.resetFiltersOfType}
              />
              <MultiSelector
                className="shipments-page__filters-button"
                title="Carrier"
                fieldName="carriers"
                options={this.props.filterOptions.carriers}
                pickedOptionIds={this.state.filters.carriers}
                onPickOption={this.pickFilterOption}
                onCancel={this.resetFiltersOfType}
              />
              <MultiSelector
                className="shipments-page__filters-button"
                title="POL"
                fieldName="pols"
                options={this.props.filterOptions.pols}
                pickedOptionIds={this.state.filters.pols}
                onPickOption={this.pickFilterOption}
                onCancel={this.resetFiltersOfType}
              />
              <MultiSelector
                className="shipments-page__filters-button"
                title="POD"
                fieldName="pods"
                options={this.props.filterOptions.pods}
                pickedOptionIds={this.state.filters.pods}
                onPickOption={this.pickFilterOption}
                onCancel={this.resetFiltersOfType}
              />
            </div>

            <div className="shipments-page__filters-group shipments-page__filters-group_right">
              <Button
                className="shipments-page__filters-button"
                color="grey-outline-green"
                onClick={this.switchShowAllFilters}
              >
                All Filters
              </Button>
              <SelectorButton
                title="Sort by"
                value={this.state.sortBy}
                className="shipments-page__filters-button"
                onChange={this.setSorting}
                defaultValue={initialFilters.sortBy}
                options={[
                  ['Newest first', 'newest'],
                  ['ETA', 'eta'],
                  ['ETD', 'etd'],
                  ['Status', 'status']
                ]}
              />
              <SelectorButton
                title="Group by"
                value={this.state.groupBy}
                defaultValue={initialFilters.groupBy}
                className="shipments-page__filters-button"
                onChange={this.setGroup}
                options={[
                  ['Status', 'status'],
                  ['Type', 'type'],
                  ['Import/Export', 'import'],
                  ['None', 'none']
                ]}
              />
            </div>
          </header>
          <section className="shipments-page__shipments">
            <LoadableContainer
              loading={busy}
              className="shipments-page__shipments-loading"
              spinnerClassName="shipments-page__shipments-spinner"
            >
              {(shipments && shipments.length)
                ? this.renderShipmentGroups(shipments)
                : (
                  <section className="shipments-page__shipments-no-results">
                    <i className="shipments-page__shipments-no-results-icon icon shipments" />
                    We cannot find shipments that match your current search / filter criteria
                  </section>
                )
              }
            </LoadableContainer>
          </section>
        </Paper>
      </article>
    );
  }

  private getGroupName(groupType: string, group: string, defaultGroup: string): string {
    if (groups[groupType].options) {
      return groups[groupType].options[group].name || defaultGroup;
    }
    if (groups[groupType].optionAccessor){
      return this.getOptionName(groups[groupType].optionAccessor, group, defaultGroup);
    }
    return defaultGroup;
  }

  private renderShipmentGroups(shipments: IDetailedShipment[]) {
    const { groupBy } = this.state;

    return (groupBy && groupBy !== 'none')
      ? chain(shipments)
        .groupBy(groups[groupBy].groupBy)
        .entries()
        .sortBy(groups[groupBy].sortRule)
        .map(([groupName, list]: any[]) => (
          !get(groups[groupBy].options[groupName], 'hidden') && [
            <header key={groupName} className="shipments-page__shipments-group-header">
              {this.getGroupName(groupBy, groupName, 'Other')}
              {' '}({list.length} results)
            </header>,
            this.renderShipmentList(list)
          ]
        ))
        .value()
      : this.renderShipmentList(shipments)
  }

  private renderShipmentList(list) {
    return list.map((shipment: IDetailedShipment ) => (
      <div className="shipments-page__shipment" key={shipment.id}>
        <Shipment
          data={shipment}
        />
      </div>
    ))
  }

  private getOptionName(optionType: string, option: string, defaultValue: string){
    return chain(this.props.filterOptions)
      .get(optionType, [])
      .find({ 1: option })
      .get(0, defaultValue)
      .value()
  }

  private filterEntryIsChanged([key, value]: any[]): boolean {
    if (!has(initialFilters, key)) return false;
    if (key === 'filters') {
      return value && values(value).some(isNotEmptyList)
    }
    return value !== initialFilters[key];
  }

  private filtersAreChanged(): boolean{
    return entries(this.state).some(this.filterEntryIsChanged, this);
  }

  private async search(stateChanges: any = {}, getData = this.props.getData): Promise<any> {
    const newState = { ...this.state, ...stateChanges };
    if (getData) {
      this.setState({ ...stateChanges, busy: true });
      try {
        await getData({
          pol: newState.filters.pols,
          pod: newState.filters.pods,
          carrier: newState.filters.carriers,
          type: newState.filters.types,
          status: newState.filters.statuses,
          contact: newState.filters.contacts,
          consignee: newState.filters.consignees,
          shipper: newState.filters.shippers,
          notify_party: newState.filters.notify_parties,
          search: newState.search,
          order_by: newState.sortBy,
          arrival_date_start: toUnixDate(newState.arrivalDateStart),
          arrival_date_end: toUnixDate(newState.arrivalDateEnd),
          departure_date_start: toUnixDate(newState.departureDateStart),
          departure_date_end: toUnixDate(newState.departureDateEnd),
        })
      } catch(error) {
        Logger.error(error)
      } finally {
        this.setState({ busy: false })
      }
    } else {
      this.setState(stateChanges);
    }
  }

  @bind
  private async changeSearch(event: any): Promise<any> {
    const searchDelayId = this.state.searchDelayId + 1;

    this.setState({ search: event.currentTarget.value, searchDelayId });

    await delay(SEARCH_REQUEST_DELAY);

    if (this.state.searchDelayId === searchDelayId){
      await this.search({ searchDelayId: 0 })
    }
  }

  @bind
  private async switchShowDelivered(event: any): Promise<any>{
    this.setState({ busy: true });
    // delay is needed so it would show spinner before render
    this.setState((state: IShipmentsState): Pick<IShipmentsState, 'showDelivered'> => ({
      showDelivered: !state.showDelivered,
    }));
    await delay(5);
    this.setState( { busy: false });
  }

  @bind
  private async resetFilters(event: any): Promise<any> {
    await this.search(initialFilters);
  }

  @bind
  private switchShowAllFilters(event: any){
    this.setState((state: IShipmentsState): Pick<IShipmentsState, 'showAllFilters'> => ({
      showAllFilters: !state.showAllFilters,
    }))
  }

  @bind
  private async pickFilterOption(optionId: string, fieldName?: string): Promise<any> {
    if (fieldName && this.state.filters[fieldName]) {
      await this.search({
        filters: {
          ...this.state.filters,
          [fieldName]: xor(this.state.filters[fieldName], [optionId])
        }
      })
    }
  }

  @bind
  private async resetFiltersOfType(filterType: string): Promise<any> {
    await this.search({
      filters: {
        ...this.state.filters,
        [filterType]: [],
      }
    })
  }

  @bind
  private setGroup(value: string){
    this.setState({ groupBy: value })
  }

  @bind
  private async downloadExcel(): Promise<any> {
    const { downloadExcel } = this.props;
    if ( downloadExcel ) {
      try {
        await downloadExcel();
      } catch(error) {
        Logger.error(error)
      }
    }
  }

  @bind
  private async setSorting(value: string): Promise<any> {
    await this.search({ sortBy: value })
  }

  @bind
  private async setArrivalDate(startDate: string, endDate: string): Promise<any> {
    await this.search({
      arrivalDateStart: startDate || null,
      arrivalDateEnd: endDate || null,
    })
  }

  @bind
  private async setDepartureDate(startDate: string, endDate: string): Promise<any> {
    await this.search({
      departureDateStart: startDate || null,
      departureDateEnd: endDate || null,
    })
  }

  @bind
  private async resetArrivalDate(): Promise<any> {
    await this.search({
      arrivalDateStart: null,
      arrivalDateEnd: null,
    })
  }

  @bind
  private async resetDepartureDate(): Promise<any> {
    await this.search({
      departureDateStart: null,
      departureDateEnd: null,
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shipments)