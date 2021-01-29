import bind from 'autobind-decorator';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { stringify } from 'querystring';

import LoginLayout from './Layout';
import { promisifyAction } from "../../utils";
import { userChangePassword } from "../../stores/actionCreators";
import { InjectedAuthReduxProps } from "redux-auth-wrapper/history3/redirect";
import { LoginHeader, Button } from '../../components';
import { LocationDescriptor } from 'history';
import { push } from 'react-router-redux';
import './styles.scss';
import { parseQuery } from '../../utils';

interface ILoginFieldSubstate {
  error: boolean;
  note: string;
  value: string;

}

interface ILoginState {
  [x: string]: ILoginFieldSubstate | string | boolean;
  confirm_password: ILoginFieldSubstate;
  password: ILoginFieldSubstate;
  note: string;
  email: string;
  urlAfterLogin: string;
  isNewUser: boolean;
}

interface ILoginProps extends InjectedAuthReduxProps {
  query: string;
  submit: IActionPromiseFactory;
  toLocation: (location: LocationDescriptor) => void;
}

interface ILoginQuery {
  email: string,
  redirect?: string,
}

const mapStateToProps = (state: IGlobalState): any => ({
  query: get(state.routing, 'location.search'),
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, userChangePassword),
  toLocation(location){ dispatch(push(location)); }
});

class ResetPassword extends Component<ILoginProps, ILoginState> {
  public static propTypes = {
    submit: PropTypes.func.isRequired,
    toLocation: PropTypes.func.isRequired,
  };

  constructor(props: any, context: any){
    super(props, context);
    this.state = {
      confirm_password: {
        error: false,
        note: '',
        value: '',
      },
      password: {
        error: false,
        note: '',
        value: '',
      },
      note: '',
      email: '',
      urlAfterLogin: '',
      isNewUser: false,
    };
  }

  public componentDidMount() {
    const query = parseQuery(this.props.query);
    const isNewUser = !!query.invitation_token;
    const email: any = (query.uid instanceof Array)
      ? query.uid.join()
      : query.uid || '';

    if (query.success === 'false' && this.props.toLocation) {
      if (isNewUser) {
        this.props.toLocation({
          pathname: '/login',
          search: stringify({ ...query, email, redirect: '/account'})
        })
      }
      else {
        this.props.toLocation({
          pathname: '/forgot-password',
          search: this.props.query,
        })
      }
    }
    else {
      if (isNewUser) {
        this.setState({
          email, isNewUser, urlAfterLogin: '/account',
        });
      }
      else {
        this.setState({ email });
      }
    }
  }

  public render() {
    const { confirm_password, email, password, isNewUser } = this.state;
    return (
      <div>
        <LoginHeader />
        <LoginLayout
          title='Set your password'
          email={email}
          passwordField={
            <TextField
              type="password"
              label={password.note ? `Password - ${password.note}` : "Password"}
              fullWidth={true}
              value={password.value}
              error={password.error}
              onChange={this.passwordChangeHandler}
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
              id="password"
              inputProps={{ autoComplete: 'off', name: 'change_password_1' }}
            />
          }
          confirmPasswordField={
            <TextField
              type="password"
              fullWidth={true}
              label={confirm_password.note ? `Confirm password - ${confirm_password.note}` : "Confirm password"}
              value={confirm_password.value}
              error={confirm_password.error}
              onChange={this.confirmPasswordChangeHandler}
              InputLabelProps={{
                classes: {
                  root: 'login-page__input-label mui-override',
                },
                FormLabelClasses: {
                  focused: 'login-page__input-label_focused mui-override',
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
              id="confirm_password"
              inputProps={{ autoComplete: 'off', name: 'change_password_2' }}
            />
          }
          back={
            <Link
              to='/login'
              className="login-page__link"
            >
              Back to log in
            </Link>
          }

          button={
            <Button
              onClick={this.submit}
              className="change-password-page__button"
            >
              Set my password
            </Button>
          }

        />
      </div>
    );
  }

  @bind
  private async submit(): Promise<any>{
    const { confirm_password, password } = this.state;
    if (!this.isValid()) {
      try {
        await this.props.submit({
          password_confirmation: confirm_password.value,
          password: password.value,
        });
        const query: ILoginQuery  = {
          email: this.state.email,
        };
        if(this.state.urlAfterLogin) {
          query.redirect = this.state.urlAfterLogin;
        }
        this.props.toLocation({
          pathname: '/login',
          search: stringify(query)
        });
      } catch(error) {
        this.setState((state, props) => ({
          password: {
            ...state.password,
            error: true,
          },
          confirm_password: {
            ...state.confirm_password,
            error: true,
          }
        }))
      }
    }
  }

  private confirmPasswordChangeHandler = ({ target: { value } }) => {
    this.setState((state, props) => ({
      confirm_password: {
        ...state.confirm_password,
        error: false,
        note: '',
        value,
      },
    }));
  };

  private passwordChangeHandler = ({ target: { value } }) => {
    this.setState((state, props) => ({
      password: {
        ...state.password,
        error: false,
        note: '',
        value,
      },
    }));
  };

  private isValid = () => {
    const {password: {value: passValue}, confirm_password: {value: confPassValue}} = this.state;
    let passError = false;
    let passNote = '';
    let confPassError = false;
    let confPassNote = '';
    if(!passValue.replace( /\D/g, '')) {
      passError = true;
      passNote = 'Should include at least 1 number'
    }
    if(passValue.length < 6) {
      passError = true;
      passNote = 'Should be at least 6 characters'
    }
    if(confPassValue !== passValue) {
      confPassError = true;
      confPassNote = 'Passwords don’t match'
    }
    this.setState((state, props) => ({
      password: {
        ...state.password,
        error: passError,
        note: passNote,
      },
      confirm_password: {
        ...state.confirm_password,
        error: confPassError,
        note: confPassNote,
      }
    }));
    return passError || confPassError;
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
