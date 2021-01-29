import 'flag-icon-css/css/flag-icon.css';

import { Link } from "react-router-dom";
import * as React from 'react';
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {searchQuotes} from "../../../../stores/actionCreators/searches";
import moment from "moment";

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: (param) => {dispatch(searchQuotes(param))},
});

class Row extends React.Component<any, any> {
  public setUrl = () => {
    let params = '';
    if (this.props.item.origin) {
      params += 'start=' + this.props.item.origin + '&';
      params += 'start_lat=' + this.props.item.start_lat + '&';
      params += 'start_lng=' + this.props.item.start_lng + '&';
      if (this.props.item.start_include_nearby) {params += 'start_include_nearby='+this.props.item.start_include_nearby+'&';}
      if (this.props.item.start_zip) {
        params += 'start_zip=' + this.props.item.start_zip + '&';
      }
      if (this.props.item.start_country) {
        params += 'start_country=' + this.props.item.start_country + '&';
      }
    }
    if (this.props.item.destination) {
      params += 'end=' + this.props.item.destination + '&';
      params += 'end_lat=' + this.props.item.end_lat + '&';
      params += 'end_lng=' + this.props.item.end_lng + '&';
      if (this.props.item.end_include_nearby) {params += 'end_include_nearby='+this.props.item.end_include_nearby+'&';}
      if (this.props.item.end_zip) {
        params += 'end_zip=' + this.props.item.end_zip + '&';
      }
      if (this.props.item.end_country) {
        params += 'end_country=' + this.props.item.end_country + '&';
      }
    }

    let date = moment();
    if(date.format('d') === '6') {date.add(2, 'days')}
    if(date.format('d') === '0') {date.add(1, 'days')}
    switch (this.props.item.container_type) {
      case '20 ft':
        params += 'selected_container_type=20&';
        params += 'quantity=' + this.props.item.shipments_quantity + '&';
        date = date.add(8, "days");
        break;
      case '40 ft':
        params += 'selected_container_type=40&';
        params += 'quantity=' + this.props.item.shipments_quantity + '&';
        date = date.add(8, "days");
        break;
      case '40ft HQ':
        params += 'selected_container_type=40hq&';
        params += 'quantity=' + this.props.item.shipments_quantity + '&';
        date = date.add(8, "days");
        break;
      case 'LCL':
        params += 'selected_container_type=lcl&';
        params += this.props.item.heights.map(item => ('heights[]=' + item + '&')).join('');
        params += this.props.item.lengths.map(item => ('lengths[]=' + item + '&')).join('');
        params += this.props.item.widths.map(item => ('widths[]=' + item + '&')).join('');
        params += this.props.item.weights.map(item => ('weights[]=' + item + '&')).join('');
        params += this.props.item.heights.map(item => ('quantities[]=1&')).join('');
        if(moment().format('d') === '5') {
          date = date.add(12, "days");
        }else{
          date = date.add(10, "days")
        }
        break;
      case 'AIR':
        params += 'selected_container_type=air&';
        params += this.props.item.heights.map(item => ('heights[]=' + item + '&')).join('');
        params += this.props.item.lengths.map(item => ('lengths[]=' + item + '&')).join('');
        params += this.props.item.widths.map(item => ('widths[]=' + item + '&')).join('');
        params += this.props.item.weights.map(item => ('weights[]=' + item + '&')).join('');
        params += this.props.item.heights.map(item => ('quantities[]=1&')).join('');
        if(moment().format('d') !== '1') {
          date = date.add(6, "days");
        }else{
          date = date.add(4, "days")
        }
        break;
    }
    if (date.format('d') === '6' || date.format('d') === '0') {
      date.add(2, "days")
    }
    if (this.props.item.departure_date) {
      const passedDate = moment(this.props.item.departure_date, 'DD-MM-YYYY')
      params += 'departure_date=' + (passedDate.isBefore(date, 'day') ? date.format('DD-MM-YYYY') : passedDate.format('DD-MM-YYYY')) + '&';
    }else{
      params += 'departure_date=' + date.format('DD-MM-YYYY') + '&';
    }
    if (this.props.item.pre_carriage) {
      params += 'pre_carriage=1&';
    }
    if (this.props.item.origin_port_charges) {
      params += 'origin_port_charges=1&';
    }
    if (this.props.item.export_custom_formalities) {
      params += 'export_custom_formalities=1&';
    }
    if (this.props.item.seafreight_requested) {
      params += 'seafreight_requested=1&';
    }
    if (this.props.item.import_custom_formalities) {
      params += 'import_custom_formalities=1&';
    }
    if (this.props.item.destination_port_charges) {
      params += 'destination_port_charges=1&';
    }
    if (this.props.item.on_carriage) {
      params += 'on_carriage=1&';
    }
    if (this.props.item.insurance) {
      params += 'insurance=1&';
    }
    return params;
  };
  public render() {
    let icon = '';
    switch (this.props.item.container_type) {
      case '20 ft':
        icon = 'container20ft';
        break;
      case '40 ft':
        icon = 'container40ft';
        break;
      case '40ft HQ':
        icon = 'container40fthq';
        break;
      case 'lcl':
      case 'LCL':
        icon = 'lcl';
        break;
      case 'air':
      case 'AIR':
        icon = 'air';
        break;
    }
    return (
      <Link to={`/search?${this.setUrl()}`}>
        <div className="search-previous__row" onClick={() => this.props.setForceUpdate(true)}>
          <div className="search-previous__location">
            Origin
            <div>
              <span className="search-previous__location-name">
                {this.props.item.origin}
              </span>              &nbsp;
              <span className={`flag-icon flag-icon-${this.props.item.start_country && this.props.item.start_country.toLowerCase()}`}/>
            </div>
          </div>
          <div className="icon chevron"/>
          <div className="search-previous__location">
            Destination
            <div>
            <span className="search-previous__location-name">
              {this.props.item.destination}
            </span>
              <span className={`flag-icon flag-icon-${this.props.item.end_country && this.props.item.end_country.toLowerCase()}`}/>
            </div>
          </div>
          <div className="search-previous__empty"/>
          <div className="search-previous__carriage">
            <span className={`icon ${icon}`}/>
            {this.props.item.container_type}
            <div>
              {this.props.item.shipments_quantity}x
            </div>
          </div>
        </div>
      </Link>
    );
  };
}

export default connect<any,any,any>(null, mapDispatchToProps)(Row);