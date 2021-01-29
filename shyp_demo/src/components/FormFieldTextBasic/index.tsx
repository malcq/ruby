import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import { find } from 'lodash';
import {
  TextField,
  FormHelperText,
} from '@material-ui/core';

import { SelectorButton } from '../';
import { IMenuOriginProps } from '../SelectorButton';

interface IContact {
  id: number,
  name: string,
}

type IOption = [string, number];

interface IProps{
  label?: string;
  field: string;
  contacts?: object[];
  value?: string | number | null;
  className?: string;
  disabled?: boolean | false;
  displaySelect?: boolean | false;
  errorNotes?: string | null;
  onChange: (fieldName: string, value: string) => void;
  onContactSelect: (value: string) => void;
}

interface IState{
  options: IOption[],
}

const toOption = ({ name, id }: IContact): IOption => [ name, id ];

class FormFieldTextBasic extends PureComponent<IProps, IState> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      options: []
    }
  }

  public componentDidMount(): void{
    this.updateOptions()
  }

  public render() {
    return (
      <div className="form-field">
        {this.renderSelect()}
        <TextField
          label={this.props.label}
          fullWidth={true}
          disabled={this.props.disabled}
          className={this.props.className || ''}
          margin="normal"
          error={!!this.props.errorNotes}
          value={this.props.value || ''}
          onChange={this.handleChange}
          InputLabelProps={{
            FormLabelClasses: {
              focused: 'focused',
              root: 'label',
              error: 'error',
              disabled: 'disabled',
            }
          }}
          InputProps={{
            classes: {
              focused: 'focused',
              root: 'input',
              error: 'error',
              disabled: 'disabled',
            }
          }}
        />
        {this.props.errorNotes && (
          <FormHelperText className="form-field__red">
            {this.props.errorNotes}
          </FormHelperText>
        )}
      </div>
    );
  }

  public componentDidUpdate(prevProps: IProps): void{
    if (prevProps.contacts !== this.props.contacts){
      this.updateOptions()
    }
  }

  private updateOptions(): void{
    const { contacts } = this.props;
    this.setState({
      options: contacts ? contacts.map(toOption) : []
    })
  }

  @bind
  private renderSelectorButton(buttonProps: IMenuOriginProps){
    return (
      <div
        role="button"
        key={buttonProps.key}
        className="contact-select"
        onClick={buttonProps.onClick}
      >
        <i
          aria-owns={buttonProps['aria-owns'] || ''}
          aria-haspopup={buttonProps['aria-haspopup'] || 'false'}
          ref={buttonProps.anchorRef}
          className="icon address-book"
        />
      </div>
    )
  }

  private renderSelect(): any {
    const { displaySelect, disabled } = this.props;
    if (displaySelect && !disabled) {
      return <SelectorButton
        hasLimitedHeight={true}
        isSearchable={true}
        renderOrigin={this.renderSelectorButton}
        onChange={this.handleItemClick}
        options={this.state.options}
      />
    }
  }

  @bind
  private handleItemClick(id: string | number): void {
    const contact = find(this.props.contacts, { id });
    if (this.props.onContactSelect && contact) {
      this.props.onContactSelect(contact);
    }
  }

  @bind
  private handleChange(event: any):void {
    this.props.onChange(this.props.field, event.target.value)
  }

}

export default FormFieldTextBasic;