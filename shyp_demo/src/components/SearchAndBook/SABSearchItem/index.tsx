import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import getClassName from '../../../utils/styling';
import DateBlock from './components/DateBlock';
import SABSearchItemExpanded from '../SABSearchItemExpanded';
import moment from "moment";
import Button from "../../Button/index";
import {baseURL} from "../../../config/local.json";
import './styles.scss';

const sortOrder = {
  "Pre carriage": 1,
  "Origin port": 2,
  "Export declaration": 3,
  "Ocean freight": 4,
  "Air freight": 4,
  "Import declaration": 5,
  "Destination port": 6,
  "On Carriage": 7
};

class SABSearchItem extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  };

  public toggleCard = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };

  public componentWillReceiveProps(props, state) {
    this.setState({isOpen: false})
  }

  public render() {
    let query = this.props.query.query;
    if (query === undefined) { query ='' }
    if (query && query.slice(-1) !== '&') { query += '&' }
    query = query.replace(/(%5B)/g, "[");
    query = query.replace(/(%5D)/g, "]");
    if(query && query.match(/departure_date=([0-9]*)&/)) {
      query.replace(/departure_date=([0-9]*)&/, `departure_date=${this.props.query.departure_date.format('DD-MM-YYYY')}&`);
    }
    if(this.props.shipment_details.id) {query += 'route_id=' + this.props.shipment_details.id + '&'}
    if(this.props.shipment_details.shipment_type) {query += 'shipment_type=' + this.props.shipment_details.shipment_type + '&'}
    if(this.props.shipment_details.is_fastest) {query += 'is_fastest=' + this.props.shipment_details.is_fastest + '&'}
    if(this.props.shipment_details.is_cheapest) {query += 'is_cheapest=' + this.props.shipment_details.is_cheapest + '&'}
    if(this.props.shipment_details.predicted_sailing) {query += 'predicted_sailing=' + this.props.shipment_details.predicted_sailing + '&'}
    if(this.props.shipment_details.carrier) {query += 'carrier=' + this.props.shipment_details.carrier + '&'}
    const sortedPricesName = this.props.price_details.price_structure.sort((x, y) => sortOrder[x.service_name] - sortOrder[y.service_name]);
    let allPriceKnown = true;
    sortedPricesName.forEach(item => {if(item.price_items[0].price_eur === 'On Request') {allPriceKnown = false}});
    let requestText;
    if(moment(this.props.price_details.valid_to,'YYYY-MM-DD').isBefore(moment(this.props.shipment_details.estimated_departure,'YYYY-MM-DD'))) {
      requestText = (<>These rates are a first indication.<br/>Request a quote for the final price.</>)
    }
    if(!allPriceKnown) {
      requestText = (<>This rate includes all known costs.<br/>Request a quote for the full rate.</>)
    }
    return (
      <div className={getClassName('SABSearchItem', {
        'SABSearchItem--open': this.state.isOpen,
      })}
      >
        <div className="card-info">
          <div className="card-info__left-block">
            {!this.state.isOpen && <DateBlock className="left-block__departure-date"
                       port={this.props.shipment_details.loading_port_code}
                       country={this.props.shipment_details.loading_port_country}
                       date={this.props.shipment_details.estimated_departure}
                       distance={this.props.shipment_details.distance_to_loading_port}
            />}
            {!this.state.isOpen && <div className="slider-container">
              <span className="icon startandend">
                <span className="icon container"/>
              </span>
              <div className={getClassName("slider-container__line",{
                "slider-container__line--chrome": navigator.userAgent.indexOf('Chrome') > -1}
                )}
              />
              <span className="icon daysintransit">
                <span className="days-in-freight">
                   {this.props.shipment_details.estimated_transit_time}
                </span>
              </span>
              <div className="slider-container__line"/>
              <span className={getClassName("icon startandend hrevert",{
                "hrevert--chrome": navigator.userAgent.indexOf('Chrome') > -1}
              )}>
                <span className="icon container "/>
              </span>
            </div>}
            {!this.state.isOpen && <DateBlock className="left-block__departure-date"
                       country={this.props.shipment_details.discharge_port_country}
                       port={this.props.shipment_details.discharge_port_code}
                       date={this.props.shipment_details.estimated_arrival}
                       distance={this.props.shipment_details.distance_to_discharge_port}
            />}
            {this.state.isOpen && <SABSearchItemExpanded fullSize={false}
                                   allPriceKnown={this.props.shipment_details.allPriceKnown}
                                   loadingPort={this.props.shipment_details.loading_port_code}
                                   loadingCountry={this.props.shipment_details.loading_port_country}
                                   loadingDate={this.props.shipment_details.estimated_departure}
                                   dischargeCountry={this.props.shipment_details.discharge_port_country}
                                   dischargePort={this.props.shipment_details.discharge_port_code}
                                   dischargeData={this.props.shipment_details.estimated_arrival}
                                   days_in_freight={this.props.shipment_details.estimated_transit_time}
                                   onCarriageAddress={this.props.shipment_details.on_carriage_address}
                                   preCarriageAddress={this.props.shipment_details.pre_carriage_address}
                                   is_cheapest={this.props.shipment_details.is_cheapest}
                                   is_fastest={this.props.shipment_details.is_fastest}
                                   predicted_sailing={this.props.shipment_details.predicted_sailing}
                                   distance_to_loading_port={this.props.shipment_details.distance_to_loading_port}
                                   distance_to_discharge_port={this.props.shipment_details.distance_to_discharge_port}
                                   services={this.props.price_details.requested_services || []}
            />}
          </div>
          <div className={getClassName('card-info__right-block', {
            'card-info__right-block--open': this.state.isOpen,
          })}>
            {!this.state.isOpen && <div className="corporation-container">
              {!this.props.isStaff && (
                <div className="corporation-container__name">
                  {this.props.shipment_details.carrier}
                </div>
              )}
              {this.props.isStaff && (
                <React.Fragment>
                  {this.props.shipment_details.carrier_id && (<div className="corporation-container__name">
                    Carrier: <a href={baseURL+"/admin/carriers/"+this.props.shipment_details.carrier_id}>{this.props.shipment_details.carrier}</a>
                  </div>)}
                  {this.props.shipment_details.supplier_id && (<div className="corporation-container__name">
                    Supplier: <a href={baseURL+"/admin/suppliers/"+this.props.shipment_details.supplier_id}>{this.props.shipment_details.supplier_name}</a>
                  </div>)}
                  {this.props.shipment_details.id && (<div className="corporation-container__name">
                    Route: <a href={baseURL+"/admin/routes/"+this.props.shipment_details.id}>#{this.props.shipment_details.id}</a>
                  </div>)}
                  {this.props.shipment_details.tariff_file_id && (<div className="corporation-container__name">
                    Tariff file: <a href={baseURL+"/admin/tariff_files/"+this.props.shipment_details.tariff_file_id}>{this.props.shipment_details.tariff_file_name}</a>
                  </div>)}
                </React.Fragment>
              )}

              <div className="corporation-container__button-container">
                {this.props.shipment_details.is_cheapest && (
                  <div className='corporation-container__button corporation-container__button--orange'>
                    Cheapest
                  </div>
                )}
                {this.props.shipment_details.is_fastest && (
                  <div className='corporation-container__button'>
                    Fastest
                  </div>
                )}
                {this.props.shipment_details.predicted_sailing && (
                  <div className='corporation-container__button corporation-container__button--disabled '>
                    By predicted schedule
                  </div>
                )}
              </div>
            </div>}
            {!this.state.isOpen && <div className="info-right-block">
              <div className="info-right-block__price-container">
                <div className="price-container__left-block">
                  <div className="left-block__first-row">
                    Ocean freight
                  </div>
                  <div className="left-block__second-row">
                    Total ({allPriceKnown ? 'Incl selected services' : 'excl pending requests'})
                  </div>
                </div>
                <div className="price-container__right-block">
                  <div className="right-block__first-row dollar-sign">
                    {sortedPricesName.filter(item => item.service_name === "Ocean freight")[0]
                      .price_items.map( el => parseFloat(el.unit_price)*parseFloat(el.quantity) )
                      .reduce((accumulator, currentValue) => accumulator + currentValue)
                      .toFixed(2)
                    }
                  </div>
                  <div className="right-block__second-row euro-sign">
                    {this.props.price_details.total_price_eur}
                  </div>
                </div>
              </div>
              <div className="info-right-block__button-container">
                <Link to={'search/quote?'+query}>
                  <Button color={allPriceKnown && !this.props.estimated_costs ? 'green' : 'green-border'} className="linked">
                    {allPriceKnown && !this.props.estimated_costs ? 'Proceed to booking' : 'Request quote'}
                  </Button>
                </Link>
              </div>

            </div>}
            {this.state.isOpen && <div className="expanded-card-info-container__right-part">
              <div className="right-part__title-row">
                <div className="right-part__company-name">
                  {this.props.shipment_details.carrier}
                </div>
                <div className="right-part__price-and-type">
                  <div className="price-and-type__type">
                    Ocean freight
                  </div>
                  <div  className="price-and-type__price dollar-sign">
                    {sortedPricesName.filter(item => item.service_name === "Ocean freight")[0]
                      .price_items.map( el => parseFloat(el.unit_price)*parseFloat(el.quantity) )
                      .reduce((accumulator, currentValue) => accumulator + currentValue)
                      .toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="right-part__price-calculating-row">
                <div className="price-calculating-row__left-part">
                  {sortedPricesName.map((item, index) => (
                    <div key={index} className="left-part__text">
                      {item.service_name}
                    </div>
                  ))}
                </div>
                <div className="price-calculating-row__right-part">
                  {sortedPricesName.map((item,index) => {
                    const subtotal = item.price_items.map( el => parseFloat(el.unit_price)*parseFloat(el.quantity) ).reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2);
                    return (
                      <div key={index} className={getClassName("right-part__value ",
                        {
                          'dollar-sign': item.price_items[0].unit_price_currency === 'USD',
                          'euro-sign': item.price_items[0].unit_price_currency === 'EUR',
                        })}
                      >
                        { subtotal === "NaN" ? "On Request" : subtotal}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="right-part__result">
                <div className="result__text">
                  {allPriceKnown ? 'Total (Excl. VAT)' : 'Total (Excl. VAT & pending requests)'}
                </div>
                <div className="result__text">
                  € {this.props.price_details.total_price_eur}
                </div>
              </div>
            </div>}
          </div>
          </div>
          <div className={getClassName('card-footer', {
            'card-footer--open': this.state.isOpen,
          })}
            onClick={this.toggleCard}
          >
            <div className="card-footer__edge-content-container card-footer__edge-content-container--first"/>
          <div className="card-footer__button-container">
              {!this.state.isOpen && <span className="icon info"/>}
            {this.state.isOpen ? 'Close ' : 'Shipping '}details
              <span className="button-container__chevron-container">
                <span className={getClassName('icon chevron', {
              'chevron--reverted': this.state.isOpen
              })}/></span>
            </div>
            <div className="card-footer__edge-content-container">
              {this.state.isOpen &&<div className={getClassName('edge-content-container__text-container', {'edge-content-container__text-container--price-known': allPriceKnown  && !this.props.estimated_costs})}>
                {allPriceKnown && !this.props.estimated_costs ?
                  'Latest ETD for this rate:' :
                  requestText
                }
                {allPriceKnown && !this.props.estimated_costs && <span className="edge-content-container__text-container--bold">
                  <b>{this.props.price_details.valid_to &&
                    moment(this.props.price_details.valid_to, 'YYYY-MM-DD').format('DD MMM')
                    || moment(this.props.shipment_details.estimated_departure).format('DD MMM')}
                  </b>
                </span>}
              </div>}
            </div>
          </div>
        {this.state.isOpen &&<div className="edge-content-container__button-container">
          <Link to={'search/quote?'+query}>
            <Button color={allPriceKnown && !this.props.estimated_costs ? 'green' : 'green-border'} className="edge-content-container__button linked">
              {allPriceKnown && !this.props.estimated_costs ? 'Proceed to booking' : 'Request quote'}
            </Button>
          </Link>
        </div>}
      </div>
    );
  }
}

export default SABSearchItem;
