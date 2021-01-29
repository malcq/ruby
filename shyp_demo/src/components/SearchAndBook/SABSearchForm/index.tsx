import React, { PureComponent } from 'react';
import {connect} from "react-redux";
import { Dispatch } from "redux";
import moment from 'moment';
import uuidv4 from  'uuid/v4';
import { Link } from 'react-router-dom'

import { searchQuotes, searchQuotesReset } from "../../../stores/actionCreators";
import {
  SABSearchFormLocation,
  SABSearchFormCariage,
  SABSearchFormDate,
  SABSearchFormServices,
  SABSearchFormLCL,
  Counter,
  SABSearchFormCariageMultiply
} from '../../'
import Button from "../../Button/index";
import './styles.scss';

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: (param) => {dispatch(searchQuotes(param))},
  reset: () => {dispatch(searchQuotesReset())},
});

class SABSearchForm extends PureComponent<any, any> {
  public constructor(props) {
    super(props)

    let date = moment();
    if(date.format('d') === '6') {date.add(2, 'days')}
    if(date.format('d') === '0') {date.add(1, 'days')}
    switch(this.props.type) {
      case 'lcl':
        if(moment().format('d') === '5') {
          date = date.add(12, "days");
        }else{
          date = date.add(10, "days")
        }
        break;
      case 'air':
        if(moment().format('d') !== '1') {
          date = date.add(6, "days");
        }else{
          date = date.add(4, "days")
        }
        break;
      default:
        date = date.add(8, "days");
        break;
    }
    if(date.format('d') === '6' || date.format('d') === '1') {date.add(2,"days")}
    this.state = {
      selectedType: 'container20ft',
      selectedCount: 1,
      selectedCountError: '',
      count20ft: 0,
      count40ft: 0,
      count40fthq: 0,
      origin: {
        value: '',
        lat: 0,
        lng: 0,
        incl_nearby: false,
        country: '',
        zip: '',
        error: false,
      },
      destination: {
        value: '',
        lat: 0,
        lng: 0,
        incl_nearby: false,
        country: '',
        zip: '',
        error: false,
      },
      lcl: [{
        id: uuidv4(),
        length: 100,
        lengthError: '',
        width: 100,
        widthError: '',
        height: 100,
        heightError: '',
        volume: 1,
        weight: 500,
        weightError: '',
        total: 1,
        totalError: '',
      }],
      departure_date: date,
      services: {
        pre_carriage: false,
        origin_port_charges: false,
        export_custom_formalities: false,
        seafreight_requested: true,
        import_custom_formalities: false,
        destination_port_charges: false,
        on_carriage: false,
        insurance: false,
      },
      cif_value: 5000,
    };
  }
  public componentWillReceiveProps(nextProps) {
    if(nextProps.force && !this.props.force) {
      this.setStateFromUrl();
      this.props.setForceUpdate(false);
    }
  }
  public setUrlFromState = () => {
    let params = '';
    if (this.state.origin && this.state.origin.value && !(this.state.origin.value === 'Please set an origin' || this.state.origin.value === 'Address not found')) {
      params += 'start='+this.state.origin.value+'&';
      params += 'start_lat='+this.state.origin.lat+'&';
      params += 'start_lng='+this.state.origin.lng+'&';
      if (this.state.origin.zip) {params += 'start_zip='+this.state.origin.zip+'&';}
      if (this.state.origin.country) {params += 'start_country='+this.state.origin.country+'&';}
      if (this.state.origin.incl_nearby) {params += 'start_include_nearby='+this.state.origin.incl_nearby+'&';}
    }
    if (this.state.destination && this.state.destination.value && !(this.state.destination.value === 'Please set an origin' || this.state.destination.value === 'Address not found')) {
      params += 'end='+this.state.destination.value+'&';
      params += 'end_lat='+this.state.destination.lat+'&';
      params += 'end_lng='+this.state.destination.lng+'&';
      if (this.state.destination.zip) {params += 'end_zip='+this.state.destination.zip+'&';}
      if (this.state.destination.country) {params += 'end_country='+this.state.destination.country+'&';}
      if (this.state.destination.incl_nearby) {params += 'end_include_nearby='+this.state.destination.incl_nearby+'&';}
    }
    let date = moment();
    if(date.format('d') === '6') {date.add(2, 'days')}
    if(date.format('d') === '0') {date.add(1, 'days')}
    switch (this.state.selectedType) {
      case 'multiple':
        date = date.add(8, "days");
        params += 'selected_container_type=20&';
        params += 'quantity=1&';
        break;
      case 'container20ft':
        date = date.add(8, "days");
        params += 'selected_container_type=20&';
        params += 'quantity='+this.state.selectedCount+'&';
        break;
      case 'container40ft':
        date = date.add(8, "days");
        params += 'selected_container_type=40&';
        params += 'quantity='+this.state.selectedCount+'&';
        break;
      case 'container40fthq':
        date = date.add(8, "days");
        params += 'selected_container_type=40hq&';
        params += 'quantity='+this.state.selectedCount+'&';
        break;
      case 'lcl':
        if(moment().format('d') === '5') {
          date = date.add(12, "days");
        }else{
          date = date.add(10, "days")
        }
        params += 'selected_container_type=lcl&';
        params += this.state.lcl.map(item => ('heights[]='+item.height+'&')).join('');
        params += this.state.lcl.map(item => ('lengths[]='+item.length+'&')).join('');
        params += this.state.lcl.map(item => ('widths[]='+item.width+'&')).join('');
        params += this.state.lcl.map(item => ('weights[]='+item.weight+'&')).join('');
        params += this.state.lcl.map(item => ('quantities[]='+item.total+'&')).join('');
        break;
      case 'air':
        if(moment().format('d') !== '1') {
          date = date.add(6, "days");
        }else{
          date = date.add(4, "days")
        }
        params += 'selected_container_type=air&';
        params += this.state.lcl.map(item => ('heights[]='+item.height+'&')).join('');
        params += this.state.lcl.map(item => ('lengths[]='+item.length+'&')).join('');
        params += this.state.lcl.map(item => ('widths[]='+item.width+'&')).join('');
        params += this.state.lcl.map(item => ('weights[]='+item.weight+'&')).join('');
        params += this.state.lcl.map(item => ('quantities[]='+item.total+'&')).join('');
        break;
    }
    if(date.format('d') === '6' || date.format('d') === '1') {date.add(2,"days")}
    const passedDate = moment(this.state.departure_date,'DD-MM-YYYY')
    params += 'departure_date=' + (passedDate.isBefore(date,'day') ? date.format('DD-MM-YYYY') : passedDate.format('DD-MM-YYYY')) + '&';
    if (this.state.services.pre_carriage ) {params += 'pre_carriage=1&';}
    if (this.state.services.origin_port_charges ) {params += 'origin_port_charges=1&';}
    if (this.state.services.export_custom_formalities ) {params += 'export_custom_formalities=1&';}
    params += 'seafreight_requested=1&';
    if (this.state.services.import_custom_formalities ) {params += 'import_custom_formalities=1&';}
    if (this.state.services.destination_port_charges ) {params += 'destination_port_charges=1&';}
    if (this.state.services.on_carriage ) {params += 'on_carriage=1&';}
    if (this.state.services.insurance ) {
      params += 'insurance=1&';
      params += 'cif_value='+this.state.cif_value
    }
    return params
  };
  public setStateFromUrl = () => {
    const search = window.location.search.slice(1);
    if (search) {
      const param = search.split('&');
      const obj : any = {};
      param.forEach(i => {
        if (i === "") {
          return;
        }
        const a = i.split('=');
        a[0] = a[0].replace(/(%5B)/g, "[");
        a[0] = a[0].replace(/(%5D)/g, "]");
        if(a[1]) {
          a[1] = a[1].replace(/(%20)/g, " ");
        }
        if (a[0].match(/(.*)\[\]/)) {
          const name = a[0].replace(/(.*)\[\]/, '$1')
          if (!obj[name]) {
            obj[name] = [];
          }
          obj[name].push(parseInt(a[1], 10))
        } else {
          obj[a[0]] = a[1];
        }
      });
      const newState : any = {};
      newState.origin = {};
      newState.origin.value = obj.start || '';
      newState.origin.lat = obj.start_lat || 0;
      newState.origin.lng = obj.start_lng || 0;
      newState.origin.incl_nearby = obj.start_include_nearby || false;
      newState.origin.country = obj.start_country || '';
      newState.origin.zip = obj.start_zip || '';
      newState.destination = {};
      newState.destination.value = obj.end || '';
      newState.destination.lat = obj.end_lat || 0;
      newState.destination.lng = obj.end_lng || 0;
      newState.destination.incl_nearby = obj.end_include_nearby || false;
      newState.destination.country = obj.end_country || '';
      newState.destination.zip = obj.end_zip || '';
      newState.services = {};
      newState.services.pre_carriage = !!obj.pre_carriage;
      newState.services.origin_port_charges = !!obj.origin_port_charges;
      newState.services.export_custom_formalities = !!obj.export_custom_formalities;
      newState.services.seafreight_requested = true;
      newState.services.import_custom_formalities = !!obj.import_custom_formalities;
      newState.services.destination_port_charges = !!obj.destination_port_charges;
      newState.services.on_carriage = !!obj.on_carriage;
      newState.services.insurance = !!obj.insurance;
      newState.cif_value = obj.cif_value || 5000;
      let date = moment();
      if(date.format('d') === '6') {date.add(2, 'days')}
      if(date.format('d') === '0') {date.add(1, 'days')}
      switch (obj.selected_container_type) {
        case '20':
          date = date.add(8, "days")
          newState.selectedType = 'container20ft';
          newState.selectedCount = parseInt(obj.quantity, 10) || 0;
          break;
        case '40':
          date = date.add(8, "days")
          newState.selectedType = 'container40ft';
          newState.selectedCount = parseInt(obj.quantity, 10) || 0;
          break;
        case '40hq':
          date = date.add(8, "days")
          newState.selectedType = 'container40fthq';
          newState.selectedCount = parseInt(obj.quantity, 10) || 0;
          break;
        case 'lcl':
          if(moment().format('d') === '5') {
            date = date.add(12, "days");
          }else{
            date = date.add(10, "days")
          }
          newState.selectedType = 'lcl';
          const lcl: any = [];
          for (let i = 0; i < obj.lengths.length; i++) {
            lcl.push({
              id: uuidv4(),
              length: obj.lengths[i],
              width: obj.widths[i],
              height: obj.heights[i],
              volume: obj.lengths[i] * obj.widths[i] * obj.heights[i] / 1000000,
              weight: obj.weights[i],
              total: obj.quantities[i],
            })
          }
          newState.lcl = lcl || [];
          break;
        case 'air':
          if(moment().format('d') !== '1') {
            date = date.add(6, "days");
          }else{
            date = date.add(4, "days")
          }
          newState.selectedType = 'air';
          const lcl2: any = [];
          for (let i = 0; i < obj.lengths.length; i++) {
            lcl2.push({
              id: uuidv4(),
              length: obj.lengths[i],
              width: obj.widths[i],
              height: obj.heights[i],
              volume: obj.lengths[i] * obj.widths[i] * obj.heights[i] / 1000000,
              weight: obj.weights[i],
              total: obj.quantities[i],
            })
          }
          newState.lcl = lcl2 || [];
          break;
      }
      if(date.format('d') === '6' || date.format('d') === '0') {date.add(2,"days")}
      const passedDate = moment(obj.departure_date,'DD-MM-YYYY')
      newState.departure_date = passedDate.isBefore(date,'day') ? date : passedDate;
      if(newState.departure_date.format() === "Invalid date") {
        newState.departure_date = date
      }
      newState.query = search;
      this.setState(prevState => ({...prevState, ...newState}),()=>{
        this.props.setQuery(this.state)
        if(this.checkValidation()) {
          this.props.submit(newState);
        }
      });
    }
    this.props.reset()
  };

