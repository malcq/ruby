import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import bind from 'autobind-decorator';
import { connect } from 'react-redux';
import { find, each, get } from 'lodash';
import { Dispatch } from 'redux';
import { replace } from 'react-router-redux';
import { LocationDescriptor } from 'history';
import { parse } from 'query-string';
import { Location } from 'history';


import {
  FormLayout,
  FormTextField,
  MenuItem,
  Button,
  ConfirmDialog,
  Contact,
  Paper,
} from '../../components';
import { withoutNullFields, promisifyAction, Logger } from '../../utils';
import {
  contactsAddContact,
  contactsPutContact,
  contactsGetData,
  contactsDeleteContact,
  companiesGetData,
  flashSuccess,
  flashError,
  flagsNotFound,
} from '../../stores/actionCreators';
import validators, { IFieldValidator } from './validators';
import './styles.scss';



interface IAddressBookEditProps extends IRouteProps{
  contacts: IContact[];
  companies?: ICompany[] | null;
  createContact: IActionPromiseFactory;
  editContact: IActionPromiseFactory;
  deleteContact: IActionPromiseFactory;
  getCompanies: IActionPromiseFactory;
  getContacts: IActionPromiseFactory;
  toLocation: (location: LocationDescriptor) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  raiseNotFoundFlag: () => void;
}

interface IErrorNotes {
  [x: string]: string
}

interface IRouteProps {
  match: IMatch | null;
  location: Location<string | undefined>;
}

interface IAddressBookEditState {
  contact: { [x:string]: any };
  validators: IFieldValidator[];
  errorNotes: IErrorNotes;
  isCreation: boolean;
  isPerson: boolean;
  dialogIsOpen: boolean;
  busy: boolean;
}



const nullContact = {
  id: null,
  contact_type: null,
  name: null,
  address: null,
  postal_code: null,
  city: null,
  country: null,
  vat_number: null,
  eori_number: null,
  email: null,
  phone: null,
  company_id: null,
};

const initialState = {
  contact: nullContact,
  busy: false,
  isCreation: false,
  isPerson: false,
  dialogIsOpen: false,
  errorNotes: {},
  validators: [],
};

const mapStateToProps = (state: IGlobalState, props: IRouteProps) => ({
  contacts: state.contacts.list,
  companies: state.companies.list,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createContact: promisifyAction(dispatch, contactsAddContact),
  editContact: promisifyAction(dispatch, contactsPutContact),
  deleteContact: promisifyAction(dispatch, contactsDeleteContact),
  getCompanies: promisifyAction(dispatch, companiesGetData),
  getContacts: promisifyAction(dispatch, contactsGetData),
  showSuccess (message: string, duration: number): void {
    dispatch(flashSuccess(message, duration));
  },
  showError (message: string, duration: number): void {
    dispatch(flashError(message, duration));
  },
  toLocation(location: LocationDescriptor): void { dispatch(replace(location)); },
  raiseNotFoundFlag(): void { dispatch(flagsNotFound(true)); }
});


class AddressBookEdit extends PureComponent<IAddressBookEditProps, IAddressBookEditState> {

