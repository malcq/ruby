import React, { PureComponent } from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import {Paper} from '@material-ui/core'
import SABSearchItemExpanded from '../SABSearchItemExpanded'
import ShipmentConversation from '../../../pages/ShipmentConversation'
import Button from "../../Button/index";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
class SABQuoteBooked extends PureComponent<any, any> {
  public render () {
    return (
      <div className="search-book__quote">
        <div className="confirmed">
          <span className="icon checked"/> {this.props.quote_status_booked ? 'Quote requested!' :'Shipment Pre-booked!'}
        </div>
        <Paper className="search-book__info">
          <div style={{flex: '1 1', padding: 32}}>
            <div className="info-shipment">
              <div>{this.props.title}<div className="info-shipment__cariage"><span className={'icon '+this.props.icon}/>  {this.props.shipment_details.total_quantity}x{this.props.shipment_details.container_type}</div>
              </div>
              {/*<div className="info-shipment__incoterm">Incoterm: EXW</div>*/}
            </div>
            <SABSearchItemExpanded fullSize={true}
                                   allPriceKnown={true}
                                   corporationButton={null}
                                   days_in_freight={this.props.shipment_details.days_in_freight}
                                   dischargeCountry={this.props.shipment_details.discharge_port_country}
                                   dischargeData={this.props.shipment_details.estimated_arrival}
                                   dischargePort={this.props.shipment_details.discharge_port_country}
                                   loadingCountry={this.props.shipment_details.loading_port_country}
                                   loadingDate={this.props.shipment_details.estimated_departure}
                                   loadingPort={this.props.shipment_details.loading_port_code}
                                   cargoClosing={this.props.shipment_details.expected_cargo_closing_date}
                                   expectedDelivery={this.props.shipment_details.expected_delivery}
                                   onCarriageAddress={this.props.shipment_details.post_carriage_address}
                                   preCarriageAddress={this.props.shipment_details.pre_carriage_address}
                                   distance_to_loading_port={this.props.shipment_details.distance_to_loading_port}
                                   distance_to_discharge_port={this.props.shipment_details.distance_to_discharge_port}
                                   cargo_closing_date={this.props.shipment_details.cargo_closing_date}
                                   services={this.props.price_details.requested_services || []}
            />
          </div>
          <div className="info-company">
            <div className="info-company__title">
              {this.props.carrier}
            </div>
            <div className='button-container'>
              {this.props.location.search.match(/is_cheapest=([^&]+)(&|$)/) && (
                <div className='button-container__button button-container__button--orange'>
                  Cheapest
                </div>
              )}
              {this.props.location.search.match(/is_fastest=([^&]+)(&|$)/) && (
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
            <img className="info-company__logo" />
          </div>
          {(this.props.shipment_details.container_type === 'LCL' || this.props.shipment_details.container_type === 'AIR') && (
            <Table className="info__lcl">
              <TableHead style={{lineHeight: '81px'}}>
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
        <Paper className="search-book__links">
          <div style={{fontSize: 14, color: "#1b2538", paddingBottom: 21}}>
            Your booking inquiry can be found in your dashboard with ID <Link to={`/shipments/${this.props.id}`}><span style={{color: "#0596e9",textDecoration: "underline"}}>{this.props.title}</span></Link>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}>
            <div style={{fontSize: 14, color: "#818181"}}>
              We need some additional information for the shipment.<br/>
               This information is required before departure of shipment. <br/>
              Please navigate to the shipment page to complete all information.
            </div>
            <Link to={`/shipments/${this.props.id}`}>
              <Button color='blue-border'>Shipment page</Button>
            </Link>
          </div>
        </Paper>
        <Paper className="search-booking__conversation">
          <div className="search-booking__chat-title">
            Tag others and start a conversation about this shipment
          </div>
          <ShipmentConversation shipmentId={this.props.id}/>
        </Paper>
      </div>
    );
  }
}

export default SABQuoteBooked;
