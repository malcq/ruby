import React, { PureComponent } from 'react';
import './styles.scss';
import { FormGroup } from '@material-ui/core';
import Autocomplete from 'react-google-autocomplete';

class GoogleInput extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      value: props.value,
    }
  }
  public componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value})
  }
  public onChange = event => {
    this.props.changeState(this.props.type, {
      incl_nearby: this.props.incl_nearby,
      value: event.target.value,
      lat: 0,
      lng: 0,
      country: '',
      zip: '',
      error: false
    })
  };
  public render () {
    return (
      <FormGroup>
        <label htmlFor={this.props.name}>{this.props.name}</label>
        <Autocomplete
          autoFocus={this.props.name === "Origin"}
          onPlaceSelected={(place) => {
            const address = place.address_components;
            if(address) {
              let zip = '';
              let country = '';
              address.forEach(item => {
                if (item.types.includes('country')) {
                  country = item.short_name
                }
                if (item.types.includes('postal_code')) {
                  zip = item.short_name
                }
              });
              this.props.changeState(this.props.type, {
                incl_nearby: this.props.incl_nearby,
                value: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                country: country,
                zip: zip,
                error: false
              })
            }else{
              this.props.changeState(this.props.type, {
                incl_nearby: this.props.incl_nearby,
                value: place.name,
                lat: 0,
                lng: 0,
                country: '',
                zip: '',
                error: false
              })
            }
          }}
          id={this.state.name}
          name={this.state.name}
          className={"google-input " + this.props.className}
          types={['geocode', 'establishment']}
          placeholder={this.props.error ? this.props.error : "Port, address, place"}
          language={'en'}
          value={this.state.value}
          onChange={this.onChange}
        />
      </FormGroup>
    );
  }
}

export default GoogleInput;
