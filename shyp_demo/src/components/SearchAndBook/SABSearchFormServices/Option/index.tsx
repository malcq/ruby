import React, { PureComponent } from 'react';
import { Tooltip } from '@material-ui/core/';

import Checkbox from "../../../Checkbox/index";
import NumberFormat from 'react-number-format';
import getClassName from "../../../../utils/styling/index";
import '../styles.scss';

class SABSearchFormServicesOption extends PureComponent<any, any> {
  public render () {
    return (
      <Tooltip title={this.props.tooltip} classes={{tooltip: 'search-form__tooltip'}}>
        <div className={getClassName("search-form__option",{"search-form__option--insurance":this.props.insurance})}
             style={this.props.checked ? {color: '#0596e9'} : {}}
             onClick={()=>{this.props.changeState(this.props.name,!this.props.checked,'services')}}>
          <div className={`option__icon ${this.props.style}`}>
            <label
              className={`icon ${this.props.icon}`}
            />
          </div>
          <Checkbox
            name={this.props.name}
            onChange={()=>{this.props.changeState(this.props.name,!this.props.checked,'services')}}
            checked={this.props.checked}
            customIcon={true}
          />
          <label
            className="option__title"
          >{this.props.title}</label>
          {this.props.insurance && this.props.checked &&(
            <div className="option-insurance" onClick={(e)=>e.stopPropagation()}>
              <label htmlFor="insurance__input" className="option-insurance-label">CIF Value of goods:</label>
              <div className="option-insurance-input">
                <div className="euro-sign option-insurance__sign"/>
                <NumberFormat
                  thousandSeparator="."
                  decimalSeparator={","}
                  className="option-insurance__input"
                  id="insurance__input"
                  value={this.props.cif_value}
                  onChange={(e)=>{this.props.changeState('cif_value',e.target.value.replace(/\./g,''))}}
                />
              </div>
            </div>)}
        </div>
      </Tooltip>
    );
  }
}

export default SABSearchFormServicesOption;
