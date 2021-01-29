import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, Dispatch } from "redux";
import { connect } from "react-redux";

import { userIsAuth } from '../../hocs';
import { AccountInfoForm, CompanyInfoForm, NotifySettingsForm, AccountAvatarForm } from '../../components';
import { promisifyAction } from '../../utils';
import { userGetUserData } from '../../stores/actionCreators';
import { Portal, CircularProgress } from '@material-ui/core';
import './styles.scss';

const mapDispatchToProps = ( dispatch: Dispatch ) => ({

  getData: promisifyAction(dispatch, userGetUserData)

});

interface IAccountProps{
  getData: IActionPromiseFactory
}

interface IAccountState{
  loading: boolean;
}

class Account extends Component<IAccountProps, IAccountState> {

  public static propTypes = {};
  public static defaultProps = {};

  constructor (props, context) {
    super(props, context);
    this.state = { loading: true };
  }

  public async componentDidMount(){
    this.setState({ loading: true });
    try{
      await this.props.getData();
    } finally {
      this.setState({ loading: false });
    }
  }

  public render () {
    return (
      <div className="account-page">
        {this.state.loading && <Portal>
          <div className="account-page__loader-container">
            <CircularProgress />
          </div>
        </Portal>}
        <div className="account-page__form">
          <AccountInfoForm />
        </div>
        <div className="account-page__form">
          <AccountAvatarForm />
        </div>
        <div className="account-page__form">
          <CompanyInfoForm />
        </div>
        <div className="account-page__form">
          <NotifySettingsForm />
        </div>
      </div>
    );
  }
}

export default compose(
  userIsAuth,
  connect(null, mapDispatchToProps)
)(Account);
