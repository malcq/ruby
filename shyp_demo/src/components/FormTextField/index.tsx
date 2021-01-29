import React, { Component, ReactNode, ReactNodeArray } from 'react';
import PropTypes from 'prop-types';
import bind from 'autobind-decorator';
import { chain } from 'lodash';
import { Input, FormControl, FormHelperText } from '@material-ui/core';

import { FormFieldGroup, SelectorButton } from '../';
import { IMenuOriginProps } from '../MenuButton';
import './styles.scss'

const SELECTOR_NAME = 'country';

interface IFormTextFieldProps{
  type?: string;
  label?: string;
  fallbackValue?: string | number | null;
  value?: string | number | null;
  fieldName: string;
  errorNote?: string | null;
  onChange: (fieldName: string, value?: string | number | null) => void;
  children?: ReactNode | ReactNodeArray;
  isRequired?: boolean;
  disabled: boolean;
  options?: string[][],
}

const PTStringOrNumber = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

// This is text field component designed to work with form state
// name of the field is passed by fieldName prop
// onChange function has field and value parameter
// fallbackValue - value which is displayed, then state is null
// it sets state.field with value
class FormTextField extends Component<IFormTextFieldProps> {

  public static propTypes = {
    label: PropTypes.string,
    value: PTStringOrNumber,
    fallbackValue: PTStringOrNumber,
    fieldName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    children: PropTypes.node,
    diabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    errorNote: PropTypes.string,
  };

  public static defaultProps = {
    defaultValue: '',
    label: '',
    value: '',
    type: 'text',
    children: '',
    isRequired: false,
    errorNote: '',
    disabled: false,
    options: [],
  };

  public render() {
    return (
      <FormFieldGroup label={`${this.props.isRequired ? '*': ''}${this.props.label}`}>
        {
          (this.props.type === 'select')
          ? this.renderSelector()
          : this.renderTextInput()
        }
      </FormFieldGroup>
    );
  }

  private renderTextInput() {
    return (
      <FormControl
        fullWidth={true}
        error={!!this.props.errorNote}
      >
        <Input
          value={this.resolveValue()}
          classes={{
            root: 'form-text-field__input mui-override',
            disabled: 'form-text-field__input_disabled underline mui-override'
          }}
          disabled={this.props.disabled}
          type={this.props.type}
          onChange={this.handleChange}
        />
        {(this.props.errorNote) &&
        <FormHelperText>
          {this.props.errorNote}
        </FormHelperText>
        }
      </FormControl>
    )
  }

  private resolveValue(): string | number{
    return this.props.value == null
      ? this.props.fallbackValue || ''
      : this.props.value
  }

  private getOptionTitle(): string {
    const { options } = this.props;
    const value = this.resolveValue();
    if (options) {
      return chain(options).find(([title, id]: ICountry) => id === value).get(0, '').value();
    }
    return ''
  }

  private renderSelector() {
    return (
      <SelectorButton
        isSearchable={true}
        hasLimitedHeight={true}
        options={this.props.options}
        value={`${this.resolveValue()}`}
        onChange={this.pickOption}
        renderOrigin={this.renderSelectorInput}
      >
        {this.props.children}
      </SelectorButton>
    )
  }

  @bind
  private renderSelectorInput(inputProps: IMenuOriginProps): ReactNode{
    return <Input
      key={inputProps.key}
      value={this.getOptionTitle()}
      inputRef={inputProps.anchorRef}
      classes={{
        root: 'form-text-field__input form-text-field__input_selector mui-override',
        disabled: 'form-text-field__input_disabled underline mui-override',
        input: 'form-text-field__selector-input mui-override'
      }}
      readOnly={true}
      disabled={this.props.disabled}
      type={this.props.type}
      onClick={inputProps.onClick}
    />
  }

  @bind
  private pickOption(optionId: string | number): void{
    const value = optionId === this.props.fallbackValue ? null : optionId;
    this.props.onChange(this.props.fieldName, value)
  }

  @bind
  private handleChange(event: any):void {
    const value = event.target.value === this.props.fallbackValue ? null : event.target.value;
    this.props.onChange(this.props.fieldName, value)
  }
}

export default FormTextField;