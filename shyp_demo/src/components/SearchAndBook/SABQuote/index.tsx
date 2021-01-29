import React, { PureComponent } from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import {Paper, Table, TableRow, TableBody, TableHead, TableCell, TableFooter} from '@material-ui/core'
import SABSearchItemExpanded from '../SABSearchItemExpanded'
import SABQuoteBooked from '../SABQuoteBooked'
import {Dispatch} from "redux";
import promisifyAction from "../../../utils/promisifyAction";
import {searchQuotesOverview} from "../../../stores/actionCreators/searchOverview";
import {searchQuotesBooking, searchQuotesBookingReset} from "../../../stores/actionCreators/searchBooking";
import {connect} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import {push} from "react-router-redux";
import {History} from "history";
import LocationDescriptor = History.LocationDescriptor;
import getClassName from "../../../utils/styling/index";
import ConfirmDialog from "../../ConfirmDialog/index";
import Button from "../../Button/index";
import {values} from 'lodash';
import moment from "moment";

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, searchQuotesOverview),
  submit: promisifyAction(dispatch, searchQuotesBooking),
  resetBooking: promisifyAction(dispatch, searchQuotesBookingReset),
  toLocation: (location: LocationDescriptor ): void => { dispatch(push(location)) },
});

const mapStateToProps = (state: IGlobalState): any => ({
  shipment_details: state.searchOverview.shipment_details,
  quote_status: state.searchOverview.quote_status,
  price_details: state.searchOverview.price_details,
  loading: state.searchOverview.loading || state.searchBooking.loading,
  id: state.searchBooking.id,
  title: state.searchBooking.title,
  quote_status_booked: state.searchBooking.quote_status,
  type: state.searchBooking.type,
  predicted_sailing: state.searchOverview.predicted_sailing,
  containers: state.searchOverview.containers
});

class SABQuote extends PureComponent<any, any> {
  public state={termsChecked: false, dialogOpened: false, screenWidth: window.innerWidth};

  public componentDidMount() {
    const drift: HTMLElement | null = document.getElementById("drift-widget");
    if(drift) {drift.classList.add("quoted-drift")}
    this.props.resetBooking();
    this.props.getData(this.props.location.search);
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  public componentWillUnmount() {
    const drift: HTMLElement | null = document.getElementById("drift-widget");
    if(drift) {drift.classList.remove("quoted-drift")}
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.price_details && nextProps.price_details.price_structure && nextProps.price_details.price_structure.length > 0) {
      nextProps.price_details.price_structure.map(item => {
        if(!this.state[item.service_name]) {this.setState({[item.service_name]: false})}
      })
    }
  }

  public expandRow = (item) => {
    this.setState(state => ({[item]: !state[item]}))
  };

  public closeDialog = () => {
    this.setState({dialogOpened: false})
  };

  public updateWindowDimensions = () => {
    this.setState({ screenWidth: window.innerWidth });
  };

