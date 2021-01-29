import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Notification  from 'react-web-notification';
import bind from 'autobind-decorator';

import { Logger } from '../../utils/Logger';
import {
  Dashboard,
  Shipments,
  ShipmentLayout,
  Quotes,
  MapOverviews,
  Rates,
  Accounts,
  AddressBook,
  SearchAndBook,
  AddressBookEdit,
  NotFound,
} from '../'
import { Header, Footer, SideNav, SABQuote } from '../../components';
import { userIsAuth } from "../../hocs";
import { promisifyAction } from '../../utils';
import { userSubscribeToBrowserNotifications } from '../../stores/actionCreators';

import './styles.scss';

const urlB64ToUint8Array = (base64String: string): any  => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const mapStateToProps = (state: IGlobalState): any => ({
  loading: state.user.loading,
  notFound: state.flags.notFound,
  currentUser: state.user,
});

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  subscribe: promisifyAction(dispatch, userSubscribeToBrowserNotifications),
});

class Layout extends PureComponent<any,any> {
  public componentDidMount() {
    (window as any).drift.identify(this.props.currentUser.id, {
      email: this.props.currentUser.email,
      name: `${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`,
    });
  }

  public render() {
    if (this.props.notFound) {
      return <NotFound/>
    }
    return (
      <div>
        {!this.props.loading && <Header/>}
        {!this.props.loading && <Notification ignore={true} onPermissionGranted={this.handlePermissionGranted} title="Shypple!"/>}
        <div className="page-layout__viewport" >
          <SideNav />
          <Switch>
            <Route path="/rates">
              <section className="page-layout__content page-layout__content_allow-h-scroll">
                {this.renderContent()}
              </section>
            </Route>
            <Route>
              <section className="page-layout__content">
                {this.renderContent()}
              </section>
            </Route>
          </Switch>
        </div>
        <Footer/>
      </div>
    );
  }

  private renderContent(): any {
    if(this.props.loading) {
      return null
    }
    return (
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/shipments/" >
          <Switch>
            <Route path="/shipments/:id/" component={ShipmentLayout} />
            <Route component={Shipments} />
          </Switch>
        </Route>
        <Route path="/quotes" component={Quotes} />
        <Route path="/map_overviews" component={MapOverviews} />
        <Route path="/rates" component={Rates} />
        <Route path="/account" component={Accounts} />
        <Route path="/contacts">
          <Switch>
            <Route path="/contacts/new" component={AddressBookEdit} />
            <Route path="/contacts/:id/edit" component={AddressBookEdit} />
            <Route component={AddressBook} />
          </Switch>
        </Route>
        <Route path="/search/quote" component={SABQuote} />
        <Route path="/search" component={SearchAndBook} />
      </Switch>
    )
  }

  @bind
  private handlePermissionGranted(): void {
    if (this.props.currentUser.impersonator) {
      Logger.log('Skip broser notification for impersonated users');
      return;
    }
    const that = this;
    Logger.log('Starting register worker');
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`)
      .then((sw) => {
        Logger.log('Starting subscribing worker');
        sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array('BMFS9x6B3aemM-w-Sy8GkPQA_ERwKshEx5q_kGhCyDveZwrENvAF-MJXJMrAo_sngnfHg5yQMo8PRCQu1GIZIRo=')
        }).then((subscription) => {
          that.subscribe(subscription);
        })
      })
      .catch((error) => {
        console.log('ServiceWorker did not registered!', error)
      });
  }

  private async subscribe(subscription: any): Promise<any>{
    try {
      await this.props.subscribe({ subscription })
    } catch(error) {
      console.log(error);
    }
  }
}

export default compose(
  userIsAuth,
  connect(mapStateToProps, mapDispatchToProps)
)(Layout)