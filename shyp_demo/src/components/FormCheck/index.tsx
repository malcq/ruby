import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import bind from 'autobind-decorator';

import { Checkbox } from '../';
import './styles.scss';


interface IFormCheckProps {
  key?: any;
  onChange: (field: string | number, value: boolean | null) => void;
  label: string;
  field: string | number;
  fallbackValue?: boolean | null;
  value?: boolean | null;
}


// Checkbox with the label and change tracking
// value - local form value
// fallbackValue - value, which displayed, if value props is null
//  also this is the value which changes are compared to
//  if new value is the same as fallback value, null is set instead
class FormCheck extends PureComponent<IFormCheckProps, {}> {

  public static propTypes = {
    field: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    fallbackValue: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.bool,
  };

  public static defaultProps = {
    fallbackValue: false,
    value: null,
    label: '',
  };

  public render() {
    const { label, fallbackValue, value } = this.props;
    return (
      <label className="form-check">
        <Checkbox
          checked={(value == null)
            ? fallbackValue || false
            : value
          }
          onChange={this.onChange}
        />
        <div
          className="form-check__label"
        >
          {label}
        </div>
      </label>
    );
  }

  @bind
  private onChange(event: any):void {
    const { onChange, field, value, fallbackValue } = this.props;
    onChange(field, value == null ? !fallbackValue : null)
  }
}

export default FormCheck;
