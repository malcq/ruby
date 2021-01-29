import React, { PureComponent } from 'react';
import moment from 'moment';
import 'flag-icon-css/css/flag-icon.css';

import getClassName from '../../../utils/styling';
import './styles.scss';

class SABSearchItemExpanded extends PureComponent<any, any> {

  public getCorporationButtonText = (value) => {
    let result = '';
    if (value === 'Cheapest') {
      result = 'Cheapest route possible';
    }
    if (value === 'Fastest') {
      result = 'Fastest route possible';
    }
    if (value === 'By predicted schedule') {
      result = 'By predicted schedule';
    }
    return result;
  };

  public render() {
   return (
     <div className="SABSearchItemExpanded">
       <div>
         <div className="slider-row">
           <span className={getClassName('icon startandend', {
             'icon--empty': this.props.services.indexOf("Pre carriage") < 0 && !this.props.preCarriageAddress,
           })}>
             <span className="icon destination"/>
           </span>
           <div className={getClassName('line line-first', {
             'line-first--all-known': this.props.services.indexOf("Pre carriage") >= 0 || this.props.preCarriageAddress,
             'line-first--empty': this.props.services.indexOf("Pre carriage") < 0 && !this.props.preCarriageAddress,
             'line-first--full-size': this.props.fullSize,
           })}/>
           <span className={getClassName('icon', {
             'startandend': this.props.services.indexOf("Pre carriage") < 0 && !this.props.preCarriageAddress,
             'mid': this.props.services.indexOf("Pre carriage") >= 0 || this.props.preCarriageAddress,
           })}>
             <span className={getClassName('icon container', {
               'container--long': this.props.services.indexOf("Pre carriage") >= 0 || this.props.preCarriageAddress,
             })}/>
           </span>
           <div className={getClassName('line line-second', {
             'line-second--all-known': this.props.allPriceKnown,
             'line-second--empty': !this.props.allPriceKnown,
             'line-second--full-size': this.props.fullSize,
           })}/>
           <span className="icon daysintransit">
             <span className="days-in-freight">
                {this.props.days_in_freight}
             </span>
           </span>
           <div className={getClassName('line line-second', {
             'line-second--all-known': this.props.services.indexOf("On carriage") >= 0 || this.props.onCarriageAddress,
             'line-second--empty': this.props.services.indexOf("On carriage") < 0 && !this.props.onCarriageAddress,
             'line-second--full-size': this.props.fullSize,
           })}/>
           <span className={getClassName('icon', {
             'startandend hrevert': this.props.services.indexOf("On carriage") < 0 && !this.props.onCarriageAddress,
             'mid': this.props.services.indexOf("On carriage") >= 0 || this.props.onCarriageAddress,
           })}>
             <span className={getClassName('icon container', {
               'container--long': this.props.services.indexOf("On carriage") >= 0 || this.props.onCarriageAddress,
             })}/>
           </span>
           <div className={getClassName('line line-first', {
             'line-first--all-known': this.props.services.indexOf("On carriage") >= 0 || this.props.onCarriageAddress,
             'line-first--empty': this.props.services.indexOf("On carriage") < 0 && !this.props.onCarriageAddress,
             'line-first--full-size': this.props.fullSize,
           })}/>
           <span className={getClassName('icon startandend hrevert', {
             'icon--empty': this.props.services.indexOf("On carriage") < 0 && !this.props.onCarriageAddress,
           })}>
             <span className="icon destination"/>
           </span>
         </div>
         <div className="address-row">
           <div className="address-row__first-col">
             <div className={getClassName('first-col__address', {
               'first-col__address--booking': this.props.fullSize,
             })}>
               Origin
             </div>
             <div className="first-col__port">
               {this.props.preCarriageAddress ? this.props.preCarriageAddress : this.props.loadingCountry.split(', ')[0]}
             </div>
           </div>
           <div className={getClassName('address-row__second-col', {
             'address-row__second-col--full-size': this.props.fullSize,
           })}>
             <div className="second-col__country">
               {this.props.loadingPort}
               <span className="second-col__country--flag">
                 <span className={`flag-icon flag-icon-${this.props.loadingCountry.split(', ')[1].toLowerCase()}`}/>
               </span>
             </div>
             <div className="second-col__port">
               {this.props.loadingCountry.split(', ')[0]}
             </div>
             <div className="second-col__distance">
               {this.props.distance_to_loading_port}
             </div>
             <div className="second-col__date">
               {this.props.cargo_closing_date &&
                 <>Estimated Cargo Closing:&nbsp;
                   <span className="second-col__date--highlight">
                     {moment(this.props.cargo_closing_date).format('DD MMM')}
                   </span>
                   <br/>
                 </>
               }
               ETD:&nbsp;
               <span className="second-col__date--highlight">
                 {moment(this.props.loadingDate).format('DD MMM')}
               </span>
             </div>
           </div>
           <div className={getClassName('address-row__third-col', {
             'address-row__third-col--full-size': this.props.fullSize,
           })}>
             <div className="third-col__country">
               {this.props.dischargePort}
               <span className="third-col__country--flag">
                 <span className={`flag-icon flag-icon-${this.props.dischargeCountry.split(', ')[1].toLowerCase()}`}/>
               </span>
             </div>
             <div className="third-col__port">
               {this.props.dischargeCountry.split(', ')[0]}
             </div>
             <div className="third-col__distance">
               {this.props.distance_to_discharge_port}
             </div>
             <div className="third-col__date">
               ETA:&nbsp;
               <span className="third-col__date--highlight">
                 {moment(this.props.dischargeData).format('DD MMM')}
               </span>
             </div>
           </div>
           <div className="address-row__last-col">
             <div className="last-col__address">
               Destination
             </div>
             <div className="last-col__port">
               {this.props.onCarriageAddress ? this.props.onCarriageAddress : this.props.dischargeCountry.split(', ')[0]}
             </div>
             {this.props.allPriceKnown && this.props.onCarriageAddress &&<div className="last-col__date">
               EDD:&nbsp;
               <span className="last-col__date--highlight">
                 {moment(this.props.expectedDelivery).format('DD MMM') ||
                 moment(this.props.dischargeData).format('DD MMM')}
               </span>
             </div>}
           </div>
         </div>
       </div>
       {!this.props.fullSize && (this.props.is_cheapest || this.props.is_fastest || this.props.predicted_sailing) &&
         (<div className='button-container'>
             <div className='button-container__wrapper'>
               {this.props.is_cheapest && (
                 <div className='button-container__button button-container__button--orange'>
                   Cheapest
                 </div>
               )}
               {this.props.is_fastest && (
                 <div className='button-container__button'>
                   Fastest
                 </div>
               )}
               {this.props.predicted_sailing && (
                 <div className='button-container__button button-container__button--disabled '>
                   By predicted schedule
                 </div>
               )}
             </div>
             {this.props.predicted_sailing && (
               <div className="button-container__text">
                 The exact sailing schedule is not known yet. These dates are an estimate. We will confirm the ETD &amp; ETA as soon as possible
               </div>
             )}
           </div>
         )}
     </div>
   );
  } ;
}

export default SABSearchItemExpanded;