  public componentDidMount = () => {
    this.setStateFromUrl();
  };

  public changeCount = event => {
    const { name, value } = event.target;
    if (value.match(/^[0-9]*$/)) {
      this.setState({[name]: parseInt(value,10)})
    }
  };

  public changeState = (name, value, upstate?) => {
    if (upstate) {
      this.setState({[upstate]: {...this.state[upstate], [name]: value}})
    } else {
      this.setState({[name]: value})
    }
  };
  public switchLocation = () => {
    this.setState((prevState) => ({
      origin: prevState.destination,
      destination: prevState.origin,
    }))
  };
  public render () {
    return (
      <div>
        <div className="search_form__main">
          { (this.state.selectedType !== 'lcl' && this.state.selectedType !== 'air' && this.state.selectedType !== 'multiple') ? (
            <div className="search-form-media-styler"/>) : (
            <div className="search-form-media-styler-lcl"/>) }
          <SABSearchFormLocation
            title="Origin"
            value={this.state.origin.value}
            changeState={this.changeState}
            type="origin"
            incl_nearby={this.state.origin.incl_nearby}
            class="bln"
            error={this.state.origin.error}
          />
          <SABSearchFormLocation
            switch={this.switchLocation}
            title="Destination"
            value={this.state.destination.value}
            changeState={this.changeState}
            type="destination"
            incl_nearby={this.state.destination.incl_nearby}
            error={this.state.destination.error}
          />
          <SABSearchFormCariage type={this.state.selectedType} changeState={this.changeState} />
          { (this.state.selectedType !== 'lcl' && this.state.selectedType !== 'air' && this.state.selectedType !== 'multiple') && (
            <div className="search-form__cariage-count">
              <label htmlFor="selectedCount">Containers</label>
              <Counter
                totalError={this.state.selectedCountError}
                value={this.state.selectedCount}
                inc={this.increment}
                dec={this.decrement}
                change={this.changeCount}
                name="selectedCount"
              />
            </div>
          )}
          <div className="search-form__date-n-btn">
            <SABSearchFormDate date={this.state.departure_date} changeState={this.changeState} type={this.state.selectedType} />
            <div className="search-form__search">
              <Link to={`/search?${this.setUrlFromState()}`}>
                <Button color="light-blue"
                  className="search__button"
                  onClick={this.submitForm}
                >
                  Find best routes
                </Button>
              </Link>
            </div>
          </div>
        </div>
        { this.state.selectedType === 'multiple' && <SABSearchFormCariageMultiply /> }
        { (this.state.selectedType === 'lcl' || this.state.selectedType === 'air') && <SABSearchFormLCL lcl={this.state.lcl} changeState={this.changeState} />}
        <SABSearchFormServices type={this.state.selectedType} changeState={this.changeState} services={this.state.services} cif_value={this.state.cif_value}/>
      </div>
    );
  }
  private submitForm = () => {
    if(this.checkValidation()) {
      this.props.setQuery({...this.state, query: this.setUrlFromState()});
      this.props.submit(this.state)
    }
  };
  private checkValidation = () => {
    let error = false;
    let originError = '';
    if(this.state.origin.lat == 0 && this.state.origin.lng == 0 || this.state.origin.value === 'Address not found') {
      error = true;
      originError = 'Address not found'
    }
    if(this.state.origin.value === '' || this.state.origin.value === 'Please set an origin') {
      error = true;
      originError = 'Please set an origin'
    }
    this.setState(state=>({origin: {...state.origin, error: originError}}));
    let destinationError = '';
    if(this.state.destination.lat == 0 && this.state.destination.lng == 0 || this.state.destination.value === 'Address not found') {
      error = true;
      destinationError = 'Address not found'
    }
    if(this.state.destination.value === '' || this.state.destination.value === 'Please set an destination') {
      error = true;
      destinationError = 'Please set a destination'
    }
    this.setState(state=>({destination: {...state.destination, error: destinationError}}));
    if(this.state.selectedType === 'lcl' || this.state.selectedType === 'air') {
      this.state.lcl.some(item => {
        let lengthError = '';
        if(item.length % 1 !== 0) {lengthError = `Please select a valid value. The two nearest valid values are ${Math.floor(item.length)} and ${Math.ceil(item.length)}.`}
        if(item.length < 1) {lengthError = 'Please select a value that is no less than 1.'}
        if(item.length > 1000) {lengthError = 'Please select a value that is not more than 1000.'}

        let widthError = '';
        if(item.width % 1 !== 0) {widthError = `Please select a valid value. The two nearest valid values are ${Math.floor(item.width)} and ${Math.ceil(item.width)}.`}
        if(item.width < 1) {widthError = 'Please select a value that is no less than 1.'}
        if(item.width > 500) {widthError = 'Please select a value that is not more than 500.'}

        let heightError = '';
        if(item.height % 1 !== 0) {heightError = `Please select a valid value. The two nearest valid values are ${Math.floor(item.height)} and ${Math.ceil(item.height)}.`}
        if(item.height < 1) {heightError = 'Please select a value that is no less than 1.'}
        if(item.height > 240) {heightError = 'Please select a value that is not more than 240.'}

        let weightError = '';
        if(item.weight % 1 !== 0) {weightError = `Please select a valid value. The two nearest valid values are ${Math.floor(item.weight)} and ${Math.ceil(item.weight)}.`}
        if(item.weight < 1) {weightError = 'Please select a value that is no less than 1.'}

        let totalError = '';
        if(item.total % 1 !== 0) {totalError = `Please select a valid value. The two nearest valid values are ${Math.floor(item.total)} and ${Math.ceil(item.total)}.`}
        if(item.total < 1) {totalError = 'Please select a value that is no less than 1.'}

        this.changeState('lcl',
          [
            ...this.state.lcl.map(stateitem => {
              if(stateitem.id === item.id) {
                stateitem.lengthError = lengthError;
                stateitem.widthError = widthError;
                stateitem.heightError = heightError;
                stateitem.weightError = weightError;
                stateitem.totalError = totalError;
              }
              return stateitem;
            })
          ]);
        error = !!(lengthError || widthError || heightError || weightError || totalError)
      });
    }else{
      let selectedCountError = '';
      if (this.state.selectedCount % 1 !== 0) {selectedCountError = `Please select a valid value. The two nearest valid values are ${Math.floor(this.state.selectedCount)} and ${Math.ceil(this.state.selectedCount)}.`}
      if (this.state.selectedCount < 1) {selectedCountError = 'Please select a value that is no less than 1.'}
      this.setState({selectedCountError});
      if(selectedCountError) {
        error = true;
      }
    }

    return !error;
  };

  private increment = event => {
    const name = event.target.name;
    this.setState((state) => ({[name]: state[name] + 1}))
  };

  private decrement = event => {
    const name = event.target.name;
    if (this.state[name] > 0) {
      this.setState((state) => ({[name]: state[name] - 1}))
    }
  };
}

export default connect<any,any,any>(null, mapDispatchToProps)(SABSearchForm);