  public render () {
    if(this.props.loading) { return(
      <div className="sab__loader--clear">
        <CircularProgress size={50} style={{marginTop: '160px'}}/>
      </div>)}
    let icon = '';
    let search = this.props.location.search;
    search = search.replace(/(%5B)/g, "[");
    search = search.replace(/(%5D)/g, "]");
    switch(this.props.shipment_details.container_type) {
      case '20 ft':
        icon = 'container20ft';
        break;
      case '40 ft':
        icon = 'container40ft';
        break;
      case '40ft HQ':
        icon = 'container40fthq';
        break;
      case 'LCL':
        icon = 'lcl';
        break;
      case 'AIR':
        icon = 'air';
        break;
    }
    const sortOrder = {
      "Pre carriage": 1,
      "Origin port": 2,
      "Export declaration": 3,
      "Ocean freight": 4,
      "Air freight": 4,
      "Import declaration": 5,
      "Destination port": 6,
      "On Carriage": 7,
      "Insurance": 8
    };
    const services : any = {...this.state};
    delete services.dialogOpened;
    delete services.termsChecked;
    const sortedPrices = this.props.price_details.price_structure.sort((x, y) => sortOrder[x.service_name] - sortOrder[y.service_name]);
    let allPriceKnown = true;
    sortedPrices.forEach(item => {item.price_items.forEach(price=>{if(price.price_eur === 'On Request'){allPriceKnown = false}})});
    if(!this.props.id) {
      return (
        <div className="search-book__quote">
          <style dangerouslySetInnerHTML={{__html: `#drift-widget { bottom: ${this.state.screenWidth >= 768 ? 90 : 150}px !important }`}} />
          <Link to={`/search${search.slice(0,search.indexOf('route_id'))}`} className="back-button">
            <Button color="blue-border" className="back-button linked">
              <span className='icon chevron hrevert'/>Back to search results
            </Button>
          </Link>
          <Paper className="search-book__info">
            <div className="info__left-part">
              <div className="info-shipment">
                <div>Shipment
                  <div className="info-shipment__cariage">
                    <span className={"icon "+icon}/>  {this.props.shipment_details.total_quantity}x{this.props.shipment_details.container_type}
                  </div>
                </div>
                {/*<div className="info-shipment__incoterm">Incoterm: EXW</div>*/}
              </div>
              <SABSearchItemExpanded fullSize={true}
                                     allPriceKnown={true}
                                     days_in_freight={this.props.shipment_details.days_in_freight}
                                     dischargeCountry={this.props.shipment_details.discharge_port_country}
                                     dischargeData={this.props.shipment_details.estimated_arrival}
                                     dischargePort={this.props.shipment_details.discharge_port_code}
                                     loadingCountry={this.props.shipment_details.loading_port_country}
                                     loadingDate={this.props.shipment_details.estimated_departure}
                                     loadingPort={this.props.shipment_details.loading_port_code}
                                     cargoClosing={this.props.shipment_details.expected_cargo_closing_date}
                                     expectedDelivery={this.props.shipment_details.expected_delivery}
                                     onCarriageAddress={this.props.shipment_details.post_carriage_address}
                                     preCarriageAddress={this.props.shipment_details.pre_carriage_address}
                                     onEditAddress={()=>{this.setState({modalOpen: true})}}
                                     distance_to_loading_port={this.props.shipment_details.distance_to_loading_port}
                                     distance_to_discharge_port={this.props.shipment_details.distance_to_discharge_port}
                                     cargo_closing_date={this.props.shipment_details.cargo_closing_date}
                                     services={this.props.price_details.requested_services || []}
              />
            </div>
            <div className="info-company">
              <div className="info-company__title">
                {search
                  && search.match(/carrier=([^&]+)(&|$)/)
                  ? search.match(/carrier=([^&]+)(&|$)/)[1].replace(/%20/,' ') : 'Carrier'}
              </div>
              <div className='button-container'>
                {search.match(/is_cheapest=([^&]+)(&|$)/) && (
                  <div className='button-container__button button-container__button--orange'>
                    Cheapest
                  </div>
                )}
                {search.match(/is_fastest=([^&]+)(&|$)/) && (
                  <div className='button-container__button'>
                    Fastest
                  </div>
                )}
                {this.props.predicted_sailing && (
                  <>
                    <div className='button-container__button button-container__button--disabled'>
                      By predicted schedule
                    </div>
                    <div className='button-container__text'>
                    The exact sailing is not known yet. These dates are an estimate. We will confirm the ETD &amp; ETA as soon as possible.
                    </div>
                  </>
                )}
              </div>
              <img className="info-company__logo"/>
            </div>
            {(this.props.shipment_details.container_type === 'LCL' || this.props.shipment_details.container_type === 'AIR') && (
              <Table className="info__lcl">
                <TableHead style={{minHeight: 74}}>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Length (cm)</TableCell>
                    <TableCell>Width (cm)</TableCell>
                    <TableCell>Height (cm)</TableCell>
                    <TableCell>Volume (m3)</TableCell>
                    <TableCell>Weight (KG)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.shipment_details.containers && this.props.shipment_details.containers.map(item =>
                    (<TableRow>
                    <TableCell>{item.quantity} x</TableCell>
                    <TableCell>{item.length_mm/10}</TableCell>
                    <TableCell>{item.width_mm/10}</TableCell>
                    <TableCell>{item.height_mm/10}</TableCell>
                    <TableCell>{item.volume_cbm}</TableCell>
                    <TableCell>{item.weight_kg}</TableCell>
                  </TableRow>))}
                </TableBody>
              </Table>
            )}
          </Paper>
          {sortedPrices.length !== 0 && (<Paper className="search-book__pricing">
            <Table>
              <TableHead style={{minHeight: 81}}>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell className={!values(services).includes(true) ? 'hidden' : ''}>{values(services).includes(true) ? 'Unit Price' : ''}</TableCell>
                  <TableCell>Dollar</TableCell>
                  <TableCell>Euro</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPrices.map(item => {
                  const totalUsd = item.price_items.map( el => parseFloat(el.price_usd) ).reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2);
                  let ready = true
                  {item.price_items.forEach(price=>{if(price.price_eur === 'On Request'){ready = false}})}
                  const totalEur = ready ? item.price_items.map( el => parseFloat(el.price_eur) ).reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2) : "Price requested"
                  return (<React.Fragment key={'tr-'+item.service_name}>
                      <TableRow className="pricing-tr--hoverable" onClick={()=>{this.expandRow(item.service_name)}}>
                        <TableCell className={getClassName('icon',{
                          'truck': item.service_name === "Pre carriage" || item.service_name === "On carriage",
                          'crane': item.service_name === "Origin port" || item.service_name === "Destination port",
                          'stamp': item.service_name === "Export declaration" || item.service_name === "Import declaration",
                          'transport': item.service_name === "Ocean freight",
                          'secure': item.service_name === "Insurance"
                        })}>{item.service_name === "Insurance" ? "Cargo insurrance" : item.service_name}</TableCell>
                        <TableCell className={!values(services).includes(true) ? 'hidden' : ''}/>
                        <TableCell className={ready && !this.state[item.service_name] ? "dollar-sign" : ''}>{this.state[item.service_name] ? '' : (ready ? totalUsd : "-")}</TableCell>
                        <TableCell className={getClassName({
                          'euro-sign': !this.state[item.service_name] && ready ,
                          'price__on-request': !this.state[item.service_name] && !ready,
                        })}>
                          {this.state[item.service_name] ? '' : totalEur}
                        </TableCell>
                        <TableCell><div className='icon chevron' style={this.state[item.service_name] ? {transform: 'rotate(-90deg)', width: 10} : {transform: 'rotate(90deg)', width: 10}}/></TableCell>
                      </TableRow>
                      {this.state[item.service_name] && item.price_items.map(subitem => (
                        <TableRow key={'subtr-'+item.service_name+'-'+subitem.description}>
                          <TableCell style={{paddingLeft: 52}}>{`${this.props.shipment_details.container_type === 'LCL' ? subitem.quantity : parseInt(subitem.quantity,10)} x ${subitem.description}`}</TableCell>
                          {item.service_name === 'Insurance' ?
                          <TableCell>Value of goods €
                            {search && search.match(/cif_value=([^&]+)(&|$)/)[1]}</TableCell> :
                          <TableCell className={getClassName('',{
                            [subitem.unit_price_currency+'-sign']: subitem.unit_price,
                            'hidden': !values(services).includes(true),
                            })}>
                            {ready ? subitem.unit_price : "-"}
                          </TableCell>}
                          <TableCell className={subitem.price_usd ? "dollar-sign" : ''}>{ready ? subitem.price_usd : "-"}</TableCell>
                          <TableCell className={getClassName({
                            "euro-sign": subitem.price_eur && subitem.price_eur !== 'On Request',
                            "subprice__on-request": subitem.price_eur === 'On Request',
                          })}>
                            {subitem.price_eur}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      ))}
                    </React.Fragment>
                  )
                })}
              </TableBody>
              <TableFooter style={{minHeight: 78}}>
                <TableRow>
                  <TableCell colSpan={values(services).includes(true) ? 2 : 1}>Total (excl. VAT and pending requests)</TableCell>

                  <TableCell className={"dollar-sign"}>{this.props.price_details.total_price_usd}</TableCell>
                  <TableCell className="euro-sign">{this.props.price_details.total_price_eur}</TableCell>
                  <TableCell/>
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>)}
          <Paper className="quote__footer">
            <div className="footer__empty"/>
            <div className="footer__accept">
              <div className="footer__accept--container">
                <input id="terms" type="checkbox" style={{marginRight: 15, minWidth: 13}} checked={this.state.termsChecked} onChange={()=>{this.setState({termsChecked: !this.state.termsChecked})}}/>
                <label htmlFor="terms">I hereby accept the general <a href="https://app.shypple.com/fenexconditions-english.pdf" target="_blank">Fenex terms &amp; conditions</a> and acknowledge that Shypple is acting as a
                freight forwarder who operates under these Fenex conditions.
                  All subcontractors utilized have Limited Liability. Shypple recommends that goods are insured.</label>
              </div>
            </div>
            <div className="footer__results-booking">
              {sortedPrices.length !== 0 && (<div className="footer__total-results">
                <div className={getClassName("total-results__total",{'all-price': allPriceKnown})}>
                  Total (Excl. VAT{!allPriceKnown && "and pending requests"}) <b><span className="euro-sign">{this.props.price_details.total_price_eur}</span></b>
                </div>
                <div className="total-results__warning">
                  {!allPriceKnown && <>These rates are a first indication<br/> Request a quote for the final price</>}
                  {allPriceKnown && <>Latest ETD for this rate: <b style={{paddingLeft: 7}}>{moment(this.props.price_details.valid_to, 'YYYY-MM-DD').format('MMM DD')}</b></>}
                </div>
              </div>)}
              <div className="footer__booking">
                {allPriceKnown && sortedPrices.length !== 0 ? (
                  <Button
                    color="green"
                    onClick={() => {
                      this.state.termsChecked ? this.props.submit(search) : this.setState({dialogOpened: true})
                    }}
                  >
                    Book now
                  </Button>
                ) : (
                  <Button
                    color="green-border"
                    onClick={()=>{this.state.termsChecked ? this.props.submit(search) : this.setState({dialogOpened: true})}}
                  >
                    Request quote
                  </Button>
                )}
              </div>
            </div>
          </Paper>
          {/*<Modal
            open={this.state.modalOpen}
            onClose={()=>{this.setState({modalOpen: !this.state.modalOpen})}}
            classes={{root:'search-book__modal'}}
          >
            <div className="search-book__modal-content">
              <div className="search-book__modal-title">Pick up address</div>
              <TextField
                name="address"
                label={"Address"}
                classes={{
                  root: 'search-book__modal-input'
                }}
              />
              <TextField
                name="postcode"
                label={"Postcode"}
                classes={{
                  root: 'search-book__modal-input'
                }}
              />
              <TextField
                name="country"
                label={"Country"}
                classes={{
                  root: 'search-book__modal-input'
                }}
                value={this.props.shipment_details.discharge_port_country}
              />
              <div className="search-book__modal-buttons">
                <button className="modal-button" onClick={()=>{this.setState({modalOpen: !this.state.modalOpen})}}>Add from adressbook</button>
                <button className="modal-button--link" onClick={()=>{this.setState({modalOpen: !this.state.modalOpen})}}>CANCEL</button>
                <button className="modal-button--link" onClick={()=>{this.setState({modalOpen: !this.state.modalOpen})}}>SAVE</button>
              </div>
            </div>
          </Modal>*/}
          <ConfirmDialog
            message="Please accept our terms and conditions before you continue."
            isOpen={this.state.dialogOpened}
            confirm={this.closeDialog}
            onClose={this.closeDialog}
            isConfirmOnly={true}
            confirmButtonText="OK"
          />
        </div>
      );
    }else{
      return (<SABQuoteBooked shipment_details={this.props.shipment_details}
                              quote_status={this.props.quote_status}
                              price_details={this.props.price_details}
                              id={this.props.id}
                              title={this.props.title}
                              quote_status_booked={this.props.quote_status_booked}
                              type={this.props.type}
                              icon={icon}
                              location={this.props.location}
                              carrier={search && search.match(/carrier=([^&]+)(&|$)/) && search.match(/carrier=([^&]+)(&|$)/)[1]}
                              predicted_sailing={this.props.predicted_sailing}
      />);
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SABQuote);
