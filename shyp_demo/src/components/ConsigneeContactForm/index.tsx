import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { find, each } from 'lodash';

import { FormFieldTextBasic, Button } from '../../components';
import {
  shipmentInstructionsSubmitConsigneeContactData,
  contactsAddContact,
  flashSuccess,
  shipmentLayoutGetData,
  flashError,
} from '../../stores/actionCreators';
import { withoutNullFields, promisifyAction, Logger } from "../../utils";
import validators from './validators';
import './styles.scss';

interface IConsigneeContactFormProps {
  displayForm?: boolean;
  name?: string;
  email?: string;
  phone?: string;
	shipmentId?: any;
	submit: IActionPromiseFactory;
  saveContact: IActionPromiseFactory;
  shipmentLayoutGetData: IActionPromiseFactory;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

interface IConsigneeContactFormState {
  [x:string]: any;
}

const prepareForRequest = (state: IConsigneeContactFormState): any => ({
  name: state.name || '',
  email: state.email || '',
  phone: state.phone || '',
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, shipmentInstructionsSubmitConsigneeContactData),
  saveContact: promisifyAction(dispatch, contactsAddContact),
  shipmentLayoutGetData: promisifyAction(dispatch, shipmentLayoutGetData),
  showError: (message) => {dispatch(flashError(message))},
	showSuccess: (message) => {dispatch(flashSuccess(message))},
});

const mapStateToProps = (state: IGlobalState): any => ({
  displayForm: state.shipmentInstructions.data.show_consignee_contact,
  contacts: state.shipmentInstructions.data.contacts,
  name: (state.shipmentInstructions.data.consignee_contact || {}).name,
  email: (state.shipmentInstructions.data.consignee_contact || {}).email,
  phone: (state.shipmentInstructions.data.consignee_contact || {}).phone,
});

const initialState = {
  displayForm: false,
  contacts: [],
  phone: '',
  email: '',
  name: '',
  validators: [],
  baseState: {},
  errorNotes: {},
};

const contactType = 'person';

class ConsigneeContactForm extends PureComponent<IConsigneeContactFormProps, IConsigneeContactFormState> {

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
            <p className="instructions-form__title">Consignee Contacts Details</p>
            <div className="instructions-form__content">
              <span className="instructions-form__content__buttons">
                <span className={`save-address ${!this.isChanged() ? 'disabled' : ''}`} onClick={this.saveContact}>Save to Address Book</span>
              </span>
              {this._renderInput("Name", 'name', 'first-field', true)}
              {this._renderInput("Email", 'email', 'half-width')}
              {this._renderInput("Phone", 'phone', 'half-width')}
              <div className="flex right-aligned">
                <Button className="instructions-form__submit-button" disabled={!this.isChanged()} color="green" onClick={this.submit}>Save</Button>
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
      label={label}
      field={field}
      value={this.state[field]}
      className={`${className} ${changed}`}
      displaySelect={displaySelect}
      contacts={this.state.contacts.filter((contact) => contact.contact_type === contactType)}
      errorNotes={this.state.errorNotes[field]}
      onChange={this.handleFieldChange}
      onContactSelect={this.onContactSelect}
    />
  }

  private isFieldChanged(field: string): boolean {
    return prepareForRequest(this.state)[field] !== prepareForRequest(this.state.baseState)[field]
  }

  private isChanged() {
    return JSON.stringify(prepareForRequest(this.state)) !== JSON.stringify(prepareForRequest(this.state.baseState))
  }

  private checkValidation() {
    let isValid = true;
    const errorNotes: any = {};
    each(
	    validators,
      ({ field, validate }: IFieldValidator):void => {
        const errorMessage = validate(this.state[field]);
        if (errorMessage) {
          errorNotes[field] = errorMessage;
          isValid = false;
        }
      }
    );
    return [isValid, errorNotes]
  }

  @bind
  private handleFieldChange(field: string, value: any): void{
    const errorNotes: any = Object.assign({}, this.state.errorNotes);
    errorNotes[field] = null;
    this.setState({ [field]: value, errorNotes });
  }

  @bind
  private onContactSelect(value: any): void{
    this.setState(prepareForRequest(value))
  }

  @bind
  private async saveContact(): Promise<any> {
    if (!this.isChanged()) { return null }
    const errorMessage = 'Your Consignee Contact not been saved to Address Book. Please see the errors messages.';
    const [isValid, errorNotes] = this.checkValidation();
    if (isValid) {
      try {
        const contact = prepareForRequest(this.state);
        contact.contact_type = contactType;
        await this.props.saveContact(withoutNullFields(contact));
        this.props.showSuccess('Your Consignee Contact have been saved to Address Book');
        this.setState({ errorNotes: {} })
      } catch (error) {
        this.props.showError(errorMessage);
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
    } else {
      this.setState({ errorNotes });
      this.props.showError(errorMessage);
    }
  }

  @bind
  private async submit(): Promise<any>{
    const errorMessage = 'Your Consignee Contact could not be saved. Please see the errors messages.';
    const [isValid, errorNotes] = this.checkValidation();
    if (isValid) {
      try {
        await this.props.submit(withoutNullFields(prepareForRequest(this.state)), this.props.shipmentId);
        this.props.shipmentLayoutGetData(this.props.shipmentId);
        this.props.showSuccess('Your Consignee Contact details have been saved.');
        this.setState({ errorNotes: {} })
      } catch(error) {
        Logger.log(error);
	      this.props.showError(errorMessage);
      }
    } else {
      this.setState({ errorNotes });
      this.props.showError(errorMessage);
    }
  }
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(ConsigneeContactForm);
