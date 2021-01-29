import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { find, each } from 'lodash';

import { Button, ForbiddenEditHider, FormFieldTextBasic } from '../../components';
import {
  shipmentInstructionsSubmitNotifyPartyData,
  contactsAddContact,
  flashSuccess,
  shipmentLayoutGetData,
  flashError,
} from '../../stores/actionCreators';
import { withoutNullFields, promisifyAction, Logger } from "../../utils";
import './styles.scss';
import { resourceKey } from '../../config/permissions';

interface INotifyPartyFormProps {
  displayForm?: boolean;
  email?: string;
  phone?: number;
  name?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  submit: IActionPromiseFactory;
  saveContact: IActionPromiseFactory;
  shipmentLayoutGetData: IActionPromiseFactory;
	showSuccess: (message: string) => void;
  showError: (message: string) => void;
	shipmentId?: any;
	isReadOnly?: boolean;
}

interface INotifyPartyFormState {
  [x:string]: any;
}

const prepareForRequest = (state: INotifyPartyFormState, isContact?: boolean | false): any => ({
  email: state.email || '',
  phone: state.phone || '',
  name: state.name || '',
  address: state.address || '',
  city: state.city || '',
  postal_code: state.postal_code || '',
  country: state.country || '',
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, shipmentInstructionsSubmitNotifyPartyData),
  saveContact: promisifyAction(dispatch, contactsAddContact),
  shipmentLayoutGetData: promisifyAction(dispatch, shipmentLayoutGetData),
  showError: (message) => {dispatch(flashError(message))},
	showSuccess: (message) => {dispatch(flashSuccess(message))},
});

const mapStateToProps = (state: IGlobalState): any => ({
  displayForm: state.shipmentInstructions.data.show_notify_party,
  contacts: state.shipmentInstructions.data.contacts,
  email: (state.shipmentInstructions.data.notify_party || {}).email,
  phone: (state.shipmentInstructions.data.notify_party || {}).phone,
  name: (state.shipmentInstructions.data.notify_party || {}).name,
  address: (state.shipmentInstructions.data.notify_party || {}).address,
  city: (state.shipmentInstructions.data.notify_party || {}).city,
  postal_code: (state.shipmentInstructions.data.notify_party || {}).postal_code,
  country: (state.shipmentInstructions.data.notify_party || {}).country,
});

const initialState = {
  displayForm: false,
  contacts: [],
  email: '',
  phone: '',
  name: '',
  address: '',
  city: '',
  postal_code: '',
  country: '',
  baseState: {},
  errorNotes: {},
};

const contactType = 'company';

class NotifyPartyForm extends PureComponent<INotifyPartyFormProps, INotifyPartyFormState> {

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public componentDidMount() {
    this.setState({ baseState: this.props, ...this.props });
  }

  public render () {
    if (this.props.displayForm) {
      return (
        <div className="shipping-instructions__form">
          <div className="instructions-form">
            <p className="instructions-form__title">Notify Party Contact Details</p>
            <div className="instructions-form__content">
              <span className="instructions-form__content__buttons">
                {!this.props.isReadOnly && (
                  <span
                    className={`save-address ${!this.isChanged() ? 'disabled' : ''}`}
                    onClick={this.saveContact}
                  >
                    Save to Address Book
                  </span>
                )}
              </span>
              {this._renderInput("Email", 'email', 'first-field', true)}
              {this._renderInput("Phone", 'phone', 'half-width')}
              {this._renderInput("Name", 'name', 'half-width')}
              {this._renderInput("Address", 'address', 'half-width')}
              <div className="flex">
                {this._renderInput("City", 'city')}
                {this._renderInput("Postal code", 'postal_code')}
              </div>
              {this._renderInput("Country", 'country', 'half-width')}
              <div className="flex right-aligned">
                {!this.props.isReadOnly && (
                  <Button
                    className="instructions-form__submit-button"
                    disabled={!this.isChanged()}
                    onClick={this.submit}
                    color="green"
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else { return null }
  }

  private _renderInput(label: string, field: string, className?: string | '', displaySelect?: boolean | false) {
    const changed: string = this.isFieldChanged(field) ? 'changed' : '';
    return <FormFieldTextBasic
      disabled={this.props.isReadOnly}
      label={label}
      field={field}
      value={this.state[field]}
      displaySelect={displaySelect}
      contacts={this.state.contacts.filter((contact) => contact.contact_type === contactType )}
      className={`${className} ${changed}`}
      errorNotes={this.state.errorNotes[field]}
      onChange={this.handleFieldChange}
      onContactSelect={this.onContactSelect}
    />
  }

  private isFieldChanged(field: string): boolean {
    return prepareForRequest(this.state)[field] !== prepareForRequest(this.state.baseState)[field]
  }

  private isChanged() {
    return !this.props.isReadOnly
     && JSON.stringify(prepareForRequest(this.state)) !== JSON.stringify(prepareForRequest(this.state.baseState))
  }

  @bind
  private handleFieldChange(field: string, value: any): void{
    const errorNotes: any = Object.assign({}, this.state.errorNotes);
    errorNotes[field] = null;
    this.setState({ [field]: value, errorNotes });
  }

  @bind
  private onContactSelect(value: any): void{
    this.setState(prepareForRequest(value, true))
  }

  @bind
  private async saveContact(): Promise<any> {
    if (!this.isChanged()) { return null }
    try {
      const contact = prepareForRequest(this.state);
      contact.contact_type = contactType;
      await this.props.saveContact(withoutNullFields(contact));
      this.props.showSuccess('Your Notify Party contact have been saved to Address Book');
      this.setState({ errorNotes: {} })
    } catch (error) {
      this.props.showError('Your Notify Party contact hasn\'t been saved to Address Book. Please see the errors messages.');
      Logger.log(error);
      if (error.response || error.response.data || error.response.data.error_hash) {
        const hash = error.response.data.error_hash;
        const errorNotes: any = {};
        Object.keys(hash).forEach((k) => {
          errorNotes[k] = hash[k].map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(', ')
        });

        this.setState({ errorNotes })
      }
    }
  }

  @bind
  private async submit(): Promise<any>{
    try {
      await this.props.submit(withoutNullFields(prepareForRequest(this.state)), this.props.shipmentId);
      this.props.shipmentLayoutGetData(this.props.shipmentId);
      this.props.showSuccess('Your Notify Party details have been saved');
    } catch(error) {
      this.props.showError('Your Notify Party contact hasn\'t been saved to Address Book. Please see the errors messages.');
      Logger.log(error)
    }
  }
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(NotifyPartyForm);
