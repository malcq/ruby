import * as React from 'react';
import { Radio } from '@material-ui/core';

const SABSearchFormCarriageRadio: React.SFC<any> = (props) => {
    return (
      <div className="cariage__radio-button">
        <Radio
          checked={props.checked}
          onChange={props.change}
          id={props.name}
          value={props.name}
          aria-label={props.name}
          className="cariage__radio"/>
        <label
          htmlFor={props.name}
          style={props.checked ? {color: '#0596e9'} : {}}>
          <span className={`icon ${props.icon}`}/>
          { !props.inline && <br /> }
          <span className="cariage__radio-label">{props.label}</span>
        </label>
      </div>
    );
};

export default SABSearchFormCarriageRadio;