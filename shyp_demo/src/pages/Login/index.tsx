import bind from 'autobind-decorator';
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import PropTypes from 'prop-types'
import React, { Component, EventHandler } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Dispatch } from "redux";
import { isEmail } from 'validator';
import { Link } from 'react-router-dom'
import { InjectedAuthReduxProps } from "redux-auth-wrapper/history3/redirect";

import LoginLayout from './Layout';
import { promisifyAction, Logger, parseQuery } from "../../utils";
import { userSignIn, userLoadRemembered } from "../../stores/actionCreators";
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
  password: ILoginFieldSubstate;
  isRemembered: boolean;
  busy: boolean;
  note: string;
  errorMessage: string;
}

interface ILoginProps extends InjectedAuthReduxProps {
  email: string;
  submit: IActionPromiseFactory;
  loadRemembered: IActionPromiseFactory;
  query: string;
}

interface IValidateArguments {
  isValidateEmail: boolean;
  isValidatePassword: boolean;
}

const mapStateFromProps = (state: IGlobalState) => ({
  email: state.user.email,
  query: get(state.routing, 'location.search', '')
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  submit: promisifyAction(dispatch, userSignIn),
  loadRemembered: promisifyAction(dispatch, userLoadRemembered)
});

class Login extends Component<ILoginProps, ILoginState> {
  public static propTypes = {
    submit: PropTypes.func,
  };

  public static defaultProps = {
    submit: (values: { email: string, password: string }):boolean => true,
  };

  public handleInputChange: EventHandler<any>;

  public handleRememberChange: EventHandler<any>;
  public handleInputBlur: EventHandler<any>;

  constructor(props: any, context: any){
    super(props, context);
    this.state = {
      busy: true,
      email: {
        error: false,
        note: '',
        value: '',
      },
      password: {
        error: false,
        note: '',
        value: '',
      },
      isRemembered: false,
      note: '',
      errorMessage: '',
    };
    this.handleInputChange = this.createFieldChangeHandler();
    this.handleRememberChange = this.createCheckboxChangeHandler();
    this.handleInputBlur = this.createFieldBlurHandler();
  }

  public async componentDidMount(){
    const query = parseQuery(this.props.query);

    if(query.email){
      const email: any = (query.email instanceof Array)
        ? query.email.join()
        : query.email;

      this.setState((state: ILoginState, props: ILoginProps): Pick<ILoginState, 'email' | 'busy'> => ({
        email: { ...state.email, value: email },
        busy: false,
      }));
      return;
    }
    const { loadRemembered } = this.props;
    try {
      if (loadRemembered) {
        await loadRemembered();
        this.setState((state: ILoginState, props: ILoginProps): Pick<ILoginState, 'email' | 'busy'> => ({
          email: { ...state.email, value: props.email },
          busy: false,
        }));
        this.setState({ busy: false });
      }
    } catch(error) {
      Logger.error(error);
    }
  }

  public render() {
    const { isRemembered, errorMessage } = this.state;
    return (
      <section className="login-page">
        <LoginHeader />
        <LoginLayout
          onKeyPress={this.handleEnterPress}
          autoComplete={!!this.props.email}
          emailField={this.renderInput('email', 'Email', 'email')}
          passwordField={this.renderInput('password', 'Password', 'password')}
          rememberCheckbox = {
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRemembered}
                  onChange={this.handleRememberChange}
                  value="isRemembered"
                  classes={{
                    root: "remember-checkbox mui-override",
                    checked: "remember-checkbox_checked mui-override",
                  }}
                />
              }
              classes={{
                label: "remember-checkbox-label mui-override",
              }}
              label="Remember me"
            />
          }
          forgotPass = {
            <Link
              className="login-page__link"
              to='/forgot-password'
            >
              Forgot your password
            </Link>
          }
          button={
            <Button
              onClick={this.submit}
              className="login-page__button"
            >
              Log in
            </Button>
          }
          errorMessage={errorMessage}
        />
      </section>
    );
  }

  @bind
  private async handleEnterPress(event: any): Promise<any> {
    if (event.key === 'Enter' ) {
      await this.submit();
    }
  }

  private renderInput(
    name: string,
    title: string,
    type: string = 'text',
  ): any{
    if (this.state.busy) {
      return null;
    }
    const field = this.state[name] as ILoginFieldSubstate;
    return (
      <TextField
        type={type}
        name={name}
        label={field.note ? `${title} - ${field.note}` : title }
        fullWidth={true}
        value={field.value}
        error={field.error}
        onChange={this.handleInputChange}
        onBlur={this.handleInputBlur}
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
        inputProps={{ autoComplete: 'on', name }}
        classes={{
          root: 'login-page__input mui-override',
        }}
      />
    )
  }

  @bind
  private async submit(): Promise<any>{
    const { email, password, isRemembered } = this.state;

    this.setState({
      errorMessage: '',
    });
    if (this.validate({isValidateEmail: true, isValidatePassword: true})) {
      try {
        await this.props.submit(email.value, password.value, isRemembered)
      } catch(error) {
        this.setState((state, props) => ({
          password: {
            ...state.password,
            error: true,
          },
          email: {
            ...state.email,
            error: true,
          },
          errorMessage: 'Invalid Email or Password',
        }))
      }
    }
  }

  private validate({ isValidateEmail = true, isValidatePassword = true }: IValidateArguments =
                     { isValidateEmail: true, isValidatePassword: true }) {
    const { email, password } = this.state;

    if (isValidateEmail) {
      email.error = false;
      email.note = '';
    }

    if (isValidatePassword) {
      password.error = false;
      password.note = '';
    }

    if (isValidateEmail && !email.value) {
      if (!email.error) {
        email.error = true;
        email.note = 'Please fill in your email';
      }
    }

    if (isValidateEmail && !isEmail(`${email.value || ''}`)) {
      if (!email.error) {
        email.error = true;
        email.note = 'Incorrect email';
      }
    }

    if (isValidatePassword && !password.value) {
      if (!password.error) {
        password.error = true;
        password.note = 'Please fill in your password';
      }
    }

    this.setState({
      email: {
        ...this.state.email,
        ...email,
      },
      password: {
        ...this.state.password,
        ...password,
      },
    });

    return !email.error && !password.error;
  }

  private createFieldChangeHandler(): React.EventHandler<any> {
    const self = this;
    function changeHandler (event: any): void {
      const { value, name } = event.target;
      const fieldData: any = self.state[name];

      if (fieldData == null) {
        return
      }
      self.setState({
        [name]: { ...fieldData, value },
      });
    }
    return changeHandler;
  }

  private createCheckboxChangeHandler(): React.EventHandler<any> {
    const self = this;
    function changeHandler (event: any): void {
      const { value, checked } = event.target;
      self.setState({ [value]: checked });
    }
    return changeHandler;
  }

  private createFieldBlurHandler(): React.EventHandler<any> {
    const self = this;
    function changeHandler(event: any): void {
      const { name } = event.target;
      if (name === 'email') {
        self.validate({
          isValidateEmail: true,
          isValidatePassword: false
        })
      } else if (name === 'password') {
        self.validate({
          isValidateEmail: false,
          isValidatePassword: true
        })
      }
    }
    return changeHandler;
  }
}


export default connect(mapStateFromProps, mapDispatchToProps)(Login);
