import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import Favicon from 'react-favicon';
import { stringify } from 'query-string';
import { ActionCableProvider } from 'react-actioncable-provider';
import { wsURL } from './config/local.json';
import { connect } from 'react-redux';

import {
  Layout,
  Login,
  ForgotPassword,
  ResetPassword,
  ShipmentLink,
} from './pages';
import { FlashMessage } from './components'
import { selfURL, googleAPIKey } from './config/local.json';
import { Logger } from './utils';
import './App.scss';

export const CHANGE_PASSWORD_PATH = '/change-password';

const mapStateFromProps = (state: IGlobalState, props: any): any => ({
  accessToken: state.user.accessToken,
  client: state.user.clientToken,
  uid: state.user.uid,
  impersonator: state.user.impersonator,
});

interface IProps{
  accessToken: string,
  client: string,
  uid: string,
  impersonator: string,
}

interface IState{
  loaded: boolean,
}

class App extends Component<IProps, IState> {
  public state = { loaded: false };
  public componentDidMount () {
    const script = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleAPIKey}&libraries=places&v=3&language=en`;
    script.async = true;
    script.onload = () => {
      this.setState({ loaded: true });
    };

    document.body.appendChild(script);

  }
  public render() {
    const { accessToken, client, uid, impersonator } = this.props;
    const areCredsPresent = accessToken && client && uid;
    let cableUrl: string = '';
    if (areCredsPresent) {
      cableUrl = `${wsURL}?${stringify({
        impersonator,
        uid,
        client,
        'access-token': accessToken,
      })}`;
    }


    if(!this.state.loaded) {
      return <div />
    }
    // This decision was made because ActionCableProvider took the correct 'url' value
    // only after login and page reload.
    if (areCredsPresent) {
      return (
        <ActionCableProvider url={cableUrl}>
          {this.renderContent()}
        </ActionCableProvider>
      )
    } else {
      return this.renderContent()
    }
  }

  private renderContent(): any {
    return (
      <div className="App">
        <Favicon url="/assets/favicon.ico"/>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path={CHANGE_PASSWORD_PATH} component={ResetPassword} />
          <Route path="/dashboard" component={Layout} />
          <Route path="/public-shipments/:token" component={ShipmentLink} />
          <Route path="/shipments" component={Layout} />
          <Route path="/dashboard-quote" component={Layout} />
          <Route path="/quotes" component={Layout} />
          <Route path="/map_overviews" component={Layout} />
          <Route path="/rates" component={Layout} />
          <Route path="/account" component={Layout} />
          <Route path="/book_contacts" component={Layout} />
          <Route path="/search" component={Layout} />
          <Route path="/search/quote" component={Layout} />
          <Route path="/contacts" component={Layout} />
          <Route>
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
        <FlashMessage />
      </div>
    )
  }
}

export default withRouter(connect<any, any, any>(mapStateFromProps)(App));
