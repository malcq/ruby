import React, { PureComponent } from 'react';
import { FormGroup, FormControlLabel } from '@material-ui/core';
import { GoogleInput } from '../../'
import { Checkbox } from "../../";
import getClassName from "../../../utils/styling/index";
import './styles.scss';

class SABSearchFormLocation extends PureComponent<any, any> {
  public changeIncl = event => {
    const { checked } = event.target;
    this.props.changeState('incl_nearby', checked, this.props.type)
  };
  public render () {
    return (
      <div className={`search-form__location ${this.props.class || ''}`}>
        { this.props.switch && <span className="location__switch icon switch" onClick={this.props.switch}/> }
        <GoogleInput
          name={this.props.title}
          value={this.props.error ? '' : this.props.value}
          changeState={this.props.changeState}
          type={this.props.type}
          className={getClassName("location__input",{"location__input--error":this.props.error})}
          incl_nearby={this.props.incl_nearby}
          error={this.props.error}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.props.incl_nearby}
                onChange={this.changeIncl}
                customIcon={true}
              />
            }
            classes={{root:'location-label__root', label:'location-label__label'}}
            label="Incl. ports nearby"
          />
        </FormGroup>
      </div>
    );
  }
}

export default SABSearchFormLocation;
