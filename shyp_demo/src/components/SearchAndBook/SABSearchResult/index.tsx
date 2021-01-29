import React, { PureComponent } from 'react';
import './styles.scss';
import SABSearchItem from '../SABSearchItem';
import moment from "moment";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "../../Button/index";
import {connect} from "react-redux";

import {Link} from "react-router-dom";

class SABSearchResult extends PureComponent<any, any> {
  public state = {anchorEl: null};
  public menuClick = (type) => {
    this.setState({ anchorEl: null }, this.props.sortF(type))
  };
  public componentWillReceiveProps(nextProps) {
    if(this.props.sortType === nextProps.sortType && JSON.stringify(this.props.resultSearch) !== JSON.stringify(nextProps.resultSearch)) {
      this.props.sortF(nextProps.sortType)
    }
  }
  public render() {

    if (this.props.resultSearch === null) {
      return (<div/>)
    }
    const date = this.props.date;
    return (
      <div className="SABSearchResult__mt">
        <div className="SABSearchResult__search-row">
          <div className="result-info">
            <span className="result-info--bold">
              {this.props.resultSearch.length}
            </span>
            &nbsp;
            results from
            &nbsp;
            <span className="result-info--bold">
              {this.props.query.departure_date && this.props.query.departure_date.format('MMM, DD YYYY')}
            </span>
            &nbsp;
            to
            &nbsp;
            <span className="result-info--bold">
              {this.props.query.departure_date && moment(this.props.query.departure_date.format()).add(13,'day').format('MMM, DD YYYY')}
            </span>
          </div>
          <div className="button-and-sorting-container">
            {/*<div className="button-container">
              <Button variant="outlined"
                      classes={{
                        root: 'button',
                        label: 'button__inner',
                      }}
                      className='button--mr'
              >
                Departure Date
              </Button>
              <Button variant="outlined"
                      classes={{
                        root: 'button',
                        label: 'button__inner',
                      }}
                      className='button--mr'
              >
                Arrival Date
              </Button>
              <Button variant="outlined"
                      classes={{
                        root: 'button',
                        label: 'button__inner',
                      }}
                      className='button--mr'
              >
                Transit time
              </Button>
              <Button variant="outlined"
                      classes={{
                        root: 'button',
                        label: 'button__inner',
                      }}
              >
                Carrier
              </Button>
            </div>*/}
            <div className="sorting-row">
              Sort by
              <div className="sorting-row__menu" aria-owns={'simple-menu'}
                   aria-haspopup="true" onClick={(event)=>{this.setState({ anchorEl: event.currentTarget })}}>
                {this.props.sortType} <span className="icon chevron"/>
              </div>
              <Menu
                classes={{paper: 'sorting-row__menu-items'}}
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={()=>{this.setState({ anchorEl: null })}}
              >
                <MenuItem onClick={()=>{this.menuClick('Price')}}>Price</MenuItem>
                <MenuItem onClick={()=>{this.menuClick('Departure Time')}}>Departure Time</MenuItem>
                <MenuItem onClick={()=>{this.menuClick('Transit Time')}}>Transit Time</MenuItem>
              </Menu>
            </div>
          </div>
        </div>
        {this.props.resultSearch.length !== 0 && <div className="SABSearchResult__result-container">
          {this.props.resultSearch.map((item, index) => {
            return (<SABSearchItem key={index}
                           {...item}
                           query={this.props.query}
                           allPriceKnown={true}
                           isStaff={this.props.isStaff}
            />)}
          )}
        </div>}
        {this.props.resultSearch.length === 0 && this.props.search &&
          <div className="SABSearchResult__result-container SABSearchResult__result-container--empty">
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <div><b>Please request a quote for this route</b></div>
              <div>At the moment we cannot find a {this.props.search.includes('selected_container_type=air') ? 'flight' : 'sailing'} schedule and/or price for the route you’ve requested.</div>
              <div>We know they’re out there, so please request a quote and we’ll get back to you within a few hours with a price and {this.props.search.includes('selected_container_type=air') ? 'flight' : 'sailing'} schedule.</div>
            </div>
            {!this.props.search.includes('selected_container_type=air') &&
            <Link to={'search/quote'+this.props.search}>
              <Button color="blue-border">
                Request quote now
              </Button>
            </Link>
            }
          </div>
        }
        {this.props.resultSearch.length === 0 && this.props.search.includes('selected_container_type=air') && this.props.search &&
          <>
            <div className="SABSearchResult__result-container SABSearchResult__result-container--empty">
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div><b>Fastest: Transit 2-3 days</b></div>
              </div>
              <Link to={'search/quote'+this.props.search+'&requested_air_tt=fast'}>
                <Button color="blue-border">
                  Request quote now
                </Button>
              </Link>
            </div>
            <div className="SABSearchResult__result-container SABSearchResult__result-container--empty">
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div><b>Regular: Transit 3-5 days</b></div>
              </div>
              <Link to={'search/quote'+this.props.search+'&requested_air_tt=regular'}>
                <Button color="blue-border">
                  Request quote now
                </Button>
              </Link>
            </div>
            <div className="SABSearchResult__result-container SABSearchResult__result-container--empty">
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div><b>Cheap: Transit 5-7 days</b></div>
              </div>
              <Link to={'search/quote'+this.props.search+'requested_air_tt=cheap'}>
                <Button color="blue-border">
                  Request quote now
                </Button>
              </Link>
            </div>
          </>
        }
        {this.props.query.selectedType !== 'air' &&
          <div className="SABSearchResult__nav">
            {this.previousCondition() && (
              <Link to={`/search?${this.setPreviousDate()}`}>
                <Button color="blue-border" onClick={()=>this.props.setForceUpdate(true)}>Search previous 2 weeks</Button>
              </Link>
            )}
            <Link to={`/search?${this.setNextDate()}`}>
              <Button color="blue-border" onClick={()=>this.props.setForceUpdate(true)}>Search next 2 weeks</Button>
            </Link>
          </div>
        }
      </div>
    );
  }
  private previousCondition = () => {
    let date = moment();
    if(date.format('d') === '6') {date.add(2, 'days')}
    if(date.format('d') === '0') {date.add(1, 'days')}
    switch (this.props.query.selectedType) {
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
    if(this.props.search.match(/departure_date=([-0-9]*)(&|$)/)) {
      const searchDate = moment(this.props.search.match(/departure_date=([-0-9]*)(&|$)/)[1],'DD-MM-YYYY');
      return searchDate.isAfter(date,'day')
    }
    return false;
  };
  private setPreviousDate = () => {

    let date = moment();
    if(date.format('d') === '6') {date.add(2, 'days')}
    if(date.format('d') === '0') {date.add(1, 'days')}
    switch (this.props.query.selectedType) {
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
    const search = this.props.search.replace(/\?/,'');
    const oldDate = search.match(/departure_date=([-0-9]*)(&|$)/) && search.match(/departure_date=([-0-9]*)(&|$)/)[1] || moment();
    const newDate = moment(oldDate, 'DD-MM-YYYY').subtract(14, 'days');
    let str = 'departure_date=';
    str += newDate.isBefore(date, 'day') ? date.format('DD-MM-YYYY') : newDate.format('DD-MM-YYYY')
    return search.replace(/departure_date=([-0-9]*)/,str)
  };
  private setNextDate = () => {
    const search = this.props.search.replace(/\?/,'');
    const oldDate = search.match(/departure_date=([-0-9]*)(&|$)/) && search.match(/departure_date=([-0-9]*)(&|$)/)[1 || moment()];
    const newDate = moment(oldDate, 'DD-MM-YYYY').add(14, 'days').format('DD-MM-YYYY');
    return search.replace(/departure_date=([-0-9]*)/,'departure_date=' + newDate);
  }
}

export default connect<any,any,any>(null,null)(SABSearchResult);