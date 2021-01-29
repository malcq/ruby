import React, { PureComponent } from 'react';
import bind from 'autobind-decorator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { each } from 'lodash';

import { FormLayout, FormTextField, FormFieldGroup, Checkbox } from '../';
import { userSubmitUserData, flashSuccess, flashError } from '../../stores/actionCreators';
import './styles.scss';
import { Logger, withoutNullFields, promisifyAction } from "../../utils";
import validators, { IFieldValidator } from './validators';

interface IAccountInfoFormProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  isFollowingNewShipments: boolean;
  submit: (formState: Partial<IAccountInfoFormState>) => void;
  showNotificationUpdated: (message: string) => void;
  showError: (message: string, duration?: number) => void;

}

interface IAccountInfoFormState {
  [x:string]: any,
}

const prepareForRequest = (state: IAccountInfoFormState): any => ({
  email: state.email,
  password: state.password,
  first_name: state.firstName,
  last_name: state.lastName,
  follow_new_shipments: state.isFollowingNewShipments,
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, userSubmitUserData),
  showNotificationUpdated(message: string): void{ dispatch(flashSuccess(message)); },
  showError(message: string, duration?: number): void {
    dispatch(flashError(message, duration))
  }
});

const mapStateToProps = (state: IGlobalState): any => ({
  email: state.user.email,
  firstName: state.user.firstName,
  lastName: state.user.lastName,
  isFollowingNewShipments: state.user.isFollowingNewShipments,
});

const initialState = {
  busy: false,
  email: null,
  password: null,
  firstName: null,
  lastName: null,
  isFollowingNewShipments: null,
  errorNotes: {},
};

class AccountInfoForm extends PureComponent<IAccountInfoFormProps, IAccountInfoFormState> {

  public static propTypes = {
    email: PropTypes.string,
    password: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isFollowingNewShipments: PropTypes.bool,
    submit: PropTypes.func.isRequired,
    showNotificationUpdated: PropTypes.func.isRequired,
  };

  public static defaultProps = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isFollowingNewShipments: false,
  };

  constructor (props, context) {
    super(props, context);
    this.state=initialState;
  }

  public render () {
    return (
      <FormLayout
        label="Account information"
        buttonText="Update account information"
        icon="account"
        disabled={!!this.state.busy}
        submit={this.submit}
      >
        <FormTextField
          disabled={true}
          label="Email"
          fieldName="email"
          fallbackValue={this.props.email}
          value={this.state.email}
          onChange={this.handleFieldChange}
        />
        <FormTextField
          label="Password"
          fieldName="password"
          type="password"
          value={this.state.password}
          onChange={this.handleFieldChange}
        />
        <FormTextField
          label="First Name"
          fieldName="firstName"
          fallbackValue={this.props.firstName}
          value={this.state.firstName}
          onChange={this.handleFieldChange}
          errorNote={this.state.errorNotes.firstName}
        />
        <FormTextField
          label="Last Name"
          fieldName="lastName"
          fallbackValue={this.props.lastName}
          value={this.state.lastName}
          onChange={this.handleFieldChange}
        />
        <FormFieldGroup align="center">
          <label className="account-info-form__checkbox-group">
            <Checkbox
              checked={(this.state.isFollowingNewShipments == null)
                ? !!this.props.isFollowingNewShipments
                : this.state.isFollowingNewShipments
              }
              onChange={this.handleCheckFollowShipments}
            />
            Automatically follow new shipments
          </label>
        </FormFieldGroup>
      </FormLayout>
    );
  }

  @bind
  private handleFieldChange(field: string, value: any): void{
    this.setState({ [field]: value })
  }
  // If state is about to become the same as props,
  // it is set to null so no change would apply.

  @bind
  private handleCheckFollowShipments(event: any): void{
    this.setState((state: IAccountInfoFormState, props: IAccountInfoFormProps):Partial<IAccountInfoFormState> => ({
      isFollowingNewShipments:
        (state.isFollowingNewShipments !== null)
        ? null
        : !props.isFollowingNewShipments
    }))
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
      this.setState({ busy: true });
      try {
        await this.props.submit(withoutNullFields(prepareForRequest(this.state)));
        this.setState(initialState);
        this.props.showNotificationUpdated('Account information updated');
      } catch(error) {
        this.setState({ busy: false });
      }
    } else {
      this.setState(newState);
      this.props.showError(
        'Account information could not be updated. Please see the error message(s)',
        5000 /* 5 sec */
      )
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfoForm);
