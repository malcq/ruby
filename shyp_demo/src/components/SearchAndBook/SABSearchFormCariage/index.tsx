import React, { PureComponent } from 'react';
import { FormGroup, Radio } from '@material-ui/core';
import SABSearchFormCarriageRadio from './Radio';
import './styles.scss';

class SABSearchFormCarriage extends PureComponent<any, any> {

  public handleChange = event => {
    this.props.changeState('selectedType',event.target.value)
  };
  public render () {
    const { type } = this.props;
    return (
      <div className="search-form__cariage">
        <FormGroup className="cariage__form">
          <SABSearchFormCarriageRadio name="lcl" icon="lcl" label="LCL" change={this.handleChange} checked={type === 'lcl'}/>
          <SABSearchFormCarriageRadio name="air" icon="airport" label="AIR" change={this.handleChange} checked={type === 'air'}/>
          <SABSearchFormCarriageRadio name="container20ft" icon="container20ft" label="20FT" change={this.handleChange} checked={type === 'container20ft'}/>
          <SABSearchFormCarriageRadio name="container40ft" icon="container40ft" label="40FT" change={this.handleChange} checked={type === 'container40ft'}/>
          <SABSearchFormCarriageRadio name="container40fthq" icon="container40fthq" label="40HQ" change={this.handleChange} checked={type === 'container40fthq'}/>
          {/*<SABSearchFormCarriageRadio name="multiple" icon="add" label="&nbsp;Multiple size containers" change={this.handleChange} checked={type === 'multiple'} inline={true}/>*/}
        </FormGroup>
      </div>
    );
  }
}

export default SABSearchFormCarriage;
