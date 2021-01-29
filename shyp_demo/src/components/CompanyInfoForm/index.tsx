import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { pick, each } from 'lodash';

import { FormLayout, FormTextField, MenuItem } from '../';
import { withoutNullFields, promisifyAction } from "../../utils";
import { countriesGetCountries, flashSuccess, flashError, userSubmitProfile } from "../../stores/actionCreators";
import validators, { IFieldValidator } from './validators';

interface ICompanyInfoFormProps {
  companyName?: string;
  phone?: string;
  street?: string;
  number? : string;
  postalCode?: string;
  city?: string;
  countryId?: number;
  vatNumber?: string;
  submit: (formState: Partial<ICompanyInfoFormState>) => void;
  showNotificationUpdated: (message: string) => void;
  showError: (message: string, duration?: number) => void;
  retrieveCountryOptions: IActionPromiseFactory;
  countryOptions: ICountry[];
}

interface ICompanyInfoFormState {
  [x:string]: any,
}

interface IErrorNotes {
  [x: string]: string
}

const prepareForRequest = (state: ICompanyInfoFormState): any => ({
  company_name: state.companyName,
  phone: state.phone,
  street: state.street,
  number: state.number,
  postal_code: state.postalCode,
  city: state.city,
  country_id: state.countryId,
  vat_number: state.vatNumber,
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, userSubmitProfile),
  retrieveCountryOptions: promisifyAction(dispatch, countriesGetCountries),
  showNotificationUpdated(message: string): void{ dispatch(flashSuccess(message)); },
  showError(message: string, duration?: number): void {
    dispatch(flashError(message, duration))
  }
});

const mapStateToProps = (state: IGlobalState): any => ({
  ...pick(state.user, [
    'companyName',
    'phone',
    'street',
    'number',
    'postalCode',
    'city',
    'countryId',
    'vatNumber'
  ]),
  countryOptions: state.countries.list,
});

const initialState = {
  companyName: null,
  phone: null,
  street: null,
  number: null,
  postalCode: null,
  city: null,
  countryId: null,
  vatNumber: null,
  busy: false,
  errorNotes: {},
};

class CompanyInfoForm extends PureComponent<ICompanyInfoFormProps, ICompanyInfoFormState> {

  public static propTypes = {
    companyName: PropTypes.string,
    phone: PropTypes.string,
    street: PropTypes.string,
    number: PropTypes.string,
    postalCode: PropTypes.string,
    city: PropTypes.string,
    countryId: PropTypes.number,
    vatNumber: PropTypes.string,
    countryOptions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    submit: PropTypes.func.isRequired,
    showNotificationUpdated: PropTypes.func.isRequired,
    retrieveCountryOptions: PropTypes.func.isRequired,
  };

  public static defaultProps = {
    companyName: '',
    phone: '',
    street: '',
    number: '',
    postalCode: '',
    city: '',
    countryId: 0,
    vatNumber: '',
    countryOptions: []
  };

  constructor (props, context) {
    super(props, context);
    this.state=initialState;
  }

  public async componentDidMount(){
    this.setState({ busy: true });
    try{
      await this.props.retrieveCountryOptions()
    } finally {
      this.setState({ busy: false })
    }
  };

  public render () {
    return (
      <FormLayout
        label="Company information"
        buttonText="Update company information"
        icon="restaurant"
        disabled={this.state.busy}
        submit={this.submit}
      >
        <FormTextField
          label="Company name"
          fieldName="companyName"
          fallbackValue={this.props.companyName}
          value={this.state.companyName}
          onChange={this.handleFieldChange}
          errorNote={this.state.errorNotes.companyName}
        />
        <FormTextField
          label="Phone"
          fieldName="phone"
          fallbackValue={this.props.phone}
          value={this.state.phone}
          onChange={this.handleFieldChange}
        />
        <FormTextField
          label="Street"
          fieldName="street"
          fallbackValue={this.props.street}
          value={this.state.street}
          onChange={this.handleFieldChange}
        />
        <FormTextField
          label="Street number"
          fieldName="number"
          fallbackValue={this.props.number}
          value={this.state.number}
          onChange={this.handleFieldChange}
         />
        <FormTextField
          label="Postal code"
          fieldName="postalCode"
          fallbackValue={this.props.postalCode}
          value={this.state.postalCode}
          onChange={this.handleFieldChange}
        />
        <FormTextField
          label="City"
          fieldName="city"
          fallbackValue={this.props.city}
          value={this.state.city}
          onChange={this.handleFieldChange}
        />
        <FormTextField
          type="select"
          label="Country"
          fieldName="countryId"
          fallbackValue={this.props.countryId}
          value={this.state.countryId}
          onChange={this.handleFieldChange}
          options={this.props.countryOptions}
        />
        <FormTextField
          disabled={!!this.props.vatNumber}
          label="VAT number"
          fieldName="vatNumber"
          fallbackValue={this.props.vatNumber}
          value={this.state.vatNumber}
          onChange={this.handleFieldChange}
        />
      </FormLayout>
    );
  }

  @bind
  private handleFieldChange(field: string, value: any): void{
    this.setState({ [field]: value })
  }

  @bind
  private async submit(): Promise<any>{
    let isValid = true;
    const newState: any = { errorNotes: {} };

    each(
      validators,
      ({ field, validate }: IFieldValidator):void => {
        const errorMessage = validate(this.state[field]);
        if (errorMessage) {
          newState.errorNotes[field] = errorMessage;
          isValid = false;
        }
      }
    );

    if(isValid){
      this.setState({ busy: true});
      try{
        await this.props.submit(withoutNullFields(prepareForRequest(this.state)));
        this.setState(initialState);
        this.props.showNotificationUpdated('Company information updated');
      } catch(error) {
        this.setState({ busy: false })
      }
    } else {
      this.setState(newState);
      this.props.showError(
        'Company information could not be updated. Please see the error message(s)',
        5000 /* 5 sec */
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfoForm);
