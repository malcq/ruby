import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { find, each } from 'lodash';

import { FormFieldTextBasic, Button } from '../../components';
import {
  shipmentInstructionsSubmitShipperCompanyData,
  contactsAddContact,
  flashSuccess,
  shipmentLayoutGetData,
  flashError,
} from '../../stores/actionCreators';
import { withoutNullFields, promisifyAction, Logger } from "../../utils";
import validators from './validators';
import './styles.scss';

interface IShipperCompanyFormProps {
  displayForm?: boolean;
  company_name?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  vat_number?: string;
  eori_number?: string;
  submit: IActionPromiseFactory;
  saveContact: IActionPromiseFactory;
  shipmentLayoutGetData: IActionPromiseFactory;
	showSuccess: (message: string) => void;
  showError: (message: string) => void;
	shipmentId?: any;
	isReadOnly: boolean;
}

interface IShipperCompanyFormState {
  [x:string]: any;
}

const prepareForRequest = (state: IShipperCompanyFormState, isContact?: boolean | false): any => ({
  company_name: (isContact ? state.name : state.company_name) || '',
  address: state.address || '',
  city: state.city || '',
  postal_code: state.postal_code || '',
  country: state.country || '',
});

const prepareForSaveContact = (state: IShipperCompanyFormState): any => ({
  name: state.company_name,
  address: state.address,
  city: state.city,
  postal_code: state.postal_code,
  country: state.country,
  contact_type: contactType,
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, shipmentInstructionsSubmitShipperCompanyData),
  saveContact: promisifyAction(dispatch, contactsAddContact),
  shipmentLayoutGetData: promisifyAction(dispatch, shipmentLayoutGetData),
	showSuccess: (message) => {dispatch(flashSuccess(message))},
  showError: (message) => {dispatch(flashError(message))},
});

const mapStateToProps = (state: IGlobalState): any => ({
  displayForm: state.shipmentInstructions.data.show_shipper_company,
  contacts: state.shipmentInstructions.data.contacts,
  company_name: (state.shipmentInstructions.data.shipper || {}).company_name,
  address: (state.shipmentInstructions.data.shipper || {}).address,
  city: (state.shipmentInstructions.data.shipper || {}).city,
  postal_code: (state.shipmentInstructions.data.shipper || {}).postal_code,
  country: (state.shipmentInstructions.data.shipper || {}).country,
});

const initialState = {
  displayForm: false,
  contacts: [],
  company_name: '',
  address: '',
  postal_code: '',
  city: '',
  country: '',
  validators: [],
  errorNotes: {},
  baseState: {},
};

const contactType = 'company';

class ShipperCompanyForm extends PureComponent<IShipperCompanyFormProps, IShipperCompanyFormState> {

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public componentDidMount() {
    this.setState({
      baseState: this.props,
      ...this.props
    });
  }

  public render () {
    if (this.props.displayForm) {
      return (
        <div className="shipping-instructions__form">
          <div className="instructions-form">
            <p className="instructions-form__title">Shipper Company Details</p>
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
              {this._renderInput("Company Name", 'company_name', 'first-field', true)}
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
    this.setState(prepareForRequest(value, true))
  }

  @bind
  private async saveContact(): Promise<any> {
    if (!this.isChanged()) { return null }

    const errorMessage = 'Your Shipper Company contact not been saved to Address Book. Please see the errors messages.';
    const [isValid, errorNotes] = this.checkValidation();
    if (isValid) {
      try {
        await this.props.saveContact(withoutNullFields(prepareForSaveContact(this.state)));
        this.props.showSuccess('Your Shipper Company contact have been saved to Address Book');
        this.setState({ errorNotes: {} })
      } catch (error) {
        this.props.showError(errorMessage);
        Logger.log(error);
        if (error.response || error.response.data || error.response.data.error_hash) {
          const hash = error.response.data.error_hash;
          const errorNotes: any = {};
          Object.keys(hash).forEach((k) => {
            let key = k;
            if (key === 'name'){ key = 'company_name' }
            errorNotes[key] = hash[k].map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(', ')
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
    const errorMessage = 'Your Shipper Company could not be saved. Please see the errors messages.';
    const [isValid, errorNotes] = this.checkValidation();
    if (isValid) {
      try {
        await this.props.submit(withoutNullFields(prepareForRequest(this.state)), this.props.shipmentId);
        this.props.shipmentLayoutGetData(this.props.shipmentId);
        this.props.showSuccess('Your Shipper Company details have been saved.');
        this.setState({ errorNotes: {} })
      } catch(error) {
        this.props.showError(errorMessage);
        Logger.log(error)
      }
    } else {
      this.setState({ errorNotes });
      this.props.showError(errorMessage);
    }
  }
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(ShipperCompanyForm);
