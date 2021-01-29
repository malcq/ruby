import React, { PureComponent } from 'react';
import { FormGroup } from '@material-ui/core';
import DatePicker from 'react-datepicker';
import './styles.scss';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import CustomInput from './CustomInput'

class SABSearchFormDate extends PureComponent<any, any> {
  public handleChange = (date) => {
    this.props.changeState('departure_date', date)
  };
  public componentDidUpdate(nextProps) {
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
    if(date.format('d') === '6' || date.format('d') === '0') {date.add(2,"days")}
    if(nextProps.date.isBefore(date, 'day')) {
      this.props.changeState('departure_date', date)
    }
  }
  public render () {
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
    if(date.format('d') === '6' || date.format('d') === '0') {date.add(2,"days")}
    return (
      <div className="search-form__date-picker">
        <FormGroup style={{justifyContent: 'space-around', height: '100%'}}>
          <label htmlFor="date">Departure date</label>
          <div className="date-picker__wicon">
            <DatePicker
              forceShowMonthNavigation={true}
              id="date"
              minDate={date}
              selected={this.props.date}
              onChange={this.handleChange}
              customInput={<CustomInput />}
            />
          </div>
        </FormGroup>
      </div>
    );
  }
}

export default SABSearchFormDate;
