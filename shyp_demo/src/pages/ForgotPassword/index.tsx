import bind from 'autobind-decorator';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types'
import React, { Component, EventHandler } from 'react';
import { InjectedAuthReduxProps } from "redux-auth-wrapper/history3/redirect";
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { isEmail } from 'validator';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import { get } from 'lodash';

import { selfURL } from '../../config/local.json';
import LoginLayout from './Layout';
import { promisifyAction } from "../../utils";
import { userForgotPassword, flashError } from "../../stores/actionCreators";
import { LoginHeader, Button } from '../../components';
import './styles.scss';

interface ILoginFieldSubstate {
  error: boolean;
  note: string;
  value: string;
}

interface ILoginState {
  [x: string]: ILoginFieldSubstate | string | boolean;
  email: ILoginFieldSubstate;
  note: string;
}

interface ILoginProps extends InjectedAuthReduxProps {
  submit: IActionPromiseFactory;
  query: string;
  showError: (message: string, duration?: number) => void;
}

const mapStateToProps = (state: IGlobalState): any => ({
  query: get(state.routing, 'location.search'),
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, userForgotPassword),
  showError(message: string, duration?: number): void {
    dispatch(flashError(message, duration));
  }
});

const messagesMap = {
  user_not_found: 'Your password reset link has expired, please request a new email to reset your password.',
  invitation_invalid: 'Your invitation link has expired or not valid. Please contact us via email or Drift.'
};

class ForgotPassword extends Component<ILoginProps, ILoginState> {
  public static propTypes = {
    submit: PropTypes.func,
  };
  public static defaultProps = {
    submit: (values: { email: string }):boolean => true,
  };
  public handleEmailChange: EventHandler<any>;

  constructor(props: any, context: any){
    super(props, context);
    this.state = {
      email: {
        error: false,
        note: '',
        value: '',
      },
      note: '',
    };
    this.handleEmailChange = this.createFieldChangeHandler(
      'email',
    );
  }

  public componentDidMount() {
    const query = parse(this.props.query);
    if (query.success === 'false' && this.props.showError) {
      this.props.showError(messagesMap[query.reason], 8000 /* 8 sec */)
    }
  }

  public render() {
    const { email } = this.state;
    return (
      <div>
        <LoginHeader />
        <LoginLayout

          emailField={
            <TextField
              fullWidth={true}
              label={email.note ? `Email - ${email.note}` : "Email"}
              value={email.value}
              error={email.error}
              onChange={this.handleEmailChange}
              InputLabelProps={{
                classes: {
                  root: 'login-page__input-label mui-override',
                },
                FormLabelClasses: {
                  focused: 'login-page__input-label_focused mui-override',
                  error: 'login-page__input-label_error mui-override',
                }
              }}
              InputProps={{
                classes: {
                  input: 'login-page__input-component mui-override',
                  focused: 'login-page__input_focused mui-override',
                }
              }}
              classes={{
                root: 'login-page__input mui-override',
              }}
            />
          }

          back={
            <Link
              to="/login"
              className="login-page__link"
            >
              Back to log in
            </Link>
          }

          button={
            <Button
              onClick={this.submit}
              disabled={this.isError()}
            >
              Reset password
            </Button>
          }

        />
      </div>
    );
  }

  @bind
  private async submit(): Promise<any>{
    const { email } = this.state;
    if (isEmail(email.value)) {
      try {
        await this.props.submit({
          email: email.value,
          redirect_url: `${selfURL}/change-password`
        })
      } catch(error) {
        this.setState((state, props) => ({
          email: {
            ...state.email,
            error: true,
          }
        }))
      }
    } else {
      this.setState({
        email: {
          ...email,
          error: true,
          note: 'Invalid Email',
        }
      })
    }
  }

  private isError(): boolean{
    const { email } = this.state;
    return !!email.error
  }

  private createFieldChangeHandler(
    stateField: string,
    validator?: (value: string) => boolean,
    note: string = '',
  ): React.EventHandler<any> {
    const self = this;
    function changeHandler (event: any): void {
      const { value } = event.target;
      const error = !!(validator && !validator(value));
      self.setState({
        [stateField]: {
          error,
          note: self.state.note || error ? note : '',
          value,
        },
      });
    }
    return changeHandler;
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
