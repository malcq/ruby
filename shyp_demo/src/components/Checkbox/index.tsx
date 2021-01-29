import React, { StatelessComponent } from 'react'
import PropTypes from 'prop-types';
import { Checkbox as MaterialCheckbox } from '@material-ui/core';
import checked from '../../assets/images/checkbox_checked.png'
import unchecked from '../../assets/images/checkbox_unchecked.png'

import './styles.scss'

interface ICheckboxProps{
    checked?: boolean;
    name?: string;
    color?: string | null;
    onChange?: (event: any) => void;
    isDisabled?: boolean;
    customIcon?: boolean;
}


// Generic checkbox with project styles wrapped around material ui checkbox
const Checkbox: StatelessComponent<any> = (props: ICheckboxProps) => {
  if(props.customIcon) {
    return (
      <MaterialCheckbox
        checked={props.checked}
        disableRipple={true}
        classes={{
          root: 'checkbox mui-override',
          checked: `checkbox_checked checkbox_checked_${props.color} mui-override`,
        }}
        name={props.name}
        id={props.name}
        onChange={props.onChange}
        disabled={props.isDisabled}
        checkedIcon={<img src={checked} />}
        icon={<img src={unchecked} />}
      />
    )
  }
  return (
    <MaterialCheckbox
      checked={props.checked}
      disableRipple={true}
      classes={{
        root: 'checkbox mui-override',
        checked: `checkbox_checked checkbox_checked_${props.color} mui-override`,
      }}
      name={props.name}
      id={props.name}
      onChange={props.onChange}
      disabled={props.isDisabled}/>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  color: PropTypes.string,
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  customIcon: PropTypes.bool,
};

Checkbox.defaultProps = {
  checked: null,
  onChange: (event) => undefined,
  color: 'blue',
  name: '',
  isDisabled: false,
  customIcon: false,
};

export default Checkbox;