  public static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      contact_type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string,
      postal_code: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      vat_number: PropTypes.string,
      eori_number: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string.isRequired,
      company_id: PropTypes.number,
    }).isRequired).isRequired,
    companies: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    ).isRequired,
    createContact: PropTypes.func.isRequired,
    editContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired,
    getCompanies: PropTypes.func.isRequired,
    getContacts: PropTypes.func.isRequired,
    toLocation: PropTypes.func.isRequired,
    showSuccess: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    raiseNotFoundFlag: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      hash: PropTypes.string.isRequired,
      key: PropTypes.any,
    }).isRequired,
  };

  public static defaultProps = {
    contact: null,
    companies: [],
  };

  public readonly state = initialState;

  public async componentDidMount() {
    await this.initialize()
  }

  public render () {
    if (this.state.busy) { return null; }
    const contact = this.getCurrentContact();
    const errorNotes: IErrorNotes = this.state.errorNotes;
    const payload = this.state.contact;
    const companies = this.props.companies || [];

    const { isPerson, isCreation } = this.state;

    let companyRelatedContacts: IContact[] = [];
    if (!isPerson && !isCreation) {
      const contacts = this.props.contacts || [];
      companyRelatedContacts = contacts.filter((personContact: IContact):boolean =>
        personContact.contact_type === 'person'
        && contact.id === personContact.company_id
      )

    }
    return (
      <article className="address-book-edit">
        <header className="address-book-edit__button-container">
          <Button
            className="address-book-edit__button"
            color="blue-outline"
            onClick={this.goBack}
          >
            <i className="icon chevron hrevert address-book-edit__button-icon" />
            Back to address book
          </Button>
        </header>
        <FormLayout
          buttonColor="green"
          icon={isPerson ? 'person' : 'company'}
          label={
            isCreation
              ? `Create ${isPerson ? 'Person' : 'Company'} Contact`
              : `${isPerson ? 'Person' : 'Company'} Contact Details`
          }
          buttonText={`${isCreation ? 'Create' : 'Update'} Contact`}
          submit={this.submit}

          rightCornerContent={
            !isCreation &&
            <Button color="red" onClick={this.openDialog}>
              Delete Contact
            </Button>
          }

          footer={(companyRelatedContacts.length > 0) && (
            <Paper className="address-book-edit__person-list">
              <div className="address-book-edit__person-list-title">Person contacts</div>
                { companyRelatedContacts.map(linkedContact => (
                    <Contact
                      key={linkedContact.id}
                      contact={linkedContact}
                      toEditing={this.toContactEditing}
                    />
                  ))
                }
            </Paper>
          )}
        >
          <FormTextField
            label="Name"
            isRequired={true}
            fieldName="name"
            value={payload.name}
            fallbackValue={contact.name}
            errorNote={errorNotes.name}
            onChange={this.handleFieldChange}
          />
          {!isPerson &&
            <>
              <FormTextField
                label="Address"
                isRequired={true}
                fieldName="address"
                value={payload.address}
                fallbackValue={contact.address}
                errorNote={errorNotes.address}
                onChange={this.handleFieldChange}
              />
              <FormTextField
                label="Postal code"
                isRequired={true}
                fieldName="postal_code"
                value={payload.postal_code}
                fallbackValue={contact.postal_code}
                errorNote={errorNotes.postal_code}
                onChange={this.handleFieldChange}
              />
              <FormTextField
                label="City"
                isRequired={true}
                fieldName="city"
                value={payload.city}
                fallbackValue={contact.city}
                errorNote={errorNotes.city}
                onChange={this.handleFieldChange}
              />
              <FormTextField
                label="Country"
                isRequired={true}
                fieldName="country"
                value={payload.country}
                fallbackValue={contact.country}
                errorNote={errorNotes.country}
                onChange={this.handleFieldChange}
              />
              <FormTextField
                label="VAT number"
                fieldName="vat_number"
                value={payload.vat_number}
                fallbackValue={contact.vat_number}
                errorNote={errorNotes.vat_number}
                onChange={this.handleFieldChange}
              />
              <FormTextField
                label="Eori number"
                fieldName="eori_number"
                value={payload.eori_number}
                fallbackValue={contact.eori_number}
                errorNote={errorNotes.eori_number}
                onChange={this.handleFieldChange}
              />
            </>
          }
          <FormTextField
            label="Email"
            isRequired={isPerson}
            fieldName="email"
            value={payload.email}
            fallbackValue={contact.email}
            errorNote={errorNotes.email}
            onChange={this.handleFieldChange}
          />
          <FormTextField
            label="Phone"
            isRequired={isPerson}
            fieldName="phone"
            value={payload.phone}
            fallbackValue={contact.phone}
            errorNote={errorNotes.phone}
            onChange={this.handleFieldChange}
          />
          {isPerson &&
            <FormTextField
              type="select"
              label="Company"
              fieldName="company_id"
              value={payload.company_id}
              fallbackValue={contact.company_id}
              errorNote={errorNotes.company_id}
              onChange={this.handleFieldChange}
              options={companies}
            />
          }
        </FormLayout>
        <ConfirmDialog
          title="Delete contact"
          message={`Are you sure you want to delete contact "${contact.name}?"`}
          isOpen={this.state.dialogIsOpen}
          confirm={this.deleteContact}
          reject={this.closeDialog}
          onClose={this.closeDialog}
        />
      </article>
    );
  }

  private showSubmitError(): void {
    this.props.showError(
      'Your contact could not be saved. Please see the error message(s)',
      5000 /* 5 sec */
    )
  }

  private async initialize(){
    window.scrollTo(0,0);
    const { match, location, toLocation, getCompanies } = this.props;
    if (match) {
      if (match.path.endsWith('edit')){
        this.setState({ busy: true });

        try {
          await this.getData();
        } catch (error) {
          Logger.error(error);
        }
        const contact = this.getCurrentContact();
        if (
          contact.id == null
          // && this.props.raiseNotFoundFlag
        ) {
          // this.props.raiseNotFoundFlag();
          this.props.toLocation('/dashboard')
        }
        const isPerson = !!(contact && contact.contact_type === 'person');

        this.setState({
          isCreation: false,
          busy: false,
          isPerson,
          validators: [
            ...validators.common,
            ...(isPerson ? validators.person.editing : validators.company.editing)
          ],
        })
      }
      if (match.path.endsWith('new')){
        const queryParams = parse(location.search);
        const isPerson = queryParams.type === 'person';
        this.setState({ busy: true });

        try {
          await getCompanies()
        } catch (error) {
          Logger.error(error)
        }

        this.setState({
          busy: false,
          isCreation: true,
          isPerson,
          validators: [
            ...validators.common,
            ...(isPerson ? validators.person.creation : validators.company.creation),
          ],
        })
      }
    }
  }

  private async getData(): Promise<any> {
    const { toLocation, getContacts, getCompanies } = this.props;
    try {
      await getContacts();
    } catch(error) {
      this.props.showError('Failed to retrieve contacts');
      Logger.error(error)
    }
    const contact = this.getCurrentContact();
    if (contact) {
      try {
        await getCompanies()
      } catch (error) {
        this.props.showError('Failed to retrieve company list');
        Logger.error(error)
      }
    } else {
      toLocation('/contacts/')
    }
  }

  private getCurrentContact(): IContact{
    return find(this.props.contacts, {
      id: ( this.props.match ? +this.props.match.params.id : -1 ),
    }) || nullContact;
  }

  @bind
  private async toContactEditing(id: number):Promise<any>{
    this.props.toLocation(`/contacts/${id}/edit`);
    await this.initialize()
  }

  @bind
  private closeDialog():void {
    this.setState({ dialogIsOpen: false })
  }

  @bind
  private openDialog():void {
    this.setState({ dialogIsOpen: true })
  }

  @bind
  private handleFieldChange(field: string, value: any): void{
    this.setState((state) => ({
      contact: { ...state.contact, [field]: value },
      errorNotes: (state.errorNotes[field])
        ? { ...state.errorNotes, [field]: '' }
        : state.errorNotes
    }));
  }

  @bind
  private async deleteContact(): Promise<any> {
    const contact = this.getCurrentContact();
    if (contact){
      try{
        await this.props.deleteContact(contact.id);
        this.setState({ dialogIsOpen: false });
        this.props.showSuccess(`Contact "${contact.name}" deleted`);
        this.props.toLocation('/contacts/');
      } catch (error) {
        this.props.showError('Unable to delete contact');
        Logger.error(error)
      }
    }
  }

  @bind goBack(): void{
    const { toLocation } = this.props;
    if (toLocation) {
      toLocation('/contacts/');
    }
  }

  @bind
  private async submit(): Promise<any>{
    const newState: any = { errorNotes: {} };
    let isValid = true;
    let isCreated = false;

    if (isValid) {
      try {
        if(this.state.isCreation){
          await this.props.createContact({
            ...withoutNullFields(this.state.contact),
            contact_type: this.state.isPerson ? 'person' : 'company',
          });
          this.props.toLocation('/contacts/');
          isCreated =true;
        } else {
          const contact = this.getCurrentContact();
          if (contact) {
            await this.props.editContact(contact.id, withoutNullFields(this.state.contact));
            newState.contact = nullContact;
          }
        }
      } catch(error) {
        if (error.response && error.response.status === 422) {
          const errorNotes: any = {};
          each(error.response.data.error_hash, (value, item) => {
            errorNotes[item] = value[0];
          });
          newState.errorNotes = errorNotes;
        }
        this.showSubmitError();
        Logger.error(error);
      }
    } else {
      this.showSubmitError();
    }
    if(!isCreated){
      this.setState(newState);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookEdit);
